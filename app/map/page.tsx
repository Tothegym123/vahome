'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

// ---- Sample listing data (will be replaced with REIN MLS feed) ----
const sampleListings = [
  { id:1, lat:36.8507, lng:-76.4345, price:664900, beds:3, baths:2, sqft:2558, type:'New Construction', address:'317 Rhapsody Dr, Suffolk, VA 23435', img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop' },
  { id:2, lat:36.8623, lng:-76.4187, price:475000, beds:3, baths:3, sqft:2500, type:'House for sale', address:'3005 Wincanton Cv, Suffolk, VA 23435', img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop' },
  { id:3, lat:36.8341, lng:-76.4512, price:329000, beds:4, baths:2, sqft:1566, type:'House for sale', address:'5628 Plummer Blvd, Suffolk, VA 23435', img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop' },
  { id:4, lat:36.8789, lng:-76.3998, price:415000, beds:4, baths:2.5, sqft:2100, type:'House for sale', address:'1204 Copper Stone Cir, Chesapeake, VA 23322', img:'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop' },
  { id:5, lat:36.8156, lng:-76.4678, price:289900, beds:3, baths:2, sqft:1450, type:'House for sale', address:'4012 River Shore Rd, Suffolk, VA 23435', img:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop' },
  { id:6, lat:36.8934, lng:-76.4123, price:545000, beds:5, baths:3, sqft:3200, type:'House for sale', address:'2301 Eagles Nest Trl, Chesapeake, VA 23322', img:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop' },
  { id:7, lat:36.8445, lng:-76.3876, price:375000, beds:3, baths:2, sqft:1890, type:'Townhouse', address:'887 Cantebury Ln, Chesapeake, VA 23320', img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop' },
  { id:8, lat:36.8678, lng:-76.4534, price:599000, beds:4, baths:3.5, sqft:2850, type:'New Construction', address:'150 Waterford Way, Suffolk, VA 23435', img:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop' },
  { id:9, lat:36.8234, lng:-76.4234, price:249900, beds:2, baths:1, sqft:1100, type:'Condo for sale', address:'6789 Harbor View Blvd, Suffolk, VA 23435', img:'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop' },
  { id:10, lat:36.8812, lng:-76.4401, price:725000, beds:5, baths:4, sqft:3600, type:'House for sale', address:'501 Bridge Hampton Way, Chesapeake, VA 23322', img:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop' },
  { id:11, lat:36.7965, lng:-76.4890, price:215000, beds:2, baths:1.5, sqft:980, type:'Condo for sale', address:'120 Marina Dr, Suffolk, VA 23435', img:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop' },
  { id:12, lat:36.9012, lng:-76.3765, price:879000, beds:6, baths:4.5, sqft:4200, type:'Luxury Home', address:'900 Greenbrier Pkwy, Chesapeake, VA 23320', img:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop' },
  { id:13, lat:36.8567, lng:-76.3543, price:345000, beds:3, baths:2, sqft:1750, type:'House for sale', address:'2455 Cedar Rd, Chesapeake, VA 23322', img:'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=300&fit=crop' },
  { id:14, lat:36.8345, lng:-76.3987, price:395000, beds:3, baths:2.5, sqft:2000, type:'Townhouse', address:'789 Volvo Pkwy, Chesapeake, VA 23320', img:'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop' },
  { id:15, lat:36.8123, lng:-76.4456, price:275000, beds:3, baths:1.5, sqft:1350, type:'House for sale', address:'333 Pughsville Rd, Suffolk, VA 23435', img:'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop' },
  { id:16, lat:36.8890, lng:-76.4267, price:499000, beds:4, baths:3, sqft:2650, type:'House for sale', address:'1700 Battlefield Blvd S, Chesapeake, VA 23322', img:'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=400&h=300&fit=crop' },
  { id:17, lat:36.8678, lng:-76.3678, price:310000, beds:3, baths:2, sqft:1600, type:'House for sale', address:'4500 Indian River Rd, Chesapeake, VA 23325', img:'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&h=300&fit=crop' },
  { id:18, lat:36.8456, lng:-76.4789, price:450000, beds:4, baths:2.5, sqft:2300, type:'House for sale', address:'800 Sleepy Hole Rd, Suffolk, VA 23435', img:'https://images.unsplash.com/photo-1600047508006-aa71d8adfe8d?w=400&h=300&fit=crop' },
]

// ---- Video markers (neighborhood tours) ----
const videoMarkers = [
  { id:'v1', lat:36.8430, lng:-76.4350, title:'Harbor View, Suffolk', videoId:'dQw4w9WgXcQ', description:'Explore the Harbor View community with waterfront dining and new construction homes.' },
  { id:'v2', lat:36.8900, lng:-76.3900, title:'Greenbrier, Chesapeake', videoId:'dQw4w9WgXcQ', description:'Tour Greenbrier with top-rated schools, shopping, and family-friendly neighborhoods.' },
  { id:'v3', lat:36.8200, lng:-76.4600, title:'Downtown Suffolk', videoId:'dQw4w9WgXcQ', description:'Historic downtown Suffolk with charming shops, restaurants, and revitalized living.' },
  { id:'v4', lat:36.8700, lng:-76.4500, title:'Western Branch, Chesapeake', videoId:'dQw4w9WgXcQ', description:'Western Branch offers quiet suburban living with easy access to I-664.' },
  { id:'v5', lat:36.8550, lng:-76.3700, title:'Great Bridge, Chesapeake', videoId:'dQw4w9WgXcQ', description:'Great Bridge features the Battlefield Park, excellent schools, and a tight-knit community.' },
]

function formatPrice(price: number): string {
  if (price >= 1000000) return '$' + (price / 1000000).toFixed(1) + 'M'
  return '$' + (price / 1000).toFixed(0) + 'K'
}

function formatPriceFull(price: number): string {
  return '$' + price.toLocaleString()
}

type Listing = typeof sampleListings[number]

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [visibleListings, setVisibleListings] = useState<Listing[]>(sampleListings)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [activeVideo, setActiveVideo] = useState<typeof videoMarkers[number] | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const updateVisibleListings = useCallback(() => {
    if (!mapRef.current) return
    const bounds = mapRef.current.getBounds()
    const visible = sampleListings.filter(l => {
      return l.lng >= bounds.getWest() && l.lng <= bounds.getEast() &&
             l.lat >= bounds.getSouth() && l.lat <= bounds.getNorth()
    }).filter(l => {
      if (activeFilter === 'all') return true
      if (activeFilter === 'house') return l.type.toLowerCase().includes('house') || l.type.toLowerCase().includes('construction') || l.type.toLowerCase().includes('luxury')
      if (activeFilter === 'condo') return l.type.toLowerCase().includes('condo')
      if (activeFilter === 'townhouse') return l.type.toLowerCase().includes('townhouse')
      return true
    })
    setVisibleListings(visible)
  }, [activeFilter])

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      // Load Mapbox CSS
      if (!document.getElementById('mapbox-gl-css')) {
        const link = document.createElement('link')
        link.id = 'mapbox-gl-css'
        link.rel = 'stylesheet'
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.9.0/mapbox-gl.css'
        document.head.appendChild(link)
      }

      mapboxgl.accessToken = MAPBOX_TOKEN

      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-76.42, 36.855],
        zoom: 11.5,
        minZoom: 9,
        maxZoom: 18,
      })

      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      mapRef.current = map

      map.on('load', () => {
        setMapLoaded(true)

        // Add listing markers as a GeoJSON source with clustering
        map.addSource('listings', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: sampleListings.map(l => ({
              type: 'Feature' as const,
              properties: { id: l.id, price: l.price, priceLabel: formatPrice(l.price), address: l.address, beds: l.beds, baths: l.baths, sqft: l.sqft, type: l.type, img: l.img },
              geometry: { type: 'Point' as const, coordinates: [l.lng, l.lat] }
            }))
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 60
        })

        // Cluster circles
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'listings',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': ['step', ['get', 'point_count'], '#f94432', 10, '#c21e11', 30, '#841e17'],
            'circle-radius': ['step', ['get', 'point_count'], 24, 10, 30, 30, 36],
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff'
          }
        })

        // Cluster count labels
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'listings',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 14
          },
          paint: { 'text-color': '#ffffff' }
        })

        // Individual listing points (invisible - we use HTML markers instead for price pills)
        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'listings',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': 0,
            'circle-opacity': 0
          }
        })

        // Click cluster to zoom in
        map.on('click', 'clusters', (e: any) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
          if (!features.length) return
          const clusterId = features[0].properties?.cluster_id
          const src = map.getSource('listings') as any
          src.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
            if (err) return
            map.easeTo({ center: (features[0].geometry as any).coordinates, zoom })
          })
        })

        // Change cursor on cluster hover
        map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = '' })

        // Update visible listings on move
        map.on('moveend', () => updateVisibleListings())
        updateVisibleListings()
      })

      // Add price pill HTML markers for unclustered points
      const updateMarkers = () => {
        if (!map.isStyleLoaded()) return
        // Clear old markers
        markersRef.current.forEach(m => m.remove())
        markersRef.current = []

        const features = map.querySourceFeatures('listings', { filter: ['!', ['has', 'point_count']] } as any)
        const seen = new Set<number>()
        features.forEach((f: any) => {
          const id = f.properties.id
          if (seen.has(id)) return
          seen.add(id)

          const el = document.createElement('div')
          el.className = 'map-price-marker'
          el.setAttribute('data-listing-id', String(id))
          el.textContent = f.properties.priceLabel
          el.onclick = () => {
            const listing = sampleListings.find(l => l.id === id)
            if (listing) setSelectedListing(listing)
          }
          el.onmouseenter = () => setHoveredId(id)
          el.onmouseleave = () => setHoveredId(null)

          const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(f.geometry.coordinates as [number, number])
            .addTo(map)
          markersRef.current.push(marker)
        })
      }

      map.on('render', () => {
        if (map.isSourceLoaded('listings')) updateMarkers()
      })

      // Add video markers
      videoMarkers.forEach(v => {
        const el = document.createElement('div')
        el.className = 'map-video-marker'
        el.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>'
        el.onclick = () => setActiveVideo(v)

        new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([v.lng, v.lat])
          .addTo(map)
      })
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [updateVisibleListings])

  // Update filter
  useEffect(() => {
    updateVisibleListings()
  }, [activeFilter, updateVisibleListings])

  // Highlight marker on hover
  useEffect(() => {
    document.querySelectorAll('.map-price-marker').forEach(el => {
      const id = parseInt(el.getAttribute('data-listing-id') || '0')
      if (id === hoveredId) el.classList.add('hovered')
      else el.classList.remove('hovered')
    })
  }, [hoveredId])

  const flyToListing = (listing: Listing) => {
    if (!mapRef.current) return
    mapRef.current.flyTo({ center: [listing.lng, listing.lat], zoom: 15, duration: 800 })
    setSelectedListing(listing)
  }

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'house', label: 'Houses' },
    { key: 'condo', label: 'Condos' },
    { key: 'townhouse', label: 'Townhouses' },
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Injected styles for map markers */}
      <style jsx global>{`
        .map-price-marker {
          background: #ffffff;
          border: 2px solid #f94432;
          color: #111827;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: Inter, system-ui, sans-serif;
          position: relative;
        }
        .map-price-marker::after {
          content: '';
          position: absolute;
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid #f94432;
        }
        .map-price-marker:hover, .map-price-marker.hovered {
          background: #f94432;
          color: #ffffff;
          transform: scale(1.1);
          z-index: 10 !important;
        }
        .map-video-marker {
          width: 40px;
          height: 40px;
          background: #f94432;
          border: 3px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        .map-video-marker:hover {
          background: #c21e11;
          transform: scale(1.15);
        }
        .mapboxgl-ctrl-attrib { font-size: 10px !important; }
      `}</style>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2 flex-wrap" style={{ marginTop: '72px' }}>
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-3 h-3 rounded-full bg-primary-500 inline-block border-2 border-white shadow-sm"></span>
            Video Tour
          </span>
        </div>
        <div className="ml-auto text-sm text-gray-500 font-semibold">
          {visibleListings.length} homes in view
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-gray-400 text-lg">Loading map...</div>
            </div>
          )}
        </div>

        {/* Listing Panel */}
        <div className="w-[400px] bg-white border-l border-gray-200 overflow-y-auto hidden md:block">
          {/* Selected listing detail */}
          {selectedListing && (
            <div className="border-b-2 border-primary-500 bg-primary-50">
              <div className="relative">
                <img
                  src={selectedListing.img}
                  alt={selectedListing.address}
                  className="w-full h-48 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <button
                  onClick={() => setSelectedListing(null)}
                  className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 shadow"
                >
                  &times;
                </button>
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-gray-900">{formatPriceFull(selectedListing.price)}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {selectedListing.beds} bd | {selectedListing.baths} ba | {selectedListing.sqft.toLocaleString()} sqft | {selectedListing.type}
                </div>
                <div className="text-sm text-gray-700 mt-1">{selectedListing.address}</div>
                <a href="/property-detail.html" className="block mt-3 text-center bg-primary-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors">
                  View Full Details
                </a>
              </div>
            </div>
          )}

          {/* Listing cards */}
          <div>
            {visibleListings.map(l => (
              <div
                key={l.id}
                className={`flex gap-3 p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  hoveredId === l.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                } ${selectedListing?.id === l.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''}`}
                onClick={() => flyToListing(l)}
                onMouseEnter={() => setHoveredId(l.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <img
                  src={l.img}
                  alt={l.address}
                  className="w-28 h-20 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.background = '#e5e7eb'; (e.target as HTMLImageElement).alt = 'Photo' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-black text-gray-900">{formatPriceFull(l.price)}</div>
                  <div className="text-xs text-gray-500">
                    {l.beds} bd | {l.baths} ba | {l.sqft.toLocaleString()} sqft
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5 truncate">{l.address}</div>
                </div>
              </div>
            ))}
            {visibleListings.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p className="text-lg font-semibold">No homes in this area</p>
                <p className="text-sm mt-1">Zoom out or pan the map to see listings</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setActiveVideo(null)}>
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900">{activeVideo.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{activeVideo.description}</p>
              <button
                onClick={() => setActiveVideo(null)}
                className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
