import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getListingById, getListings, formatPriceFull, getFullAddress, getListingUrl } from '../../../lib/listings'
import type { Listing } from '../../../lib/listings'

// ---- ISR: Revalidate every 60 seconds ----
// When REIN MLS feed is connected, switch to on-demand revalidation:
// export const revalidate = 0 (disable time-based)
// and call revalidatePath('/listings/[id]/[slug]') from the MLS sync cron
export const revalidate = 60

// ---- Generate static paths for all listings at build time ----
export async function generateStaticParams() {
  const listings = getListings()
  return listings.map(l => {
    const url = getListingUrl(l)
    const parts = url.split('/').filter(Boolean)
    // URL format: /listings/{id}/{slug}/
    return { id: parts[1], slug: parts[2] }
  })
}

// ---- Dynamic metadata for SEO ----
export async function generateMetadata({ params }: { params: { id: string; slug: string } }) {
  const listing = getListingById(parseInt(params.id))
  if (!listing) return { title: 'Listing Not Found | VaHome' }

  const address = getFullAddress(listing)
  return {
    title: `${address} - ${formatPriceFull(listing.price)} | ${listing.beds} Bed ${listing.baths} Bath`,
    description: listing.description || `${listing.beds} bedroom, ${listing.baths} bathroom ${listing.type.toLowerCase()} at ${address}. ${listing.sqft.toLocaleString()} sqft. Listed at ${formatPriceFull(listing.price)}.`,
    openGraph: {
      title: `${address} - ${formatPriceFull(listing.price)}`,
      description: `${listing.beds}bd | ${listing.baths}ba | ${listing.sqft.toLocaleString()} sqft`,
      images: [{ url: listing.img, width: 800, height: 600, alt: address }],
    },
  }
}

// ---- JSON-LD structured data for individual listing ----
function ListingJsonLd({ listing }: { listing: Listing }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: getFullAddress(listing),
    url: `https://vahometest2.com${getListingUrl(listing)}`,
    description: listing.description,
    image: listing.img,
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'USD',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip,
      addressCountry: 'US',
    },
    numberOfRooms: listing.beds,
    numberOfBathroomsTotal: listing.baths,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: listing.sqft,
      unitCode: 'FTK',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default function ListingDetailPage({ params }: { params: { id: string; slug: string } }) {
  const listing = getListingById(parseInt(params.id))

  if (!listing) {
    notFound()
  }

  const address = getFullAddress(listing)
  const nearbyListings = getListings()
    .filter(l => l.id !== listing.id && l.city === listing.city)
    .slice(0, 4)

  return (
    <>
      <ListingJsonLd listing={listing} />

      <div className="min-h-screen bg-gray-50" style={{ marginTop: '72px' }}>
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span>/</span>
              <Link href="/map/" className="hover:text-gray-700">Map Search</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate">{listing.address}, {listing.city}</span>
            </nav>
          </div>
        </div>

        {/* Hero image */}
        <div className="bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="relative aspect-[16/7] md:aspect-[16/6]">
              <img
                src={listing.img}
                alt={address}
                className="w-full h-full object-cover"
              />
              {listing.status === 'active' && (
                <span className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded">
                  Active
                </span>
              )}
              <Link
                href="/map/"
                className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Map
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column — details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Price & address */}
              <div>
                <div className="text-4xl font-black text-gray-900">{formatPriceFull(listing.price)}</div>
                <div className="text-lg text-gray-600 mt-1">{address}</div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-900">{listing.beds}</div>
                    <div className="text-sm text-gray-500">Beds</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-900">{listing.baths}</div>
                    <div className="text-sm text-gray-500">Baths</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-900">{listing.sqft.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Sqft</div>
                  </div>
                  {listing.yearBuilt && (
                    <>
                      <div className="w-px h-8 bg-gray-200"></div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-gray-900">{listing.yearBuilt}</div>
                        <div className="text-sm text-gray-500">Built</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">About This Home</h2>
                  <p className="text-gray-600 leading-relaxed">{listing.description}</p>
                </div>
              )}

              {/* Property details grid */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <DetailItem label="Property Type" value={listing.type} />
                  <DetailItem label="Bedrooms" value={String(listing.beds)} />
                  <DetailItem label="Bathrooms" value={String(listing.baths)} />
                  <DetailItem label="Square Feet" value={listing.sqft.toLocaleString()} />
                  {listing.yearBuilt && <DetailItem label="Year Built" value={String(listing.yearBuilt)} />}
                  {listing.lotSize && <DetailItem label="Lot Size" value={listing.lotSize} />}
                  {listing.daysOnMarket !== undefined && <DetailItem label="Days on Market" value={String(listing.daysOnMarket)} />}
                  <DetailItem label="City" value={listing.city} />
                  <DetailItem label="Zip Code" value={listing.zip} />
                </div>
              </div>

              {/* Map preview */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Location</h2>
                <div className="bg-gray-200 rounded-xl overflow-hidden aspect-[16/9] flex items-center justify-center">
                  <Link
                    href={`/map/?lat=${listing.lat}&lng=${listing.lng}&zoom=15`}
                    className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    View on Interactive Map
                  </Link>
                </div>
              </div>
            </div>

            {/* Right column — contact card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900">Interested in this home?</h3>
                <p className="text-sm text-gray-500 mt-1">The VaHome Team can help you schedule a tour.</p>

                <a
                  href="tel:+17577777577"
                  className="block mt-4 text-center bg-red-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Call (757) 777-7577
                </a>

                <a
                  href="mailto:tom@vahomes.com?subject=Interested in {address}"
                  className="block mt-2 text-center bg-white text-red-500 border-2 border-red-500 py-3 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  Email Us
                </a>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-400 text-center">
                    The VaHome Team | LPT Realty<br />
                    249 Central Park Ave Ste 300<br />
                    Virginia Beach, VA 23462
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby listings */}
          {nearbyListings.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">More homes in {listing.city}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {nearbyListings.map(l => (
                  <Link key={l.id} href={getListingUrl(l)} className="group">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                      <img src={l.img} alt={getFullAddress(l)} className="w-full h-40 object-cover" loading="lazy" />
                      <div className="p-4">
                        <div className="text-lg font-black text-gray-900">{formatPriceFull(l.price)}</div>
                        <div className="text-xs text-gray-500 mt-1">{l.beds} bd | {l.baths} ba | {l.sqft.toLocaleString()} sqft</div>
                        <div className="text-xs text-gray-600 mt-0.5 truncate">{getFullAddress(l)}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="text-xs text-gray-400 font-medium">{label}</div>
      <div className="text-sm font-semibold text-gray-900 mt-0.5">{value}</div>
    </div>
  )
}
