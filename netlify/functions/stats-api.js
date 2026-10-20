// netlify/functions/stats-api.js
//
// Password-gated read API for the visitor-statistics dashboard (dashboard.html).
// The password is checked SERVER-SIDE against process.env.DASHBOARD_PASSWORD.
//
// POST { password, from: "YYYY-MM-DD", to: "YYYY-MM-DD", group: "hour"|"day"|"week"|"month",
//        filter: { page?, source?, channel?, device?, country?, city? } }
//   -> { totals, previous, series, pages, entries, sources, channels, campaigns,
//        devices, browsers, oses, countries, cities, enquiryTypes, clicks,
//        journeys, heatmap, live }
//
// Everything is counted per visitor-day (see netlify/lib/stats-core.js). A filter keeps
// the visitors who match it, with all of their activity: "page" means "visitors who
// viewed this page".

const crypto = require('crypto');
const core = require('../lib/stats-core');

const json = (statusCode, obj) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(obj)
});

// Hash both sides so the comparison is constant-time whatever the lengths.
function passwordMatches(provided) {
  const expected = process.env.DASHBOARD_PASSWORD || '';
  if (!expected) return false;
  const a = crypto.createHash('sha256').update(String(provided || '')).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

const CONTACT_CLICKS = new Set(['phone', 'email', 'whatsapp']);
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));

function contactClicks(r) {
  let n = 0;
  for (const [k, v] of Object.entries(r.clicks || {})) if (CONTACT_CLICKS.has(k)) n += v;
  return n;
}

function matches(r, f) {
  if (f.page && !(r.pages && r.pages[f.page])) return false;
  if (f.source && r.src !== f.source) return false;
  if (f.channel && r.ch !== f.channel) return false;
  if (f.device && r.dev !== f.device) return false;
  if (f.country && (r.cn || r.cc || 'Unknown') !== f.country) return false;
  if (f.city && (r.city || 'Unknown') !== f.city) return false;
  return true;
}

function totalsOf(recs) {
  const t = { visitors: recs.length, views: 0, bounces: 0, time: 0, enquiries: 0, converted: 0, contactClicks: 0, contacted: 0 };
  for (const r of recs) {
    t.views += r.views;
    if (r.views <= 1) t.bounces++;
    t.time += r.time;
    t.enquiries += r.enq;
    if (r.enq > 0) t.converted++;
    const c = contactClicks(r);
    t.contactClicks += c;
    if (r.enq > 0 || c > 0) t.contacted++;
  }
  const v = t.visitors || 1;
  t.bounceRate = t.visitors ? t.bounces / v : 0;
  t.pagesPerVisitor = t.visitors ? t.views / v : 0;
  t.avgTime = t.visitors ? t.time / v : 0;
  t.conversionRate = t.visitors ? t.converted / v : 0;
  t.contactRate = t.visitors ? t.contacted / v : 0;
  return t;
}

// Count visitors (and conversions) by one key per visitor.
function tally(recs, keyFn, limit = 50) {
  const m = new Map();
  for (const r of recs) {
    const k = keyFn(r);
    if (k == null || k === '') continue;
    let row = m.get(k);
    if (!row) m.set(k, (row = { key: k, visitors: 0, views: 0, bounces: 0, converted: 0 }));
    row.visitors++;
    row.views += r.views;
    if (r.views <= 1) row.bounces++;
    if (r.enq > 0) row.converted++;
  }
  return [...m.values()]
    .sort((a, b) => b.visitors - a.visitors || b.views - a.views)
    .slice(0, limit);
}

function bucketKey(date, first, group) {
  if (group === 'hour') return String(core.londonClock(first).hour).padStart(2, '0');
  if (group === 'month') return date.slice(0, 7);
  if (group === 'week') {
    // Monday of that week.
    const d = new Date(date + 'T00:00:00Z');
    return core.addDays(date, -((d.getUTCDay() + 6) % 7));
  }
  return date;
}

function emptyBuckets(from, to, group) {
  if (group === 'hour') return Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'));
  const keys = [];
  for (const d of core.daysBetween(from, to)) {
    const k = bucketKey(d, 0, group);
    if (keys[keys.length - 1] !== k) keys.push(k);
  }
  return keys;
}

async function loadRange(store, haveData, from, to) {
  const dates = core.daysBetween(from, to).filter((d) => haveData.has(d));
  const days = await core.mapLimit(dates, 8, (d) => core.loadDay(store, d));
  const recs = [];
  for (const day of days) for (const r of day.visitors) recs.push({ ...r, date: day.date });
  return recs;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Invalid JSON' });
  }

  if (!passwordMatches(body.password)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return json(401, { error: 'Unauthorized' });
  }

  const today = core.londonDate(Date.now());
  let from = isDate(body.from) ? body.from : core.addDays(today, -29);
  let to = isDate(body.to) ? body.to : today;
  if (to > today) to = today;
  if (from > to) from = to;
  // Cap at roughly 13 months so one request stays inside the function time limit.
  if (core.daysBetween(from, to).length > 400) from = core.addDays(to, -399);
  const span = core.daysBetween(from, to).length;
  const group = ['hour', 'day', 'week', 'month'].includes(body.group) ? body.group : 'day';
  const filter = body.filter && typeof body.filter === 'object' ? body.filter : {};

  try {
    const { getStore } = await import('@netlify/blobs');
    const host = (event.headers && (event.headers['x-forwarded-host'] || event.headers.host)) || '';
    const store = core.openStore(getStore, core.storeNameForHost(host));
    const haveData = await core.datesWithData(store);

    const prevTo = core.addDays(from, -1);
    const prevFrom = core.addDays(from, -span);
    const [all, prevAll] = await Promise.all([
      loadRange(store, haveData, from, to),
      loadRange(store, haveData, prevFrom, prevTo)
    ]);
    const recs = all.filter((r) => matches(r, filter));
    const prev = prevAll.filter((r) => matches(r, filter));

    // Time series.
    const buckets = new Map(emptyBuckets(from, to, group).map((k) => [k, { key: k, visitors: 0, views: 0, enquiries: 0, converted: 0 }]));
    for (const r of recs) {
      const b = buckets.get(bucketKey(r.date, r.first, group));
      if (!b) continue;
      b.visitors++;
      b.views += r.views;
      b.enquiries += r.enq;
      if (r.enq > 0) b.converted++;
    }

    // Pages: views, visitors, average time per view, entries, and the share of the
    // page's visitors who went on to send an enquiry.
    const pageMap = new Map();
    for (const r of recs) {
      for (const [p, n] of Object.entries(r.pages)) {
        let row = pageMap.get(p);
        if (!row) pageMap.set(p, (row = { key: p, views: 0, visitors: 0, time: 0, entries: 0, converted: 0 }));
        row.views += n;
        row.visitors++;
        row.time += (r.pt && r.pt[p]) || 0;
        if (r.enq > 0) row.converted++;
      }
      const e = pageMap.get(r.entry);
      if (e) e.entries++;
    }
    const pages = [...pageMap.values()]
      .map((row) => ({ ...row, avgTime: row.views ? row.time / row.views : 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 60);

    // Enquiry event types and link clicks.
    const enqTypes = new Map();
    const clickMap = new Map();
    for (const r of recs) {
      for (const t of r.enqTypes || []) enqTypes.set(t, (enqTypes.get(t) || 0) + 1);
      for (const [k, v] of Object.entries(r.clicks || {})) clickMap.set(k, (clickMap.get(k) || 0) + v);
    }

    // Weekday x hour of arrival.
    const heatmap = Array.from({ length: 7 }, () => new Array(24).fill(0));
    for (const r of recs) {
      const c = core.londonClock(r.first);
      if (c.weekday >= 0) heatmap[c.weekday][c.hour]++;
    }

    // The most recent visitors who sent an enquiry, and the pages they saw first.
    const journeys = recs
      .filter((r) => r.enq > 0)
      .sort((a, b) => b.first - a.first)
      .slice(0, 30)
      .map((r) => ({
        at: r.first, src: r.src, ch: r.ch, dev: r.dev,
        place: [r.city, r.cn || r.cc].filter(Boolean).join(', '),
        path: r.enqPath || r.seq, types: r.enqTypes, views: r.views, time: r.time
      }));

    // Visitors active in the last 30 minutes (unfiltered, today only).
    const cutoff = Date.now() - 30 * 60 * 1000;
    const live = to === today ? all.filter((r) => r.date === today && r.last >= cutoff).length : null;

    return json(200, {
      from, to, group, span, filter,
      totals: totalsOf(recs),
      previous: { from: prevFrom, to: prevTo, ...totalsOf(prev) },
      series: [...buckets.values()],
      pages,
      entries: tally(recs, (r) => r.entry),
      sources: tally(recs, (r) => r.src),
      channels: tally(recs, (r) => r.ch),
      campaigns: tally(recs, (r) => (r.utm && r.utm.c ? `${r.utm.c} (${r.utm.s || '-'})` : null)),
      devices: tally(recs, (r) => r.dev),
      browsers: tally(recs, (r) => r.br),
      oses: tally(recs, (r) => r.os),
      countries: tally(recs, (r) => r.cn || r.cc || 'Unknown'),
      cities: tally(recs, (r) => r.city || 'Unknown'),
      enquiryTypes: [...enqTypes].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count),
      clicks: [...clickMap].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count),
      journeys,
      heatmap,
      live
    });
  } catch (err) {
    console.error('stats-api failed', err);
    return json(500, { error: 'Could not load statistics' });
  }
};
