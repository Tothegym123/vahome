// Legacy RETS XML authentication (HTTP Digest) + capability discovery
// Used when REIN ships RETS instead of RESO Web API.

import crypto from 'node:crypto';
import { logger } from './logger.js';

let session = null; // { cookies, capabilityUrls }

function md5(s) { return crypto.createHash('md5').update(s).digest('hex'); }

// HTTP Digest auth helper. Some RETS servers want the full digest;
// others accept Basic. We try Digest first, fall back to Basic.
async function digestFetch(url, opts = {}) {
  const username = process.env.REIN_USERNAME;
  const password = process.env.REIN_PASSWORD;
  const userAgent = process.env.REIN_USER_AGENT || 'VaHomeSync/1.0';
  const retsVersion = process.env.REIN_RETS_VERSION || 'RETS/1.7.2';

  const baseHeaders = {
    'User-Agent': userAgent,
    'RETS-Version': retsVersion,
    'Accept': '*/*',
    ...(opts.headers || {}),
  };
  if (session?.cookies) baseHeaders.Cookie = session.cookies;

  // First request: unauthenticated
  let resp = await fetch(url, { ...opts, headers: baseHeaders });

  if (resp.status === 401) {
    const wwwAuth = resp.headers.get('www-authenticate') || '';
    if (/^Digest/i.test(wwwAuth)) {
      // Parse digest challenge
      const params = {};
      wwwAuth.replace(/Digest\s+/i, '').split(',').forEach(p => {
        const [k, ...rest] = p.trim().split('=');
        params[k] = rest.join('=').replace(/^"|"$/g, '');
      });
      const ha1 = md5(`${username}:${params.realm}:${password}`);
      const u = new URL(url);
      const ha2 = md5(`${opts.method || 'GET'}:${u.pathname}${u.search}`);
      const cnonce = crypto.randomBytes(8).toString('hex');
      const nc = '00000001';
      const response = md5(`${ha1}:${params.nonce}:${nc}:${cnonce}:${params.qop || 'auth'}:${ha2}`);
      const auth = `Digest username="${username}", realm="${params.realm}", nonce="${params.nonce}", uri="${u.pathname}${u.search}", qop=${params.qop || 'auth'}, nc=${nc}, cnonce="${cnonce}", response="${response}", algorithm=${params.algorithm || 'MD5'}${params.opaque ? `, opaque="${params.opaque}"` : ''}`;
      resp = await fetch(url, { ...opts, headers: { ...baseHeaders, Authorization: auth } });
    } else {
      // Fall back to Basic
      const basic = Buffer.from(`${username}:${password}`).toString('base64');
      resp = await fetch(url, { ...opts, headers: { ...baseHeaders, Authorization: `Basic ${basic}` } });
    }
  }

  // Capture cookies for session continuity
  const setCookie = resp.headers.get('set-cookie');
  if (setCookie && !session?.cookies) {
    session = session || {};
    session.cookies = setCookie.split(';')[0];
  }
  return resp;
}

export async function getRetsSession() {
  if (session?.capabilityUrls) return session;

  const loginUrl = process.env.REIN_LOGIN_URL;
  if (!loginUrl) throw new Error('REIN_LOGIN_URL is required for RETS auth');

  const resp = await digestFetch(loginUrl);
  if (!resp.ok) throw new Error(`RETS Login failed: ${resp.status}`);
  const xml = await resp.text();

  // Parse <RETS-RESPONSE> for capability URLs (simple text parse — RETS responses are tiny)
  const caps = {};
  const match = xml.match(/<RETS-RESPONSE>([\s\S]*?)<\/RETS-RESPONSE>/i);
  if (match) {
    match[1].split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Za-z]+)\s*=\s*(.+?)\s*$/);
      if (m) caps[m[1].toLowerCase()] = m[2];
    });
  }
  // Resolve relative URLs against login base
  const loginBase = new URL(loginUrl);
  for (const k of Object.keys(caps)) {
    if (/^https::/i.test(caps[k])) continue;
    caps[k] = new URL(caps[k], loginBase).toString();
  }

  session = session || {};
  session.capabilityUrls = caps;
  logger.info({ caps: Object.keys(caps) }, 'RETS Login OK, capabilities discovered');
  return session;
}

export async function testRetsAuth() {
  const s = await getRetsSession();
  if (!s.capabilityUrls?.search && !s.capabilityUrls?.Search) {
    throw new Error('RETS Search capability URL not found in Login response');
  }
  return { ok: true, capabilities: Object.keys(s.capabilityUrls) };
}

export async function fetchListingsRets({ modifiedAfter = null, top = 200, offset = 1 } = {}) {
  const s = await getRetsSession();
  const searchUrl = s.capabilityUrls.search || s.capabilityUrls.Search;
  if (!searchUrl) throw new Error('RETS Search URL not available');

  const resource = process.env.REIN_RESOURCE || 'Property';
  const klass = process.env.REIN_CLASS || 'Listing';

  // DMQL2 query — modify timestamp filter
  // REIN uses MatrixModifiedDT (Matrix-based RETS server), not the generic
  // ModificationTimestamp. (MatrixModifiedDT=2024-04-30T12:00:00+) means >= that timestamp.
  // Optional REIN_STATUS_FILTER appends ,(PublicStatus=<value>) — use | for OR.
  const baseTimestamp = modifiedAfter
    ? `(MatrixModifiedDT=${modifiedAfter}+)`
    : '(MatrixModifiedDT=1900-01-01T00:00:00+)';
  const statusFilter = process.env.REIN_STATUS_FILTER
    ? `,(PublicStatus=${process.env.REIN_STATUS_FILTER})`
    : '';
  const query = `${baseTimestamp}${statusFilter}`;

  const params = new URLSearchParams({
    SearchType: resource,
    Class: klass,
    Query: query,
    QueryType: 'DMQL2',
    Format: 'COMPACT-DECODED',
    Limit: String(top),
    Offset: String(offset),
    StandardNames: '0',
    Count: '1',
  });

  const url = `${searchUrl}?${params.toString()}`;
  const resp = await digestFetch(url);
  if (!resp.ok) throw new Error(`RETS Search failed: ${resp.status}`);
  const xml = await resp.text();

  // Parse COMPACT-DECODED: <COLUMNS> tab-separated header, then <DATA> tab-separated rows
  const colMatch = xml.match(/<COLUMNS>\s*([\s\S]*?)\s*<\/COLUMNS>/);
  if (!colMatch) return [];
  const cols = colMatch[1].split('\t').filter(Boolean);
  const dataRows = [...xml.matchAll(/<DATA>\s*([\s\S]*?)\s*<\/DATA>/g)];
  return dataRows.map(m => {
    const vals = m[1].split('\t');
    const obj = {};
    cols.forEach((c, i) => { obj[c] = vals[i + (vals[0] === '' ? 1 : 0)] ?? ''; });
    return obj;
  });
}

export async function fetchPhotosRets(mlsId) {
  const s = await getRetsSession();
  const getObjectUrl = s.capabilityUrls.getobject || s.capabilityUrls.GetObject;
  if (!getObjectUrl) return [];

  const resource = process.env.REIN_PHOTO_RESOURCE || 'Property';
  const objectType = process.env.REIN_PHOTO_CLASS || 'LargePhoto';

  const params = new URLSearchParams({
    Resource: resource,
    Type: objectType,
    ID: `${mlsId}:*`,
    Location: '0',
  });

  const url = `${getObjectUrl}?${params.toString()}`;
  const resp = await digestFetch(url);
  if (!resp.ok) {
    logger.warn({ mlsId, status: resp.status }, 'RETS photo fetch failed');
    return [];
  }

  // Multipart MIME response — split on boundary, extract Content-ID + binary
  const ct = resp.headers.get('content-type') || '';
  const boundaryMatch = ct.match(/boundary="?([^";]+)"?/i);
  if (!boundaryMatch) {
    // Single-part response
    const buf = Buffer.from(await resp.arrayBuffer());
    return [{ mediaKey: `${mlsId}-1`, contentType: ct.split(';')[0] || 'image/jpeg', buffer: buf, order: 1 }];
  }

  const boundary = boundaryMatch[1];
  const buf = Buffer.from(await resp.arrayBuffer());
  const parts = [];
  const boundaryBuf = Buffer.from(`--${boundary}`);
  let idx = 0;
  let order = 1;
  while (idx < buf.length) {
    const start = buf.indexOf(boundaryBuf, idx);
    if (start === -1) break;
    const next = buf.indexOf(boundaryBuf, start + boundaryBuf.length);
    if (next === -1) break;
    const partBuf = buf.subarray(start + boundaryBuf.length, next);
    // Split headers from body
    const headerEnd = partBuf.indexOf('\r\n\r\n');
    if (headerEnd === -1) { idx = next; continue; }
    const headers = partBuf.subarray(0, headerEnd).toString('utf8');
    const body = partBuf.subarray(headerEnd + 4);
    const cidMatch = headers.match(/Content-ID:\s*<?([^>\r\n]+)>?/i);
    const ctMatch = headers.match(/Content-Type:\s*([^\r\n;]+)/i);
    const orderMatch = headers.match(/Object-ID:\s*(\d+)/i);
    if (body.length > 100) {
      const objectId = orderMatch ? parseInt(orderMatch[1], 10) : order;
      parts.push({
        mediaKey: `${mlsId}-${objectId}`,
        contentType: (ctMatch?.[1] || 'image/jpeg').trim(),
        buffer: body,
        order: objectId,
      });
      order++;
    }
    idx = next;
  }
  return parts;
}
