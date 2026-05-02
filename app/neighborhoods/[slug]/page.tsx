// app/neighborhoods/[slug]/page.tsx
// =============================================================================
// Neighborhood detail page served at /neighborhoods/[slug]/.
//
// Renders for all 80 Hampton Roads neighborhoods (20 with rich migrated
// content, 60 with clean templated stubs + live REIN listings). Returns
// 404 for any unknown slug.
//
// Listings are filtered to listings.subdivision matching the
// neighborhood's pattern (case-insensitive substring), so the page surfaces
// only homes in that subdivision. If REIN ships nothing for the area, the
// page still renders the descriptive content and links to the parent city.
//
// SEO contract:
//   - Self-canonical URL
//   - index, follow + max-image-preview:large
//   - One H1: "[Neighborhood] Homes for Sale"
//   - JSON-LD: Place + RealEstateListing[] + BreadcrumbList
//   - OG/Twitter metadata with hero photo (first listing's first photo)
//   - Internal links to parent /listings/[city]/ and nearby neighborhoods
// =============================================================================

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  NEIGHBORHOOD_SLUGS,
  getNeighborhood,
  neighborhoodsByCity,
  resolveCanonicalSlug,
  subdivisionMatchPattern,
  type NeighborhoodData,
} from "../../lib/neighborhoods";
import { CITIES, getCity } from "../../lib/cities";
import { canonicalListingSlug } from "../../lib/listing-slug";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 60;
const BASE = "https://vahome.com";

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function fetchNeighborhoodListings(n: NeighborhoodData) {
  const supabase = sb();
  const pattern = subdivisionMatchPattern(n);
  let q = supabase
    .from("listings")
    .select(
      "id, address, city, state, zip, price, beds, baths, sqft, status, photos, mls_number, subdivision",
      { count: "exact" },
    )
    .eq("excluded", false)
    .is("removed_at", null)
    .in("status", ["Active", "Pending", "Contingent", "New Listing", "Under Contract"])
    .gt("price", 0)
    .ilike("subdivision", `%${pattern}%`)
    .order("price", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  const { data, count, error } = await q;
  if (error) {
    console.error("[/neighborhoods/[slug]] supabase error", error);
    return { listings: [], total: 0 };
  }
  const listings = (data || []).map((r: any) => ({
    id: r.id,
    address: r.address,
    city: r.city,
    state: r.state,
    zip: r.zip,
    price: r.price ?? 0,
    beds: r.beds ?? 0,
    baths: r.baths != null ? Number(r.baths) : 0,
    sqft: r.sqft ?? 0,
    status: r.status,
    photo: Array.isArray(r.photos) && r.photos.length > 0 ? r.photos[0] : null,
    mls_number: r.mls_number,
    slug: canonicalListingSlug({ address: r.address, city: r.city }),
  }));
  return { listings, total: count || 0 };
}

export function generateStaticParams() {
  return NEIGHBORHOOD_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const n = getNeighborhood(params.slug);
  if (!n) return { title: "Neighborhood Not Found | VaHome.com" };

  const canonical = `${BASE}/neighborhoods/${n.slug}/`;
  const title = `${n.displayName} Homes for Sale — ${n.parentCityName}, VA | VaHome.com`;
  const description = n.hasFullContent && n.intro
    ? n.intro.slice(0, 155)
    : `Browse current homes for sale in ${n.displayName}, ${n.parentCityName}, VA. Live REIN MLS listings, neighborhood overview, and parent-city context from the VaHome Team.`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: `${n.displayName} Homes for Sale — ${n.parentCityName}, VA`,
      description,
      siteName: "VaHome.com",
    },
    twitter: { card: "summary_large_image", title: n.displayName, description },
  };
}

function NeighborhoodJsonLd({ n, listingCount }: { n: NeighborhoodData; listingCount: number }) {
  const url = `${BASE}/neighborhoods/${n.slug}/`;
  const cityUrl = `${BASE}/listings/${n.citySlug}/`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        "@id": url,
        name: `${n.displayName}, ${n.parentCityName}, VA`,
        url,
        description: n.intro || `Residential neighborhood in ${n.parentCityName}, Virginia.`,
        containedInPlace: {
          "@type": "City",
          name: n.parentCityName,
          url: cityUrl,
          address: {
            "@type": "PostalAddress",
            addressLocality: n.parentCityName,
            addressRegion: "VA",
            addressCountry: "US",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Listings", item: `${BASE}/listings/` },
          { "@type": "ListItem", position: 3, name: `${n.parentCityName} Homes for Sale`, item: cityUrl },
          { "@type": "ListItem", position: 4, name: `${n.displayName} Homes for Sale`, item: url },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function NeighborhoodPage({ params }: { params: { slug: string } }) {
  // Accept either canonical (hyphenated) or legacy (un-hyphenated Lofty) slugs.
  // Anything else 404s; legacy slugs 301 to canonical so search-engine equity
  // transfers cleanly.
  const canonical = resolveCanonicalSlug(params.slug);
  if (!canonical) notFound();
  if (canonical !== params.slug) {
    permanentRedirect(`/neighborhoods/${canonical}/`);
  }
  const n = getNeighborhood(canonical);
  if (!n) notFound();

  const { listings, total } = await fetchNeighborhoodListings(n);
  const city = getCity(n.citySlug);
  const filterUrl = `/listings/?city=${encodeURIComponent(n.parentCityName)}`;

  // Other neighborhoods in the same city — internal link block
  const sameCityOthers = neighborhoodsByCity(n.citySlug)
    .filter((o) => o.slug !== n.slug)
    .slice(0, 12);

  return (
    <div className="pt-20 min-h-screen">
      <NeighborhoodJsonLd n={n} listingCount={total} />

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span className="mx-2">›</span>
          <a href="/listings/" className="hover:text-gray-700">Listings</a>
          <span className="mx-2">›</span>
          <a href={`/listings/${n.citySlug}/`} className="hover:text-gray-700">{n.parentCityName}</a>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{n.displayName}</span>
        </nav>

        {/* H1 + Intro */}
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {n.displayName} Homes for Sale
          </h1>
          <p className="text-base text-gray-500 mt-1">{n.parentCityName}, Virginia</p>

          {n.hasFullContent && n.intro ? (
            <p className="mt-4 text-gray-700 leading-relaxed">{n.intro}</p>
          ) : (
            <p className="mt-4 text-gray-700 leading-relaxed">
              {n.displayName} is a residential area in {n.parentCityName}, Virginia. Browse current homes
              for sale below — listings come straight from the REIN MLS and refresh continuously. Scroll
              down for {n.parentCityName} market context and links to other {n.parentCityName}{" "}
              neighborhoods.
            </p>
          )}

          {total > 0 && (
            <p className="mt-3 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{total.toLocaleString()}</span>{" "}
              {total === 1 ? "home" : "homes"} for sale in {n.displayName} right now.
            </p>
          )}
        </header>

        {/* Listings grid */}
        {listings.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No active listings in {n.displayName} right now
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {n.parentCityName} has plenty of inventory in nearby neighborhoods — browse the{" "}
              <a href={`/listings/${n.citySlug}/`} className="text-blue-600 hover:underline">
                full {n.parentCityName} listings page
              </a>{" "}
              or check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {listings.map((l) => (
                <a
                  key={l.id}
                  href={`/listings/${l.id}/${l.slug}/`}
                  className="block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] bg-gray-100 relative">
                    {l.photo ? (
                      <img src={l.photo} alt={l.address} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic">
                        No photo provided
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-2xl font-bold text-gray-900">${l.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-1">{l.address}</p>
                    <p className="text-xs text-gray-500">
                      {l.city}, {l.state} {l.zip}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-600">
                      {l.beds > 0 && (<span><span className="font-semibold text-gray-900">{l.beds}</span> bd</span>)}
                      {l.baths > 0 && (<span><span className="font-semibold text-gray-900">{l.baths}</span> ba</span>)}
                      {l.sqft > 0 && (<span><span className="font-semibold text-gray-900">{l.sqft.toLocaleString()}</span> sqft</span>)}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {total > PAGE_SIZE && (
              <div className="mt-10 text-center">
                <a
                  href={filterUrl}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Browse all {n.parentCityName} homes →
                </a>
              </div>
            )}
          </>
        )}

        {/* Lifestyle / market — only when we have rich content */}
        {n.hasFullContent && n.lifestyle && (
          <section className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Living in {n.displayName}</h2>
            <p className="text-gray-700 leading-relaxed">{n.lifestyle}</p>
            {n.marketSnapshot && (
              <p className="text-gray-700 leading-relaxed mt-4">{n.marketSnapshot}</p>
            )}
          </section>
        )}

        {/* Parent city context — same canonical copy used on /listings/[city]/ */}
        {city && (
          <section className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              About {city.displayName}
            </h2>
            <p className="text-gray-700 leading-relaxed">{city.intro}</p>
            <p className="mt-3 text-sm">
              <a href={`/listings/${city.slug}/`} className="text-primary-600 hover:underline font-medium">
                See all {city.displayName} homes for sale →
              </a>
            </p>
          </section>
        )}

        {/* Other neighborhoods in the same city */}
        {sameCityOthers.length > 0 && (
          <section className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Other {n.parentCityName} neighborhoods
            </h2>
            <div className="flex flex-wrap gap-2">
              {sameCityOthers.map((o) => (
                <a
                  key={o.slug}
                  href={`/neighborhoods/${o.slug}/`}
                  className="inline-block bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-primary-600 hover:text-primary-700"
                >
                  {o.displayName}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
