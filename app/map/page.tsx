import { Metadata } from 'next';
import MapClient from '@/app/map/MapClient';

export const metadata: Metadata = {
  alternates: { canonical: "/map/" },
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
      <section className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-gray-700 leading-relaxed text-base">{`The VaHome interactive map gives you a unified view of every active listing across Hampton Roads with real-time MLS data. Filter by price range, property type, bed and bath count, and military-specific criteria like proximity to Naval Station Norfolk, NAS Oceana, Joint Base Langley-Eustis, or other installations. Active-duty service members can also filter by paygrade and dependent status to see only listings within their BAH range. Each listing on the map opens a detailed property page with photos, price history, school zone information, flood map overlays, and drive-time estimates to your duty station or workplace. The map is the fastest way to explore Hampton Roads housing across all seven cities at once.`}</p>
      </section>
      {/* Preconnect to Google Maps origins so connection is warm when user activates the map */}
      <link rel="preconnect" href="https://maps.googleapis.com" />
      <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <MapClient />
    </>
  );
}
