import { Metadata } from 'next';
import MapClient from '@/app/map/MapClient';

export const metadata: Metadata = {
  title: 'Interactive Map Search | VaHome.com',
  description:
    'Search real estate listings on an interactive map of Hampton Roads, Virginia.',
  other: {
    // Preconnect hints for Google Maps (loaded after user interaction)
    'Link': '</https://maps.googleapis.com>; rel=preconnect, <https://fonts.gstatic.com>; rel=preconnect; crossorigin',
  },
};

export default function MapPage() {
  return (
    <>
      <h1 className="sr-only">Interactive Map Search - Hampton Roads Real Estate</h1>
      {/* Preconnect to Google Maps origins so connection is warm when user activates the map */}
      <link rel="preconnect" href="https://maps.googleapis.com" />
      <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <MapClient />
    </>
  );
}
