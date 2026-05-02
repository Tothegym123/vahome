// app/lib/listing-slug.ts
// =============================================================================
// Single source of truth for listing-detail URL slugs.
//
// Earlier versions of this codebase generated slugs from
//   [address, city, state, zip].join(' ')
// but REIN's `address` column already contains the full
//   "<STREET>, <CITY> <STATE_ABBREV> <ZIP>"
// string, so the resulting slug duplicated the city+state+zip — e.g.
//   /listings/1166/3340-country-cir-chesapeake-va-23324-chesapeake-virginia-23324/
//
// This helper extracts JUST the street portion of the address (everything
// before the first comma, stripped of state abbreviations + zip codes that
// some feeds embed without a comma) and appends a single canonical city
// suffix for SEO.
//
// Canonical example:
//   /listings/1166/3340-country-cir-chesapeake/
//
// The listing-detail server component compares the requested slug against
// `canonicalListingSlug(listing)` and 301-redirects when they don't match,
// so existing inbound links to the old duplicated URLs still resolve.
// =============================================================================

const STATE_ABBREV = /\b(?:VA|NC|MD|DC|TN|WV|KY|SC|PA|NY|FL|GA)\b/gi;
const ZIP_CODE = /\b\d{5}(?:-\d{4})?\b/g;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // strip punctuation
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Extract the street-only portion of a possibly-compound address string.
//   "3340 Country CIR, CHESAPEAKE VA 23324"  -> "3340 Country CIR"
//   "3340 Country CIR"                       -> "3340 Country CIR"
//   "3340 Country CIR CHESAPEAKE VA 23324"   -> "3340 Country CIR" (best-effort)
function extractStreet(addressRaw: string): string {
  if (!addressRaw) return "";
  // Comma-delimited form is the common REIN/MLS shape — take the first chunk.
  const beforeComma = addressRaw.split(",")[0].trim();
  if (beforeComma && beforeComma !== addressRaw) {
    return beforeComma;
  }
  // No comma — strip any trailing "<STATE> <ZIP>" or "<CITY> <STATE> <ZIP>"
  // pattern when present, then return what's left.
  let s = addressRaw;
  s = s.replace(ZIP_CODE, "").trim();
  s = s.replace(STATE_ABBREV, "").trim();
  // Remove trailing whitespace + dangling commas/dashes
  return s.replace(/[,\s-]+$/, "").trim();
}

export function canonicalListingSlug(opts: {
  address: string;
  city: string;
  state?: string;
  zip?: string;
}): string {
  const street = extractStreet(opts.address || "");
  const city = (opts.city || "").trim();
  // Just street + city — short, readable, SEO-friendly. State abbrev and ZIP
  // are intentionally excluded because the listing ID in the URL already
  // disambiguates and including them is what produced the duplication bug.
  const parts = [street, city].filter(Boolean).join(" ");
  return slugify(parts);
}

// Backward-compatible alias for the old function name used in three
// rendering paths. Existing callers can be updated incrementally.
export function generateListingSlug(
  address: string,
  city: string,
  _state?: string,
  _zip?: string,
): string {
  return canonicalListingSlug({ address, city });
}
