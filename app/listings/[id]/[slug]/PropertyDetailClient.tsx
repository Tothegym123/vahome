'use client';

import { useState } from 'react';
import { Listing, formatPriceFull, formatPrice, getFullAddress } from '../../lib/listings';
import Image from 'next/image';

interface PropertyDetailClientProps {
  listing: Listing;
}

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: string;
  iconBg: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  id,
  title,
  icon,
  iconBg,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <span className="text-lg">{icon}</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 flex-1 text-left">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-6 py-5">{children}</div>}
    </div>
  );
}

function DetailGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
      {items.map((item, idx) => (
        <div key={idx}>
          <p className="text-sm text-gray-500 mb-1">{item.label}</p>
          <p className="text-sm font-medium text-gray-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function SchoolCard({ label, school }: { label: string; school: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      <p className="text-sm font-medium text-gray-900">{school || 'N/A'}</p>
    </div>
  );
}

export default function PropertyDetailClient({ listing }: PropertyDetailClientProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const photos = listing.photos && listing.photos.length > 0 ? listing.photos : [listing.img];
  const mainPhoto = photos[0];
  const thumbnailPhotos = photos.slice(1, 5);

  const pricePerSqft = listing.sqft > 0 ? Math.round(listing.price / listing.sqft) : 0;
  const isActive = listing.status?.toLowerCase() === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">
            Home
          </a>
          <span>/</span>
          <a href="/listings" className="hover:text-gray-900">
            Virginia
          </a>
          <span>/</span>
          <a href={`/listings?city=${listing.city}`} className="hover:text-gray-900">
            {listing.city}
          </a>
          <span>/</span>
          <span>{listing.neighborhood || listing.subdivision}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{listing.address}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Photo Gallery */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <div className="grid gap-2 p-2" style={{ gridTemplateColumns: '2fr 1fr', gridTemplateRows: '200px 200px' }}>
                {/* Main Image */}
                <div className="relative row-span-2 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={mainPhoto}
                    alt={listing.address}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src =
                        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%239ca3af%22%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {photos.length} Photos
                  </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="col-span-1 grid grid-cols-2 gap-2">
                  {thumbnailPhotos.map((photo, idx) => (
                    <div key={idx} className="relative bg-gray-200 rounded-lg overflow-hidden aspect-square cursor-pointer hover:opacity-80 transition-opacity">
                      <Image
                        src={photo}
                        alt={`${listing.address} - Photo ${idx + 2}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src =
                            'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Bar */}
            <div className="bg-white rounded-xl border border-gray-100 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isActive ? 'ACTIVE' : 'SOLD'}
                </span>
                <span className="text-gray-600 text-sm">
                  {listing.daysOnMarket} days on market
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatPriceFull(listing.price)}</p>
            </div>

            {/* Address & MLS Info */}
            <div className="bg-white rounded-xl border border-gray-100 px-6 py-5">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.address}</h1>
              <p className="text-gray-600 text-sm">
                {listing.city}, {listing.state} {listing.zip}
              </p>
              <p className="text-gray-500 text-xs mt-3">
                MLS# {listing.mlsNumber} · {listing.subdivision} · {listing.county}
              </p>
            </div>

            {/* Key Stats */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-6 divide-x divide-gray-200">
                {[
                  { label: 'Beds', value: listing.beds.toString() },
                  { label: 'Baths', value: `${listing.baths}${listing.halfBaths ? `.${listing.halfBaths}` : ''}` },
                  { label: 'Sq Ft', value: listing.sqft.toLocaleString() },
                  { label: '$/Sq Ft', value: `$${pricePerSqft}` },
                  { label: 'Built', value: listing.yearBuilt.toString() },
                  { label: 'Garage', value: listing.garage.toString() },
                ].map((stat, idx) => (
                  <div key={idx} className="px-4 py-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Facts Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                listing.propertyType,
                listing.style,
                listing.stories && `${listing.stories} Story`,
                listing.hoaFee > 0 && `HOA: $${listing.hoaFee}/${listing.hoaFrequency}`,
                listing.waterfront && 'Waterfront',
              ]
                .filter(Boolean)
                .map((fact, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {fact}
                  </span>
                ))}
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              {/* Description */}
              <CollapsibleSection
                id="description"
                title="Description"
                icon="📝"
                iconBg="bg-blue-100"
              >
                <p className="text-gray-700 text-sm leading-6">
                  {listing.remarks || listing.description || 'No description available.'}
                </p>
              </CollapsibleSection>

              {/* Property Details */}
              <CollapsibleSection
                id="property-details"
                title="Property Details"
                icon="🏠"
                iconBg="bg-green-100"
              >
                <DetailGrid
                  items={[
                    { label: 'Property Type', value: listing.propertyType },
                    { label: 'Style', value: listing.style },
                    { label: 'Stories', value: listing.stories.toString() },
                    { label: 'Year Built', value: listing.yearBuilt.toString() },
                    { label: 'Approx Sq Ft', value: listing.sqft.toLocaleString() },
                    { label: 'Bedrooms', value: listing.beds.toString() },
                    { label: 'Full Baths', value: listing.baths.toString() },
                    { label: 'Half Baths', value: listing.halfBaths.toString() },
                    { label: 'Fireplaces', value: listing.fireplaces.toString() },
                    { label: 'Lot Size', value: listing.lotSize },
                  ]}
                />
              </CollapsibleSection>

              {/* Construction & Exterior */}
              <CollapsibleSection
                id="construction"
                title="Construction & Exterior"
                icon="🔨"
                iconBg="bg-amber-100"
              >
                <DetailGrid
                  items={[
                    { label: 'Exterior', value: listing.construction.join(', ') || 'N/A' },
                    { label: 'Foundation', value: listing.foundation },
                    { label: 'Roof', value: listing.roof },
                    { label: 'Exterior Features', value: listing.exteriorFeatures.join(', ') || 'N/A' },
                    { label: 'Pool', value: listing.pool },
                    { label: 'Fencing', value: listing.fencing },
                    {
                      label: 'Waterfront',
                      value: listing.waterfront ? listing.waterfrontDescription : 'Not Waterfront',
                    },
                  ]}
                />
              </CollapsibleSection>

              {/* Interior Features */}
              <CollapsibleSection
                id="interior"
                title="Interior Features"
                icon="✨"
                iconBg="bg-purple-100"
              >
                <DetailGrid
                  items={[
                    { label: 'Flooring', value: listing.flooring.join(', ') || 'N/A' },
                    { label: 'Cooling', value: listing.cooling },
                    { label: 'Heating', value: listing.heating },
                    { label: 'Laundry', value: listing.laundry },
                    {
                      label: 'Interior Features',
                      value: listing.interiorFeatures.join(', ') || 'N/A',
                    },
                  ]}
                />
              </CollapsibleSection>

              {/* Appliances & Equipment */}
              {listing.appliancesIncluded && listing.appliancesIncluded.length > 0 && (
                <CollapsibleSection
                  id="appliances"
                  title="Appliances & Equipment"
                  icon="⚙️"
                  iconBg="bg-slate-100"
                >
                  <div className="space-y-2">
                    {listing.appliancesIncluded.map((appliance, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{appliance}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {/* Parking & Garage */}
              <CollapsibleSection
                id="parking"
                title="Parking & Garage"
                icon="🚗"
                iconBg="bg-blue-100"
              >
                <DetailGrid
                  items={[
                    { label: 'Garage', value: listing.garage > 0 ? 'Yes' : 'No' },
                    { label: 'Parking', value: listing.parkingFeatures.join(', ') || 'N/A' },
                  ]}
                />
              </CollapsibleSection>

              {/* Utilities */}
              <CollapsibleSection
                id="utilities"
                title="Utilities"
                icon="⚡"
                iconBg="bg-green-100"
              >
                <DetailGrid
                  items={[
                    { label: 'Water', value: listing.waterSource },
                    { label: 'Sewer', value: listing.sewer },
                    { label: 'Heating', value: listing.heating },
                    { label: 'Cooling', value: listing.cooling },
                  ]}
                />
              </CollapsibleSection>

              {/* Financial Details */}
              <CollapsibleSection
                id="financial"
                title="Financial Details"
                icon="💰"
                iconBg="bg-amber-100"
              >
                <DetailGrid
                  items={[
                    { label: 'List Price', value: formatPriceFull(listing.price) },
                    { label: 'Price/Sq Ft', value: `$${pricePerSqft}` },
                    { label: 'Approx Taxes', value: `$${listing.taxAmount.toLocaleString()}/yr` },
                    {
                      label: 'HOA',
                      value:
                        listing.hoaFee > 0
                          ? `$${listing.hoaFee}/${listing.hoaFrequency}`
                          : 'None',
                    },
                  ]}
                />
              </CollapsibleSection>

              {/* Schools */}
              <CollapsibleSection
                id="schools"
                title="Schools"
                icon="🎓"
                iconBg="bg-blue-100"
              >
                <div className="grid grid-cols-3 gap-4">
                  <SchoolCard label="Elementary School" school={listing.elementarySchool} />
                  <SchoolCard label="Middle School" school={listing.middleSchool} />
                  <SchoolCard label="High School" school={listing.highSchool} />
                </div>
              </CollapsibleSection>

              {/* Location & Zoning */}
              <CollapsibleSection
                id="location"
                title="Location & Zoning"
                icon="📍"
                iconBg="bg-red-100"
              >
                <DetailGrid
                  items={[
                    { label: 'County', value: listing.county },
                    { label: 'Subdivision', value: listing.subdivision },
                    { label: 'Directions', value: listing.directions },
                  ]}
                />
              </CollapsibleSection>
            </div>

            {/* Footer Info */}
            <div className="bg-white rounded-xl border border-gray-100 px-6 py-5 text-center text-xs text-gray-500">
              <p className="mb-2">
                Listed by: <span className="font-medium text-gray-700">{listing.listingOffice}</span> · MLS#
                <span className="font-medium text-gray-700">{listing.mlsNumber}</span>
              </p>
              <p>Data provided by REIN MLS. Information deemed reliable but not guaranteed.</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit">
            {/* CTA Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isActive ? 'ACTIVE LISTING' : 'SOLD'}
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-3">
                {formatPriceFull(listing.price)}
              </p>
              <p className="text-sm font-medium text-gray-700 mb-1">{listing.address}</p>
              <p className="text-sm text-gray-600 mb-6">
                {listing.city}, {listing.state} {listing.zip}
              </p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-4">
                Schedule Your Tour Today
              </button>
              <p className="text-sm text-gray-600">or call <span className="font-semibold text-gray-900">(757) 777-7577</span></p>
            </div>

            {/* Quick Facts Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Quick Facts</h3>
              <div className="space-y-3">
                {[
                  { label: 'Type', value: listing.type },
                  { label: 'Year Built', value: listing.yearBuilt.toString() },
                  { label: 'Lot Size', value: listing.lotSize },
                  { label: 'Taxes', value: `$${listing.taxAmount.toLocaleString()}/yr` },
                  {
                    label: 'HOA',
                    value:
                      listing.hoaFee > 0
                        ? `$${listing.hoaFee}/mo`
                        : 'None',
                  },
                  { label: 'Parking', value: `${listing.garage} Car Garage` },
                  { label: 'Heating', value: listing.heating },
                  { label: 'Cooling', value: listing.cooling },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">{item.label}</span>
                    <span className="text-xs font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
