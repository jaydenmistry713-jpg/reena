// netlify/functions/get-quote.js
//
// Public endpoint used by quote.html to render a customer's quote.
// No password: the random 16-char quote id in the URL acts as the access token.
//   GET /.netlify/functions/get-quote?id=<id>  ->  { quote }

const json = (statusCode, obj) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(obj)
});

// See admin-api.js: fall back to explicit credentials so Blobs also works on
// manual drag-and-drop deploys.
function blobStore(getStore, name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.BLOBS_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name, siteID, token });
  }
  return getStore(name);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) return json(400, { error: 'Missing id' });

  try {
    const { getStore } = await import('@netlify/blobs');
    const quotes = blobStore(getStore, 'quotes');
    const quote = await quotes.get(id, { type: 'json' });
    if (!quote) return json(404, { error: 'Quote not found' });
    return json(200, { quote });
  } catch (err) {
    console.error('get-quote error:', err);
    return json(500, { error: 'Server error' });
  }
};
