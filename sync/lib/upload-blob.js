// Photo upload via Vercel API proxy.
// The droplet does NOT have BLOB_READ_WRITE_TOKEN. Instead it POSTs photo
// bytes to a Vercel API route which uploads to Blob using its auto-injected
// env token. This keeps the Blob token off the droplet entirely.
//
// Required env on droplet:
//   VAHOME_API_URL (default: https://vahome.com)
//   ADMIN_PASSWORD (shared secret matching Vercel project env)

import { logger } from './logger.js';

const VAHOME_API_URL = process.env.VAHOME_API_URL || 'https://vahome.com';
const RETRY_DELAYS_MS = [200, 800, 3200];

function getAdminPassword() {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) throw new Error('ADMIN_PASSWORD env var required for photo uploads');
  return pwd;
}

export async function uploadPhoto(mlsNumber, mediaKey, buffer, contentType) {
  const ext = (contentType?.split('/')[1] || 'webp').toLowerCase();
  const safeKey = String(mediaKey).replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `listings/${mlsNumber}/${safeKey}.${ext}`;

  const body = JSON.stringify({
    path,
    contentType: contentType || 'image/webp',
    base64: buffer.toString('base64'),
  });

  const url = `${VAHOME_API_URL}/api/admin/upload-photo/`;
  const adminPwd = getAdminPassword();

  let lastError = null;
  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPwd,
          'Accept': 'application/json',
        },
        body,
        // Generous timeout — base64 + multi-hop network can be slow
        signal: AbortSignal.timeout ? AbortSignal.timeout(45000) : undefined,
      });

      if (resp.ok) {
        const json = await resp.json();
        if (!json.url) {
          throw new Error(`upload route returned no url: ${JSON.stringify(json)}`);
        }
        return json.url;
      }

      // 4xx → no point retrying (auth error, bad input, etc.)
      if (resp.status >= 400 && resp.status < 500 && resp.status !== 408 && resp.status !== 429) {
        const text = await resp.text();
        throw new Error(`upload route returned ${resp.status}: ${text.substring(0, 200)}`);
      }

      // 5xx or 408/429 — retry
      const text = await resp.text();
      lastError = `HTTP ${resp.status}: ${text.substring(0, 200)}`;
    } catch (err) {
      // Don't retry auth/input errors that we threw above
      if (err.message?.includes('returned 4')) throw err;
      lastError = err.message;
    }

    const delay = RETRY_DELAYS_MS[attempt];
    if (attempt < RETRY_DELAYS_MS.length - 1) {
      logger.debug({ mlsNumber, mediaKey, attempt: attempt + 1, lastError, retryInMs: delay }, 'photo upload retry');
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw new Error(`photo upload failed after ${RETRY_DELAYS_MS.length} attempts: ${lastError}`);
}
