// netlify/functions/visit.js
//
// Receives one visitor-statistics event from js/visit.js and stores it in Netlify Blobs.
// Cookieless: the visitor id is a one-way hash of IP + user agent + the London date,
// so nothing is stored on the visitor's device and the IP itself is never saved.
//
// Event types (field "t"):
//   view     a page view            { p, r (referrer), w (screen width), us/um/uc (utm) }
//   leave    time spent on a page   { p, d (seconds) }
//   enquiry  contact form sent      { p, e (event type chosen on the form) }
//   click    phone/email/WhatsApp/social link clicked  { p, l (label) }

const crypto = require('crypto');
const core = require('../lib/stats-core');

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|pingdom|uptime|monitor|facebookexternalhit|embedly|curl|wget|python|node-fetch|axios|go-http|java\/|httpclient|okhttp|phantom|selenium|puppeteer|playwright/i;
const TYPES = new Set(['view', 'leave', 'enquiry', 'click']);

const clip = (v, n) => (v == null ? '' : String(v).slice(0, n));
const noContent = { statusCode: 204, body: '' };

// "/team.html", "/team" and "/team/" are one page. "/" stays "/".
function normalisePath(p) {
  p = clip(p, 200).split(/[?#]/)[0] || '/';
  let notFound = '';
  if (p.startsWith('404:')) {
    notFound = '404:';
    p = p.slice(4) || '/';
  }
  p = p.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return notFound + (p || '/');
}

function refHost(ref, host) {
  try {
    const h = new URL(ref).hostname.toLowerCase();
    if (!h || h === host || h.replace(/^www\./, '') === host.replace(/^www\./, '')) return '';
    return h.slice(0, 100);
  } catch (e) {
    return '';
  }
}

function device(ua, width) {
  if (/ipad|tablet|kindle|silk|playbook/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) return 'Tablet';
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'Mobile';
  if (width && width < 768) return 'Mobile';
  return 'Desktop';
}

function browser(ua) {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\/|opera/i.test(ua)) return 'Opera';
  if (/samsungbrowser/i.test(ua)) return 'Samsung Internet';
  if (/fbav|fban|instagram/i.test(ua)) return 'In-app (Meta)';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua)) return 'Safari';
  return 'Other';
}

function os(ua) {
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/android/i.test(ua)) return 'Android';
  if (/windows/i.test(ua)) return 'Windows';
  if (/mac os x|macintosh/i.test(ua)) return 'macOS';
  if (/cros/i.test(ua)) return 'ChromeOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Other';
}

// Netlify's geolocation header (base64 JSON), with the older x-country as a fallback.
function geo(headers) {
  const out = { cc: '', cn: '', city: '', region: '' };
  try {
    const raw = headers['x-nf-geo'];
    if (raw) {
      const g = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
      out.cc = clip(g.country && g.country.code, 4);
      out.cn = clip(g.country && g.country.name, 60);
      out.city = clip(g.city, 60);
      out.region = clip(g.subdivision && g.subdivision.name, 60);
    }
  } catch (e) { /* no geo is fine */ }
  if (!out.cc && headers['x-country']) out.cc = clip(headers['x-country'], 4);
  return out;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const headers = event.headers || {};
  const ua = headers['user-agent'] || '';
  if (!ua || BOT_UA.test(ua)) return noContent;

  const host = String(headers['x-forwarded-host'] || headers.host || '').toLowerCase();

  // Only accept events posted from the site's own pages.
  const origin = headers.origin || headers.referer || '';
  if (origin) {
    try {
      if (new URL(origin).hostname.toLowerCase() !== host.split(':')[0]) return noContent;
    } catch (e) {
      return noContent;
    }
  }

  let data;
  try {
    let body = event.body || '';
    if (event.isBase64Encoded) body = Buffer.from(body, 'base64').toString('utf8');
    if (body.length > 4000) return noContent;
    data = JSON.parse(body);
  } catch (e) {
    return noContent;
  }
  if (!data || !TYPES.has(data.t)) return noContent;

  try {
    const ts = Date.now();
    const date = core.londonDate(ts);
    const ip = headers['x-nf-client-connection-ip'] || headers['client-ip'] ||
      String(headers['x-forwarded-for'] || '').split(',')[0].trim();
    const secret = process.env.STATS_SALT || process.env.BLOBS_TOKEN || 'pfe';
    const vh = crypto.createHash('sha256').update(`${secret}|${date}|${host}|${ip}|${ua}`).digest('hex').slice(0, 16);
    const width = Math.max(0, Math.min(10000, Number(data.w) || 0));

    const record = {
      ts,
      t: data.t,
      vh,
      p: normalisePath(data.p),
      dev: device(ua, width),
      br: browser(ua),
      os: os(ua),
      ...geo(headers)
    };
    if (data.t === 'view') {
      record.ref = refHost(data.r, host);
      if (data.us) record.us = clip(data.us, 60).toLowerCase();
      if (data.um) record.um = clip(data.um, 60).toLowerCase();
      if (data.uc) record.uc = clip(data.uc, 80);
    } else if (data.t === 'leave') {
      record.d = Math.round(Math.max(0, Math.min(1800, Number(data.d) || 0)));
      if (!record.d) return noContent;
    } else if (data.t === 'enquiry') {
      record.e = clip(data.e, 60);
    } else if (data.t === 'click') {
      record.l = clip(data.l, 30).toLowerCase();
    }

    const { getStore } = await import('@netlify/blobs');
    const store = core.openStore(getStore, core.storeNameForHost(host));
    await store.setJSON(`e/${date}/${ts}-${crypto.randomBytes(4).toString('hex')}`, record);
  } catch (err) {
    console.error('visit: failed to store event', err);
  }
  return noContent;
};
