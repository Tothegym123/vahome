import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getListingByIdAsync, formatPriceFull } from '../../../lib/listings';
import { canonicalListingSlug } from '../../../lib/listing-slug';
import PropertyDetailClient from './PropertyDetailClient';
import ListingJsonLd from './ListingJsonLd';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

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

  const street = streetOnly(listing.address);
  const slug = canonicalListingSlug({ address: listing.address, city: listing.city });
  const canonical = `${BASE}/listings/${listing.id}/${slug}/`;
  const fullAddress = `${street}, ${listing.city}, ${listing.state || 'VA'} ${listing.zip || ''}`.trim();
  const title = `${fullAddress} | VaHome.com`;
  const description =
    `${listing.beds || 0} bed, ${listing.baths || 0} bath, ${(listing.sqft || 0).toLocaleString()} sq ft ` +
    `${listing.propertyType || 'home'} for sale at ${formatPriceFull(listing.price)} in ${listing.city}, VA.`;

  const heroImage = Array.isArray(listing.photos) && listing.photos.length > 0 ? listing.photos[0] : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      // Tells Google it can use a large image preview in SERPs (per
      // https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).
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
