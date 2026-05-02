// app/listings/[id]/page.tsx
// =============================================================================
// City listing landing pages at /listings/[city-slug]/.
//
// This route shares the [id] dynamic segment with the listing detail route at
// /listings/[id]/[slug]/. When the segment value matches a known city slug
// (defined in app/lib/cities.ts), this handler renders the city landing page.
// Otherwise the page returns 404 — but the existing /listings/[id]/[slug]/
// detail route continues to work because it requires two segments.
//
// SEO contract:
//   - Self-referencing canonical
//   - <meta name="robots" content="index, follow">
//   - One visible <h1>
//   - FAQPage JSON-LD
//   - Internal links to nearby city pages
//   - Live REIN data via the same applyFiltersToSupabaseQuery used by /listings
// =============================================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import HamptonRoadsAreaGuide from "../../components/HamptonRoadsAreaGuide";
import { applyFiltersToSupabaseQuery } from "../../lib/listing-filters";
import { CITIES, CITY_SLUGS, getCity, type CityData } from "../../lib/cities";
import { getDisplayStatus, getDisplayStatusBadgeClasses, isContingentFromRaw } from "../../lib/listing-status";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 60;

function generateSlug(address: string, city: string, state: string, zip: string): string {
  return [address, city, state, zip]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function fetchCityListings(cityDisplayName: string) {
  const supabase = sb();
  let q = supabase
    .from("listings")
    .select(
      "id, address, city, state, zip, price, beds, baths, sqft, status, photos, mls_number, raw",
      { count: "exact" },
    )
    .gt("price", 0)
    .order("price", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  // Reuse the canonical filter library so this page returns the exact same
  // dataset as /listings/?city=... — single source of truth.
  q = applyFiltersToSupabaseQuery(q, { city: cityDisplayName });

  const { data, count, error } = await q;
  if (error) {
    console.error("[/listings/[city]] supabase error", error);
    return { listings: [], total: 0 };
  }
  const listings = (data || []).map((r: any) => {
    const contingent = isContingentFromRaw(r.raw);
    return {
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
      contingent,
      displayStatus: getDisplayStatus(r.status, contingent),
      photo: Array.isArray(r.photos) && r.photos.length > 0 ? r.photos[0] : null,
      mls_number: r.mls_number,
      slug: generateSlug(r.address, r.city, r.state, r.zip),
    };
  });
  return { listings, total: count || 0 };
}

export function generateStaticParams() {
  return CITY_SLUGS.map((id) => ({ id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const city = getCity(params.id);
  if (!city) {
    // Fall through to notFound() in the page component; metadata is minimal.
    return { title: "Page not found | VaHome.com" };
  }
  const title = `${city.displayName} Homes for Sale | VaHome.com`;
  const description = `Browse homes for sale in ${city.displayName}, VA. Live REIN MLS listings, neighborhood guides, and answers to common questions about ${city.displayName} real estate from the VaHome team.`;
  const canonical = `https://vahome.com/listings/${city.slug}/`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { title, description, type: "website", url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

function FaqJsonLd({ city }: { city: CityData }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function BreadcrumbJsonLd({ city }: { city: CityData }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
      { "@type": "ListItem", position: 2, name: "Listings", item: "https://vahome.com/listings/" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${city.displayName} Homes for Sale`,
        item: `https://vahome.com/listings/${city.slug}/`,
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

export default async function CityListingsPage({ params }: { params: { id: string } }) {
  const city = getCity(params.id);
  if (!city) {
    notFound();
  }

  const { listings, total } = await fetchCityListings(city.displayName);
  const filterUrl = `/listings/?city=${encodeURIComponent(city.displayName)}`;

  return (
    <div className="pt-20 min-h-screen">
      <FaqJsonLd city={city} />
      <BreadcrumbJsonLd city={city} />

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span className="mx-2">›</span>
          <a href="/listings/" className="hover:text-gray-700">Listings</a>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{city.displayName}</span>
        </nav>

        {/* H1 + Intro */}
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {city.displayName} Homes for Sale
          </h1>
          <p className="mt-3 text-gray-700 leading-relaxed">{city.intro}</p>
          {total > 0 && (
            <p className="mt-3 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{total.toLocaleString()}</span>{" "}
              {total === 1 ? "home" : "homes"} for sale in {city.displayName} right now.
            </p>
          )}
        </header>

        {/* Listings grid */}
        {listings.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-16 text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No active listings right now</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Check back soon — new {city.displayName} listings are added daily from the REIN MLS.
              You can also browse the full <a href="/listings/" className="text-blue-600 hover:underline">Hampton Roads listings</a>.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {listings.map((l) => (
                <a
                  key={l.id}
                  href={`/listings/${l.id}/${l.slug}`}
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
                    {l.displayStatus !== "Active" && l.displayStatus !== "Unknown" && (
                      <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${getDisplayStatusBadgeClasses(l.displayStatus)}`}>
                        {l.displayStatus}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-2xl font-bold text-gray-900">${l.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-1">{l.address}</p>
                    <p className="text-xs text-gray-500">
                      {l.city}, {l.state} {l.zip}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-600">
                      {l.beds > 0 && (
                        <span>
                          <span className="font-semibold text-gray-900">{l.beds}</span> bd
                        </span>
                      )}
                      {l.baths > 0 && (
                        <span>
                          <span className="font-semibold text-gray-900">{l.baths}</span> ba
                        </span>
                      )}
                      {l.sqft > 0 && (
                        <span>
                          <span className="font-semibold text-gray-900">{l.sqft.toLocaleString()}</span> sqft
                        </span>
                      )}
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
                  Browse all {total.toLocaleString()} {city.displayName} homes →
                </a>
                <p className="mt-2 text-xs text-gray-500">
                  Refine by price, bedrooms, square footage, and more on the full search page.
                </p>
              </div>
            )}
          </>
        )}

        {/* Neighborhoods */}
        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{city.neighborhoodsHeading}</h2>
          <p className="text-gray-700 leading-relaxed">{city.neighborhoods}</p>
        </section>

        {/* Market snapshot */}
        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{city.marketSnapshotHeading}</h2>
          <p className="text-gray-700 leading-relaxed">{city.marketSnapshot}</p>
        </section>

        {/* FAQ */}
        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Common questions about {city.displayName} real estate
          </h2>
          <div className="space-y-5">
            {city.faqs.map((f, i) => (
              <div key={i} className="border-l-4 border-primary-600 pl-4">
                <h3 className="text-base font-semibold text-gray-900">{f.q}</h3>
                <p className="mt-1 text-gray-700 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby cities */}
        {city.nearby.length > 0 && (
          <section className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore nearby cities</h2>
            <div className="flex flex-wrap gap-3">
              {city.nearby.map((nearbySlug) => {
                const n = CITIES[nearbySlug];
                if (!n) {
                  // Nearby slug isn't a built city page yet — link to filter URL.
                  const fallbackName = nearbySlug
                    .split("-")
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(" ");
                  return (
                    <a
                      key={nearbySlug}
                      href={`/listings/?city=${encodeURIComponent(fallbackName)}`}
                      className="inline-block bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-primary-600 hover:text-primary-700"
                    >
                      Homes for Sale in {fallbackName} →
                    </a>
                  );
                }
                return (
                  <a
                    key={n.slug}
                    href={`/listings/${n.slug}/`}
                    className="inline-block bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-primary-600 hover:text-primary-700"
                  >
                    {n.displayName} Homes for Sale →
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <HamptonRoadsAreaGuide />
    </div>
  );
}
