'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import type { Listing } from '@/app/lib/listings'
import { formatPriceFull, getListingUrl } from '@/app/lib/listings'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

// Hampton Roads static bounds [west, south, east, north]
const HAMPTON_ROADS_BOUNDS: [number, number, number, number] = [-76.85, 36.55, -76.15, 37.35]

interface Filters {
  minPrice: number
  maxPrice: number
  beds: number
  baths: number
  city: string
  propertyType: string
}

interface Props {
  listings: Listing[]
}

export default function MapClient({ listings }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const mapboxRef = useRef<any>(null)
  const [mapReady, setMapReady] = useState(false)
  const [selected, setSelected] = useState<Listing | null>(null)
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 2000000,
    beds: 0,
    baths: 0,
    city: '',
    propertyType: '',
  })

  // Derived filtered listings
  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (l.price < filters.minPrice) return false
      if (l.price > filters.maxPrice) return false
      if (filters.beds && l.beds < filters.beds) return false
      if (filters.baths && l.baths < filters.baths) return false
      if (filters.city && l.city !== filters.city) return false
      if (filters.propertyType && l.propertyType !== filters.propertyType) return false
      return true
    })
  }, [listings, filters])

  const cityOptions = useMemo(() => {
    return Array.from(new Set(listings.map((l) => l.city))).sort()
  }, [listings])

  const typeOptions = useMemo(() => {
    return Array.from(new Set(listings.map((l) => l.propertyType))).sort()
  }, [listings])

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return
    if (!MAPBOX_TOKEN) {
      console.error('NEXT_PUBLIC_MAPBOX_TOKEN is missing')
      return
    }

    // Inject mapbox-gl CSS once
    if (typeof document !== 'undefined' && !document.getElementById('mapbox-gl-css')) {
      const link = document.createElement('link')
      link.id = 'mapbox-gl-css'
      link.rel = 'stylesheet'
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.9.0/mapbox-gl.css'
      document.head.appendChild(link)
    }

    let cancelled = false
    ;(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapboxgl: any = (await import('mapbox-gl')).default
      if (cancelled || !mapContainerRef.current) return
      mapboxgl.accessToken = MAPBOX_TOKEN

      // Use inline raster style with OSM tiles to bypass Mapbox v3 vector tile pipeline
      const rasterStyle: any = {
        version: 8,
        sources: {
          'osm-raster': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap © CARTO',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-raster',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
        glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
      }

      const map: any = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: rasterStyle,
        center: [-76.3, 36.85],
        zoom: 9,
        projection: 'mercator',
      })

      // Force resize + fitBounds after render loop kicks in
      setTimeout(() => {
        try {
          map.resize()
          map.fitBounds(HAMPTON_ROADS_BOUNDS, { padding: 40, duration: 0 })
        } catch {}
      }, 100)

      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.addControl(new mapboxgl.GeolocateControl({ trackUserLocation: false }), 'top-right')

      // Keep render loop alive for first 3 seconds to work around v3 loop-stall
      let repaintCount = 0
      const repaintInterval = setInterval(() => {
        if (repaintCount++ > 30 || cancelled) { clearInterval(repaintInterval); return }
        try { map.triggerRepaint() } catch {}
      }, 100)

      // Use DOM Markers instead of GeoJSON source (vector tile pipeline is broken in v3)
      let setupDone = false
      const doSetup = () => {
        if (setupDone) return
        setupDone = true
        mapboxRef.current = mapboxgl
        mapRef.current = map
        renderMarkers(listings)
        setMapReady(true)
      }

      const renderMarkers = (items: Listing[]) => {
        // Clear existing markers
        markersRef.current.forEach((mk) => mk.remove())
        markersRef.current = []
        
        // Military bases overlay (SVG ÃÂ¢ÃÂÃÂ vector layers broken in v3)
        if (!(map as any).__vhBases) {
          ;(map as any).__vhBases = true
          const container = map.getContainer() as HTMLElement
          const canvasContainer = container.querySelector('.mapboxgl-canvas-container') as HTMLElement
          if (canvasContainer) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
            svg.setAttribute('id','vh-base-svg')
            svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1'
            canvasContainer.appendChild(svg)
            fetch('/military-bases.geojson').then(r => r.json()).then((geo: any) => {
              const draw = () => {
                const rect = container.getBoundingClientRect()
                svg.setAttribute('width', String(rect.width))
                svg.setAttribute('height', String(rect.height))
                while (svg.firstChild) svg.removeChild(svg.firstChild)
                const zm = map.getZoom()
                for (const feat of geo.features as any[]) {
                  const geoms = feat.geometry.type === 'MultiPolygon' ? feat.geometry.coordinates : [feat.geometry.coordinates]
                  let cx = 0, cy = 0, cn = 0
                  for (const poly of geoms) {
                    let d = ''
                    for (const ring of poly) {
                      const pts = ring.map((c: number[]) => {
                        const p = map.project({ lng: c[0], lat: c[1] } as any)
                        cx += p.x; cy += p.y; cn++
                        return p.x + ',' + p.y
                      })
                      d += 'M' + pts.join('L') + 'Z '
                    }
                    const path = document.createElementNS('http://www.w3.org/2000/svg','path')
                    path.setAttribute('d', d)
                    path.setAttribute('fill', '#ff1a1a')
                    path.setAttribute('fill-opacity', '0.25')
                    path.setAttribute('stroke', '#ff0000')
                    path.setAttribute('stroke-width', '1')
                    path.setAttribute('stroke-opacity', '0.8')
                    svg.appendChild(path)
                  }
                  const nm: string = (feat.properties && feat.properties.name) || ""
                  if (nm && cn > 0) {
                    const tx = document.createElementNS('http://www.w3.org/2000/svg','text')
                    tx.setAttribute('x', String(cx/cn))
                    tx.setAttribute('y', String(cy/cn))
                    tx.setAttribute('text-anchor', 'middle')
                    tx.setAttribute('font-size', '13')
                    tx.setAttribute('font-weight', '800')
                    tx.setAttribute('font-family', 'system-ui,sans-serif')
                    tx.setAttribute('fill', '#000000')
                    tx.setAttribute('stroke', '#ffffff')
                    tx.setAttribute('stroke-width', '3')
                    tx.setAttribute('paint-order', 'stroke')
                    tx.textContent = nm
                    svg.appendChild(tx)
                  }
                }
              }
              draw()
              map.on('move', draw)
              map.on('zoom', draw)
              map.on('resize', draw)
            }).catch(() => {})
          }
        }
        items.forEach((l) => {
          const el = document.createElement('button')
          el.type = 'button'
          el.className =
            'vh-marker bg-white border border-[#1a5f7a] text-[#1a5f7a] font-semibold text-[10px] leading-none px-1.5 py-0.5 rounded-full shadow-sm hover:bg-[#1a5f7a] hover:text-white transition-colors cursor-pointer whitespace-nowrap'
          el.textContent = formatPriceFull(l.price)
          el.addEventListener('click', (e) => {
            e.stopPropagation()
            map.flyTo({ center: [l.lng, l.lat], zoom: Math.max(map.getZoom(), 14), speed: 1.2 })
            setSelected(l)
          })
          const mk = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat([l.lng, l.lat])
            .addTo(map)
          markersRef.current.push(mk)
        })
      }

      // Expose for effect below
      ;(mapRef as any).renderMarkers = renderMarkers

      map.on('load', doSetup)
      map.on('styledata', doSetup)
      map.on('idle', doSetup)
      setTimeout(doSetup, 200)
      setTimeout(doSetup, 500)
      setTimeout(doSetup, 1000)

      mapRef.current = map
    })()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update markers when filters change
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const rm = (mapRef as any).renderMarkers
    if (typeof rm === 'function') rm(filtered)
  }, [filtered, mapReady])

  // Fly to listing when selected from sidebar
  const handleSidebarClick = (listing: Listing) => {
    setSelected(listing)
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [listing.lng, listing.lat],
        zoom: 14,
        speed: 1.2,
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-gray-50">
      {/* Filter + Results Sidebar */}
      <aside className="w-full lg:w-[380px] border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Filter Listings</h2>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                <select
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                >
                  <option value={0}>Any</option>
                  <option value={200000}>$200K</option>
                  <option value={300000}>$300K</option>
                  <option value={400000}>$400K</option>
                  <option value={500000}>$500K</option>
                  <option value={750000}>$750K</option>
                  <option value={1000000}>$1M</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                <select
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                >
                  <option value={2000000}>Any</option>
                  <option value={300000}>$300K</option>
                  <option value={400000}>$400K</option>
                  <option value={500000}>$500K</option>
                  <option value={750000}>$750K</option>
                  <option value={1000000}>$1M</option>
                  <option value={1500000}>$1.5M</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Beds</label>
                <select
                  value={filters.beds}
                  onChange={(e) => setFilters({ ...filters, beds: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                  <option value={5}>5+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Baths</label>
                <select
                  value={filters.baths}
                  onChange={(e) => setFilters({ ...filters, baths: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              >
                <option value="">All Cities</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              >
                <option value="">All Types</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() =>
                setFilters({
                  minPrice: 0,
                  maxPrice: 2000000,
                  beds: 0,
                  baths: 0,
                  city: '',
                  propertyType: '',
                })
              }
              className="w-full text-xs text-gray-600 underline hover:text-gray-900"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="text-sm text-gray-600 mb-3">
            {filtered.length} of {listings.length} listings
          </div>
          <div className="space-y-3">
            {filtered.map((l) => (
              <button
                key={l.id}
                onClick={() => handleSidebarClick(l)}
                className={`w-full text-left bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                  selected?.id === l.id ? 'border-[#1a5f7a] ring-2 ring-[#1a5f7a]/20' : 'border-gray-200'
                }`}
              >
                <div className="flex gap-3 p-3">
                  <img
                    src={l.img}
                    alt={l.address}
                    className="w-24 h-20 object-cover rounded flex-shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{formatPriceFull(l.price)}</div>
                    <div className="text-xs text-gray-600 truncate">{l.address}</div>
                    <div className="text-xs text-gray-500">
                      {l.city}, {l.state}
                    </div>
                    <div className="text-xs text-gray-700 mt-1">
                      {l.beds} bd ÃÂ¢ÃÂÃÂ¢ {l.baths} ba ÃÂ¢ÃÂÃÂ¢ {l.sqft.toLocaleString()} sqft
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-gray-500 italic text-center py-8">
                No listings match your filters.
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Map */}
      <div className="relative flex-1">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Selected listing floating card */}
        {selected && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-10">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelected(null) }}
              className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-gray-600 shadow"
              aria-label="Close"
            >
              ÃÂÃÂ
            </button>
            <Link href={getListingUrl(selected)} className="block hover:bg-gray-50 transition-colors cursor-pointer">
              <img src={selected.img} alt={selected.address} className="w-full h-44 object-cover bg-gray-100" />
              <div className="p-4">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-xl font-bold text-gray-900">{formatPriceFull(selected.price)}</div>
                  <div className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">{selected.status}</div>
                </div>
                <div className="text-sm text-gray-700">{selected.address}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {selected.city}, {selected.state} {selected.zip}
                </div>
                <div className="text-sm text-gray-800 mb-3">
                  {selected.beds} bd ÃÂ¢ÃÂÃÂ¢ {selected.baths} ba
                  {selected.halfBaths ? ` ÃÂ¢ÃÂÃÂ¢ ${selected.halfBaths} half` : ''} ÃÂ¢ÃÂÃÂ¢ {selected.sqft.toLocaleString()} sqft
                </div>
                <div className="block w-full text-center bg-[#1a5f7a] text-white py-2 rounded-lg font-medium text-sm">
                  View Details
                </div>
              </div>
            </Link>
          </div>
        )}

        {!MAPBOX_TOKEN && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-6">
              <div className="text-gray-900 font-semibold mb-2">Map unavailable</div>
              <div className="text-sm text-gray-600">NEXT_PUBLIC_MAPBOX_TOKEN is not configured.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
