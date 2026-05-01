// Unified listings fetcher — dispatches to RESO or RETS based on env
import { fetchListingsReso } from './auth-reso.js';
import { fetchListingsRets } from './auth-rets.js';
import { logger } from './logger.js';

export async function fetchAllListings({ modifiedAfter = null, pageSize = 200 } = {}) {
  const authType = (process.env.REIN_AUTH_TYPE || 'reso').toLowerCase();
  // MAX_RECORDS env var caps the total number of listings fetched. Useful
  // for smoke tests without pulling the entire feed (~7k listings).
  const maxRecords = parseInt(process.env.MAX_RECORDS || '0', 10);
  const all = [];
  let page = 0;

  while (true) {
    let batch;
    if (authType === 'reso') {
      batch = await fetchListingsReso({
        modifiedAfter,
        top: pageSize,
        skip: page * pageSize,
      });
    } else if (authType === 'rets') {
      batch = await fetchListingsRets({
        modifiedAfter,
        top: pageSize,
        offset: page * pageSize + 1, // RETS is 1-indexed
      });
    } else {
      throw new Error(`Unknown REIN_AUTH_TYPE: ${authType}`);
    }

    if (!batch || batch.length === 0) break;
    all.push(...batch);
    logger.info({ page, fetched: batch.length, total: all.length }, 'listings page fetched');

    // Stop early if MAX_RECORDS cap reached
    if (maxRecords > 0 && all.length >= maxRecords) {
      return all.slice(0, maxRecords);
    }

    if (batch.length < pageSize) break;
    page++;

    // Safety stop — should never hit this with a real feed but prevents
    // an infinite loop if pagination metadata is wrong
    if (page > 500) {
      logger.warn({ page }, 'pagination safety stop hit');
      break;
    }
  }

  return all;
}
