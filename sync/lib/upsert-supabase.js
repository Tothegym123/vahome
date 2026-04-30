// Upsert listings into Supabase with history tracking.
import { createClient } from '@supabase/supabase-js';
import { logger } from './logger.js';
import { maybeBuildHistoryRow, extractOpenHouses } from './transform.js';

let _client = null;
function client() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export async function fetchExistingByMls(mlsNumbers) {
  if (mlsNumbers.length === 0) return new Map();
  const supabase = client();
  // Page through 1000 at a time
  const out = new Map();
  for (let i = 0; i < mlsNumbers.length; i += 1000) {
    const slice = mlsNumbers.slice(i, i + 1000);
    const { data, error } = await supabase
      .from('listings')
      .select('mls_number, price, status, photos')
      .in('mls_number', slice);
    if (error) throw new Error(`Supabase fetch existing failed: ${error.message}`);
    for (const r of (data || [])) out.set(r.mls_number, r);
  }
  return out;
}

export async function upsertListings(rows, photoUrls = new Map()) {
  if (rows.length === 0) return { inserted: 0, updated: 0, history: 0 };
  const supabase = client();

  const existing = await fetchExistingByMls(rows.map(r => r.mls_number));
  const historyRows = [];

  // Attach photo URLs
  for (const r of rows) {
    const urls = photoUrls.get(r.mls_number);
    if (Array.isArray(urls)) r.photos = urls;
  }

  // Build history rows
  for (const r of rows) {
    const prev = existing.get(r.mls_number);
    const events = maybeBuildHistoryRow(prev, r);
    if (events) historyRows.push(...events);
  }

  // Upsert in batches of 500
  let inserted = 0, updated = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    const { error, count } = await supabase
      .from('listings')
      .upsert(batch, { onConflict: 'mls_number', count: 'exact' });
    if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
    for (const r of batch) {
      if (existing.has(r.mls_number)) updated++;
      else inserted++;
    }
  }

  // Insert history rows
  if (historyRows.length > 0) {
    const { error } = await supabase.from('listing_history').insert(historyRows);
    if (error) {
      logger.warn({ err: error.message }, 'history insert failed (non-fatal)');
    }
  }

  return { inserted, updated, history: historyRows.length };
}

export async function upsertOpenHouses(records) {
  const supabase = client();
  const allOH = records.flatMap(r => extractOpenHouses(r));
  if (allOH.length === 0) return 0;
  // Upsert on (mls_number, open_house_id) — need composite key in DB; if not present, just insert
  const { error } = await supabase
    .from('open_houses')
    .upsert(allOH, { onConflict: 'open_house_id', ignoreDuplicates: true });
  if (error) {
    logger.warn({ err: error.message }, 'open_houses upsert failed (non-fatal)');
  }
  return allOH.length;
}

export async function startIngestionRun(source) {
  const supabase = client();
  const { data, error } = await supabase
    .from('ingestion_runs')
    .insert({ source, status: 'running' })
    .select('id')
    .single();
  if (error) throw new Error(`ingestion_runs insert failed: ${error.message}`);
  return data.id;
}

export async function finishIngestionRun(id, stats) {
  const supabase = client();
  const { error } = await supabase
    .from('ingestion_runs')
    .update({
      status: stats.status || 'completed',
      finished_at: new Date().toISOString(),
      records_seen: stats.seen ?? 0,
      records_inserted: stats.inserted ?? 0,
      records_updated: stats.updated ?? 0,
      records_excluded: stats.excluded ?? 0,
      error_message: stats.error || null,
      notes: stats.notes || null,
    })
    .eq('id', id);
  if (error) logger.warn({ err: error.message }, 'failed to update ingestion_runs');
}

export async function getLastSuccessfulSyncCursor() {
  const supabase = client();
  const { data, error } = await supabase
    .from('ingestion_runs')
    .select('finished_at, started_at')
    .eq('status', 'completed')
    .order('finished_at', { ascending: false })
    .limit(1);
  if (error || !data || data.length === 0) return null;
  // Return the start_at of the last successful run (with overlap subtracted)
  return data[0].started_at;
}
