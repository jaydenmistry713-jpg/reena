// netlify/lib/stats-core.js
//
// Shared by the visitor-statistics functions (visit.js, stats-api.js, stats-compact.js).
// It lives outside netlify/functions so Netlify does not deploy it as a function of its
// own; esbuild bundles it into each function that requires it.
//
// Storage (Netlify Blobs store "analytics", or "analytics-preview" on preview hosts):
//   e/<YYYY-MM-DD>/<ms>-<hex>   one raw event, written by visit.js
//   d/<YYYY-MM-DD>              that day's summary: one record per visitor. Written the
//                               first time a finished day is read, and nightly by
//                               stats-compact.js. Rebuilt if SUMMARY_VERSION changes.
//
// Dates are Europe/London calendar days. Visitors are counted per day: the visitor id
// is a hash of IP + user agent + the date, so nothing is stored on the visitor's device
// and the same person on two days counts as two visitors.

const SUMMARY_VERSION = 1;
const TZ = 'Europe/London';

// Open a Blobs store, explicit credentials first (this site does not auto-provision
// Blobs at runtime; see CLAUDE.md "Environment variables").
function openStore(getStore, name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.BLOBS_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.BLOBS_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token });
  return getStore(name);
}

// Preview and branch deploys ("<alias>--<site>.netlify.app") and local dev write to a
// separate store, so testing never pollutes the live figures. Same rule as the enquiry
// email in form-submission.js.
function storeNameForHost(host) {
  host = String(host || '');
  return host.includes('--') || host.startsWith('localhost') || host.startsWith('127.')
    ? 'analytics-preview'
    : 'analytics';
}

const dayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const partsFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23', weekday: 'short' });

function londonDate(ms) {
  return dayFmt.format(new Date(ms));
}

// { hour: 0-23, weekday: 0 (Mon) - 6 (Sun) } in London time.
function londonClock(ms) {
  const parts = partsFmt.formatToParts(new Date(ms));
  const hour = Number(parts.find((p) => p.type === 'hour').value);
  const wd = parts.find((p) => p.type === 'weekday').value;
  return { hour, weekday: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(wd) };
}

// A day can be summarised once it has been over for 15 minutes, which leaves time for
// Blobs' eventually-consistent listing to catch up with the last events of the day.
function isFinished(date) {
  return date < londonDate(Date.now() - 15 * 60 * 1000);
}

// Calendar arithmetic on YYYY-MM-DD strings (UTC maths, no timezone involved).
function addDays(date, n) {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function daysBetween(from, to) {
  const out = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

// Run fn over items with at most `limit` in flight.
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

// ---------------------------------------------------------------------------
// Traffic sources
// ---------------------------------------------------------------------------

// Checked in order: the first match wins, so AI assistants and Google Gemini sit above
// plain Google.
const SOURCES = [
  [/chatgpt\.com|openai\.com/, 'ChatGPT', 'AI assistant'],
  [/perplexity\.ai/, 'Perplexity', 'AI assistant'],
  [/claude\.ai/, 'Claude', 'AI assistant'],
  [/gemini\.google|bard\.google/, 'Gemini', 'AI assistant'],
  [/copilot\.microsoft|edgeservices\.bing/, 'Copilot', 'AI assistant'],
  [/(^|\.)google\./, 'Google', 'Search'],
  [/(^|\.)bing\.com/, 'Bing', 'Search'],
  [/duckduckgo\./, 'DuckDuckGo', 'Search'],
  [/(^|\.)yahoo\./, 'Yahoo', 'Search'],
  [/ecosia\./, 'Ecosia', 'Search'],
  [/(^|\.)yandex\./, 'Yandex', 'Search'],
  [/(^|\.)baidu\./, 'Baidu', 'Search'],
  [/(^|\.)(facebook|fb)\.(com|me)|^m\.facebook/, 'Facebook', 'Social'],
  [/instagram\.com/, 'Instagram', 'Social'],
  [/(^|\.)t\.co$|twitter\.com|(^|\.)x\.com/, 'X', 'Social'],
  [/youtube\.com|youtu\.be/, 'YouTube', 'Social'],
  [/tiktok\.com/, 'TikTok', 'Social'],
  [/whatsapp\.(com|net)|wa\.me/, 'WhatsApp', 'Social'],
  [/linkedin\.com|lnkd\.in/, 'LinkedIn', 'Social'],
  [/pinterest\./, 'Pinterest', 'Social'],
  [/snapchat\.com/, 'Snapchat', 'Social'],
  [/reddit\.com/, 'Reddit', 'Social']
];

// Returns [source, channel].
function classifySource(refHost, utmSource) {
  if (utmSource) {
    const u = String(utmSource).toLowerCase();
    for (const [re, name, channel] of SOURCES) {
      if (re.test(u) || u === name.toLowerCase()) return [name, 'Campaign'];
    }
    return [u, 'Campaign'];
  }
  if (!refHost) return ['Direct', 'Direct'];
  for (const [re, name, channel] of SOURCES) {
    if (re.test(refHost)) return [name, channel];
  }
  return [refHost.replace(/^www\./, ''), 'Referral'];
}

// ---------------------------------------------------------------------------
// Day summaries
// ---------------------------------------------------------------------------

// Fold one day's raw events into one record per visitor.
function buildDay(date, events) {
  events.sort((a, b) => a.ts - b.ts);
  const byVisitor = new Map();

  for (const ev of events) {
    if (!ev || !ev.vh) continue;
    let r = byVisitor.get(ev.vh);
    if (!r) {
      r = {
        vh: ev.vh, first: ev.ts, last: ev.ts,
        views: 0, pages: {}, pt: {}, seq: [],
        entry: null, src: null, ch: null, ref: null, utm: null,
        dev: ev.dev || 'Unknown', br: ev.br || 'Other', os: ev.os || 'Other',
        cc: ev.cc || '', cn: ev.cn || '', city: ev.city || '', region: ev.region || '',
        enq: 0, enqTypes: [], enqPath: null, clicks: {}, time: 0
      };
      byVisitor.set(ev.vh, r);
    }
    r.last = Math.max(r.last, ev.ts);

    if (ev.t === 'view') {
      r.views++;
      r.pages[ev.p] = (r.pages[ev.p] || 0) + 1;
      if (r.seq[r.seq.length - 1] !== ev.p && r.seq.length < 25) r.seq.push(ev.p);
      if (!r.entry) {
        // The first page view decides where the visit came from.
        r.entry = ev.p;
        const [src, ch] = classifySource(ev.ref, ev.us);
        r.src = src;
        r.ch = ch;
        r.ref = ev.ref || null;
        if (ev.us || ev.um || ev.uc) r.utm = { s: ev.us || '', m: ev.um || '', c: ev.uc || '' };
      }
    } else if (ev.t === 'leave') {
      const d = Number(ev.d) || 0;
      r.time += d;
      r.pt[ev.p] = (r.pt[ev.p] || 0) + d;
    } else if (ev.t === 'enquiry') {
      r.enq++;
      if (ev.e) r.enqTypes.push(ev.e);
      if (!r.enqPath) r.enqPath = r.seq.slice();
    } else if (ev.t === 'click' && ev.l) {
      r.clicks[ev.l] = (r.clicks[ev.l] || 0) + 1;
    }
  }

  // A visitor whose only events were time pings or clicks (their view landed just
  // before midnight) still counts, with the page they were on as the entry.
  for (const r of byVisitor.values()) {
    if (!r.entry) {
      r.entry = Object.keys(r.pt)[0] || '(unknown)';
      r.src = 'Direct';
      r.ch = 'Direct';
    }
  }

  return { v: SUMMARY_VERSION, date, visitors: [...byVisitor.values()] };
}

async function readEvents(store, date) {
  const { blobs } = await store.list({ prefix: `e/${date}/` });
  const events = await mapLimit(blobs, 25, (b) => store.get(b.key, { type: 'json' }).catch(() => null));
  return events.filter(Boolean);
}

// Dates (YYYY-MM-DD) that have at least one raw event.
async function datesWithData(store) {
  const { directories } = await store.list({ prefix: 'e/', directories: true });
  return new Set(directories.map((d) => d.replace(/^e\//, '').replace(/\/$/, '')));
}

// Summary for one day: the stored one when it is current, otherwise built from the raw
// events (and stored, once the day is over).
async function loadDay(store, date) {
  const finished = isFinished(date);
  if (finished) {
    const saved = await store.get(`d/${date}`, { type: 'json' }).catch(() => null);
    if (saved && saved.v === SUMMARY_VERSION) return saved;
  }
  const summary = buildDay(date, await readEvents(store, date));
  if (finished) await store.setJSON(`d/${date}`, summary).catch(() => {});
  return summary;
}

module.exports = {
  SUMMARY_VERSION,
  openStore,
  storeNameForHost,
  londonDate,
  londonClock,
  isFinished,
  addDays,
  daysBetween,
  mapLimit,
  classifySource,
  buildDay,
  datesWithData,
  loadDay
};
