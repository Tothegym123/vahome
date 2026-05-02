import { Metadata } from "next";
import { createClient } from '@supabase/supabase-js';
import HamptonRoadsAreaGuide from '../components/HamptonRoadsAreaGuide'
import FilterBar from '../components/filters/FilterBar'
import FilterSidebar from '../components/filters/FilterSidebar'
import {
  parseFiltersFromSearchParams,
  applyFiltersToSupabaseQuery,
  serializeFiltersToQueryString,
  type Filters,
} from '../lib/listing-filters'
import { citySlugFromName, CITIES } from '../lib/cities'
import { getDisplayStatus, getDisplayStatusColor, getDisplayStatusTextColor, isContingentFromRaw } from '../lib/listing-status'
import { canonicalListingSlug } from '../lib/listing-slug'

// Returns true when ?city= is the only filter set on the URL (so we can offer
// users + Google a redirect/canonical to the clean /listings/[city]/ page).
function isCityOnlyFilter(f: Filters): boolean {
  if (!f.city) return false;
  if (f.q || f.min_price !== undefined || f.max_price !== undefined) return false;
  if (f.beds !== undefined || f.max_beds !== undefined || f.baths !== undefined) return false;
  if (f.type && f.type.length > 0) return false;
  if (f.min_sqft !== undefined || f.max_sqft !== undefined) return false;
  if (f.min_year !== undefined || f.max_year !== undefined) return false;
  if (f.min_lot !== undefined || f.max_lot !== undefined) return false;
  if (f.status && f.status.length > 0) return false;
  if (f.dom_max !== undefined) return false;
  if (f.page !== undefined && f.page > 1) return false;
  return true;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PAGE_SIZE = 60;

function generateSlug(address: string, city: string, _state?: string, _zip?: string): string {
  return canonicalListingSlug({ address, city });
}

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function fetchListings(filters: Filters) {
  const supabase = sb();
  const page = Math.max(1, filters.page || 1);
  const offset = (page - 1) * PAGE_SIZE;

  let q = supabase
    .from('listings')
    .select(
      'id, address, city, state, zip, price, beds, baths, sqft, status, photos, mls_number, raw',
      { count: 'exact' },
    )
    .gt('price', 0)
    .order('price', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  q = applyFiltersToSupabaseQuery(q, filters);

  const { data, count, error } = await q;
  if (error) {
    console.error('[/listings] supabase error', error);
    return { listings: [], total: 0, page };
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
  return { listings, total: count || 0, page };
}

const CITY_INTROS: Record<string, string> = {
  "virginia-beach": "Virginia Beach is the largest city in Hampton Roads and one of Virginia's most desirable real estate markets. Home buyers here can choose from oceanfront condos along the boardwalk, golf-course communities in Kempsville, established family neighborhoods in Great Neck, and waterfront properties along the Lynnhaven River. The city's combination of strong public schools, mild coastal climate, and proximity to Naval Air Station Oceana keeps housing demand consistent year-round. The median home price in Virginia Beach typically tracks slightly above the regional average, with active inventory ranging from sub-$300K starter homes to multi-million-dollar luxury estates. The VaHome team specializes in Virginia Beach real estate and can help you navigate everything from VA loan eligibility to school zone boundaries.",
  "norfolk": "Norfolk offers some of the most diverse housing options in Hampton Roads, from historic Ghent townhomes and Larchmont craftsmen to modern condos in the booming Downtown waterfront district. As home to Naval Station Norfolk, the largest naval base in the world, the city has consistent demand from active-duty military and DoD civilians, making it especially friendly to VA loan buyers. Neighborhoods like Colonial Place, Edgewater, and Park Place each have distinct character and price ranges. Norfolk also leads the region in walkability, with neighborhoods like Ghent and Riverview ranking among the most walkable in Virginia. Median home prices here are typically more accessible than Virginia Beach, making Norfolk a popular choice for first-time buyers and military families on PCS orders.",
  "chesapeake": "Chesapeake is Virginia's second-largest city by area and offers a mix of suburban subdivisions, rural acreage, and waterfront properties along the Intracoastal Waterway. Western Branch, Greenbrier, and Great Bridge are among the most sought-after neighborhoods, with top-rated public schools and easy access to I-64 and the Chesapeake Expressway. Chesapeake is known for its lower property taxes and larger lot sizes compared to neighboring cities, making it attractive to families looking for more space. Newer construction is common in areas like Edinburgh and Cahoon Plantation, while established neighborhoods like Hickory and Indian River offer more mature settings. The VaHome team has deep experience guiding buyers through Chesapeake's varied submarkets.",
  "suffolk": "Suffolk is Hampton Roads' fastest-growing city and one of the largest in Virginia by land area. Home buyers find a mix of new-construction subdivisions in northern neighborhoods like Harbour View and Burbage Grant, charming historic homes in Downtown Suffolk, and substantial rural and waterfront properties throughout the south of the city. Suffolk's lower cost of living, generous lot sizes, and easy commute to Naval Medical Center Portsmouth and Norfolk Naval Shipyard make it especially appealing to growing families and military households. Public schools in Suffolk include several highly rated options, and the city has invested heavily in parks, trails, and waterfront access in recent years.",
  "hampton": "Hampton is one of the oldest English-speaking settlements in America and offers an exceptional value proposition for home buyers in Hampton Roads. Neighborhoods like Phoebus, Wythe, and Buckroe Beach combine historic charm with proximity to Joint Base Langley-Eustis, making the city particularly popular with Air Force and Army families. Hampton's median home price is typically among the most accessible in the region, with single-family homes available well under $300,000 in many neighborhoods. Buckroe Beach offers oceanfront and bayfront living, while Fox Hill and Aberdeen Gardens provide established family neighborhoods. The VaHome team can help you find homes near Langley AFB, including ones that fit BAH for various paygrades.",
  "newport-news": "Newport News is a long, narrow city stretching along the James River with neighborhoods that range dramatically in price and character. Hilton Village offers historic English-village-style homes, while Port Warwick provides newer mixed-use community living with restaurants and shops on-site. Denbigh and Kiln Creek offer suburban subdivisions popular with families. Newport News is home to Newport News Shipbuilding, the city's largest employer, as well as Joint Base Langley-Eustis (Fort Eustis side). Median home prices remain among the most accessible in Hampton Roads, making this a strong choice for first-time buyers and shipyard workers. Public schools in some neighborhoods are highly rated, while others have improved substantially in recent years.",
  "portsmouth": "Portsmouth combines historic naval heritage with affordable, character-rich neighborhoods. Olde Towne Portsmouth offers tree-lined streets of restored 18th and 19th century homes with sweeping Elizabeth River views. Churchland, Cradock, and West Park View provide established family neighborhoods at price points well below comparable Norfolk or Virginia Beach properties. The city is home to Norfolk Naval Shipyard, one of the Navy's oldest and largest shipyards, ensuring consistent demand from civilian shipyard workers and active-duty Navy personnel. Portsmouth's median home prices are among the lowest in Hampton Roads, making it especially appealing to first-time buyers, investors, and military families seeking a VA loan property close to base.",
  "yorktown": "Yorktown is a charming historic town on the York River, best known for the decisive battle of the American Revolution that ended here in 1781. Today, Yorktown offers picturesque homes ranging from waterfront colonials to newer subdivisions in nearby Tabb and Grafton. The town is part of York County, which consistently ranks among the top public school systems in Virginia, making it a top choice for families. Yorktown is also conveniently located near Joint Base Langley-Eustis (Fort Eustis side) and Naval Weapons Station Yorktown, with manageable commutes to both. Home prices in Yorktown and surrounding York County tend to be higher than the regional average, reflecting strong school quality and lower density.",
  "williamsburg": "Williamsburg combines colonial-era history with one of Virginia's most distinctive real estate markets. Homes here range from restored historic properties in the Historic Triangle to newer single-family construction in master-planned communities like Ford's Colony and Kingsmill. The city is anchored by The College of William & Mary, Colonial Williamsburg, and Busch Gardens, supporting a robust tourism and educational economy. Williamsburg's home prices reflect the area's desirability, with strong demand from retirees, second-home buyers, and families drawn by James City County's highly rated schools. Many neighborhoods offer golf courses, pools, and clubhouses as part of HOA amenities."
};


export function generateMetadata({ searchParams }: { searchParams: { city?: string; q?: string } }): Metadata {
  const city = searchParams.city;
  const query = searchParams.q;

  let title = "Homes for Sale in Hampton Roads";
  let description = "Browse homes for sale in Hampton Roads, Virginia. Find your perfect property in Virginia Beach, Norfolk, Chesapeake, and more.";

  if (city) {
    title = "Homes for Sale in " + city + ", VA";
    description = "Browse homes for sale in " + city + ", Virginia. View listings, prices, and property details with VaHome.com.";
  } else if (query) {
    title = "Search Results: " + query;
    description = "Property search results for " + query + " in Hampton Roads, Virginia.";
  }
  title += " | VaHome.com";

  // Canonical resolution:
  //   - No filters at all -> /listings/
  //   - ?city= on a recognized city as the ONLY filter -> point canonical at the
  //     clean /listings/[slug]/ page so ranking signals consolidate there.
  //   - ?city= with other filters -> self-canonical to the filter URL (still
  //     noindexed via the robots field below).
  let canonical: string;
  const cityOnly = !!city && Object.keys(searchParams || {}).length === 1;
  const knownCitySlug = city ? citySlugFromName(city) : undefined;
  if (cityOnly && knownCitySlug) {
    canonical = `https://vahome.com/listings/${knownCitySlug}/`;
  } else if (city) {
    canonical = "https://vahome.com/listings/?city=" + encodeURIComponent(city);
  } else {
    canonical = "https://vahome.com/listings/";
  }

  return {
    title,
    description,
    alternates: { canonical },
    robots: searchParams && Object.keys(searchParams).length > 0 ? { index: false, follow: true } : undefined,
    openGraph: { title, description, type: "website" },
  };
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseFiltersFromSearchParams(searchParams);
  const { listings, total, page } = await fetchListings(filters);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildPageUrl = (n: number) => {
    const next: Filters = { ...filters, page: n > 1 ? n : undefined };
    const qs = serializeFiltersToQueryString(next);
    return qs ? `/listings?${qs}` : '/listings';
  };

  // Initial value for the search input — preserves typed text across reloads.
  const initialQ = filters.q || '';

  const cityKey = (searchParams?.city || "").toString().toLowerCase().replace(/\s+/g, "-");
  const cityIntro = CITY_INTROS[cityKey];

  // If the user filtered by a recognized city, surface the dedicated indexable
  // city page. Helps both UX and SEO (consolidates ranking signals).
  const recognizedCity = filters.city ? CITIES[citySlugFromName(filters.city) || ""] : undefined;

  return (
    <div className="pt-20 min-h-screen">
      {/* Sticky search bar (search input only — filters live in the sidebar / mobile sheet) */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <form action="/listings" method="get" className="relative">
            {/* Preserve filter params across a search submit */}
            {filters.city && <input type="hidden" name="city" value={filters.city} />}
            {filters.min_price !== undefined && <input type="hidden" name="min_price" value={String(filters.min_price)} />}
            {filters.max_price !== undefined && <input type="hidden" name="max_price" value={String(filters.max_price)} />}
            {filters.beds !== undefined && <input type="hidden" name="beds" value={String(filters.beds)} />}
            {filters.max_beds !== undefined && <input type="hidden" name="max_beds" value={String(filters.max_beds)} />}
            {filters.baths !== undefined && <input type="hidden" name="baths" value={String(filters.baths)} />}
            {filters.type && filters.type.length > 0 && <input type="hidden" name="type" value={filters.type.join(',')} />}
            {filters.min_sqft !== undefined && <input type="hidden" name="min_sqft" value={String(filters.min_sqft)} />}
            {filters.max_sqft !== undefined && <input type="hidden" name="max_sqft" value={String(filters.max_sqft)} />}
            {filters.min_year !== undefined && <input type="hidden" name="min_year" value={String(filters.min_year)} />}
            {filters.max_year !== undefined && <input type="hidden" name="max_year" value={String(filters.max_year)} />}
            {filters.status && filters.status.length > 0 && <input type="hidden" name="status" value={filters.status.join(',')} />}
            {filters.dom_max !== undefined && <input type="hidden" name="dom_max" value={String(filters.dom_max)} />}
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              name="q"
              defaultValue={initialQ}
              placeholder="Search by city, zip, address..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </form>
        </div>
      </div>

      {/* Two-column layout: persistent sidebar + main content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 flex gap-6">
        <FilterSidebar />

        <main className="flex-1 min-w-0">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Homes for Sale in Hampton Roads</h1>
            {cityIntro && (
              <section className="mt-3">
                <p className="text-gray-700 leading-relaxed text-base">{cityIntro}</p>
              </section>
            )}
          </div>

          {recognizedCity && (
            <a
              href={`/listings/${recognizedCity.slug}/`}
              className="block mb-4 px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <p className="text-sm text-blue-900">
                <span className="font-semibold">View {recognizedCity.displayName}'s dedicated homes-for-sale page</span> — neighborhoods, market notes, FAQs and more →
              </p>
            </a>
          )}

          <FilterBar resultCount={total} />

          {listings.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-16 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h2>
              <p className="text-gray-400 max-w-md mx-auto">Try adjusting your search or browse all <a className="text-blue-600 hover:underline" href="/listings">Hampton Roads listings</a>.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {listings.map((l) => (
                  <a key={l.id} href={`/listings/${l.id}/${l.slug}`} className="block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] bg-gray-100 relative">
                      {l.photo ? (
                        <img src={l.photo} alt={l.address} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic">No photo provided</div>
                      )}
                      {l.displayStatus !== 'Active' && l.displayStatus !== 'Unknown' && (
                        <span
                          className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: getDisplayStatusColor(l.displayStatus),
                            color: getDisplayStatusTextColor(l.displayStatus),
                          }}
                        >{l.displayStatus}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-2xl font-bold text-gray-900">${l.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-1">{l.address}</p>
                      <p className="text-xs text-gray-500">{l.city}, {l.state} {l.zip}</p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-600">
                        {l.beds > 0 && <span><span className="font-semibold text-gray-900">{l.beds}</span> bd</span>}
                        {l.baths > 0 && <span><span className="font-semibold text-gray-900">{l.baths}</span> ba</span>}
                        {l.sqft > 0 && <span><span className="font-semibold text-gray-900">{l.sqft.toLocaleString()}</span> sqft</span>}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-10">
                  {page > 1 ? (
                    <a href={buildPageUrl(page - 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">← Previous</a>
                  ) : <span />}
                  <span className="text-sm text-gray-500">Page {page} of {totalPages.toLocaleString()}</span>
                  {page < totalPages ? (
                    <a href={buildPageUrl(page + 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Next →</a>
                  ) : <span />}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <HamptonRoadsAreaGuide />
    </div>
  )
}
