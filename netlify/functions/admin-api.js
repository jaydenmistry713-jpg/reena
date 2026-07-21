// netlify/functions/admin-api.js
//
// Password-protected admin API for the inquiry dashboard and quote creation.
// The password is checked SERVER-SIDE against process.env.ADMIN_PASSWORD — it
// is never exposed to the browser. Every request must include { password }.
//
// Actions (sent as { action, ...payload }):
//   list-inquiries      -> { inquiries: [...] }
//   set-inquiry-status  -> { id, status }            -> { ok: true }
//   delete-inquiry      -> { id }                    -> { ok: true }
//   create-quote        -> { customer, event, message, price } -> { id, quote }
//   list-quotes         -> { quotes: [...] }
//   delete-quote        -> { id }                    -> { ok: true }

const crypto = require('crypto');

// Open a Blobs store. Uses Netlify's automatic config when available (Git/CLI
// deploys), and falls back to explicit credentials (siteID + token) so it also
// works on manual drag-and-drop deploys, which do NOT auto-provision Blobs.
function blobStore(getStore, name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.BLOBS_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name, siteID, token });
  }
  return getStore(name);
}

const json = (statusCode, obj) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(obj)
});

// Constant-time-ish comparison to avoid trivial timing leaks on the password.
function passwordMatches(provided) {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  const a = Buffer.from(String(provided || ''));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Read every record from a store and return them as an array (newest first).
async function readAll(store) {
  const { blobs } = await store.list();
  const records = await Promise.all(
    blobs.map((b) => store.get(b.key, { type: 'json' }).catch(() => null))
  );
  return records
    .filter(Boolean)
    .sort((x, y) => String(y.createdAt).localeCompare(String(x.createdAt)));
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Invalid JSON' });
  }

  // Auth gate.
  if (!passwordMatches(body.password)) {
    return json(401, { error: 'Unauthorized' });
  }

  let inquiries, quotes;
  try {
    const { getStore } = await import('@netlify/blobs');
    inquiries = blobStore(getStore, 'inquiries');
    quotes = blobStore(getStore, 'quotes');
  } catch (e) {
    console.error('Blobs init failed:', e);
    return json(500, { error: 'Storage not configured: ' + e.message });
  }

  try {
    switch (body.action) {
      case 'list-inquiries': {
        return json(200, { inquiries: await readAll(inquiries) });
      }

      case 'set-inquiry-status': {
        const { id, status } = body;
        if (!id || !['new', 'handled'].includes(status)) {
          return json(400, { error: 'id and valid status required' });
        }
        const rec = await inquiries.get(id, { type: 'json' });
        if (!rec) return json(404, { error: 'Inquiry not found' });
        rec.status = status;
        await inquiries.setJSON(id, rec);
        return json(200, { ok: true });
      }

      case 'delete-inquiry': {
        if (!body.id) return json(400, { error: 'id required' });
        await inquiries.delete(body.id);
        // Cascade: remove any quotes generated from this inquiry.
        let removedQuotes = 0;
        try {
          const all = await readAll(quotes);
          const linked = all.filter((q) => q.inquiryId === body.id);
          await Promise.all(linked.map((q) => quotes.delete(q.id)));
          removedQuotes = linked.length;
        } catch (e) {
          console.error('Quote cascade delete failed:', e);
        }
        return json(200, { ok: true, removedQuotes });
      }

      case 'create-quote': {
        const { customer, event: ev, message, price, inquiryId } = body;
        if (!message || price === undefined || price === null || price === '') {
          return json(400, { error: 'message and price are required' });
        }
        const id = crypto.randomBytes(8).toString('hex'); // 16-char access token
        const quote = {
          id,
          createdAt: new Date().toISOString(),
          status: 'active',
          inquiryId: inquiryId || null,
          customer: {
            name: (customer && customer.name) || '',
            email: (customer && customer.email) || '',
            phone: (customer && customer.phone) || ''
          },
          event: {
            'event-type': (ev && ev['event-type']) || '',
            'event-date': (ev && ev['event-date']) || '',
            'event-time': (ev && ev['event-time']) || '',
            venue: (ev && ev.venue) || '',
            'event-location': (ev && ev['event-location']) || '',
            'number-of-guests': (ev && ev['number-of-guests']) || ''
          },
          message: String(message),
          price: String(price)
        };
        await quotes.setJSON(id, quote);
        return json(200, { id, quote });
      }

      case 'list-quotes': {
        return json(200, { quotes: await readAll(quotes) });
      }

      case 'delete-quote': {
        if (!body.id) return json(400, { error: 'id required' });
        await quotes.delete(body.id);
        return json(200, { ok: true });
      }

      default:
        return json(400, { error: 'Unknown action' });
    }
  } catch (err) {
    console.error('admin-api error:', err);
    return json(500, { error: 'Server error', details: err.message });
  }
};
