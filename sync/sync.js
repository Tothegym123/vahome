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
  fetchExistingByMls,
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
    // Three-layer optimization:
    //   1. SKIP: if a listing's PhotoModificationTimestamp matches what's in
    //      the DB AND we already have its photos, reuse the existing URLs.
    //   2. PARALLEL: process LISTING_CONCURRENCY listings concurrently
    //      (each runs its own fetch + optimize + upload pipeline).
    //   3. CONCURRENT UPLOADS: within a listing, upload PHOTO_CONCURRENCY
    //      photos in parallel batches.
    // All bounded by per-photo and per-listing timeouts so no single bad
    // listing or stuck upload can stall the run.
    const LISTING_CONCURRENCY = parseInt(process.env.LISTING_CONCURRENCY || '3', 10);
    const PHOTO_CONCURRENCY = parseInt(process.env.PHOTO_CONCURRENCY || '5', 10);
    const PHOTO_TIMEOUT_MS = 90_000;
    const LISTING_TIMEOUT_MS = 5 * 60_000;
    const PROGRESS_EVERY = 25;
    const photoUrlMap = new Map();

    // Pre-fetch existing listings for the photo-reuse check
    const existingForPhotos = await fetchExistingByMls(rows.map((r) => r.mls_number));
    let stats_skipped = 0;
    let stats_reused_photos = 0;

    const withTimeout = (promise, ms, label) =>
      Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`${label} timeout after ${ms}ms`)),
            ms
          )
        ),
      ]);

    // Worker function — handles one listing end-to-end
    const processListing = async (row, listingIdx) => {
      const listingStart = Date.now();
      try {
        // SKIP CHECK: if photo_modified_at is unchanged and we already have
        // photos in the DB, reuse them (no fetch, no upload).
        const existing = existingForPhotos.get(row.mls_number);
        const existingPMT = existing?.photo_modified_at;
        const newPMT = row.photo_modified_at;
        const existingPhotos = existing?.photos;
        const pmtMatches =
          existingPMT &&
          newPMT &&
          new Date(existingPMT).getTime() === new Date(newPMT).getTime();
        if (
          pmtMatches &&
          Array.isArray(existingPhotos) &&
          existingPhotos.length > 0
        ) {
          photoUrlMap.set(row.mls_number, existingPhotos);
          stats_skipped++;
          stats_reused_photos += existingPhotos.length;
          if (listingIdx % PROGRESS_EVERY === 0) {
            logger.info(
              {
                progress: `${listingIdx}/${rows.length}`,
                totalUploaded: stats.photosUploaded,
                totalFailed: stats.photoFailures,
                listingsSkipped: stats_skipped,
                photosReused: stats_reused_photos,
              },
              'sync progress'
            );
          }
          return;
        }

        const photos = await withTimeout(
          fetchAndProcessPhotos(row.matrix_unique_id || row.mls_number),
          LISTING_TIMEOUT_MS,
          'fetchAndProcessPhotos'
        );

        if (!photos || photos.length === 0) {
          if (listingIdx % PROGRESS_EVERY === 0) {
            logger.info(
              {
                progress: `${listingIdx}/${rows.length}`,
                totalUploaded: stats.photosUploaded,
                totalFailed: stats.photoFailures,
                listingsSkipped: stats_skipped,
              },
              'sync progress'
            );
          }
          return;
        }

        const urls = new Array(photos.length);
        let listingSuccess = 0;
        let listingFail = 0;

        for (let i = 0; i < photos.length; i += PHOTO_CONCURRENCY) {
          const batchPhotos = photos.slice(i, i + PHOTO_CONCURRENCY);
          const results = await Promise.allSettled(
            batchPhotos.map((p) =>
              withTimeout(
                uploadPhoto(row.mls_number, p.mediaKey, p.buffer, p.contentType),
                PHOTO_TIMEOUT_MS,
                `upload ${p.mediaKey}`
              )
            )
          );
          for (let j = 0; j < results.length; j++) {
            const r = results[j];
            if (r.status === 'fulfilled') {
              urls[i + j] = r.value;
              stats.photosUploaded++;
              listingSuccess++;
            } else {
              stats.photoFailures++;
              listingFail++;
              logger.warn(
                {
                  mls: row.mls_number,
                  mediaKey: batchPhotos[j].mediaKey,
                  err: r.reason?.message || String(r.reason),
                },
                'photo upload failed'
              );
            }
          }
        }

        const filteredUrls = urls.filter(Boolean);
        if (filteredUrls.length > 0) {
          photoUrlMap.set(row.mls_number, filteredUrls);
        }

        const elapsedMs = Date.now() - listingStart;
        logger.info(
          {
            mls: row.mls_number,
            progress: `${listingIdx}/${rows.length}`,
            uploaded: listingSuccess,
            failed: listingFail,
            photoCount: photos.length,
            elapsedMs,
            totalUploaded: stats.photosUploaded,
            totalFailed: stats.photoFailures,
          },
          'listing photos done'
        );
      } catch (err) {
        logger.warn(
          {
            mls: row.mls_number,
            progress: `${listingIdx}/${rows.length}`,
            err: err.message,
            elapsedMs: Date.now() - listingStart,
          },
          'photo pipeline failed for listing'
        );
        stats.photoFailures++;
      }
    };

    // Run listings in concurrent batches
    for (let i = 0; i < rows.length; i += LISTING_CONCURRENCY) {
      const batch = rows.slice(i, i + LISTING_CONCURRENCY);
      await Promise.all(
        batch.map((row, j) => processListing(row, i + j + 1))
      );
    }

    logger.info(
      {
        listingsSkipped: stats_skipped,
        photosReused: stats_reused_photos,
        photosUploaded: stats.photosUploaded,
        photosFailed: stats.photoFailures,
      },
      'photo phase complete'
    );

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
