// ============================================================
// LISTING DATA LAYER
// ============================================================
// This file is the SINGLE source of truth for all listing data.
// When REIN MLS feed is connected, replace the sampleListings
// array with a fetch call to /api/listings — nothing else changes.
// ============================================================

export interface Listing {
  id: number
  lat: number
  lng: number
  price: number
  beds: number
  baths: number
  sqft: number
  type: string
  address: string
  city: string
  state: string
  zip: string
  img: string
  mlsId?: string
  yearBuilt?: number
  lotSize?: string
  description?: string
  agent?: string
  daysOnMarket?: number
  status?: 'active' | 'pending' | 'sold'
}

export interface VideoMarker {
  id: string
  lat: number
  lng: number
  title: string
  videoId: string
  description: string
}

// ---- Sample listings (will be replaced by REIN MLS feed) ----
export const sampleListings: Listing[] = [
  {
    id: 1, lat: 36.8507, lng: -76.4345, price: 664900, beds: 3, baths: 2, sqft: 2558,
    type: 'New Construction', address: '317 Rhapsody Dr', city: 'Suffolk', state: 'VA', zip: '23435',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    yearBuilt: 2025, lotSize: '0.28 acres', daysOnMarket: 5, status: 'active',
    description: 'Stunning new construction in the heart of Harbor View. Open floor plan with gourmet kitchen, quartz countertops, and hardwood floors throughout. Large primary suite with walk-in closet and luxurious bath.'
  },
  {
    id: 2, lat: 36.8623, lng: -76.4187, price: 475000, beds: 3, baths: 3, sqft: 2500,
    type: 'House', address: '3005 Wincanton Cv', city: 'Suffolk', state: 'VA', zip: '23435',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    yearBuilt: 2018, lotSize: '0.22 acres', daysOnMarket: 12, status: 'active',
    description: 'Beautiful 3-bedroom home in sought-after Harbour View community. Features an open concept living area, modern kitchen with island, and spacious backyard.'
  },
  {
    id: 3, lat: 36.8341, lng: -76.4512, price: 329000, beds: 4, baths: 2, sqft: 1566,
    type: 'House', address: '5628 Plummer Blvd', city: 'Suffolk', state: 'VA', zip: '23435',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    yearBuilt: 2005, lotSize: '0.18 acres', daysOnMarket: 21, status: 'active',
    description: 'Well-maintained 4-bedroom ranch in a quiet Suffolk neighborhood. Updated kitchen, new HVAC, and fenced backyard. Perfect for families.'
  },
  {
    id: 4, lat: 36.8789, lng: -76.3998, price: 415000, beds: 4, baths: 2.5, sqft: 2100,
    type: 'House', address: '1204 Copper Stone Cir', city: 'Chesapeake', state: 'VA', zip: '23322',
    img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop',
    yearBuilt: 2012, lotSize: '0.25 acres', daysOnMarket: 8, status: 'active',
    description: 'Spacious colonial in popular Copper Stone. Two-story foyer, formal dining, eat-in kitchen, and large family room with fireplace.'
  },
  {
    id: 5, lat: 36.8156, lng: -76.4678, price: 289900, beds: 3, baths: 2, sqft: 1450,
    type: 'House', address: '4012 River Shore Rd', city: 'Suffolk', state: 'VA', zip: '23435',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    yearBuilt: 2001, lotSize: '0.20 acres', daysOnMarket: 30, status: 'active',
    description: 'Charming 3-bedroom home with water views. Updated bathrooms, new roof, and screened porch overlooking the river.'
  },
  {
    id: 6, lat: 36.8934, lng: -76.4123, price: 545000, beds: 5, baths: 3, sqft: 3200,
    type: 'House', address: '2301 Eagles Nest Trl', city: 'Chesapeake', state: 'VA', zip: '23322',
    img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop',
    yearBuilt: 2015, lotSize: '0.35 acres', daysOnMarket: 3, status: 'active',
    description: 'Impressive 5-bedroom home in Eagles Nest. Gourmet kitchen, first-floor guest suite, bonus room, and private wooded lot.'
  },
  {
    id: 7, lat: 36.8445, lng: -76.3876, price: 375000, beds: 3, baths: 2, sqft: 1890,
    type: 'Townhouse', address: '887 Cantebury Ln', city: 'Chesapeake', state: 'VA', zip: '23320',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    yearBuilt: 2019, lotSize: '0.08 acres', daysOnMarket: 14, status: 'active',
    description: 'Modern end-unit townhouse near Greenbrier. Open floor plan, rooftop deck, attached garage, and community pool.'
  },
  {
    id: 8, lat: 36.8678, lng: -76.4534, price: 599000, beds: 4, baths: 3.5, sqft: 2850,
    type: 'New Construction', address: '150 Waterford Way', city: 'Suffolk', state: 'VA', zip: '23435',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop',
    yearBuilt: 2025, lotSize: '0.30 acres', daysOnMarket: 1, status: 'active',
    description: 'Brand new luxury home in Waterford. Chef\'s kitchen, 10-foot ceilings, home office, and resort-style backyard with pool.'
  },
  {
    id: 9, lat: 36.8234, lng: -76.4234, price: 249900, beds: 2, baths: 1, sqft: 1100,
    type: 'Condo', address: '6789 Harbor View Blvd', city: 'Suffolk', state: 'VA', zip: '23435',
    img: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop',
    yearBuilt: 2010, lotSize: 'N/A', daysOnMarket: 45, status: 'active',
    description: 'Low-maintenance living in Harbor View. Updated kitchen, in-unit laundry, balcony with sunset views, and community amenities.'
  },
  {
    id: 10, lat: 36.8812, lng: -76.4401, price: 725000, beds: 5, baths: 4, sqft: 3600,
    type: 'House', address: '501 Bridge Hampton Way', city: 'Chesapeake', state: 'VA', zip: '23322',
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    yearBuilt: 2020, lotSize: '0.40 acres', daysOnMarket: 7, status: 'active',
    description: 'Executive home in Bridge Hampton. Three-car garage, wine cellar, home theater, and outdoor kitchen on a premium lot.'
  },
  {
    id: 11, lat: 36.7965, lng: -76.4890, price: 215000, beds: 2, baths: 1.5, sqft: 980,
    type: 'Condo', address: '120 Marina Dr', city: 'Suffolk', state: 'VA', zip: '23435',
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
    yearBuilt: 2008, lotSize: 'N/A', daysOnMarket: 60, status: 'active',
    description: 'Waterfront condo with marina access. Open layout, stainless appliances, and private boat slip available.'
  },
  {
    id: 12, lat: 36.9012, lng: -76.3765, price: 879000, beds: 6, baths: 4.5, sqft: 4200,
    type: 'House', address: '900 Greenbrier Pkwy', city: 'Chesapeake', state: 'VA', zip: '23320',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    yearBuilt: 2021, lotSize: '0.50 acres', daysOnMarket: 10, status: 'active',
    description: 'Luxury estate in Greenbrier. Custom finishes throughout, elevator, smart home technology, and resort-style pool.'
  },
  {
    id: 13, lat: 36.8567, lng: -76.3543, price: 345000, beds: 3, baths: 2, sqft: 1750,
    type: 'House', address: '2455 Cedar Rd', city: 'Chesapeake', state: 'VA', zip: '23322',
    img: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=300&fit=crop',
    yearBuilt: 2007, lotSize: '0.22 acres', daysOnMarket: 18, status: 'active',
    description: 'Move-in ready ranch in Cedar area. Updated kitchen, hardwood floors, fenced yard, and close to parks.'
  },
  {
    id: 14, lat: 36.8345, lng: -76.3987, price: 395000, beds: 3, baths: 2.5, sqft: 2000,
    type: 'Townhouse', address: '789 Volvo Pkwy', city: 'Chesapeake', state: 'VA', zip: '23320',
    img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop',
    yearBuilt: 2022, lotSize: '0.06 acres', daysOnMarket: 9, status: 'active',
    description: 'Newer townhouse near Greenbrier Mall. Three stories, rooftop terrace, two-car garage, and walkable to shops.'
  },
  {
    id: 15, lat: 36.8123, lng: -76.4456, price: 275000, beds: 3, baths: 1.5, sqft: 1350,
    type: 'House', address: '333 Pughsville Rd', city: 'Suffolk', state: 'VA', zip: '23435',
    img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop',
    yearBuilt: 1998, lotSize: '0.25 acres', daysOnMarket: 35, status: 'active',
    description: 'Affordable family home with large yard. Recent updates include roof, HVAC, and water heater. Great starter home.'
  },
  {
    id: 16, lat: 36.8890, lng: -76.4267, price: 499000, beds: 4, baths: 3, sqft: 2650,
    type: 'House', address: '1700 Battlefield Blvd S', city: 'Chesapeake', state: 'VA', zip: '23322',
    img: 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=400&h=300&fit=crop',
    yearBuilt: 2016, lotSize: '0.32 acres', daysOnMarket: 6, status: 'active',
    description: 'Stunning craftsman on Battlefield Blvd. Open concept, chef\'s kitchen, covered patio, and fenced backyard with firepit.'
  },
  {
    id: 17, lat: 36.8678, lng: -76.3678, price: 310000, beds: 3, baths: 2, sqft: 1600,
    type: 'House', address: '4500 Indian River Rd', city: 'Chesapeake', state: 'VA', zip: '23325',
    img: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&h=300&fit=crop',
    yearBuilt: 2003, lotSize: '0.19 acres', daysOnMarket: 22, status: 'active',
    description: 'Well-kept home near Indian River. New flooring, fresh paint, updated kitchen, and quiet cul-de-sac location.'
  },
  {
    id: 18, lat: 36.8456, lng: -76.4789, price: 450000, beds: 4, baths: 2.5, sqft: 2300,
    type: 'House', address: '800 Sleepy Hole Rd', city: 'Suffolk', state: 'VA', zip: '23435',
    img: 'https://images.unsplash.com/photo-1600047508006-aa71d8adfe8d?w=400&h=300&fit=crop',
    yearBuilt: 2014, lotSize: '0.28 acres', daysOnMarket: 11, status: 'active',
    description: 'Colonial gem on quiet Sleepy Hole Road. Formal living & dining, family room with fireplace, and screened porch.'
  },
]

// ---- Video markers (neighborhood tours) ----
export const videoMarkers: VideoMarker[] = [
  {
    id: 'v1', lat: 36.8430, lng: -76.4350,
    title: 'Harbor View, Suffolk', videoId: 'dQw4w9WgXcQ',
    description: 'Explore the Harbor View community with waterfront dining and new construction homes.'
  },
  {
    id: 'v2', lat: 36.8900, lng: -76.3900,
    title: 'Greenbrier, Chesapeake', videoId: 'dQw4w9WgXcQ',
    description: 'Tour Greenbrier with top-rated schools, shopping, and family-friendly neighborhoods.'
  },
  {
    id: 'v3', lat: 36.8200, lng: -76.4600,
    title: 'Downtown Suffolk', videoId: 'dQw4w9WgXcQ',
    description: 'Historic downtown Suffolk with charming shops, restaurants, and revitalized living.'
  },
  {
    id: 'v4', lat: 36.8700, lng: -76.4500,
    title: 'Western Branch, Chesapeake', videoId: 'dQw4w9WgXcQ',
    description: 'Western Branch offers quiet suburban living with easy access to I-664.'
  },
  {
    id: 'v5', lat: 36.8550, lng: -76.3700,
    title: 'Great Bridge, Chesapeake', videoId: 'dQw4w9WgXcQ',
    description: 'Great Bridge features the Battlefield Park, excellent schools, and a tight-knit community.'
  },
]

// ---- Helper functions ----
export function formatPrice(price: number): string {
  if (price >= 1000000) return '$' + (price / 1000000).toFixed(1) + 'M'
  return '$' + (price / 1000).toFixed(0) + 'K'
}

export function formatPriceFull(price: number): string {
  return '$' + price.toLocaleString()
}

export function getListingUrl(listing: Listing): string {
  // Generates SEO-friendly URL slug from address + city
  const slug = (listing.address + ' ' + listing.city + ' ' + listing.state + ' ' + listing.zip)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `/listings/${listing.id}/${slug}/`
}

export function getFullAddress(listing: Listing): string {
  return `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`
}

// ---- Data fetching (future: replace with API call) ----
// When REIN MLS is connected, change this to:
// export async function getListings(): Promise<Listing[]> {
//   const res = await fetch('/api/listings')
//   return res.json()
// }
export function getListings(): Listing[] {
  return sampleListings
}

export function getListingById(id: number): Listing | undefined {
  return sampleListings.find(l => l.id === id)
}

// ---- GeoJSON conversion (for Mapbox) ----
export function listingsToGeoJSON(listings: Listing[]) {
  return {
    type: 'FeatureCollection' as const,
    features: listings.map(l => ({
      type: 'Feature' as const,
      properties: {
        id: l.id,
        price: l.price,
        priceLabel: formatPrice(l.price),
        priceFull: formatPriceFull(l.price),
        address: getFullAddress(l),
        beds: l.beds,
        baths: l.baths,
        sqft: l.sqft,
        type: l.type,
        img: l.img,
        url: getListingUrl(l),
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [l.lng, l.lat],
      },
    })),
  }
}
