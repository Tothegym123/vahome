// Geocoding fallback. Used when REIN doesn't provide lat/lng on a listing.
// Calls Google Maps Geocoding API and stores result with source metadata.
//
// IMPORTANT: never overwrites lat/lng when coordinate_source='rein'.
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import { logger } from './logger.js';

const GOOGLE_API = 'https://maps.googleapis.com/maps/api/geocode/json';
const RATE_LIMIT_MS = 100; // ~10 QPS — well below Google's 50 QPS limit

let _client = null;
function client() {
  if (_client) return _client;
  _client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
  return _client;
}

// Build a full address string from listing fields.
// REIN's `address` field usually has the full address ("123 Main St, City VA 23456"),
// but if not, reconstruct from components.
export function buildAddress(row) {
  if (row.address && row.address.trim()) {
    // Append city/state/zip if not already in address
    const a = row.address.trim();
    const parts = [a];
    if (row.city && !a.includes(row.city)) parts.push(row.city);
    if (row.state && !a.includes(row.state)) parts.push(row.state);
    if (row.zip && !a.includes(row.zip)) parts.push(row.zip);
    return parts.join(', ');
  }
  const parts = [];
  const street = [row.street_number, row.street_name].filter(Boolean).join(' ');
  if (street) parts.push(street);
  if (row.city) parts.push(row.city);
  if (row.state) parts.push(row.state);
  if (row.zip) parts.push(row.zip);
  return parts.join(', ').trim();
}

// SHA256 short hash of normalized address. Used to detect when an address
// has changed and needs re-geocoding.
export function addressHash(addr) {
  if (!addr) return null;
  const normalized = addr.toLowerCase().replace(/\s+/g, ' ').trim();
  return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
}

async function callGoogle(address) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY required for geocoding');

  const params = new URLSearchParams({
    address,
    key: apiKey,
    components: 'country:US',
  });

  const resp = await fetch(`${GOOGLE_API}?${params}`);
  if (!resp.ok) throw new Error(`Google Geocoding HTTP ${resp.status}`);

  const data = await resp.json();
  if (data.status === 'OK' && data.results?.[0]) {
    const loc = data.results[0].geometry.location;
    return {
      lat: loc.lat,
      lng: loc.lng,
      formatted: data.results[0].formatted_address,
      partial: data.results[0].partial_match || false,
    };
  }
  if (data.status === 'ZERO_RESULTS') return null;
  if (data.status === 'OVER_QUERY_LIMIT') {
    throw new Error('Google geocoding rate limit hit');
  }
  if (data.status === 'REQUEST_DENIED') {
    throw new Error(`Google geocoding REQUEST_DENIED: ${data.error_message || ''}`);
  }
  throw new Error(`Google geocoding error: ${data.status} - ${data.error_message || ''}`);
}

// Find listings needing geocoding and process them.
// Skips: REIN-sourced coords (preserved), and addresses that already failed
//        with the same hash (no point retrying same address).
export async function runGeocodePass() {
  const supabase = client();
  const stats = {
    rein: 0,
    googleSuccess: 0,
    googleFailed: 0,
    noAddress: 0,
    skipped: 0,
    total: 0,
  };

  // Count REIN-provided coords (already counted at upsert time, but we
  // re-count for accurate logging)
  const { count: reinCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('coordinate_source', 'rein');
  stats.rein = reinCount || 0;

  // Fetch listings needing geocoding:
  //   - coordinate_source IS NULL (never attempted)
  //   - OR coordinate_source = 'failed' (retry only if address changed)
  // Exclude sold/closed listings to save API calls
  const { data: pending, error } = await supabase
    .from('listings')
    .select('id, mls_number, address, city, state, zip, coordinate_source, address_hash, status')
    .or('coordinate_source.is.null,coordinate_source.eq.failed')
    .neq('status', 'Sold')
    .neq('status', 'Closed');

  if (error) {
    logger.error({ err: error.message }, 'geocode pass: failed to fetch pending');
    return stats;
  }

  if (!pending || pending.length === 0) {
    logger.info(stats, 'geocode pass: nothing to geocode');
    return stats;
  }

  stats.total = pending.length;
  logger.info({ count: pending.length }, 'geocode pass: starting');

  for (const row of pending) {
    const addr = buildAddress(row);
    if (!addr) {
      await supabase.from('listings').update({
        coordinate_source: 'failed',
        geocode_status: 'no_address',
        geocoded_at: new Date().toISOString(),
      }).eq('id', row.id);
      stats.noAddress++;
      continue;
    }

    const hash = addressHash(addr);

    // Skip if same address has already been tried and failed (rule 6)
    if (row.coordinate_source === 'failed' && row.address_hash === hash) {
      stats.skipped++;
      continue;
    }

    try {
      const result = await callGoogle(addr);
      if (result) {
        await supabase.from('listings').update({
          lat: result.lat,
          lng: result.lng,
          coordinate_source: 'google',
          geocode_status: 'google_success',
          geocoded_at: new Date().toISOString(),
          address_hash: hash,
        }).eq('id', row.id);
        stats.googleSuccess++;
      } else {
        await supabase.from('listings').update({
          coordinate_source: 'failed',
          geocode_status: 'google_failed',
          geocoded_at: new Date().toISOString(),
          address_hash: hash,
        }).eq('id', row.id);
        stats.googleFailed++;
      }
    } catch (err) {
      logger.warn({ mls: row.mls_number, addr, err: err.message }, 'geocode call failed');
      stats.googleFailed++;
      // Don't update DB on transient errors — let the listing get retried next run
    }

    // Rate limit
    await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
  }

  logger.info(stats, 'geocode pass: complete');
  return stats;
}
