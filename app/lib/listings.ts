// app/lib/listings.ts
// Single source of truth for all listing data on vahometest2.com
// These are real REIN MLS properties used as examples

export interface Listing {
  id: number;
  lat: number;
  lng: number;
  price: number;
  beds: number;
  baths: number;
  halfBaths: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  photos: string[];
  img: string;
  status: string;
  propertyType: string;
  type: string;
  yearBuilt: number;
  lotSqft: number;
  lotSize: string;
  garage: number;
  description: string;
  // REIN MLS Extended Fields
  mlsNumber: string;
  style: string;
  stories: number;
  foundation: string;
  exteriorFeatures: string[];
  interiorFeatures: string[];
  heating: string;
  cooling: string;
  waterSource: string;
  sewer: string;
  flooring: string[];
  roof: string;
  construction: string[];
  parkingFeatures: string[];
  appliancesIncluded: string[];
  laundry: string;
  fireplaces: number;
  pool: string;
  fencing: string;
  waterfront: boolean;
  waterfrontDescription: string;
  taxAmount: number;
  taxYear: number;
  hoaFee: number;
  hoaFrequency: string;
  elementarySchool: string;
  middleSchool: string;
  highSchool: string;
  listingAgent: string;
  listingOffice: string;
  daysOnMarket: number;
  listDate: string;
  subdivision: string;
  county: string;
  directions: string;
  virtualTour: string;
  remarks: string;
}

export const sampleListings: Listing[] = [
  {
    id: 10626717,
    lat: 36.8326,
    lng: -76.0255,
    price: 475000,
    beds: 4,
    baths: 2,
    halfBaths: 1,
    sqft: 1581,
    address: '828 Maitland Drive',
    city: 'Virginia Beach',
    state: 'VA',
    zip: '23454',
    neighborhood: 'Ocean Lakes',
    photos: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    status: 'Active',
    propertyType: 'Detached',
    type: 'Single Family',
    yearBuilt: 1988,
    lotSqft: 8276,
    lotSize: '8,276 sqft',
    garage: 2,
    description: 'Beautiful 4-bedroom Colonial in the sought-after Ocean Lakes community. Features an updated kitchen, hardwood floors throughout the main level, and a spacious backyard perfect for entertaining.',
    mlsNumber: '10626717',
    style: 'Colonial/Traditional',
    stories: 2,
    foundation: 'Slab',
    exteriorFeatures: ['Deck', 'Fenced Yard', 'Sprinkler System'],
    interiorFeatures: ['Walk-in Closet', 'Ceiling Fan', 'Pantry'],
    heating: 'Forced Air, Natural Gas',
    cooling: 'Central Air',
    waterSource: 'City/Public',
    sewer: 'City/Public',
    flooring: ['Hardwood', 'Carpet', 'Ceramic Tile'],
    roof: 'Asphalt Shingle',
    construction: ['Brick', 'Vinyl Siding'],
    parkingFeatures: ['Attached Garage', 'Driveway'],
    appliancesIncluded: ['Dishwasher', 'Microwave', 'Range', 'Refrigerator', 'Disposal'],
    laundry: 'Washer/Dryer Hookup',
    fireplaces: 1,
    pool: 'None',
    fencing: 'Wood Privacy',
    waterfront: false,
    waterfrontDescription: '',
    taxAmount: 3420,
    taxYear: 2025,
    hoaFee: 150,
    hoaFrequency: 'Annually',
    elementarySchool: 'Ocean Lakes Elementary',
    middleSchool: 'Princess Anne Middle',
    highSchool: 'Ocean Lakes High',
    listingAgent: 'REIN MLS',
    listingOffice: 'LPT Realty',
    daysOnMarket: 5,
    listDate: '2026-03-28',
    subdivision: 'Ocean Lakes',
    county: 'Virginia Beach',
    directions: 'From Oceana Blvd, turn onto Dam Neck Rd, right onto Maitland Dr.',
    virtualTour: '',
    remarks: 'Move-in ready Colonial with 4 bedrooms and 2.5 baths in Ocean Lakes. Updated kitchen with granite counters, stainless appliances. Main-level hardwood floors. Large fenced backyard with deck. Community pool and playground access.',
  },
  {
    id: 10625012,
    lat: 36.8105,
    lng: -76.1135,
    price: 350000,
    beds: 3,
    baths: 2,
    halfBaths: 1,
    sqft: 1530,
    address: '1934 Cranborne Court',
    city: 'Virginia Beach',
    state: 'VA',
    zip: '23453',
    neighborhood: 'Parkside Green',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    status: 'Active',*    propertyType: 'Attached/Townhouse',
    type: 'Townhouse',
    yearBuilt: 1995,
    lotSqft: 3200,
    lotSize: '3,200 sqft',
    garage: 1,
    description: 'Well-maintained 3-bedroom townhouse in Parkside Green. Open floor plan with vaulted ceilings, updated bathrooms, and a private patio. Convenient location near shopping and dining.',
    mlsNumber: '10625012',
    style: 'Townhouse',
    stories: 2,
    foundation: 'Slab',
    exteriorFeatures: ['Patio', 'Exterior Lighting'],
    interiorFeatures: ['Vaulted Ceiling', 'Walk-in Closet', 'Ceiling Fan'],
    heating: 'Heat Pump, Electric',
    cooling: 'Central Air',
    waterSource: 'City/Public',
    sewer: 'City/Public',
    flooring: ['Laminate', 'Carpet', 'Vinyl'],
    roof: 'Asphalt Shingle',
    construction: ['Vinyl Siding'],
    parkingFeatures: ['Attached Garage', 'Assigned Parking'],
    appliancesIncluded: ['Dishwasher', 'Microwave', 'Range', 'Refrigerator'],
    laundry: 'Washer/Dryer Hookup',
    fireplaces: 0,
    pool: 'Community',
    fencing: 'None',
    waterfront: false,
    waterfrontDescription: '',
    taxAmount: 2680,
    taxYear: 2025,
    hoaFee: 225,
    hoaFrequency: 'Monthly',
    elementarySchool: 'Red Mill Elementary',
    middleSchool: 'Independence Middle',
    highSchool: 'Kellam High',
    listingAgent: 'REIN MLS',
    listingOffice: 'LPT Realty',
    daysOnMarket: 12,
    listDate: '2026-03-21',
    subdivision: 'Parkside Green',
    county: 'Virginia Beach',
    directions: 'From Princess Anne Rd, turn onto Parkside Green Dr, left onto Cranborne Ct.',
    virtualTour: '',
    remarks: 'Spacious townhouse with open layout and vaulted ceilings. Updated baths, fresh paint throughout. Private rear patio. Community pool included in HOA. Minutes to Red Mill Commons shopping.',
  },
  {
    id: 10625273,
    lat: 36.8080,
    lng: -76.1530,
    price: 419999,
    beds: 4,
    baths: 2,
    halfBaths: 1,
    sqft: 1786,
    address: '1116 Taylor Road',
    city: 'Virginia Beach',
    state: 'VA',
    zip: '23464',
    neighborhood: 'Whitehurst Landing',
    photos: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
    ],
    img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    status: 'Active',
    propertyType: 'Detached',
    type: 'Single Family',
    yearBuilt: 1990,
    lotSqft: 9583,
    lotSize: '9,583 sqft',
    garage: 2,
    description: 'Spacious 4-bedroom Traditional in Whitehurst Landing with a large corner lot. Updated kitchen, new HVAC, and a finished bonus room over the garage. Great schools and easy access to I-264.',
    mlsNumber: '10625273',
    style: 'Traditional',
    stories: 2,
    foundation: 'Crawl Space',
    exteriorFeatures: ['Deck', 'Fenced Yard', 'Storage Shed', 'Corner Lot'],
    interiorFeatures: ['Walk-in Closet', 'Pantry', 'Bonus Room', 'Ceiling Fan'],
    heating: 'Forced Air, Natural Gas',
    cooling: 'Central Air',
    waterSource: 'City/Public',
    sewer: 'City/Public',
    flooring: ['Hardwood', 'Carpet', 'Ceramic Tile'],
    roof: 'Architectural Shingle',
    construction: ['Vinyl Siding', 'Brick Foundation'],
    parkingFeatures: ['Attached Garage', 'Driveway'],
    appliancesIncluded: ['Dishwasher', 'Microwave', 'Range', 'Refrigerator', 'Disposal', 'Dryer', 'Washer'],
    laundry: 'Laundry Room',
    fireplaces: 1,
    pool: 'None',
    fencing: 'Wood Privacy',
    waterfront: false,
    waterfrontDescription: '',
    taxAmount: 3150,
    taxYear: 2025,
    hoaFee: 0,
    hoaFrequency: '',
    elementarySchool: 'Whitehurst Elementary',
    middleSchool: 'Lynnhaven Middle',
    highSchool: 'Salem High',
    listingAgent: 'REIN MLS',
    listingOffice: 'LPT Realty',
    daysOnMarket: 9,
    listDate: '2026-03-24',
    subdivision: 'Whitehurst Landing',
    county: 'Virginia Beach',
    directions: 'From I-264, take Independence Blvd south, turn onto Taylor Rd.',
    virtualTour: '',
    remarks: 'Corner lot Traditional with 4 beds, 2.5 baths. New HVAC 2025. Updated kitchen with granite and stainless. Bonus room over garage. Large fenced yard with deck and shed. No HOA!',
  },
  {
    id: 10624845,
    lat: 36.7280,
    lng: -76.5835,
    price: 410000,
    beds: 4,
    baths: 2,
    halfBaths: 1,
    sqft: 2500,
    address: '251 Fallawater Way',
    city: 'Suffolk',
    state: 'VA',
    zip: '23434',
    neighborhood: 'Applewood Farms',
    photos: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    ],
    img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    status: 'Active',
    propertyType: 'Detached',
    type: 'Single Family',
    yearBuilt: 2004,
    lotSqft: 14375,
    lotSize: '14,375 sqft',
    garage: 2,
    description: 'Generous 2,500 sqft Traditional on a large lot in Applewood Farms, Suffolk. Open concept main floor, formal dining, and a spacious primary suite. Quiet cul-de-sac location with mature landscaping.',
    mlsNumber: '10624845',
    style: 'Traditional',
    stories: 2,
    foundation: 'Crawl Space',
    exteriorFeatures: ['Patio', 'Fenced Yard', 'Sprinkler System', 'Cul-de-sac'],
    interiorFeatures: ['Walk-in Closet', 'Pantry', 'Formal Dining', 'Breakfast Nook', 'Ceiling Fan'],
    heating: 'Heat Pump, Electric',
    cooling: 'Central Air',
    waterSource: 'City/Public',
    sewer: 'City/Public',
    flooring: ['Hardwood', 'Carpet', 'Ceramic Tile'],
    roof: 'Asphalt Shingle',
    construction: ['Vinyl Siding', 'Brick Accent'],
    parkingFeatures: ['Attached Garage', 'Driveway'],
    appliancesIncluded: ['Dishwasher', 'Microwave', 'Range', 'Refrigerator', 'Disposal'],
    laundry: 'Laundry Room',
    fireplaces: 1,
    pool: 'None',
    fencing: 'Wood Privacy',
    waterfront: false,
    waterfrontDescription: '',
    taxAmount: 3050,
    taxYear: 2025,
    hoaFee: 350,
    hoaFrequency: 'Annually',
    elementarySchool: 'Kilby Shores Elementary',
    middleSchool: 'Forest Glen Middle',
    highSchool: 'Lakeland High',
    listingAgent: 'REIN MLS',
    listingOffice: 'LPT Realty',
    daysOnMarket: 15,
    listDate: '2026-03-18',
    subdivision: 'Applewood Farms',
    county: 'Suffolk',
    directions: 'From Rt 58, take Wilroy Rd south, right into Applewood Farms, follow to Fallawater Way.',
    virtualTour: '',
    remarks: 'Spacious Traditional in desirable Applewood Farms. 4 beds, 2.5 baths, 2500 sqft on a third-acre lot. Open floor plan, formal dining, large primary suite. Quiet cul-de-sac. Community playground.',
  },
  {
    id: 10627278,
    lat: 36.9350,
    lng: -76.2680,
    price: 339000,
    beds: 3,
    baths: 2,
    halfBaths: 0,
    sqft: 1375,
    address: '8910 Devon Street',
    city: 'Norfolk',
    state: 'VA',
    zip: '23503',
    neighborhood: 'Bayview Beach',
    photos: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80',
    ],
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    status: 'Active',
    propertyType: 'Detached',
    type: 'Single Family',
    yearBuilt: 1951,
    lotSqft: 6534,
    lotSize: '6,534 sqft',
    garage: 0,
    description: 'Charming 3-bedroom Cape Cod in the Bayview Beach neighborhood of Norfolk. Renovated kitchen and baths, refinished hardwood floors, and a detached workshop. Walk to the Chesapeake Bay beach.',
    mlsNumber: '10627278',
    style: 'Cape Cod',
    stories: 1.5,
    foundation: 'Crawl Space',
    exteriorFeatures: ['Detached Workshop', 'Fenced Yard', 'Mature Trees'],
    interiorFeatures: ['Ceiling Fan', 'Eat-in Kitchen', 'Updated Baths'],
    heating: 'Forced Air, Natural Gas',
    cooling: 'Central Air',
    waterSource: 'City/Public',
    sewer: 'City/Public',
    flooring: ['Hardwood', 'Ceramic Tile'],
    roof: 'Asphalt Shingle',
    construction: ['Brick'],
    parkingFeatures: ['Driveway', 'Off-street Parking'],
    appliancesIncluded: ['Dishwasher', 'Microwave', 'Range', 'Refrigerator'],
    laundry: 'Washer/Dryer Hookup',
    fireplaces: 0,
    pool: 'None',
    fencing: 'Chain Link',
    waterfront: false,
    waterfrontDescription: 'Near Chesapeake Bay',
    taxAmount: 2580,
    taxYear: 2025,
    hoaFee: 0,
    hoaFrequency: '',
    elementarySchool: 'Bay View Elementary',
    middleSchool: 'Northside Middle',
    highSchool: 'Granby High',
    listingAgent: 'REIN MLS',
    listingOffice: 'LPT Realty',
    daysOnMarket: 3,
    listDate: '2026-03-30',
    subdivision: 'Bayview Beach',
    county: 'Norfolk',
    directions: 'From Shore Dr, turn onto E Ocean View Ave, right onto Devon St.',
    virtualTour: '',
    remarks: 'Renovated Cape Cod steps from Bay View beach. 3 beds, 2 full baths. Refinished hardwoods, updated kitchen with quartz counters. Detached workshop/studio. Fenced yard. No HOA, no flood zone.',
  },
];

// Video markers for neighborhood tour locations
export const videoMarkers: {
  lat: number;
  lng: number;
  title: string;
  videoUrl: string;
}[] = [
  {
    lat: 36.85,
    lng: -76.05,
    title: 'Virginia Beach Oceanfront Tour',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
  },
  {
    lat: 36.85,
    lng: -76.29,
    title: 'Norfolk Downtown Living',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
  },
  {
    lat: 36.77,
    lng: -76.24,
    title: 'Chesapeake Great Bridge',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
  },
  {
    lat: 36.73,
    lng: -76.58,
    title: 'Suffolk Harbour View',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
  },
  {
    lat: 37.03,
    lng: -76.35,
    title: 'Hampton Phoebus Waterfront',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
  },
];

// Lookup functions (used by detail page and static generation)
export function getListingById(id: number): Listing | undefined {
  return sampleListings.find((listing) => listing.id === id);
}

export function getListings(): Listing[] {
  return sampleListings;
}

// Helper functions
export function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  return `$${Math.round(price / 1000)}K`;
}

export function formatPriceFull(price: number): string {
  return `$${price.toLocaleString()}`;
}

export function getFullAddress(listing: Listing): string {
  return `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`;
}

export function getListingUrl(listing: Listing): string {
  const slug = `${listing.address}-${listing.city}-${listing.state}-${listing.zip}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `/listings/${listing.id}/${slug}`;
}

export function listingsToGeoJSON(listings: Listing[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: listings.map((listing) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [listing.lng, listing.lat],
      },
      properties: {
        id: listing.id,
        price: listing.price,
        priceFormatted: formatPrice(listing.price),
        priceFull: formatPriceFull(listing.price),
        beds: listing.beds,
        baths: listing.baths,
        halfBaths: listing.halfBaths,
        sqft: listing.sqft,
        address: listing.address,
        city: listing.city,
        state: listing.state,
        zip: listing.zip,
        neighborhood: listing.neighborhood,
        photo: listing.photos[0] || '',
        status: listing.status,
        propertyType: listing.propertyType,
        yearBuilt: listing.yearBuilt,
        url: getListingUrl(listing),
        fullAddress: getFullAddress(listing),
      },
    })),
  };
}
