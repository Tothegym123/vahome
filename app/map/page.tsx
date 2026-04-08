// app/map/page.tsx - Server component
import type { Metadata } from 'next'
import MapClient from './MapClient'
import { loadRetsListings } from '@/app/lib/rets-adapter'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Map Search | VaHome',
  description:
    'Browse Hampton Roads homes for sale on an interactive map. Filter by price, beds, baths, city and property type.',
}

export default function MapPage() {
  const listings = loadRetsListings()
  return <MapClient listings={listings} />
}
