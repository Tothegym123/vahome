// app/listings/[id]/[slug]/ListingJsonLd.tsx
// =============================================================================
// Comprehensive structured data for every listing detail page.
//
// Renders three JSON-LD blocks server-side:
//
//   1. RealEstateListing + Product (dual-typed root) wrapping
//        Offer -> SingleFamilyResidence
//        ├── PostalAddress  (streetAddress, addressLocality, addressRegion,
//        │                    postalCode, addressCountry)
//        ├── GeoCoordinates (latitude, longitude — when present in DB)
//        ├── floorSize / numberOfBedrooms / numberOfBathroomsTotal /
//        │   yearBuilt / amenityFeature[]
//        └── image (array of ImageObject — caption, contentUrl, width, height)
//
//   2. BreadcrumbList — Home > [City] homes for sale > [Address]
//
//   3. (Future) RealEstateAgent — once the Office/Member sync resolves the
//      listingAgent / listingOffice names. Currently the data layer surfaces
//      these as strings (sometimes still numeric IDs); we omit RealEstateAgent
//      from JSON-LD when the value isn't a real human/brokerage name to avoid
//      shipping 'Listed by 140820' to Google.
//
// Validation: paste any /listings/[id]/[slug]/ URL into
//   https://search.google.com/test/rich-results
// after deploy — should report zero errors.
// =============================================================================

import type { Listing } from "../../../lib/listings";
import { canonicalListingSlug } from "../../../lib/listing-slug";

const BASE = "https://vahome.com";

function looksLikeRealName(v: string | undefined | null): boolean {
  if (!v) return false;
  const s = String(v).trim();
  if (s.length < 3) return false;
  // Numeric-only strings (e.g. REIN office IDs '140820') should NOT be
  // exposed as a human-readable agent/office name in schema.
  if (/^\d+$/.test(s)) return false;
  return true;
}

function listingUrl(l: Listing): string {
  return `${BASE}/listings/${l.id}/${canonicalListingSlug({
    address: l.address,
    city: l.city,
  })}/`;
}

function streetAddress(l: Listing): string {
  // The DB `address` field can include the full city/state/zip. Strip those
  // for the streetAddress schema property so it carries only the street.
  const before = (l.address || "").split(",")[0].trim();
  return before || l.address || "";
}

function buildRoot(l: Listing) {
  const url = listingUrl(l);

  const images = (l.photos || [])
    .filter((p) => typeof p === "string" && p.length > 0)
    .slice(0, 12)
    .map((src, i) => ({
      "@type": "ImageObject",
      contentUrl: src,
      url: src,
      caption: `${streetAddress(l)} — photo ${i + 1}`,
    }));

  const amenityFeature: Array<Record<string, unknown>> = [];
  const pushAmenity = (name: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;
    amenityFeature.push({
      "@type": "LocationFeatureSpecification",
      name,
      value: String(value),
    });
  };
  pushAmenity("Heating", l.heating);
  pushAmenity("Cooling", l.cooling);
  pushAmenity("Pool", l.pool);
  pushAmenity("Fencing", l.fencing);
  pushAmenity("Roof", l.roof);
  pushAmenity("Water Source", l.waterSource);
  pushAmenity("Sewer", l.sewer);
  pushAmenity("Waterfront", l.waterfront ? "Yes" : undefined);

  const residence: Record<string, unknown> = {
    "@type": "SingleFamilyResidence",
    name: streetAddress(l),
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress(l),
      addressLocality: l.city,
      addressRegion: l.state || "VA",
      postalCode: l.zip,
      addressCountry: "US",
    },
    numberOfBedrooms: l.beds || undefined,
    numberOfBathroomsTotal: l.baths || undefined,
    floorSize: l.sqft
      ? {
          "@type": "QuantitativeValue",
          value: l.sqft,
          unitCode: "FTK", // square feet
        }
      : undefined,
    yearBuilt: l.yearBuilt || undefined,
  };

  if (typeof l.lat === "number" && typeof l.lng === "number" && (l.lat || l.lng)) {
    residence.geo = {
      "@type": "GeoCoordinates",
      latitude: l.lat,
      longitude: l.lng,
    };
  }

  if (images.length > 0) {
    residence.image = images;
  }
  if (amenityFeature.length > 0) {
    residence.amenityFeature = amenityFeature;
  }

  // RealEstateAgent — only embed when listingAgent looks like a real name
  // (Office/Member sync may still be in flight, so guard against numeric IDs).
  if (looksLikeRealName(l.listingAgent)) {
    residence.brokerOf = undefined; // structural, no-op
    (residence as any).agent = {
      "@type": "RealEstateAgent",
      name: l.listingAgent,
      ...(looksLikeRealName(l.listingOffice)
        ? {
            worksFor: { "@type": "RealEstateAgent", name: l.listingOffice },
          }
        : {}),
    };
  }

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    price: l.price || undefined,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    itemOffered: residence,
    url,
  };

  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateListing", "Product"],
    "@id": url,
    name: `${streetAddress(l)}, ${l.city}, ${l.state || "VA"} ${l.zip || ""}`.trim(),
    url,
    description:
      `${l.beds || 0} bed, ${l.baths || 0} bath, ${(l.sqft || 0).toLocaleString()} sq ft ` +
      `${l.propertyType || "home"} for sale at ${streetAddress(l)} in ${l.city}, ` +
      `${l.state || "VA"} ${l.zip || ""}.`,
    image: images.length > 0 ? images.map((i) => i.contentUrl) : undefined,
    inLanguage: "en-US",
    offers: offer,
  };
}

function buildBreadcrumbs(l: Listing) {
  const citySlug = (l.city || "").toLowerCase().trim().replace(/\s+/g, "-");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Listings", item: `${BASE}/listings/` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${l.city} Homes for Sale`,
        item: `${BASE}/listings/${citySlug}/`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: streetAddress(l),
        item: listingUrl(l),
      },
    ],
  };
}

export default function ListingJsonLd({ listing }: { listing: Listing }) {
  const root = buildRoot(listing);
  const crumbs = buildBreadcrumbs(listing);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [root, crumbs],
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
