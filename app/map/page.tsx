import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="mt-4 text-sm font-medium text-gray-600">Loading interactive map…</p>
      </div>
    </div>
  ),
});

export const metadata = {
  title: 'Map Search | VaHome.com',
  description: 'Search homes for sale in Hampton Roads on an interactive map. Filter by price, beds, baths, and military base proximity.',
};

export default function MapPage() {
  return <MapClient />;
}
