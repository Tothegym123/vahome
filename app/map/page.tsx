import { Metadata } from 'next';
import MapClient from '@/app/map/MapClient';

export const metadata: Metadata = {
  title: 'Interactive Map Search | VaHome.com',
  description:
    'Search real estate listings on an interactive map of Hampton Roads, Virginia.',
};

export default function MapPage() {
  return (
    <>
      <h1 className="sr-only">Interactive Map Search - Hampton Roads Real Estate</h1>
      <MapClient />
    </>
  );
}
