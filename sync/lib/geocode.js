// Google Geocoding API helper.
// =============================================================================
// REIN's RETS feed includes Latitude/Longitude fields, but agents leave them
// blank for ~50% of listings. We fall back to Google's Geocoding API to
// resolve `address + city + state + zip` → coordinates so those listings
// still land on the map.
//
// API:    https://maps.googleapis.com/maps/api/geocode/json
// Pricing: $5 per 1,000 requests (under "Geocoding API" SKU on Google Cloud
//          Maps Platform). Free tier covers ~28K calls/month.
// Limits:  50 queries per second per project; we cap concurrency at 5 to
//          stay well under and tolerate transient throttling.
//
// Returns:
//   { ok: true,  lat, lng, formattedAddress, partialMatch }
//   { ok: false, reason: 'no_results' | 'api_ZERO_RESULTS' | 'http_403' | ... }
// =============================================================================
import { logger } from './logger.js';

const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * @param {{address?: string, city?: string, state?: string, zip?: string}} parts
 * @param {{timeoutMs?: number}} [opts]
 */
export async function geocodeAddress(parts, opts = {}) {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: 'no_api_key' };
  }

  // Build the address string. Strip the unit/apt portion that's after the
  // comma in REIN's address field (Google handles it via the components
  // parameter, and including '#7' often confuses the geocoder).
  const street = String(parts.address || '').split(',')[0].trim();
  const components = [street, parts.city, parts.state || 'VA', parts.zip]
    .filter((s) => s && String(s).trim().length > 0);
  const fullAddress = components.join(', ');
  if (!fullAddress) {
    return { ok: false, reason: 'empty_address' };
  }

  const url =
    GEOCODE_URL +
    '?' +
    new URLSearchParams({
      address: fullAddress,
      key: apiKey,
      region: 'us',
    }).toString();

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeoutMs || DEFAULT_TIMEOUT_MS);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) {
      return { ok: false, reason: 'http_' + r.status };
    }
    const j = await r.json();
    if (j.status !== 'OK') {
      // Common non-OK statuses: ZERO_RESULTS, OVER_QUERY_LIMIT, REQUEST_DENIED,
      // INVALID_REQUEST, UNKNOWN_ERROR. Return them prefixed so we can group
      // failures cleanly in logs.
      return { ok: false, reason: 'api_' + j.status, errorMessage: j.error_message };
    }
    if (!j.results || j.results.length === 0) {
      return { ok: false, reason: 'no_results' };
    }
    const top = j.results[0];
    const loc = top.geometry && top.geometry.location;
    if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') {
      return { ok: false, reason: 'invalid_location' };
    }
    return {
      ok: true,
      lat: loc.lat,
      lng: loc.lng,
      formattedAddress: top.formatted_address,
      partialMatch: !!top.partial_match,
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, reason: 'timeout' };
    }
    return { ok: false, reason: 'fetch_error', errorMessage: err.message };
  } finally {
    clearTimeout(t);
  }
}
