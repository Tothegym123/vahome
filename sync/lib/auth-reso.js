// RESO Web API authentication (OAuth2 client_credentials grant)
// Modern path. Returns a Bearer token + helpers.

import { logger } from './logger.js';

let cachedToken = null;
let cachedUntil = 0;

export async function getResoToken() {
  const now = Date.now();
  if (cachedToken && cachedUntil > now + 60_000) return cachedToken;

  const tokenUrl = process.env.REIN_TOKEN_URL;
  const clientId = process.env.REIN_CLIENT_ID;
  const clientSecret = process.env.REIN_CLIENT_SECRET;
  const scope = process.env.REIN_SCOPE || '';

  if (!tokenUrl || !clientId || !clientSecret) {
    throw new Error('REIN_TOKEN_URL, REIN_CLIENT_ID, and REIN_CLIENT_SECRET are required for RESO auth');
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });
  if (scope) body.set('scope', scope);

  const resp = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`RESO OAuth2 token request failed: ${resp.status} ${txt.slice(0, 500)}`);
  }

  const data = await resp.json();
  cachedToken = data.access_token;
  cachedUntil = now + ((data.expires_in || 3600) * 1000);
  logger.info({ expires_in: data.expires_in }, 'RESO token acquired');
  return cachedToken;
}

export async function testResoAuth() {
  const token = await getResoToken();
  // Minimal ping — fetch metadata or a single record
  const baseUrl = process.env.REIN_BASE_URL;
  const resource = process.env.REIN_RESOURCE || 'Property';
  const url = `${baseUrl}/${resource}?$top=1`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`RESO smoke test failed: ${resp.status} ${txt.slice(0, 500)}`);
  }
  return { ok: true, status: resp.status };
}

export async function fetchListingsReso({ modifiedAfter = null, top = 200, skip = 0 } = {}) {
  const token = await getResoToken();
  const baseUrl = process.env.REIN_BASE_URL;
  const resource = process.env.REIN_RESOURCE || 'Property';

  const params = new URLSearchParams();
  params.set('$top', String(top));
  params.set('$skip', String(skip));
  params.set('$orderby', 'ModificationTimestamp asc');
  if (modifiedAfter) {
    params.set('$filter', `ModificationTimestamp gt ${modifiedAfter}`);
  }

  const url = `${baseUrl}/${resource}?${params.toString()}`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`RESO listings fetch failed: ${resp.status} ${txt.slice(0, 500)}`);
  }
  const data = await resp.json();
  return data.value || [];
}

export async function fetchPhotosReso(mlsId) {
  const token = await getResoToken();
  const baseUrl = process.env.REIN_BASE_URL;
  // RESO Media resource — common pattern. REIN's actual resource name may differ.
  const photoResource = process.env.REIN_PHOTO_RESOURCE_RESO || 'Media';
  const filter = `ResourceRecordKey eq '${mlsId}' and MediaCategory eq 'Photo'`;
  const url = `${baseUrl}/${photoResource}?$filter=${encodeURIComponent(filter)}&$orderby=Order asc`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  if (!resp.ok) {
    logger.warn({ mlsId, status: resp.status }, 'photo metadata fetch failed');
    return [];
  }
  const data = await resp.json();
  return (data.value || []).map(m => ({
    mediaKey: m.MediaKey || m.MediaURL?.split('/').pop() || `${mlsId}-${m.Order || 0}`,
    url: m.MediaURL,
    order: m.Order || 0,
  }));
}
