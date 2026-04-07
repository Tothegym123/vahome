'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { sampleListings, videoMarkers, formatPrice, formatPriceFull, getFullAddress, getListingUrl, listingsToGeoJSON } from '../lib/listings'
import type { Listing, VideoMarker as VideoMarkerType } from '../lib/listings'
import FavoriteButton from '../components/FavoriteButton'
import { createClient } from '../lib/supabase/client'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

// ---- Filter types ----
interface Filters {
  type: string
  minPrice: number
  maxPrice: number
  minBeds: number
}

const DEFAULT_FILTERS: Filters = {
  type: 'all',
  minPrice: 0,
  maxPrice: 5000000,
  minBeds: 0,
}

function filterListings(listings: Listing[], filters: Filters): Listing[] {
  return listings.filter(l => {
    if (filters.type !== 'all') {
      const t = l.type.toLowerCase()
      if (filters.type === 'house' && !t.includes('house') && !t.includes('construction')) return false
      if (filters.type === 'condo' && !t.includes('condo')) return false
      if (filters.type === 'townhouse' && !t.includes('townhouse')) return false
    }
    if (l.price < filters.minPrice || l.price > filters.maxPrice) return false
    if (l.beds < filters.minBeds) return false
    return true
  })
}

// ---- Price range options ----
const priceOptions = [
  { label: 'Any', min: 0, max: 5000000 },
  { label: 'Under $300K', min: 0, max: 300000 },
  { label: '$300KÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ$500K', min: 300000, max: 500000 },
  { label: '$500KÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ$750K', min: 500000, max: 750000 },
  { label: '$750K+', min: 750000, max: 5000000 },
]

const bedOptions = [
  { label: 'Any', value: 0 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
  { label: '5+', value: 5 },
]

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const videoMarkersRef = useRef<any[]>([])
  const popupRef = useRef<any>(null)
  const [visibleListings, setVisibleListings] = useState<Listing[]>(sampleListings)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [activeVideo, setActiveVideo] = useState<VideoMarkerType | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [tourPins, setTourPins] = useState<Array<{id:string,title:string,description:string,youtube_url:string,lat:number,lng:number}>>([])
  const [userTier, setUserTier] = useState<'free' | 'paid' | null>(null)

  // Filter listings based on current filters
  const filteredListings = useMemo(() => filterListings(sampleListings, filters), [filters])

  // Update visible listings based on map bounds + filters
  const updateVisibleListings = useCallback(() => {
    if (!mapRef.current) return
    const bounds = mapRef.current.getBounds()
    const visible = filteredListings.filter(l => {
      return l.lng >= bounds.getWest() && l.lng <= bounds.getEast() &&
        l.lat >= bounds.getSouth() && l.lat <= bounds.getNorth()
    })
    setVisibleListings(visible)
  }, [filteredListings])

  // Update GeoJSON source when filters change
  useEffect(() => {
    console.log('[tour-debug] markerEffect mapLoaded=', mapLoaded, 'tier=', userTier, 'pins=', tourPins.length); if (!mapRef.current || !mapLoaded) return
    const source = mapRef.current.getSource('listings')
    if (source) {
      source.setData(listingsToGeoJSON(filteredListings))
    }
    updateVisibleListings()
  }, [filteredListings, mapLoaded, updateVisibleListings])

  // Fetch user tier and (if paid) load video tour pins
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (cancelled) return
        if (!user) {
          setUserTier(null)
          setTourPins([])
          return
        }
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('tier')
          .eq('id', user.id)
          .single()
        if (cancelled) return
        const tier: 'free' | 'paid' = profile?.tier === 'paid' ? 'paid' : 'free'
        setUserTier(tier); console.log('[tour-debug] tier=', tier)
        if (tier === 'paid') {
          const { data: tours } = await supabase
            .from('neighborhood_tours')
            .select('id,title,description,youtube_url,lat,lng')
          if (cancelled) return
          setTourPins((tours || []) as any); console.log('[tour-debug] tours=', tours)
        } else {
          setTourPins([])
        }
      } catch (e) {
        console.error('tour pin fetch failed', e)
      }
    })()
    return () => { cancelled = true }
  }, [])

  // Render tier-gated video tour markers
      useEffect(() => {
        console.log('[tour-debug] renderEffect entry tier=', userTier, 'pins=', tourPins.length)
        videoMarkersRef.current.forEach(m => m.remove())
        videoMarkersRef.current = []
        if (userTier !== 'paid' || tourPins.length === 0) return
        let cancelled = false
        const tryRender = async () => {
          if (cancelled) return
          const map = mapRef.current
          if (!map || !map.loaded()) { setTimeout(tryRender, 150); return }
          const mapboxgl = (await import('mapbox-gl')).default
          if (cancelled || !mapRef.current) return
          console.log('[tour-debug] rendering', tourPins.length, 'markers')
          tourPins.forEach(pin => {
            const el = document.createElement('div')
            el.className = 'map-video-marker'
            el.style.cssText = 'width:32px;height:32px;border-radius:50%;background:#dc2626;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid white'
            el.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>'
            el.title = pin.title
            el.onclick = () => {
              const m = pin.youtube_url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)
              const videoId = m ? m[1] : ''
              setActiveVideo({ videoId, title: pin.title, description: pin.description, lat: pin.lat, lng: pin.lng } as any)
            }
            const marker = new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat([pin.lng, pin.lat]).addTo(mapRef.current)
            videoMarkersRef.current.push(marker)
          })
        }
        tryRender()
        return () => { cancelled = true }
      }, [tourPins, userTier])

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default

      // Preload Mapbox CSS
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
      map.addControl(new mapboxgl.GeolocateControl({ trackUserLocation: false }), 'top-right')
      mapRef.current = map

      map.on('load', () => {
        setMapLoaded(true)

        // ---- GeoJSON source with clustering ----
        map.addSource('listings', {
          type: 'geojson',
          data: listingsToGeoJSON(sampleListings),
          cluster: true,
          clusterMaxZoom: 13,
          clusterRadius: 60,
        })

        // ---- Cluster circles ----
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'listings',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': ['step', ['get', 'point_count'],
              '#f94432', 10, '#c21e11', 50, '#841e17', 200, '#5c0a0a'],
            'circle-radius': ['step', ['get', 'point_count'],
              22, 10, 28, 50, 34, 200, 40],
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
          },
        })

        // ---- Cluster count labels ----
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'listings',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 13,
          },
          paint: { 'text-color': '#ffffff' },
        })

        // ---- Individual listing circles (base layer for interaction) ----
        map.addLayer({
          id: 'listing-points',
          type: 'circle',
          source: 'listings',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': 14,
            'circle-color': '#1e3a5f',
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.95,
          },
        })

        // ---- Price labels on individual listings ----
        map.addLayer({
          id: 'listing-prices',
          type: 'symbol',
          source: 'listings',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'text-field': ['get', 'priceLabel'],
            'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
            'text-size': 10,
            'text-allow-overlap': true,
            'text-ignore-placement': false,
          },
          paint: {
            'text-color': '#ffffff',
          },
        })

        // ---- Hover state: enlarge on hover ----
        let hoveredFeatureId: number | null = null

        map.on('mouseenter', 'listing-points', (e: any) => {
          map.getCanvas().style.cursor = 'pointer'
          if (e.features && e.features.length > 0) {
            const id = e.features[0].properties.id
            setHoveredId(id)
          }
        })

        map.on('mouseleave', 'listing-points', () => {
          map.getCanvas().style.cursor = ''
          setHoveredId(null)
        })

        // ---- Click listing ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ show popup card (Zillow style) ----
        const showListingPopup = (e: any) => {
          if (!e.features || e.features.length === 0) return
          const feat = e.features[0]
          const props = feat.properties
          const coords = (feat.geometry as any).coordinates.slice()

          // Close existing popup
          if (popupRef.current) {
            popupRef.current.remove()
            popupRef.current = null
          }

          const html = `
            <a href="${props.url}" class="popup-card" style="display:block;text-decoration:none;color:inherit;width:240px;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
              <img src="${props.img}" alt="" style="width:100%;height:140px;object-fit:cover;border-radius:8px 8px 0 0;display:block;" />
              <div style="padding:10px 12px 12px;">
                <div style="font-size:18px;font-weight:800;color:#111827;">${props.priceFull || props.priceLabel}</div>
                <div style="font-size:12px;color:#6b7280;margin-top:2px;">${props.beds} bd | ${props.baths} ba | ${Number(props.sqft).toLocaleString()} sqft</div>
                <div style="font-size:12px;color:#374151;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${props.address}</div>
                <div style="font-size:11px;color:#ef4444;font-weight:600;margin-top:6px;">View details ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ</div>
              </div>
            </a>
          `

          const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            maxWidth: '260px',
            offset: 18,
            className: 'listing-popup',
          })
            .setLngLat(coords)
            .setHTML(html)
            .addTo(map)

          popupRef.current = popup
        }

        map.on('click', 'listing-points', showListingPopup)
        map.on('click', 'listing-prices', showListingPopup)

        // ---- Click cluster to zoom in ----
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

        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = ''
        })

        // Update visible listings on map move ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ using 'idle' instead of 'moveend'
        // for smoother updates, and 'idle' only fires once the map is done rendering
        map.on('idle', () => updateVisibleListings())
        updateVisibleListings()
      })

      // VIDEO MARKERS TEMPORARILY DISABLED - will add back later
      //       // ---- Video markers (HTML markers ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ only 5, so DOM is fine) ----
      //       videoMarkers.forEach(v => {
      //         const el = document.createElement('div')
      //         el.className = 'map-video-marker'
      //         el.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>'
      //         el.onclick = () => setActiveVideo(v)
      //         const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      //           .setLngLat([v.lng, v.lat])
      //           .addTo(map)
      //         videoMarkersRef.current.push(marker)
      //       })
    }

    initMap()

    return () => {
      videoMarkersRef.current.forEach(m => m.remove())
      videoMarkersRef.current = []
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [updateVisibleListings])

  // Fly to listing from panel click
  const flyToListing = (listing: Listing) => {
    if (!mapRef.current) return
    mapRef.current.flyTo({
      center: [listing.lng, listing.lat],
      zoom: 15,
      duration: 800,
    })
    setSelectedListing(listing)
    setMobileDrawerOpen(false)
  }

  const typeFilters = [
    { key: 'all', label: 'All' },
    { key: 'house', label: 'Houses' },
    { key: 'condo', label: 'Condos' },
    { key: 'townhouse', label: 'Townhouses' },
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Styles for map markers and mobile drawer */}
      <style jsx global>{`
        .map-video-marker {
          width: 40px; height: 40px; background: #f94432;
          border: 3px solid #ffffff; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #ffffff; cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        .map-video-marker:hover {
          background: #c21e11; transform: scale(1.15);
        }
        .mapboxgl-ctrl-attrib { font-size: 10px !important; }
        .listing-popup .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18) !important;
        }
        .listing-popup .mapboxgl-popup-close-button {
          font-size: 18px;
          color: #fff;
          right: 6px;
          top: 4px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
          z-index: 2;
        }
        .listing-popup .mapboxgl-popup-close-button:hover {
          background: transparent;
          color: #fff;
        }
        .listing-popup .mapboxgl-popup-tip {
          border-top-color: #fff;
        }
        .popup-card:hover {
          opacity: 0.95;
        }
        .mobile-drawer {
          transition: transform 0.3s ease;
        }
        .mobile-drawer.open {
          transform: translateY(0);
        }
        .mobile-drawer.closed {
          transform: translateY(calc(100% - 60px));
        }
      `}</style>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2 flex-wrap" style={{ marginTop: '72px' }}>
        {/* Type filters */}
        <div className="flex gap-1.5">
          {typeFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilters(prev => ({ ...prev, type: f.key }))}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filters.type === f.key
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* More filters toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            showFilters ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
        </button>

        {/* Video tour legend */}
        <span className="flex items-center gap-1.5 text-xs text-gray-400 ml-1">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block border-2 border-white shadow-sm"></span>
          Video Tour
        </span>

        {/* Count */}
        <div className="ml-auto text-sm text-gray-500 font-semibold">
          {visibleListings.length} home{visibleListings.length !== 1 ? 's' : ''} in view
        </div>
      </div>

      {/* Expanded filter row */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 flex-wrap">
          {/* Price range */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Price:</span>
            <div className="flex gap-1">
              {priceOptions.map(p => (
                <button
                  key={p.label}
                  onClick={() => setFilters(prev => ({ ...prev, minPrice: p.min, maxPrice: p.max }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filters.minPrice === p.min && filters.maxPrice === p.max
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Beds */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Beds:</span>
            <div className="flex gap-1">
              {bedOptions.map(b => (
                <button
                  key={b.label}
                  onClick={() => setFilters(prev => ({ ...prev, minBeds: b.value }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filters.minBeds === b.value
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {(filters.minPrice !== 0 || filters.maxPrice !== 5000000 || filters.minBeds !== 0 || filters.type !== 'all') && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Reset all
            </button>
          )}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />

          {/* Loading skeleton */}
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm mt-4">Loading map...</p>
            </div>
          )}

          {/* Mobile drawer toggle */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 z-10 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            {visibleListings.length} homes
            <svg className={`w-4 h-4 transition-transform ${mobileDrawerOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>

        {/* Desktop Listing Panel */}
        <div className="w-[400px] bg-white border-l border-gray-200 overflow-y-auto hidden md:block">
          {/* Selected listing detail */}
          {selectedListing && (
            <div className="border-b-2 border-red-500 bg-red-50">
              <div className="relative">
                <img
                  src={selectedListing.img}
                  alt={getFullAddress(selectedListing)}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => setSelectedListing(null)}
                  className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 shadow"
                >
                  &times;
                </button>
                {selectedListing.daysOnMarket !== undefined && (
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {selectedListing.daysOnMarket === 0 ? 'Just listed' : `${selectedListing.daysOnMarket}d on market`}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-gray-900">{formatPriceFull(selectedListing.price)}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {selectedListing.beds} bd | {selectedListing.baths} ba | {selectedListing.sqft.toLocaleString()} sqft
                  {selectedListing.yearBuilt ? ` | Built ${selectedListing.yearBuilt}` : ''}
                </div>
                <div className="text-sm text-gray-700 mt-1">{getFullAddress(selectedListing)}</div>
                {selectedListing.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{selectedListing.description}</p>
                )}
                <a
                  href={getListingUrl(selectedListing)}
                  className="block mt-3 text-center bg-red-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
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
                } ${selectedListing?.id === l.id ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}
                onClick={() => flyToListing(l)}
                onMouseEnter={() => setHoveredId(l.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative flex-shrink-0">
                <img src={l.img} alt={getFullAddress(l)} className="w-28 h-20 rounded-lg object-cover" loading="lazy" />
                <div className="absolute top-1 right-1" onClick={(e) => e.stopPropagation()}>
                  <FavoriteButton listingId={l.id} listingData={l} size="sm" />
                </div>
              </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="text-lg font-black text-gray-900">{formatPriceFull(l.price)}</div>
                    {l.daysOnMarket !== undefined && l.daysOnMarket <= 7 && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">New</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {l.beds} bd | {l.baths} ba | {l.sqft.toLocaleString()} sqft
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5 truncate">{getFullAddress(l)}</div>
                  <a
                    href={getListingUrl(l)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-red-500 hover:text-red-700 font-medium mt-1 inline-block"
                  >
                    View details &rarr;
                  </a>
                </div>
              </div>
            ))}
            {visibleListings.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p className="text-lg font-semibold">No homes in this area</p>
                <p className="text-sm mt-1">Zoom out or pan the map to see listings</p>
                {(filters.type !== 'all' || filters.minPrice > 0 || filters.minBeds > 0) && (
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium mt-3"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Listing Drawer */}
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-20 mobile-drawer ${
            mobileDrawerOpen ? 'open' : 'closed'
          }`}
          style={{ height: '60vh' }}
        >
          {/* Drag handle */}
          <div
            className="flex justify-center py-3 cursor-pointer"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          >
            <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          <div className="overflow-y-auto" style={{ height: 'calc(60vh - 60px)' }}>
            {visibleListings.map(l => (
              <div
                key={l.id}
                className="flex gap-3 p-3 border-b border-gray-100"
                onClick={() => flyToListing(l)}
              >
                <div className="relative flex-shrink-0">
                <img src={l.img} alt={getFullAddress(l)} className="w-24 h-18 rounded-lg object-cover" loading="lazy" />
                <div className="absolute top-1 right-1" onClick={(e) => e.stopPropagation()}>
                  <FavoriteButton listingId={l.id} listingData={l} size="sm" />
                </div>
              </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-black text-gray-900">{formatPriceFull(l.price)}</div>
                  <div className="text-xs text-gray-500">{l.beds} bd | {l.baths} ba | {l.sqft.toLocaleString()} sqft</div>
                  <div className="text-xs text-gray-600 truncate">{getFullAddress(l)}</div>
                  <a
                    href={getListingUrl(l)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-red-500 font-medium"
                  >
                    View details &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
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
