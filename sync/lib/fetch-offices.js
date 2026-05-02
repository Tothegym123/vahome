// sync/lib/fetch-offices.js
// =============================================================================
// REIN Office resource fetcher.
//
// REIN's Property/Listing resource ships only numeric office codes
// (ListOfficeMain, ListOfficeMLSID, ListOffice_MUI). Human-readable office
// names live in a separate top-level RETS resource — typically named "Office"
// per RESO standards, though MLS implementations vary. Configurable via env:
//   REIN_OFFICE_RESOURCE   default: "Office"
//   REIN_OFFICE_CLASS      default: "Office"
//   REIN_OFFICE_KEY_FIELD  default: "OfficeMlsId"   (used for the wildcard query)
//   REIN_OFFICE_AUTH_TYPE  default: same as REIN_AUTH_TYPE
//
// Run `node sync/probe-metadata.js` first to confirm the actual resource +
// class + field names exposed by REIN. If the probe shows different names,
// override via .env on the droplet.
// =============================================================================

import 'dotenv/config';
import { getRetsSession } from './auth-rets.js';
import { logger } from './logger.js';

// Local digestFetch — mirrors the pattern in auth-rets.js so this module
// doesn't need to reach into the listing fetcher's internals.
import crypto from 'node:crypto';
function md5(s) { return crypto.createHash('md5').update(s).digest('hex'); }

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

  let resp = await fetch(url, { ...opts, headers: baseHeaders });
  if (resp.status === 401) {
    const wwwAuth = resp.headers.get('www-authenticate') || '';
    if (/^Digest/i.test(wwwAuth)) {
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
      const basic = Buffer.from(`${username}:${password}`).toString('base64');
      resp = await fetch(url, { ...opts, headers: { ...baseHeaders, Authorization: `Basic ${basic}` } });
    }
  }
  return resp;
}

// COMPACT-DECODED parser — same logic as fetchListingsRets in auth-rets.js
function parseCompactDecoded(xml) {
  const colMatch = xml.match(/<COLUMNS>\s*([\s\S]*?)\s*<\/COLUMNS>/);
  if (!colMatch) return [];
  const cols = colMatch[1].split('\t').filter(Boolean);
  const dataRows = [...xml.matchAll(/<DATA>\s*([\s\S]*?)\s*<\/DATA>/g)];
  return dataRows.map(m => {
    const vals = m[1].split('\t');
    const obj = {};
    cols.forEach((c, i) => {
      // RETS COMPACT-DECODED rows often start with a leading tab; offset by 1 if so.
      obj[c] = vals[i + (vals[0] === '' ? 1 : 0)] ?? '';
    });
    return obj;
  });
}

// Map a RETS Office record into the mls_offices column shape. Field names
// follow RESO standards but are tolerant of variants (most MLSes deviate
// slightly). pick() returns the first non-empty value across candidates.
function pick(rec, ...keys) {
  for (const k of keys) {
    const v = rec?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return null;
}

export function transformOffice(rec) {
  return {
    mls_id: pick(rec, 'OfficeMlsId', 'OfficeMLSID', 'OfficeKey', 'OfficeMain', 'OfficeID'),
    name: pick(rec, 'OfficeName', 'OfficeFullName', 'OfficeLongName'),
    phone: pick(rec, 'OfficePhone', 'OfficePhoneNumber', 'MainOfficePhone'),
    address: pick(rec, 'OfficeAddress1', 'OfficeStreetAddress', 'OfficeAddress'),
    city: pick(rec, 'OfficeCity'),
    state: pick(rec, 'OfficeStateOrProvince', 'OfficeState'),
    zip: pick(rec, 'OfficePostalCode', 'OfficeZip'),
    raw: rec,
  };
}

export async function fetchAllOfficesRets({ pageSize = 500 } = {}) {
  const s = await getRetsSession();
  const searchUrl = s.capabilityUrls.search || s.capabilityUrls.Search;
  if (!searchUrl) throw new Error('RETS Search URL not available');

  const resource = process.env.REIN_OFFICE_RESOURCE || 'Office';
  const klass = process.env.REIN_OFFICE_CLASS || 'Office';
  const keyField = process.env.REIN_OFFICE_KEY_FIELD || 'OfficeMlsId';

  // Wildcard query: all offices. RETS DMQL2: ((Field=*))
  // If the configured key field doesn't exist, the request errors with 20203
  // and the operator should re-run probe-metadata to find the right field name.
  const query = `(${keyField}=*)`;

  const all = [];
  let offset = 1;
  let page = 0;

  while (true) {
    const params = new URLSearchParams({
      SearchType: resource,
      Class: klass,
      Query: query,
      QueryType: 'DMQL2',
      Format: 'COMPACT-DECODED',
      Limit: String(pageSize),
      Offset: String(offset),
      StandardNames: '0',
      Count: '1',
    });

    const url = `${searchUrl}?${params.toString()}`;
    const resp = await digestFetch(url);
    if (!resp.ok) {
      throw new Error(`RETS Office Search failed: ${resp.status} ${resp.statusText}`);
    }
    const xml = await resp.text();

    // RETS error envelope: <RETS ReplyCode="..." ReplyText="..." />
    const replyCode = xml.match(/ReplyCode="(\d+)"/)?.[1];
    if (replyCode && replyCode !== '0' && replyCode !== '20201') {
      // 20201 = "No records found" — terminal but not an error
      throw new Error(`RETS reply code ${replyCode}: ${xml.match(/ReplyText="([^"]+)"/)?.[1] || 'unknown'}`);
    }

    const batch = parseCompactDecoded(xml);
    if (!batch || batch.length === 0) break;

    all.push(...batch);
    logger.info({ page, fetched: batch.length, total: all.length }, 'office page fetched');

    if (batch.length < pageSize) break;
    offset += batch.length;
    page++;

    if (page > 200) {
      logger.warn({ page }, 'office pagination safety stop hit');
      break;
    }
  }

  return all;
}

// Convenience: fetch + transform + dedupe by mls_id.
export async function fetchAllOfficesNormalized() {
  const raw = await fetchAllOfficesRets();
  const seen = new Set();
  const offices = [];
  for (const r of raw) {
    const transformed = transformOffice(r);
    if (!transformed.mls_id) continue;
    if (seen.has(transformed.mls_id)) continue;
    seen.add(transformed.mls_id);
    offices.push(transformed);
  }
  return offices;
}
