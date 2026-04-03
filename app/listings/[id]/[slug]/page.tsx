import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getListingById, formatPriceFull } from '../../../lib/listings';
import PropertyDetailClient from './PropertyDetailClient';

export const revalidate = 60;

interface Props {
  params: {
    id: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = getListingById(Number(params.id));
  if (!listing) {
    return { title: 'Property Not Found' };
  }
  return {
    title: `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip} | VaHome.com`,
    description: `${listing.beds} bed, ${listing.baths} bath, ${listing.sqft.toLocaleString()} sq ft ${listing.propertyType} for sale at ${formatPriceFull(listing.price)} in ${listing.city}, VA.`,
  };
}

export default function PropertyDetailPage({ params }: Props) {
  const listing = getListingById(Number(params.id));

  if (!listing) {
    notFound();
  }

  return <PropertyDetailClient listing={listing} />;
}
