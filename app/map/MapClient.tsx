'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Listing } from '@/app/lib/listings'
import { formatPriceFull, getListingUrl } from '@/app/lib/listings'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

// Hampton Roads bounds: [west, south, east, north]
const HAMPTON_ROADS_BOUNDS: [number, number, number, number] = [-76.85, 36.55, -76.15, 37.35]

// CARTO Voyager raster tiles (known-good base map for mapbox-gl v3)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _rasterStyle: any = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
      minzoom: 0,
      maxzoom: 22,
    },
  ],
}

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

// Short price formatter used for the pill text (e.g. $635K, $1.2M)
function formatPriceShort(price: number): string {
  if (price >= 1_000_000) {
    const m = price / 1_000_000
    return '$' + (m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, '')) + 'M'
  }
  if (price >= 1000) {
    return '$' + Math.round(price / 1000) + 'K'
  }
  return '$' + price
}

export default function MapClient({ listings }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const mapboxRef = useRef<any>(null)
  const rebuildSourceRef = useRef<(() => void) | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [selected, setSelected] = useState<Listing | null>(null)
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set())
  const [showFlood, setShowFlood] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 10_000_000,
    beds: 0,
    baths: 0,
    city: '',
    propertyType: '',
  })

  // Optional dev stress-test: ?stress=20000 generates synthetic points scattered
  // across Hampton Roads. Used to confirm the GeoJSON + clustering pipeline can
  // scale to the full ~17k REIN MLS feed without crashing.
  const workingListings: Listing[] = useMemo(() => {
    if (typeof window === 'undefined') return listings
    const params = new URLSearchParams(window.location.search)
    const stress = parseInt(params.get('stress') || '0', 10)
    if (!stress || stress <= 0) return listings

    const [w, s, e, n] = HAMPTON_ROADS_BOUNDS
    const base = listings.length ? listings[0] : null
    const synthetic: Listing[] = []
    for (let i = 0; i < stress; i++) {
      const lng = w + Math.random() * (e - w)
      const lat = s + Math.random() * (n - s)
      const price = 150_000 + Math.floor(Math.random() * 1_500_000)
      synthetic.push({
        ...(base as Listing),
        id: 9_000_000 + i,
        lat,
        lng,
        price,
        address: `${i} Stress Test Way`,
      } as Listing)
    }
    return [...listings, ...synthetic]
  }, [listings])

  // Filtered listings (same shape as before). These drive BOTH the map source
  // and the sidebar card list, so the two stay perfectly in sync.
  const filtered = useMemo(() => {
    return workingListings.filter((l) => {
      if (l.price < filters.minPrice) return false
      if (l.price > filters.maxPrice) return false
      if (filters.beds && l.beds < filters.beds) return false
      if (filters.baths && l.baths < filters.baths) return false
      if (filters.city && l.city !== filters.city) return false
      if (filters.propertyType && l.propertyType !== filters.propertyType) return false
      return true
    })
  }, [workingListings, filters])

  // ---------------------------------------------------------------------------
  // Initialize map once on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    let cancelled = false
    ;(async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      if (cancelled) return
      mapboxgl.accessToken = MAPBOX_TOKEN
      mapboxRef.current = mapboxgl

      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-76.2, 36.85],
        zoom: 10,
        maxBounds: [
          [-77.3, 36.2],
          [-75.7, 37.7],
        ],
      })
      mapRef.current = map

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

      map.on('style.load', () => {
        // Strip the hosted mapbox base layers/source — composite TileJSON stalls in
        // mapbox-gl v3 for us, so we render CARTO raster tiles instead.
        try {
          const style: any = (map as any).style
          const ids: string[] = style && style._order ? [...style._order] : []
          for (const id of ids) {
            const layer = style._layers && style._layers[id]
            if (layer && (layer.source === 'composite' || id === 'land' || id === 'background')) {
              try { map.removeLayer(id) } catch {}
            }
          }
          try { map.removeSource('composite') } catch {}
        } catch {}
        map.addSource('carto-basemap', { type: 'raster', tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png','https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png','https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png','https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'], tileSize: 256, attribution: '\u00a9 OpenStreetMap, \u00a9 CARTO' })
        map.addLayer({ id: 'carto-basemap-layer', type: 'raster', source: 'carto-basemap' })

        // -------------------------------------------------------------------
        // FEMA National Flood Hazard Layer (NFHL) overlay ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ public ArcGIS
        // MapServer. Added here as a raster source so it's tile-based and
        // virtually free performance-wise (only in-view tiles are fetched,
        // nothing runs on the main thread). Toggled via the "Flood zones"
        // button on the map. Starts hidden.
        // -------------------------------------------------------------------
        map.addSource('fema-nfhl', {
          type: 'raster',
          tiles: [
            'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: 'Flood data &copy; FEMA NFHL',
        })
        map.addLayer({
          id: 'fema-nfhl-layer',
          type: 'raster',
          source: 'fema-nfhl',
          layout: { visibility: 'none' },
          paint: { 'raster-opacity': 0.6 },
        })

        // -------------------------------------------------------------------
        // Listings GeoJSON source with server-side (web-worker) clustering
        // -------------------------------------------------------------------
        map.addSource('listings', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        })

        // Cluster circles (visible at low zoom)
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'listings',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#3b82f6',
              25,
              '#2563eb',
              100,
              '#1d4ed8',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              18,
              25,
              24,
              100,
              32,
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.9,
          },
        })

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'listings',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-size': 13,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          },
          paint: {
            'text-color': '#ffffff',
          },
        })

        // Unclustered dot (visible when zoomed out past the pill threshold)
        map.addLayer({
          id: 'unclustered-dot',
          type: 'circle',
          source: 'listings',
          filter: ['!', ['has', 'point_count']],
          maxzoom: 13,
          paint: {
            'circle-color': '#ffffff',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            // NOTE: pill/dot color hook ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ swap these for data-driven expressions later
            // e.g. ['case', ['==', ['get','status'],'pending'], '#eab308', '#111827']
            'circle-stroke-color': '#111827',
          },
        })

        // Unclustered price pills (visible when zoomed in, Zillow-style)
        map.addLayer({
          id: 'unclustered-pill',
          type: 'symbol',
          source: 'listings',
          filter: ['!', ['has', 'point_count']],
          minzoom: 13,
          layout: {
            'text-field': ['get', 'priceShort'],
            'text-size': 12,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-padding': 2,
            'text-allow-overlap': false,
            'text-ignore-placement': false,
          },
          paint: {
            // NOTE: pill color hook ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ default is black text on the white pill background
            // below. To color-code later (e.g. viewed=gray, pending=yellow, sold=red),
            // replace the constant strings with ['case', ...] / ['match', ...] expressions.
            'text-color': '#111827',
            'text-halo-color': '#ffffff',
            'text-halo-width': 8,
            'text-halo-blur': 0,
          },
        })

        // -------------------------------------------------------------------
        // Interaction: cluster click ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ zoom in
        // -------------------------------------------------------------------
        map.on('click', 'clusters', (e: any) => {
          const features: any[] = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
          if (!features.length) return
          const f0: any = features[0]
          const clusterId = f0.properties.cluster_id
          const source: any = map.getSource('listings')
          source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
            if (err) return
            map.easeTo({
              center: f0.geometry.coordinates,
              zoom: zoom + 0.2,
            })
          })
        })
        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = ''
        })

        // Interaction: pill/dot click ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ select listing
        const selectFromFeature = (e: any) => {
          const f = e.features && e.features[0]
          if (!f) return
          const id = f.properties.id as number
          const found = filteredRef.current.find((l) => l.id === id)
          if (found) setSelected(found)
        }
        map.on('click', 'unclustered-pill', selectFromFeature)
        map.on('click', 'unclustered-dot', selectFromFeature)
        map.on('mouseenter', 'unclustered-pill', () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'unclustered-pill', () => {
          map.getCanvas().style.cursor = ''
        })
        map.on('mouseenter', 'unclustered-dot', () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'unclustered-dot', () => {
          map.getCanvas().style.cursor = ''
        })

        // -------------------------------------------------------------------
        // Viewport-aware source rebuild (Zillow-style 500-dot cap).
        //
        // On every pan/zoom we:
        //   1. Read the current map bounds
        //   2. Filter the full `filtered` list down to listings inside the bbox
        //   3. Slice to at most 500
        //   4. Push that slice into the GeoJSON source via setData()
        //   5. Mirror the same 500 IDs into visibleIds for the sidebar
        //
        // The GeoJSON source therefore NEVER contains more than 500 features at
        // any time, matching Zillow's "500 of N" behavior exactly. Clustering
        // still works, but only across the 500 in-view points ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ listings
        // outside the viewport are not counted in clusters (same as Zillow).
        // -------------------------------------------------------------------
        const rebuildSource = () => {
          const source: any = map.getSource('listings')
          if (!source) return
          const b: any = map.getBounds()
          if (!b) return
          const w = b.getWest()
          const s = b.getSouth()
          const e = b.getEast()
          const n = b.getNorth()

          const all = filteredRef.current
          const inView: Listing[] = []
          for (let i = 0; i < all.length; i++) {
            const l = all[i]
            if (l.lng >= w && l.lng <= e && l.lat >= s && l.lat <= n) {
              inView.push(l)
              if (inView.length >= 500) break
            }
          }

          const features = inView.map((l) => ({
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [l.lng, l.lat],
            },
            properties: {
              id: l.id,
              price: l.price,
              priceShort: formatPriceShort(l.price),
              slug: getListingUrl(l),
              city: l.city,
              propertyType: l.propertyType,
              status: l.status || 'active',
              // Future color-coding hook ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ set these to real values when ready.
              viewed: false,
            },
          }))
          source.setData({ type: 'FeatureCollection', features })

          const ids = new Set<number>()
          for (let i = 0; i < inView.length; i++) ids.add(inView[i].id)
          setVisibleIds(ids)
        }
        rebuildSourceRef.current = rebuildSource
        map.on('moveend', rebuildSource)

        setMapReady(true)
        // Initial population
        rebuildSource()
      })
    })()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Keep a ref to filtered so click handlers always see the latest list
  // without needing to re-register themselves.
  const filteredRef = useRef<Listing[]>(filtered)
  useEffect(() => {
    filteredRef.current = filtered
  }, [filtered])

  // ---------------------------------------------------------------------------
  // When filters change (or the map becomes ready), rebuild the viewport-capped
  // GeoJSON source. The rebuild function lives inside map.on('load') and is
  // exposed via rebuildSourceRef so we can trigger it from outside.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapReady) return
    rebuildSourceRef.current?.()
  }, [filtered, mapReady])

  // Toggle the FEMA flood-zone overlay on/off without touching listings.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    if (!map.getLayer('fema-nfhl-layer')) return
    map.setLayoutProperty(
      'fema-nfhl-layer',
      'visibility',
      showFlood ? 'visible' : 'none'
    )
  }, [showFlood, mapReady])

  // Derived: cards to show in the sidebar mirror the ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¤500 features currently in
  // the GeoJSON source. visibleIds is populated by rebuildSource() on every
  // moveend, so this is always in lockstep with what's actually on the map.
  const visibleInView = useMemo(() => {
    if (visibleIds.size === 0) return [] as Listing[]
    return filtered.filter((l) => visibleIds.has(l.id))
  }, [filtered, visibleIds])
  const visibleCards = visibleInView

  const cities = useMemo(
    () => Array.from(new Set(workingListings.map((l) => l.city))).sort(),
    [workingListings]
  )
  const propertyTypes = useMemo(
    () => Array.from(new Set(workingListings.map((l) => l.propertyType).filter(Boolean))).sort(),
    [workingListings]
  )

  return (
    <div className="flex h-[calc(100vh-80px)] w-full flex-col lg:flex-row">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white p-3 lg:hidden">
        <input
          type="number"
          placeholder="Min $"
          className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
          onChange={(e) =>
            setFilters((f) => ({ ...f, minPrice: Number(e.target.value) || 0 }))
          }
        />
        <input
          type="number"
          placeholder="Max $"
          className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              maxPrice: Number(e.target.value) || 10_000_000,
            }))
          }
        />
        <select
          className="rounded border border-gray-300 px-2 py-1 text-sm"
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Map */}
      <div className="relative h-[50vh] w-full lg:h-full lg:w-3/5">
        <div ref={mapContainerRef} className="absolute inset-0" />
        {/* Layer toggles (top-left over the map) */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowFlood((v) => !v)}
            className={
              'rounded-md border px-3 py-1.5 text-xs font-semibold shadow-md transition ' +
              (showFlood
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50')
            }
            title="Toggle FEMA flood hazard zones"
          >
            {showFlood ? 'ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ Flood zones' : 'Flood zones'}
          </button>
        </div>
      </div>

      {/* Sidebar: cards synced to visible features */}
      <div className="h-[50vh] w-full overflow-y-auto border-l border-gray-200 bg-gray-50 lg:h-full lg:w-2/5">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-3">
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            <input
              type="number"
              placeholder="Min $"
              className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
              onChange={(e) =>
                setFilters((f) => ({ ...f, minPrice: Number(e.target.value) || 0 }))
              }
            />
            <input
              type="number"
              placeholder="Max $"
              className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  maxPrice: Number(e.target.value) || 10_000_000,
                }))
              }
            />
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              onChange={(e) =>
                setFilters((f) => ({ ...f, beds: Number(e.target.value) || 0 }))
              }
            >
              <option value="0">Any beds</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              onChange={(e) =>
                setFilters((f) => ({ ...f, baths: Number(e.target.value) || 0 }))
              }
            >
              <option value="0">Any baths</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              onChange={(e) =>
                setFilters((f) => ({ ...f, city: e.target.value }))
              }
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              onChange={(e) =>
                setFilters((f) => ({ ...f, propertyType: e.target.value }))
              }
            >
              <option value="">All types</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Showing {visibleCards.length} of {filtered.length} listings
            {visibleCards.length >= 500 && (
              <span className="text-gray-400"> &middot; zoom in to see more</span>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {visibleCards.map((l) => (
            <Link
              key={l.id}
              href={getListingUrl(l)}
              className="block p-3 transition hover:bg-white"
              onMouseEnter={() => setSelected(l)}
            >
              <div className="flex gap-3">
                <div
                  className="h-20 w-28 flex-shrink-0 rounded bg-gradient-to-br from-blue-100 to-blue-300"
                  style={
                    l.photos && l.photos[0]
                      ? {
                          backgroundImage: `url(${l.photos[0]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold text-gray-900">
                    {formatPriceFull(l.price)}
                  </div>
                  <div className="text-sm text-gray-700">
                    {l.beds} bd &middot; {l.baths} ba &middot;{' '}
                    {l.sqft?.toLocaleString()} sqft
                  </div>
                  <div className="truncate text-sm text-gray-600">
                    {l.address}
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {l.city}, {l.state} {l.zip}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {visibleCards.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No listings in the current view. Try zooming out or adjusting filters.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
