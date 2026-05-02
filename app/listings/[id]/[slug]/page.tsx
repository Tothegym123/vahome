import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getListingByIdAsync, formatPrice, formatPriceFull } from '../../../lib/listings';
import { canonicalListingSlug } from '../../../lib/listing-slug';
import PropertyDetailClient from './PropertyDetailClient';
import ListingJsonLd from './ListingJsonLd';

// =============================================================================
// Listing detail rendering mode: ISR (Incremental Static Regeneration).
//
// Pages are server-rendered on first request, then cached at the Vercel edge.
// After 600 seconds (10 min) the next request triggers a background re-render
// while still serving the stale HTML — so users never wait on a regen.
//
// REIN sync triggers immediate refreshes via /api/revalidate when listing data
// actually changes, so the 600s ceiling only applies if a change misses the
// webhook (e.g. the sync host is unreachable). Worst-case staleness: 10 min.
//
// We intentionally do NOT generateStaticParams — the listing inventory is too
// large (~3-5k active) and constantly churning. Each path is built lazily on
// first request and cached after.
// =============================================================================
export const revalidate = 600;
export const dynamicParams = true;

interface Props {
  params: {
    id: string;
    slug: string;
  };
}

const BASE = 'https://vahome.com';

function streetOnly(address: string): string {
  return (address || '').split(',')[0].trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListingByIdAsync(Number(params.id));
  if (!listing) {
    return { title: 'Property Not Found | VaHome.com' };
  }

  // Treat closed/sold/withdrawn/expired listings as inactive — see robots block below.
  const _statusLower = (listing.status || '').toLowerCase().trim();
  const isInactive = ['sold','off market','off-market','closed','cancelled','canceled','withdrawn','expired','rented'].some(
    (k) => _statusLower.includes(k)
  );
  const street = streetOnly(listing.address);
  const slug = canonicalListingSlug({ address: listing.address, city: listing.city });
  const canonical = `${BASE}/listings/${listing.id}/${slug}/`;
  const fullAddress = `${street}, ${listing.city}, ${listing.state || 'VA'} ${listing.zip || ''}`.trim();
  const cityState = `${listing.city}, ${listing.state || 'VA'}`;
  const priceCompact = listing.price ? formatPrice(listing.price) : '';
  // Unique title that survives REIN duplicate-listing re-lists (same address, different MLS#).
  // Format: "{Street}, {City}, VA {ZIP} - {Price} | VaHome.com"
  // The price differs across re-listings even when address is identical.
  // Length budget: 60 chars street+city, 8 char price, 14 char " | VaHome.com" = ~82 max.
  // For very long addresses, drop the ZIP.
  let title = `${street}, ${cityState} ${listing.zip || ''} - ${priceCompact} | VaHome.com`.trim();
  if (title.length > 70) {
    title = `${street}, ${cityState} - ${priceCompact} | VaHome.com`.trim();
  }
  if (title.length > 70) {
    title = `${street}, ${cityState} | VaHome.com`.trim();
  }
  // Unique meta description: lead with MLS# + price (always unique across re-lists).
  const description =
    `MLS# ${listing.id}: ${listing.beds || 0} bed, ${listing.baths || 0} bath, ` +
    `${(listing.sqft || 0).toLocaleString()} sq ft ${listing.propertyType || 'home'} ` +
    `for sale at ${formatPriceFull(listing.price)} — ${street}, ${listing.city}, VA ${listing.zip || ''}.`;

  const heroImage = Array.isArray(listing.photos) && listing.photos.length > 0 ? listing.photos[0] : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      // Sold/off-market/withdrawn/expired: keep the URL alive (so existing
      // backlinks don't 404 and so users with the link can still read the
      // record) but pull it from Google's fresh-results pool.
      index: !isInactive,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: fullAddress,
      description,
      siteName: 'VaHome.com',
      images: heroImage
        ? [
            {
              url: heroImage,
              width: 1200,
              height: 630,
              alt: fullAddress,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullAddress,
      description,
      images: heroImage ? [heroImage] : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const listing = await getListingByIdAsync(Number(params.id));
  if (!listing) {
    notFound();
  }

  // Slug normalization — every listing's canonical URL is
  //   /listings/<id>/<canonical-slug>/
  // Older URLs in the wild duplicated city+state+zip in the slug; redirect
  // them to the canonical form so the search-engine equity transfers.
  const expectedSlug = canonicalListingSlug({
    address: listing.address,
    city: listing.city,
  });
  if (params.slug !== expectedSlug) {
    permanentRedirect(`/listings/${listing.id}/${expectedSlug}/`);
  }

  return (
    <>
      <ListingJsonLd listing={listing} />
      <PropertyDetailClient listing={listing} />
    </>
  );
}
