// sync/lib/upsert-offices.js
// =============================================================================
// Upsert REIN office directory into public.mls_offices.
// Conflict target: mls_id (primary key).
// =============================================================================

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { logger } from './logger.js';

let _client = null;
function sb() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env missing (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)');
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}

export async function upsertOffices(offices) {
  const supabase = sb();
  if (!Array.isArray(offices) || offices.length === 0) {
    logger.info('no offices to upsert');
    return { inserted: 0, updated: 0, total: 0 };
  }

  // Chunk to avoid hitting Supabase request limits on large directories.
  const CHUNK = 500;
  let upserted = 0;
  for (let i = 0; i < offices.length; i += CHUNK) {
    const slice = offices.slice(i, i + CHUNK);
    const rows = slice.map(o => ({
      mls_id: o.mls_id,
      name: o.name,
      phone: o.phone,
      address: o.address,
      city: o.city,
      state: o.state,
      zip: o.zip,
      raw: o.raw,
    }));

    const { error, count } = await supabase
      .from('mls_offices')
      .upsert(rows, { onConflict: 'mls_id', count: 'exact' });

    if (error) {
      logger.error({ err: error, offset: i }, 'mls_offices upsert chunk failed');
      throw new Error(`upsertOffices chunk @${i} failed: ${error.message}`);
    }
    upserted += rows.length;
    logger.info({ offset: i, chunk: rows.length, totalDone: upserted }, 'mls_offices chunk upserted');
  }

  return { total: upserted };
}

// Backfill helper: rewrite listings.list_office_name from the numeric MLS-ID
// it currently holds to the resolved office name, joined via mls_offices.
// Returns counts of {matched, updated, unmatched}.
export async function backfillListingOfficeNames({ dryRun = false } = {}) {
  const supabase = sb();

  // Fetch all listings whose list_office_name still looks like a numeric ID
  // (the misnamed legacy column) and whose mls_offices row has a name.
  const { data: rows, error: selErr } = await supabase
    .from('listings')
    .select('id, list_office_name')
    .not('list_office_name', 'is', null);
  if (selErr) throw new Error(`backfill select failed: ${selErr.message}`);

  const candidates = (rows || []).filter(r => /^\d+$/.test(String(r.list_office_name).trim()));
  logger.info({ candidates: candidates.length, totalListings: rows?.length || 0 }, 'backfill candidates identified');

  if (candidates.length === 0) {
    return { candidates: 0, matched: 0, updated: 0, unmatched: 0 };
  }

  // Bulk-load office name lookup
  const ids = [...new Set(candidates.map(r => String(r.list_office_name).trim()))];
  const { data: offices, error: ofErr } = await supabase
    .from('mls_offices')
    .select('mls_id, name')
    .in('mls_id', ids);
  if (ofErr) throw new Error(`backfill office lookup failed: ${ofErr.message}`);

  const nameById = new Map();
  for (const o of offices || []) {
    if (o.name) nameById.set(String(o.mls_id), o.name);
  }

  let matched = 0;
  let updated = 0;
  const unmatchedIds = new Set();

  for (const r of candidates) {
    const id = String(r.list_office_name).trim();
    const name = nameById.get(id);
    if (!name) {
      unmatchedIds.add(id);
      continue;
    }
    matched++;
    if (dryRun) continue;
    const { error: upErr } = await supabase
      .from('listings')
      .update({ list_office_name: name })
      .eq('id', r.id);
    if (upErr) {
      logger.warn({ listingId: r.id, err: upErr.message }, 'backfill update failed');
      continue;
    }
    updated++;
  }

  logger.info({
    candidates: candidates.length,
    matched,
    updated,
    unmatched: unmatchedIds.size,
    sampleUnmatched: [...unmatchedIds].slice(0, 5),
  }, 'backfill complete');

  return { candidates: candidates.length, matched, updated, unmatched: unmatchedIds.size };
}
