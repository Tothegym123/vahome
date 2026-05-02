// Upsert listings into Supabase with history tracking + schema normalization.
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

// Columns that exist in the public.listings table. Anything the transform
// emits that isn't here gets dropped before upsert.
const VALID_COLUMNS = new Set([
  'mls_number','address','city','state','zip','county','subdivision','lat','lng',
  'price','status','status_changed_at','beds','baths','half_baths','sqft','lot_size',
  'year_built','stories','garage','property_type','property_subtype','days_on_market','list_date',
  'list_agent_name','list_agent_phone','list_agent_email','list_office_name','list_office_phone',
  'description','photos','rooms','flooring','kitchen','appliances','hvac','fireplace',
  'exterior','roof','parking','pool','fencing','waterfront','waterfront_type','water_view',
  'deep_water_access','bulkhead','dock','boat_lift','water','sewer','electric','gas','internet',
  'hoa_fee','hoa_frequency','elementary_school','middle_school','high_school',
  'tax_amount','tax_year','price_per_sqft','excluded','raw','mls_modified','last_seen_at',
  'coordinate_source','geocoded_at','geocode_status','address_hash',
  'photo_modified_at',
]);

// Map transform-emitted field names to the actual schema column names.
const FIELD_ALIASES = {
  latitude: 'lat',
  longitude: 'lng',
  annual_taxes: 'tax_amount',
  modification_timestamp: 'mls_modified',
  status_change_timestamp: 'status_changed_at',
  raw_payload: 'raw',
  water_source: 'water',
  exterior_features: 'exterior',
};

function normalizeRow(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    const aliased = FIELD_ALIASES[k] || k;
    if (!VALID_COLUMNS.has(aliased)) continue;
    if (v === undefined) continue;
    out[aliased] = v;
  }
  // Schema has fireplace + pool as TEXT but transform produces boolean
  if (typeof out.fireplace === 'boolean') out.fireplace = out.fireplace ? 'Yes' : null;
  if (typeof out.pool === 'boolean') out.pool = out.pool ? 'Yes' : null;
  // Coerce smallint columns to integers (REIN returns decimals like stories=1.5)
  const SMALLINT_COLUMNS = ['beds', 'half_baths', 'stories', 'year_built', 'tax_year'];
  for (const col of SMALLINT_COLUMNS) {
    if (out[col] !== undefined && out[col] !== null && out[col] !== '') {
      const n = Number(out[col]);
      out[col] = Number.isFinite(n) ? Math.round(n) : null;
    }
  }
  // price, sqft, hoa_fee, tax_amount, days_on_market, price_per_sqft are integer too
  const INTEGER_COLUMNS = ['price', 'sqft', 'hoa_fee', 'tax_amount', 'days_on_market', 'price_per_sqft'];
  for (const col of INTEGER_COLUMNS) {
    if (out[col] !== undefined && out[col] !== null && out[col] !== '') {
      const n = Number(out[col]);
      out[col] = Number.isFinite(n) ? Math.round(n) : null;
    }
  }
  // Stamp last_seen_at on every upsert so we can detect listings that drop out of the feed
  out.last_seen_at = new Date().toISOString();
  return out;
}

export async function fetchExistingByMls(mlsNumbers) {
  if (mlsNumbers.length === 0) return new Map();
  const supabase = client();
  const out = new Map();
  for (let i = 0; i < mlsNumbers.length; i += 1000) {
    const slice = mlsNumbers.slice(i, i + 1000);
    const { data, error } = await supabase
      .from('listings')
      .select('mls_number, price, status, photos, photo_modified_at')
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

  // Attach photo URLs (transform output uses 'photos' which IS in schema)
  for (const r of rows) {
    const urls = photoUrls.get(r.mls_number);
    if (Array.isArray(urls)) r.photos = urls;
  }

  // Build history rows from raw transform output (before normalization, so
  // status/price comparisons still work)
  for (const r of rows) {
    const prev = existing.get(r.mls_number);
    const events = maybeBuildHistoryRow(prev, r);
    if (events) historyRows.push(...events);
  }

  // Normalize to schema-compatible rows
  const normalized = rows.map(normalizeRow);

  // Upsert in batches of 500
  let inserted = 0, updated = 0;
  for (let i = 0; i < normalized.length; i += 500) {
    const batch = normalized.slice(i, i + 500);
    const { error } = await supabase
      .from('listings')
      .upsert(batch, { onConflict: 'mls_number' });
    if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
    for (const r of batch) {
      if (existing.has(r.mls_number)) updated++;
      else inserted++;
    }
  }

  // Insert history rows (best-effort; not fatal)
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
  return data[0].started_at;
}
