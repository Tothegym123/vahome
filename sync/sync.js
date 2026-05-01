#!/usr/bin/env node
// VaHome REIN MLS sync — main entrypoint
//
// Modes:
//   node sync.js                   — incremental (since last successful run)
//   SYNC_FULL=true node sync.js    — full pull (ignore cursor)
//   node sync.js --test-auth       — auth + ping only, no data fetched

import 'dotenv/config';
import { logger, logRunStart, logRunEnd, logRunError } from './lib/logger.js';
import { testResoAuth } from './lib/auth-reso.js';
import { testRetsAuth } from './lib/auth-rets.js';
import { fetchAllListings } from './lib/fetch-listings.js';
import { fetchAndProcessPhotos } from './lib/fetch-photos.js';
import { uploadPhoto } from './lib/upload-blob.js';
import { transformRecord } from './lib/transform.js';
import { runGeocodePass } from './lib/geocode.js';
import {
  upsertListings,
  upsertOpenHouses,
  startIngestionRun,
  finishIngestionRun,
  getLastSuccessfulSyncCursor,
} from './lib/upsert-supabase.js';

const args = process.argv.slice(2);
const TEST_AUTH = args.includes('--test-auth');
const FULL_SYNC = process.env.SYNC_FULL === 'true' || args.includes('--full');
const PAGE_SIZE = parseInt(process.env.PAGE_SIZE || '200', 10);
const OVERLAP_MIN = parseInt(process.env.INCREMENTAL_OVERLAP_MINUTES || '5', 10);

async function main() {
  const authType = (process.env.REIN_AUTH_TYPE || 'reso').toLowerCase();
  logger.info({ authType, testOnly: TEST_AUTH, fullSync: FULL_SYNC }, 'sync starting');

  // ---- Auth smoke test --------------------------------------------------
  try {
    const result = authType === 'reso' ? await testResoAuth() : await testRetsAuth();
    logger.info({ result }, 'auth smoke test OK');
  } catch (err) {
    logRunError(err, { phase: 'auth' });
    process.exit(1);
  }

  if (TEST_AUTH) {
    logger.info('--test-auth flag set, exiting after smoke test');
    process.exit(0);
  }

  // ---- Determine cursor -------------------------------------------------
  let modifiedAfter = null;
  if (!FULL_SYNC) {
    const cursor = await getLastSuccessfulSyncCursor();
    if (cursor) {
      // Subtract overlap
      const d = new Date(cursor);
      d.setMinutes(d.getMinutes() - OVERLAP_MIN);
      modifiedAfter = d.toISOString();
      logger.info({ modifiedAfter }, 'incremental sync from cursor');
    } else {
      logger.info('no prior successful run — falling back to full sync');
    }
  }

  // ---- Start ingestion run row -----------------------------------------
  const source = `${authType}_${FULL_SYNC ? 'full' : 'incremental'}`;
  let runId = null;
  try {
    runId = await startIngestionRun(source);
  } catch (err) {
    logRunError(err, { phase: 'ingestion_runs.start' });
    process.exit(1);
  }

  let stats = {
    seen: 0,
    inserted: 0,
    updated: 0,
    excluded: 0,
    photosUploaded: 0,
    photoFailures: 0,
  };

  try {
    // ---- Fetch listings -----------------------------------------------
    logRunStart(source, FULL_SYNC);
    const records = await fetchAllListings({ modifiedAfter, pageSize: PAGE_SIZE });
    stats.seen = records.length;
    logger.info({ count: records.length }, 'listings fetched');

    if (records.length === 0) {
      await finishIngestionRun(runId, { ...stats, status: 'completed', notes: 'no records returned' });
      logRunEnd(stats);
      return;
    }

    // ---- Transform + filter excluded ----------------------------------
    const rows = [];
    for (const rec of records) {
      const row = transformRecord(rec);
      if (!row) continue;
      if (row.excluded) {
        stats.excluded++;
        continue;
      }
      rows.push(row);
    }

    // ---- Fetch + upload photos ----------------------------------------
    // (Skip on incremental runs unless price/status/key fields changed —
    // for simplicity v1 fetches photos for every record returned.)
    const photoUrlMap = new Map();
    for (const row of rows) {
      try {
        const photos = await fetchAndProcessPhotos(row.matrix_unique_id || row.mls_number);
        const urls = [];
        for (const p of photos) {
          try {
            const url = await uploadPhoto(row.mls_number, p.mediaKey, p.buffer, p.contentType);
            urls.push(url);
            stats.photosUploaded++;
          } catch (err) {
            stats.photoFailures++;
          }
        }
        if (urls.length > 0) photoUrlMap.set(row.mls_number, urls);
      } catch (err) {
        logger.warn({ mls: row.mls_number, err: err.message }, 'photo pipeline failed for listing');
        stats.photoFailures++;
      }
    }

    // ---- Upsert -------------------------------------------------------
    const upsertResult = await upsertListings(rows, photoUrlMap);
    stats.inserted = upsertResult.inserted;
    stats.updated = upsertResult.updated;

    // ---- Geocode fallback for listings without REIN coordinates ----
    try {
      const geoStats = await runGeocodePass();
      stats.geocode = geoStats;
      logger.info({
        rein_provided: geoStats.rein,
        google_success: geoStats.googleSuccess,
        google_failed: geoStats.googleFailed,
        no_address: geoStats.noAddress,
        skipped_unchanged: geoStats.skipped,
      }, 'coordinate sources summary');
    } catch (err) {
      logger.warn({ err: err.message }, 'geocode pass failed (non-fatal)');
    }

    // ---- Open houses --------------------------------------------------
    if (authType === 'reso') {
      const ohCount = await upsertOpenHouses(records);
      logger.info({ openHouses: ohCount }, 'open houses synced');
    }

    await finishIngestionRun(runId, { ...stats, status: 'completed' });
    logRunEnd(stats);
  } catch (err) {
    logRunError(err, { phase: 'main' });
    await finishIngestionRun(runId, { ...stats, status: 'failed', error: err.message });
    process.exit(1);
  }
}

main().catch(err => {
  logger.error({ err: { message: err.message, stack: err.stack } }, 'unhandled error in main');
  process.exit(1);
});
