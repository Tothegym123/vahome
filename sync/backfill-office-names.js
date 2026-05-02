#!/usr/bin/env node
// sync/backfill-office-names.js
// =============================================================================
// One-shot: replace the numeric office MLS IDs currently sitting in
// listings.list_office_name with the resolved human-readable office name
// from public.mls_offices.
//
// Run AFTER sync-offices.js has populated mls_offices.
//
// Usage:
//   node backfill-office-names.js              — apply updates
//   node backfill-office-names.js --dry-run    — counts only, no DB writes
//
// Idempotent: only touches rows where list_office_name still matches /^\d+$/
// (still a numeric ID). Subsequent runs are no-ops once names are in place.
// =============================================================================

import 'dotenv/config';
import { logger } from './lib/logger.js';
import { backfillListingOfficeNames } from './lib/upsert-offices.js';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

async function main() {
  logger.info({ dryRun: DRY_RUN }, 'office-name backfill starting');
  const result = await backfillListingOfficeNames({ dryRun: DRY_RUN });
  logger.info({ result }, 'office-name backfill complete');

  if (result.unmatched > 0) {
    logger.warn(
      { unmatched: result.unmatched },
      'some listings have office IDs that have no row in mls_offices — re-run sync-offices.js, or these offices may be inactive/withdrawn from REIN'
    );
  }
}

main().catch(err => {
  logger.error({ err: { message: err.message, stack: err.stack } }, 'backfill failed');
  process.exit(1);
});
