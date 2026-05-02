// app/lib/listing-filters.ts
// =============================================================================
// Shared filter library for buyer search.
//
// Source of truth for: URL param schema, parsing, serialization, and
// applying a Filters object to a Supabase query builder. Used by both the
// server-rendered /listings page and the /api/map-listings JSON endpoint
// so the two surfaces stay in lockstep.
// =============================================================================

export type Filters = {
  q?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  beds?: number;          // min beds
  max_beds?: number;      // optional upper bound (range mode)
  baths?: number;
  type?: string[];        // ['Detached', 'Condo']
  min_sqft?: number;
  max_sqft?: number;
  min_year?: number;
  max_year?: number;
  min_lot?: number;       // acres
  max_lot?: number;
  status?: string[];      // ['Active', 'Pending']
  dom_max?: number;
  page?: number;
};

export const DEFAULT_STATUS = ['Active', 'Pending', 'Contingent'];

export const PROPERTY_TYPES: { value: string; label: string }[] = [
  { value: 'single_family', label: 'Single Family' },
  { value: 'townhome_condo', label: 'Townhome / Condo' },
  { value: 'multi_family', label: 'Multi-Family' },
  { value: 'land', label: 'Land' },
  { value: 'rental', label: 'Rental' },
  { value: 'commercial', label: 'Commercial' },
];

export const STATUS_CHOICES: { value: string; label: string }[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Contingent', label: 'Contingent' },
  { value: 'Coming Soon', label: 'Coming Soon' },
];

const parseInt_ = (v: string | undefined): number | undefined => {
  if (!v) return undefined;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
};

const parseFloat_ = (v: string | undefined): number | undefined => {
  if (!v) return undefined;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
};

const parseList = (v: string | undefined): string[] | undefined => {
  if (!v) return undefined;
  const arr = v.split(',').map((s) => s.trim()).filter(Boolean);
  return arr.length > 0 ? arr : undefined;
};

export function parseFiltersFromSearchParams(
  sp: Record<string, string | string[] | undefined>
): Filters {
  const get = (k: string): string | undefined => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  return {
    q: get('q'),
    city: get('city'),
    min_price: parseInt_(get('min_price')),
    max_price: parseInt_(get('max_price')),
    beds: parseInt_(get('beds')),
    max_beds: parseInt_(get('max_beds')),
    baths: parseFloat_(get('baths')),
    type: parseList(get('type')),
    min_sqft: parseInt_(get('min_sqft')),
    max_sqft: parseInt_(get('max_sqft')),
    min_year: parseInt_(get('min_year')),
    max_year: parseInt_(get('max_year')),
    min_lot: parseFloat_(get('min_lot')),
    max_lot: parseFloat_(get('max_lot')),
    status: parseList(get('status')),
    dom_max: parseInt_(get('dom_max')),
    page: parseInt_(get('page')),
  };
}

export function serializeFiltersToQueryString(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.city) p.set('city', f.city);
  if (f.min_price !== undefined) p.set('min_price', String(f.min_price));
  if (f.max_price !== undefined) p.set('max_price', String(f.max_price));
  if (f.beds !== undefined) p.set('beds', String(f.beds));
  if (f.max_beds !== undefined) p.set('max_beds', String(f.max_beds));
  if (f.baths !== undefined) p.set('baths', String(f.baths));
  if (f.type && f.type.length > 0) p.set('type', f.type.join(','));
  if (f.min_sqft !== undefined) p.set('min_sqft', String(f.min_sqft));
  if (f.max_sqft !== undefined) p.set('max_sqft', String(f.max_sqft));
  if (f.min_year !== undefined) p.set('min_year', String(f.min_year));
  if (f.max_year !== undefined) p.set('max_year', String(f.max_year));
  if (f.min_lot !== undefined) p.set('min_lot', String(f.min_lot));
  if (f.max_lot !== undefined) p.set('max_lot', String(f.max_lot));
  if (f.status && f.status.length > 0) p.set('status', f.status.join(','));
  if (f.dom_max !== undefined) p.set('dom_max', String(f.dom_max));
  if (f.page && f.page > 1) p.set('page', String(f.page));
  return p.toString();
}

// Apply a filter set to a Supabase query builder. Used by both
// /api/map-listings and /listings page. The caller is responsible for
// adding any additional surface-specific clauses (e.g. bbox on the map,
// pagination/order on the grid).
export function applyFiltersToSupabaseQuery(query: any, f: Filters): any {
  const status = (f.status && f.status.length > 0) ? f.status : DEFAULT_STATUS;
  query = query.in('status', status);
  query = query.eq('excluded', false).is('removed_at', null);

  if (f.city) {
    query = query.ilike('city', f.city.replace(/-/g, ' '));
  }
  if (f.q) {
    const term = `%${f.q}%`;
    query = query.or(
      `address.ilike.${term},city.ilike.${term},zip.ilike.${term},mls_number.ilike.${term}`
    );
  }
  if (f.min_price !== undefined) query = query.gte('price', f.min_price);
  if (f.max_price !== undefined) query = query.lte('price', f.max_price);
  if (f.beds !== undefined) query = query.gte('beds', f.beds);
  if (f.max_beds !== undefined) query = query.lte('beds', f.max_beds);
  if (f.baths !== undefined) query = query.gte('baths', f.baths);
  if (f.type && f.type.length > 0) {
    // Translate buyer-facing type groups into (property_type, property_subtype)
    // OR conditions. PostgREST `or=()` syntax with nested `and(...)` is used
    // to express "AND within a group, OR between groups".
    const orParts: string[] = [];
    for (const t of f.type) {
      switch (t) {
        case 'single_family':
          orParts.push('and(property_type.eq.Residential,property_subtype.eq.Detached)');
          break;
        case 'townhome_condo':
          orParts.push('and(property_type.eq.Residential,property_subtype.eq.Attached)');
          break;
        case 'multi_family':
          orParts.push('property_type.eq.Multi Family Residential');
          orParts.push('property_subtype.eq.Duplex');
          orParts.push('property_subtype.eq.Quadruplex');
          break;
        case 'land':
          orParts.push('property_type.eq.Land and Farms');
          break;
        case 'rental':
          orParts.push('property_type.eq.Rental');
          break;
        case 'commercial':
          orParts.push('property_type.eq.Commercial/Industrial');
          break;
        default:
          // Legacy / pass-through: literal property_type value match
          orParts.push(`property_type.ilike.%${t}%`);
      }
    }
    if (orParts.length > 0) {
      query = query.or(orParts.join(','));
    }
  }
  if (f.min_sqft !== undefined) query = query.gte('sqft', f.min_sqft);
  if (f.max_sqft !== undefined) query = query.lte('sqft', f.max_sqft);
  if (f.min_year !== undefined) query = query.gte('year_built', f.min_year);
  if (f.max_year !== undefined) query = query.lte('year_built', f.max_year);
  // lot_size is text; filter best-effort by parsing or skip if non-numeric.
  // For first wave, skip lot filtering (TODO: add a numeric lot_acres column).
  if (f.dom_max !== undefined) query = query.lte('days_on_market', f.dom_max);

  return query;
}
