import { Metadata } from 'next';
import MapClient from '@/app/map/MapClient';
import HamptonRoadsAreaGuide from '../components/HamptonRoadsAreaGuide'

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
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Use the Hampton Roads Map</h2>
          <p className="text-gray-700 mb-4">The interactive map shows every active listing across Hampton Roads, plus military installations, school catchment markers, and neighborhood boundaries. Use the filters above the map to narrow by price, bedrooms, property type, and proximity to bases. Click any pin to see the full listing card; click again to open the full property detail page with photos, floor plan, school ratings, drive times to bases, BAH affordability under your paygrade, and VA loan eligibility flags.</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Search by Base</h3>
          <p className="text-gray-700 mb-4">Switch on Military Mode to overlay drive-time radii from each Hampton Roads installation — Naval Station Norfolk, NAS Oceana, JEB Little Creek-Fort Story, Joint Base Langley-Eustis, Naval Medical Center Portsmouth, Norfolk Naval Shipyard, and Coast Guard Base Portsmouth. The 15-, 30-, and 45-minute isochrones show what is realistically reachable during peak commute hours, not just by straight-line distance.</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Filter by BAH and VA Loan</h3>
          <p className="text-gray-700 mb-4">For active-duty buyers, toggle the BAH-aware filter to hide listings priced beyond your paygrade and dependent-status housing allowance. For VA loan buyers, the VA-eligible filter excludes property types that do not qualify (most manufactured, co-ops without VA approval, and condos in unapproved projects) and flags homes with known condition issues.</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why a Local Map Matters</h3>
          <p className="text-gray-700 mb-4">Hampton Roads is split by water — the HRBT, Monitor-Merrimac, and Downtown Tunnel separate the Southside from the Peninsula, and bridge traffic adds significant time during PCS season. A home that looks 12 miles from Naval Station Norfolk on a national real estate site can take 50 minutes during morning rush. Using a local-aware map saves you the surprise.</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Saved Searches and Alerts</h3>
          <p className="text-gray-700 mb-4">Once you sign in, every map view you find useful can be saved as a search. We send you new listings within your filters and price-change alerts on properties you flagged. PCS-relocating service members in particular tell us this is the most useful feature: they cannot fly out for every new listing, but they can stay current the same way local buyers do.</p>
        </section>
        <HamptonRoadsAreaGuide />
      </section>
      {/* Preconnect to Google Maps origins so connection is warm when user activates the map */}
      <link rel="preconnect" href="https://maps.googleapis.com" />
      <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <MapClient />
    </>
  );
}
