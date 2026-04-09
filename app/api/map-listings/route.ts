import { NextRequest, NextResponse } from 'next/server';
import { sampleListings as listings } from '@/app/lib/listings';

export const runtime = 'nodejs';

function generateSlug(address: string, city: string, state: string, zip: string): string {
  const parts = [address, city, state, zip]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return parts;
}

function formatPriceShort(price: number): string {
  if (price >= 1000000) return '$' + (price / 1000000).toFixed(1) + 'M';
  if (price >= 1000) return '$' + Math.round(price / 1000) + 'K';
  return '$' + price;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const sw_lat = parseFloat(searchParams.get('sw_lat') || '0');
    const sw_lng = parseFloat(searchParams.get('sw_lng') || '0');
    const ne_lat = parseFloat(searchParams.get('ne_lat') || '90');
    const ne_lng = parseFloat(searchParams.get('ne_lng') || '0');

    const limit = parseInt(searchParams.get('limit') || '500', 10);
    const type = searchParams.get('type')?.toLowerCase() || '';
    const min_price = searchParams.get('min_price') ? parseInt(searchParams.get('min_price')!, 10) : null;
    const max_price = searchParams.get('max_price') ? parseInt(searchParams.get('max_price')!, 10) : null;
    const beds = searchParams.get('beds') ? parseInt(searchParams.get('beds')!, 10) : null;

    const filtered = listings.filter((listing) => {
      if (listing.lat < sw_lat || listing.lat > ne_lat) return false;
      if (listing.lng < sw_lng || listing.lng > ne_lng) return false;
      if (type && listing.propertyType.toLowerCase() !== type) return false;
      if (min_price !== null && listing.price < min_price) return false;
      if (max_price !== null && listing.price > max_price) return false;
      if (beds !== null && listing.beds < beds) return false;
      return true;
    });

    const limited = filtered.slice(0, limit);

    const response = limited.map((listing) => ({
      id: listing.id,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      zip: listing.zip,
      price: listing.price,
      priceFormatted: formatPriceShort(listing.price),
      beds: listing.beds,
      baths: listing.baths,
      sqft: listing.sqft,
      propertyType: listing.propertyType,
      status: listing.status,
      lat: listing.lat,
      lng: listing.lng,
      slug: generateSlug(listing.address, listing.city, listing.state, listing.zip),
    }));

    return NextResponse.json({
      listings: response,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error in map-listings route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings', listings: [], total: 0 },
      { status: 500 }
    );
  }
}
