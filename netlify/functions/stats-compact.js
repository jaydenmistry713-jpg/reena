// netlify/functions/stats-compact.js
//
// Scheduled nightly (netlify.toml). Writes the summary for each of the last seven
// finished days that has events but no current summary, so the dashboard rarely has
// to read raw events. The dashboard does the same on demand, so a missed run only
// makes the next dashboard load a little slower.
//
// Scheduled functions run on the published (production) deploy only, so this always
// works on the live "analytics" store.

const core = require('../lib/stats-core');

exports.handler = async () => {
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = core.openStore(getStore, 'analytics');
    const haveData = await core.datesWithData(store);
    const today = core.londonDate(Date.now());

    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = core.addDays(today, -i);
      if (haveData.has(d) && core.isFinished(d)) dates.push(d);
    }
    await core.mapLimit(dates, 3, (d) => core.loadDay(store, d));
    console.log('stats-compact: checked', dates.join(', ') || 'no days');
  } catch (err) {
    console.error('stats-compact failed', err);
  }
  return { statusCode: 200, body: '' };
};
