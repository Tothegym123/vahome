import MapClient from './MapClient';

export const metadata = {
  title: 'Map Search | VaHome.com',
  description: 'Search homes for sale in Hampton Roads on an interactive map. Filter by price, beds, baths, and military base proximity.',
};

export default function MapPage() {
  return <MapClient />;
}
