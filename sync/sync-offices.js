#!/usr/bin/env node
// sync/sync-offices.js
// =============================================================================
// Standalone REIN Office directory sync.
//
// Pulls every office from REIN's Office resource and upserts into
// public.mls_offices. After this runs, sync/backfill-office-names.js can
// resolve the numeric IDs in listings.list_office_name into real names.
//
// Usage:
//   node sync-offices.js               — fetch all offices, upsert, exit
//   node sync-offices.js --dry-run     — fetch + show counts, no DB writes
//   node sync-offices.js --probe       — print first 5 records + key field discovery
//
// Env (set in .env on the droplet — defaults shown):
//   REIN_OFFICE_RESOURCE   = "Office"
//   REIN_OFFICE_CLASS      = "Office"
//   REIN_OFFICE_KEY_FIELD  = "OfficeMlsId"
//
// If you don't know REIN's exact resource/class/key names, run:
//   node probe-metadata.js | grep -A 20 -i office
// to discover them, then set the env vars and re-run.
// =============================================================================

import 'dotenv/config';
import { logger } from './lib/logger.js';
import { fetchAllOfficesNormalized, fetchAllOfficesRets, transformOffice } from './lib/fetch-offices.js';
import { upsertOffices } from './lib/upsert-offices.js';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const PROBE = args.includes('--probe');

async function main() {
  logger.info({ dryRun: DRY_RUN, probe: PROBE }, 'office sync starting');

  if (PROBE) {
    const raw = await fetchAllOfficesRets({ pageSize: 5 });
    if (!raw || raw.length === 0) {
      logger.warn('probe: no records returned. Check REIN_OFFICE_RESOURCE / _CLASS / _KEY_FIELD env vars.');
      return;
    }
    const first = raw[0];
    logger.info({ keys: Object.keys(first) }, 'probe: keys on first record');
    raw.slice(0, 5).forEach((rec, i) => {
      const t = transformOffice(rec);
      logger.info({ index: i, transformed: t, raw: rec }, 'probe sample');
    });
    return;
  }

  const offices = await fetchAllOfficesNormalized();
  logger.info({ count: offices.length }, 'offices fetched + normalized');

  if (offices.length === 0) {
    logger.warn('no offices returned — check REIN_OFFICE_* env vars');
    return;
  }

  const sample = offices.slice(0, 3).map(o => ({ mls_id: o.mls_id, name: o.name }));
  logger.info({ sample }, 'first 3 offices');

  if (DRY_RUN) {
    logger.info('dry-run: skipping DB upsert');
    return;
  }

  const result = await upsertOffices(offices);
  logger.info({ result }, 'office upsert complete');
}

main().catch(err => {
  logger.error({ err: { message: err.message, stack: err.stack } }, 'office sync failed');
  process.exit(1);
});
