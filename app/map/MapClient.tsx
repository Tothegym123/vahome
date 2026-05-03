'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { getDisplayStatus, getStatusPillBg, getStatusPillFg } from '../lib/listing-status';
import Script from 'next/script';
import { getDutyStation, distanceMiles, type DutyStation } from '../data/duty-stations';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';

declare const google: any;

// Type definitions
interface MapListing {
  id: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  priceFormatted: string;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  status: string;
  contingent?: boolean;
  lat: number;
  lng: number;
  slug: string;
}

interface MapVideo {
  id: string;
  title: string;
  youtube_url: string;
  lat: number;
  lng: number;
  neighborhood: string;
}

interface MapBounds {
  sw_lat: number;
  sw_lng: number;
  ne_lat: number;
  ne_lng: number;
}

interface FilterState {
  type: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
}

// Military base boundaries (Hampton Roads area — within ~50 mi of Norfolk)
// Easily removable: delete this array and related code to remove base overlays
const MILITARY_BASES = [
  {
    name: 'Naval Station Norfolk',
    coords: [
      { lat: 36.9590, lng: -76.3385 },
      { lat: 36.9585, lng: -76.3180 },
      { lat: 36.9570, lng: -76.3020 },
      { lat: 36.9530, lng: -76.2960 },
      { lat: 36.9460, lng: -76.2930 },
      { lat: 36.9400, lng: -76.2945 },
      { lat: 36.9350, lng: -76.3010 },
      { lat: 36.9310, lng: -76.3120 },
      { lat: 36.9290, lng: -76.3250 },
      { lat: 36.9330, lng: -76.3350 },
      { lat: 36.9410, lng: -76.3390 },
      { lat: 36.9500, lng: -76.3400 },
    ],
  },
  {
    name: 'NAS Oceana',
    coords: [
      { lat: 36.8350, lng: -76.0480 },
      { lat: 36.8340, lng: -76.0250 },
      { lat: 36.8300, lng: -76.0120 },
      { lat: 36.8220, lng: -76.0070 },
      { lat: 36.8140, lng: -76.0080 },
      { lat: 36.8090, lng: -76.0150 },
      { lat: 36.8080, lng: -76.0320 },
      { lat: 36.8100, lng: -76.0470 },
      { lat: 36.8170, lng: -76.0510 },
      { lat: 36.8270, lng: -76.0510 },
    ],
  },
  {
    name: 'JEB Little Creek-Fort Story',
    coords: [
      { lat: 36.9280, lng: -76.1820 },
      { lat: 36.9270, lng: -76.1600 },
      { lat: 36.9230, lng: -76.1420 },
      { lat: 36.9170, lng: -76.1350 },
      { lat: 36.9110, lng: -76.1380 },
      { lat: 36.9080, lng: -76.1500 },
      { lat: 36.9070, lng: -76.1680 },
      { lat: 36.9090, lng: -76.1800 },
      { lat: 36.9150, lng: -76.1860 },
      { lat: 36.9220, lng: -76.1850 },
    ],
  },
  {
    name: 'Norfolk Naval Shipyard',
    coords: [
      { lat: 36.8400, lng: -76.3060 },
      { lat: 36.8390, lng: -76.2960 },
      { lat: 36.8350, lng: -76.2910 },
      { lat: 36.8280, lng: -76.2890 },
      { lat: 36.8210, lng: -76.2910 },
      { lat: 36.8190, lng: -76.2980 },
      { lat: 36.8200, lng: -76.3050 },
      { lat: 36.8250, lng: -76.3080 },
      { lat: 36.8330, lng: -76.3080 },
    ],
  },
  {
    name: 'Dam Neck Annex',
    coords: [
      { lat: 36.8140, lng: -75.9760 },
      { lat: 36.8130, lng: -75.9640 },
      { lat: 36.8080, lng: -75.9570 },
      { lat: 36.8000, lng: -75.9560 },
      { lat: 36.7940, lng: -75.9590 },
      { lat: 36.7930, lng: -75.9700 },
      { lat: 36.7970, lng: -75.9770 },
      { lat: 36.8060, lng: -75.9780 },
    ],
  },
  {
    name: 'Langley AFB (JBLE)',
    coords: [
      { lat: 37.0970, lng: -76.3750 },
      { lat: 37.0960, lng: -76.3560 },
      { lat: 37.0920, lng: -76.3420 },
      { lat: 37.0850, lng: -76.3380 },
      { lat: 37.0780, lng: -76.3400 },
      { lat: 37.0740, lng: -76.3510 },
      { lat: 37.0740, lng: -76.3670 },
      { lat: 37.0790, lng: -76.3760 },
      { lat: 37.0870, lng: -76.3790 },
      { lat: 37.0940, lng: -76.3780 },
    ],
  },
  {
    name: 'Fort Eustis (JBLE)',
    coords: [
      { lat: 37.1680, lng: -76.6220 },
      { lat: 37.1670, lng: -76.6020 },
      { lat: 37.1620, lng: -76.5850 },
      { lat: 37.1540, lng: -76.5790 },
      { lat: 37.1440, lng: -76.5800 },
      { lat: 37.1380, lng: -76.5900 },
      { lat: 37.1370, lng: -76.6080 },
      { lat: 37.1400, lng: -76.6200 },
      { lat: 37.1480, lng: -76.6250 },
      { lat: 37.1590, lng: -76.6260 },
    ],
  },
  {
    name: 'Naval Weapons Station Yorktown',
    coords: [
      { lat: 37.2450, lng: -76.5930 },
      { lat: 37.2430, lng: -76.5700 },
      { lat: 37.2370, lng: -76.5530 },
      { lat: 37.2280, lng: -76.5480 },
      { lat: 37.2170, lng: -76.5500 },
      { lat: 37.2120, lng: -76.5620 },
      { lat: 37.2130, lng: -76.5810 },
      { lat: 37.2180, lng: -76.5930 },
      { lat: 37.2280, lng: -76.5970 },
      { lat: 37.2380, lng: -76.5960 },
    ],
  },
  {
    name: 'Naval Medical Center Portsmouth',
    coords: [
      { lat: 36.8480, lng: -76.3060 },
      { lat: 36.8475, lng: -76.2990 },
      { lat: 36.8440, lng: -76.2960 },
      { lat: 36.8400, lng: -76.2970 },
      { lat: 36.8395, lng: -76.3030 },
      { lat: 36.8420, lng: -76.3070 },
      { lat: 36.8460, lng: -76.3075 },
    ],
  },
  {
    name: 'NSA Hampton Roads',
    coords: [
      { lat: 36.9370, lng: -76.3180 },
      { lat: 36.9365, lng: -76.3110 },
      { lat: 36.9330, lng: -76.3080 },
      { lat: 36.9290, lng: -76.3090 },
      { lat: 36.9280, lng: -76.3150 },
      { lat: 36.9310, lng: -76.3200 },
      { lat: 36.9350, lng: -76.3200 },
    ],
  },
  {
    name: 'Coast Guard Base Portsmouth',
    coords: [
      { lat: 36.8350, lng: -76.3160 },
      { lat: 36.8345, lng: -76.3100 },
      { lat: 36.8310, lng: -76.3080 },
      { lat: 36.8280, lng: -76.3090 },
      { lat: 36.8275, lng: -76.3140 },
      { lat: 36.8300, lng: -76.3170 },
      { lat: 36.8330, lng: -76.3170 },
    ],
  },
  {
    name: 'Northwest Annex',
    coords: [
      { lat: 36.7900, lng: -76.2580 },
      { lat: 36.7895, lng: -76.2510 },
      { lat: 36.7860, lng: -76.2470 },
      { lat: 36.7820, lng: -76.2480 },
      { lat: 36.7810, lng: -76.2540 },
      { lat: 36.7840, lng: -76.2590 },
      { lat: 36.7880, lng: -76.2600 },
    ],
  },
  {
    name: 'Camp Peary',
    coords: [
      { lat: 37.3050, lng: -76.6250 },
      { lat: 37.3030, lng: -76.6050 },
      { lat: 37.2960, lng: -76.5920 },
      { lat: 37.2860, lng: -76.5870 },
      { lat: 37.2760, lng: -76.5910 },
      { lat: 37.2720, lng: -76.6060 },
      { lat: 37.2750, lng: -76.6220 },
      { lat: 37.2830, lng: -76.6300 },
      { lat: 37.2940, lng: -76.6310 },
    ],
  },
  {
    name: 'Cheatham Annex',
    coords: [
      { lat: 37.2650, lng: -76.6080 },
      { lat: 37.2640, lng: -76.5950 },
      { lat: 37.2590, lng: -76.5870 },
      { lat: 37.2520, lng: -76.5860 },
      { lat: 37.2480, lng: -76.5930 },
      { lat: 37.2490, lng: -76.6060 },
      { lat: 37.2540, lng: -76.6110 },
      { lat: 37.2610, lng: -76.6110 },
    ],
  },
  {
    name: 'Fort Barfoot (Fort Pickett)',
    coords: [
      { lat: 37.0950, lng: -77.9800 },
      { lat: 37.0920, lng: -77.9450 },
      { lat: 37.0800, lng: -77.9200 },
      { lat: 37.0620, lng: -77.9100 },
      { lat: 37.0440, lng: -77.9150 },
      { lat: 37.0340, lng: -77.9350 },
      { lat: 37.0330, lng: -77.9600 },
      { lat: 37.0400, lng: -77.9800 },
      { lat: 37.0550, lng: -77.9920 },
      { lat: 37.0750, lng: -77.9930 },
    ],
  },
];

// Color mapping for listing status
// Pill background color — delegates to the shared listing-status helper so
// the entire site (map pills, sidebar pills, listing card badges, etc.)
// pulls from a single palette source of truth.
const getStatusColor = (status: string, contingent?: boolean): string =>
  getStatusPillBg(status, contingent);

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function MapClient() {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const clustererActiveRef = useRef<boolean>(false);
  const clusterIdleListenerRef = useRef<any>(null);
  const videoMarkersRef = useRef<Map<string, any>>(new Map());
  const infoWindowsRef = useRef<Map<string, any>>(new Map());
  const currentInfoWindowRef = useRef<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const boundsRef = useRef<any>(null);
  const fetchMapDataRef = useRef<((bounds: MapBounds) => Promise<void>) | null>(null);
  const basePolygonsRef = useRef<any[]>([]);

  const [mapActivated, setMapActivated] = useState(true);
  const [listings, setListings] = useState<MapListing[]>([]);
  const [showBases, setShowBases] = useState(false);
  const [showSold, setShowSold] = useState(false);
  const [videos, setVideos] = useState<MapVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MapListing | null>(
    null
  );
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
  });

  // Parse military filter from URL (?duty=...&commute=...&bah=...&paygrade=...&deps=...)
  // Computed once on mount; navigation re-mounts the component.
  const militaryFilter = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const duty = params.get('duty');
    if (!duty) return null;
    const station = getDutyStation(duty);
    if (!station) return null;
    return {
      station,
      commuteMin: parseInt(params.get('commute') || '30', 10) || 30,
      bahCap: parseInt(params.get('bah') || '0', 10) || 0,
      paygrade: params.get('paygrade') || '',
      deps: params.get('deps') === '1',
    };
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch listings and videos based on bounds and filters
  const fetchMapData = useCallback(
    async (bounds: MapBounds) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          sw_lat: bounds.sw_lat.toString(),
          sw_lng: bounds.sw_lng.toString(),
          ne_lat: bounds.ne_lat.toString(),
          ne_lng: bounds.ne_lng.toString(),
          ...(filters.type && { type: filters.type }),
          ...(filters.minPrice && { min_price: filters.minPrice }),
          ...(filters.maxPrice && { max_price: filters.maxPrice }),
          ...(filters.beds && { beds: filters.beds }),
          // When 'Show Sold' is on, request the full set of statuses including
          // recent closed sales. When off, omit the status param so the API
          // defaults to buyer-relevant only (Active/Pending/Contingent).
          ...(showSold && { status: 'Active,Pending,Contingent,Coming Soon,Under Contract,Sold,Closed' }),
        });

        const [listingsRes, videosRes] = await Promise.all([
          fetch(`/api/map-listings?${params}`),
          fetch(`/api/map-videos?${params}`),
        ]);

        if (!listingsRes.ok || !videosRes.ok) {
          throw new Error('Failed to fetch map data');
        }

        const listingsJson = await listingsRes.json();
        const videosJson = await videosRes.json();

        const fetchedListings: MapListing[] =
          listingsJson.listings || listingsJson || [];
        const fetchedVideos: MapVideo[] =
          videosJson.videos || videosJson || [];

        // Apply military filter if active (price ≤ BAH cap AND drive ≤ commute target)
        const filteredListings = militaryFilter
          ? fetchedListings.filter((l: MapListing) => {
              if (militaryFilter.bahCap > 0) {
                // BAH is monthly; convert to approx max purchase price.
                // 80% of BAH for P&I at ~6%/30yr VA loan ≈ 133× multiplier.
                const maxPrice = militaryFilter.bahCap * 133;
                if (l.price > maxPrice) return false;
              }
              if (typeof l.lat === 'number' && typeof l.lng === 'number') {
                const miles = distanceMiles(l.lat, l.lng, militaryFilter.station.lat, militaryFilter.station.lng);
                const driveMin = (miles * 1.3) / (30 / 60);
                if (driveMin > militaryFilter.commuteMin) return false;
              }
              return true;
            })
          : fetchedListings;
        setListings(filteredListings);
        // Only show video markers if fewer than 500 listings
        setVideos(fetchedListings.length < 500 ? fetchedVideos : []);
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setLoading(false);
      }
    },
    [filters, showSold]
  );

  // Keep a ref to the latest fetchMapData so the idle listener always uses current filters
  useEffect(() => {
    fetchMapDataRef.current = fetchMapData;
  }, [fetchMapData]);

  // Re-fetch when "Show Sold" toggles — pulls solds in or removes them.
  useEffect(() => {
    if (!boundsRef.current || !fetchMapDataRef.current) return;
    const b = boundsRef.current;
    fetchMapDataRef.current({
      sw_lat: b.getSouthWest().lat(),
      sw_lng: b.getSouthWest().lng(),
      ne_lat: b.getNorthEast().lat(),
      ne_lng: b.getNorthEast().lng(),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSold]);

  // Create marker SVG icon - returns data URI (used for video markers)
  const createMarkerIcon = (color: string, isVideo = false): string => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
      ${isVideo ? '<text x="16" y="20" font-size="12" fill="white" text-anchor="middle" font-weight="bold">&#9654;</text>' : ''}
    </svg>`;
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml,${encoded}`;
  };

  // Build a pill-shaped marker icon. When `price` is provided, the pill is
  // wider and contains the price label centered inside.
  const buildPillIcon = (color: string, price?: string): any => {
    if (price && typeof google !== 'undefined' && google.maps) {
      const w = Math.max(48, price.length * 8 + 14);
      const h = 22;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="10" fill="${color}" stroke="white" stroke-width="1.5"/><text x="${w/2}" y="15" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="white" text-anchor="middle">${price}</text></svg>`;
      return {
        url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(w, h),
        anchor: new google.maps.Point(w / 2, h / 2),
      };
    }
    // Compact pill (no price text) for zoomed-out views
    const w = 28, h = 14;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="6" fill="${color}" stroke="white" stroke-width="2"/></svg>`;
    if (typeof google !== 'undefined' && google.maps) {
      return {
        url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(w, h),
        anchor: new google.maps.Point(w / 2, h / 2),
      };
    }
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  // Google Maps API key for Script component
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Initialize the map - called by next/script onReady callback
  const initMap = useCallback(() => {
    if (!containerRef.current || mapRef.current) return;
    if (typeof google === 'undefined' || !google.maps) return;

    const map = new google.maps.Map(containerRef.current, {
      zoom: militaryFilter ? 11 : 10,
      center: militaryFilter
        ? { lat: militaryFilter.station.lat, lng: militaryFilter.station.lng }
        : { lat: 36.85, lng: -76.28 },
      mapTypeControl: true,
      streetViewControl: true,
      zoomControl: true,
      fullscreenControl: true,
      gestureHandling: 'greedy',
    });

    mapRef.current = map;

    // Force a resize so Google Maps detects container dimensions
    requestAnimationFrame(() => {
      google.maps.event.trigger(map, 'resize');
    });

    // Fetch initial data using bounds once the map is idle
    // (idle fires after initial render, more reliable than tilesloaded)
    google.maps.event.addListenerOnce(map, 'idle', () => {
      const bounds = map.getBounds();
      if (bounds) {
        boundsRef.current = bounds;
        const mapBounds: MapBounds = {
          sw_lat: bounds.getSouthWest().lat(),
          sw_lng: bounds.getSouthWest().lng(),
          ne_lat: bounds.getNorthEast().lat(),
          ne_lng: bounds.getNorthEast().lng(),
        };
        if (fetchMapDataRef.current) {
          fetchMapDataRef.current(mapBounds);
        }
      }
    });

    // Debounced idle listener for subsequent pan/zoom - uses ref for latest filters
    map.addListener('idle', () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        const newBounds = map.getBounds();
        if (newBounds) {
          boundsRef.current = newBounds;
          const mapBounds: MapBounds = {
            sw_lat: newBounds.getSouthWest().lat(),
            sw_lng: newBounds.getSouthWest().lng(),
            ne_lat: newBounds.getNorthEast().lat(),
            ne_lng: newBounds.getNorthEast().lng(),
          };
          if (fetchMapDataRef.current) {
            fetchMapDataRef.current(mapBounds);
          }
        }
      }, 300);
    });
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Render/remove military base polygons
  useEffect(() => {
    if (!mapRef.current || typeof google === 'undefined' || !google.maps) return;

    // Clear existing polygons
    basePolygonsRef.current.forEach((poly) => poly.setMap(null));
    basePolygonsRef.current = [];

    if (showBases) {
      MILITARY_BASES.forEach((base) => {
        const polygon = new google.maps.Polygon({
          paths: base.coords,
          strokeColor: '#dc2626',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#dc2626',
          fillOpacity: 0.25,
          map: mapRef.current,
        });

        // Info window on click
        const infoWindow = new google.maps.InfoWindow({
          content: `<div class="p-2 font-sans font-semibold text-sm">${base.name}</div>`,
        });

        polygon.addListener('click', (event: any) => {
          if (currentInfoWindowRef.current) {
            currentInfoWindowRef.current.close();
          }
          infoWindow.setPosition(event.latLng);
          infoWindow.open(mapRef.current);
          currentInfoWindowRef.current = infoWindow;
        });

        basePolygonsRef.current.push(polygon);
      });
    }
  }, [showBases]);

  // Render listing markers
  useEffect(() => {
    if (!mapRef.current || typeof google === 'undefined' || !google.maps) {
      return;
    }

    // Clear old listing markers from the clusterer (if present) and the map.
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.clear();
    // Close all InfoWindows EXCEPT the one currently open - preserves the
    // user's popup across listings refreshes triggered by map pan/zoom.
    infoWindowsRef.current.forEach((iw) => {
      if (iw !== currentInfoWindowRef.current) {
        iw.close();
      }
    });
    infoWindowsRef.current.clear();

    // Lazy-create the MarkerClusterer the first time we have markers.
    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map: mapRef.current,
        algorithm: new SuperClusterAlgorithm({
          // Always cluster across our usable zoom range. The defaults can stop
          // emitting clusters at very low zoom, which made markers disappear.
          radius: 80,
          minZoom: 0,
          maxZoom: 20,
          minPoints: 2,
        }),
        renderer: {
          render: ({ count, position }: any) => {
            // Tiered sizes for visual hierarchy at glance
            const size = count < 20 ? 36 : count < 100 ? 44 : count < 500 ? 52 : 60;
            const fontSize = count < 20 ? 13 : count < 100 ? 15 : 17;
            const fill = '#1d4ed8'; // blue-700, distinct from green/yellow listing pills
            const svg = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${size}\" height=\"${size}\" viewBox=\"0 0 ${size} ${size}\"><circle cx=\"${size/2}\" cy=\"${size/2}\" r=\"${size/2 - 3}\" fill=\"${fill}\" fill-opacity=\"0.92\" stroke=\"white\" stroke-width=\"3\"/><text x=\"${size/2}\" y=\"${size/2 + fontSize/3}\" font-family=\"Arial,sans-serif\" font-size=\"${fontSize}\" font-weight=\"700\" fill=\"white\" text-anchor=\"middle\">${count}</text></svg>`;
            return new google.maps.Marker({
              position,
              icon: {
                url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
                scaledSize: new google.maps.Size(size, size),
                anchor: new google.maps.Point(size/2, size/2),
              },
              zIndex: 1000 + count,
              label: undefined,
            });
          },
        },
      });
    }

    const PRICE_ZOOM_THRESHOLD = 11;
    const initialZoom = mapRef.current?.getZoom?.() ?? 10;
    const showPriceInitially = initialZoom >= PRICE_ZOOM_THRESHOLD;

    // Build new markers for each listing — but DON'T add to the map directly.
    // The MarkerClusterer below manages map membership and clusters dense areas.
    const newMarkers: any[] = [];
    listings.forEach((listing) => {
      const color = getStatusColor(listing.status, listing.contingent);
      const marker = new google.maps.Marker({
        position: { lat: listing.lat, lng: listing.lng },
        // map intentionally omitted — clusterer adds/removes as needed
        icon: buildPillIcon(color, showPriceInitially ? listing.priceFormatted : undefined),
        title: listing.address,
      });

      markersRef.current.set(listing.id, marker);
      newMarkers.push(marker);

      const photoHtml = (listing as any).photo
        ? `<a href="/listings/${listing.id}/${listing.slug}" style="display:block;width:100%;height:160px;overflow:hidden;background:#f3f4f6;"><img src="${(listing as any).photo}" alt="${listing.address}" style="width:100%;height:100%;object-fit:cover;display:block;" /></a>`
        : `<div style="width:100%;height:160px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:13px;font-style:italic;border-bottom:1px solid #e5e7eb;">No photos provided</div>`;
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="width:280px;font-family:sans-serif;">
            ${photoHtml}
            <div style="padding:12px;">
              <h3 style="font-size:18px;font-weight:700;margin:0 0 4px 0;">${listing.priceFormatted}</h3>
              <p style="font-size:13px;color:#374151;margin:0 0 2px 0;">${listing.address}</p>
              <p style="font-size:11px;color:#6b7280;margin:0;">${listing.city}, ${listing.state} ${listing.zip}</p>
              <div style="display:flex;gap:14px;margin:8px 0;font-size:12px;color:#374151;">
                <span>${listing.beds} Beds</span>
                <span>${listing.baths} Baths</span>
                <span>${listing.sqft.toLocaleString()} sqft</span>
              </div>
              <a href="/listings/${listing.id}/${listing.slug}" style="color:#2563eb;font-size:13px;font-weight:600;text-decoration:none;">View Details &rarr;</a>
            </div>
          </div>
        `,
      });

      infoWindowsRef.current.set(`listing-${listing.id}`, infoWindow);

      marker.addListener('click', () => {
        if (currentInfoWindowRef.current) {
          currentInfoWindowRef.current.close();
        }
        infoWindow.setPosition(marker.getPosition());
        infoWindow.open(mapRef.current);
        currentInfoWindowRef.current = infoWindow;
        setSelectedListing(listing);
      });
    });

    // Decide clustering once per listings refresh, based on the total
    // newMarkers.length. The /api/map-listings endpoint already returns only
    // what's in the visible bbox, so this is effectively the viewport count.
    // Above 500 -> cluster into blue circles; below -> show individual pills
    // (i.e. zoom in until fewer than 500 fit in the viewport, and the clusters
    // dissolve into per-listing pins).
    const SHOULD_CLUSTER_THRESHOLD = 500;
    if (newMarkers.length > SHOULD_CLUSTER_THRESHOLD) {
      // Cluster: hand markers to the clusterer (it manages map membership)
      for (const m of newMarkers) m.setMap(null);
      if (clustererRef.current) {
        clustererRef.current.addMarkers(newMarkers);
      }
    } else {
      // Below threshold: show individual pills directly on the map
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      for (const m of newMarkers) m.setMap(mapRef.current);
    }

        // Update pill icons when zoom crosses the price threshold
    const zoomListener = mapRef.current.addListener('zoom_changed', () => {
      const z = mapRef.current?.getZoom?.() ?? 10;
      const showPrice = z >= PRICE_ZOOM_THRESHOLD;
      markersRef.current.forEach((m, id) => {
        const l = listings.find((x) => x.id === id);
        if (!l) return;
        const c = getStatusColor(l.status, l.contingent);
        m.setIcon(buildPillIcon(c, showPrice ? l.priceFormatted : undefined));
      });
    });

    return () => {
      if (zoomListener && typeof google !== 'undefined' && google.maps) {
        google.maps.event.removeListener(zoomListener);
      }
    };
  }, [listings]);

  // Render video markers
  useEffect(() => {
    if (!mapRef.current || typeof google === 'undefined' || !google.maps) {
      return;
    }

    // Clear old video markers
    videoMarkersRef.current.forEach((marker) => marker.setMap(null));
    videoMarkersRef.current.clear();

    videos.forEach((video) => {
      const marker = new google.maps.Marker({
        position: { lat: video.lat, lng: video.lng },
        map: mapRef.current,
        icon: createMarkerIcon('#dc2626', true),
        title: video.title,
      });

      videoMarkersRef.current.set(video.id, marker);

      // Extract YouTube video ID
      const youtubeId = extractYoutubeId(video.youtube_url);

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="w-80 p-3 font-sans">
            <h3 class="text-lg font-bold mb-2">${video.title}</h3>
            <p class="text-sm text-gray-600 mb-3">${video.neighborhood}</p>
            <div class="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/${youtubeId}"
                title="${video.title}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        `,
      });

      infoWindowsRef.current.set(`video-${video.id}`, infoWindow);

      marker.addListener('click', () => {
        if (currentInfoWindowRef.current) {
          currentInfoWindowRef.current.close();
        }
        infoWindow.setPosition(marker.getPosition());
        infoWindow.open(mapRef.current);
        currentInfoWindowRef.current = infoWindow;
      });
    });
  }, [videos]);

  // Extract YouTube video ID from various URL formats
  const extractYoutubeId = (url: string): string => {
    try {
      const youtubeUrl = new URL(url);
      const id = youtubeUrl.searchParams.get('v');
      if (id) return id;
      // Handle youtu.be short links
      if (youtubeUrl.hostname === 'youtu.be') {
        return youtubeUrl.pathname.slice(1);
      }
    } catch {
      // Fallback regex parsing
      const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
      );
      if (match && match[1]) return match[1];
    }
    return '';
  };

  // Handle filter changes
  const handleFilterChange = (
    key: keyof FilterState,
    value: string
  ): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle search button click
  const handleSearch = (): void => {
    if (mapRef.current && boundsRef.current) {
      const bounds: MapBounds = {
        sw_lat: boundsRef.current.getSouthWest().lat(),
        sw_lng: boundsRef.current.getSouthWest().lng(),
        ne_lat: boundsRef.current.getNorthEast().lat(),
        ne_lng: boundsRef.current.getNorthEast().lng(),
      };
      fetchMapData(bounds);
    }
  };

  // Handle listing card click
  const handleListingClick = (listing: MapListing): void => {
    if (!mapRef.current || typeof google === 'undefined' || !google.maps) {
      return;
    }

    // Pan and zoom to listing
    mapRef.current.panTo({ lat: listing.lat, lng: listing.lng });
    mapRef.current.setZoom(16);

    // Open info window
    const marker = markersRef.current.get(listing.id);
    const infoWindow = infoWindowsRef.current.get(`listing-${listing.id}`);
    if (marker && infoWindow) {
      if (currentInfoWindowRef.current) {
        currentInfoWindowRef.current.close();
      }
      infoWindow.setPosition(marker.getPosition());
        infoWindow.open(mapRef.current);
      currentInfoWindowRef.current = infoWindow;
    }

    setSelectedListing(listing);

    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  return (
    <div
      className="flex w-full overflow-hidden bg-gray-100"
      style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }}
    >
      {/* Load Google Maps API only after user activates the map */}
      {mapActivated && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=marker`}
          strategy="afterInteractive"
          onReady={initMap}
        />
      )}

      {/* Map Container */}
      <div
        className={`${
          isMobile ? 'w-full' : 'w-3/5'
        } relative flex flex-col bg-white shadow-lg`}
      >
        {/* Filter Bar - only show after map is activated */}
        {mapActivated && (
          <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Property Type</option>
                <option value="Single Family">Single Family</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Land">Land</option>
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={filters.beds}
                onChange={(e) => handleFilterChange('beds', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Bedrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>

              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Search
              </button>

              <button
                onClick={() => setShowBases((prev) => !prev)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  showBases
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showBases ? 'Hide Bases' : 'Military Bases'}
              </button>

              <button
                onClick={() => setShowSold((prev) => !prev)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  showSold
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Show recent sold listings on the map"
              >
                {showSold ? 'Hide Sold' : 'Show Sold'}
              </button>
            </div>
          </div>
        )}

        {/* Static placeholder before map is activated */}
        {!mapActivated && (
          <div
            className="flex-1 relative cursor-pointer group"
            style={{ minHeight: '400px' }}
            onClick={() => setMapActivated(true)}
          >
            {/* Static map image centered on Hampton Roads */}
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=36.85,-76.28&zoom=10&size=1200x800&scale=2&maptype=roadmap&key=${mapsApiKey}`}
              alt="Hampton Roads area map"
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
            {/* Click-to-load overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 text-center max-w-sm mx-4">
                <div className="text-4xl mb-3">&#x1F5FA;&#xFE0F;</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Interactive Map Search
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Explore Hampton Roads listings with filters, military base overlays, and neighborhood video tours.
                </p>
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm group-hover:bg-blue-700 transition-colors">
                  <span>&#x1F50D;</span>
                  <span>Click to Explore the Map</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive map container - rendered after activation */}
        {mapActivated && (
          <div
            ref={containerRef}
            className="flex-1 relative"
            style={{ minHeight: '400px' }}
          />
        )}

        {/* Badge - Listing and Video Count (only after map is active) */}
        {mapActivated && (
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm font-semibold text-gray-800 z-10">
            <div>&#x1F4CD; {listings.length} Listings</div>
            {videos.length > 0 && (
              <div>&#x1F3A5; {videos.length} Video Tours</div>
            )}
          </div>
        )}

        {/* Mobile View Listings Button (only after map is active) */}
        {isMobile && mapActivated && (
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-medium z-10"
          >
            View Listings ({listings.length})
          </button>
        )}
      </div>

      {/* Desktop Listings Panel */}
      {!isMobile && (
        <div className="w-2/5 bg-white border-l border-gray-200 flex flex-col">
          {/* Pre-activation info panel */}
          {!mapActivated && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-5xl mb-4">&#x1F3E0;</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Hampton Roads Real Estate
              </h2>
              <p className="text-sm text-gray-600 mb-6 max-w-xs">
                Click the map to start exploring listings across Virginia Beach, Norfolk, Chesapeake, Suffolk, Hampton, and Newport News.
              </p>
              <button
                onClick={() => setMapActivated(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                Load Interactive Map
              </button>
            </div>
          )}

          {/* Post-activation listings */}
          {mapActivated && (
          <>
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">
              Properties ({listings.length})
            </h2>
            {loading && (
              <p className="text-sm text-gray-500 mt-1">Loading...</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {listings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No properties found. Adjust filters or zoom out.</p>
              </div>
            ) : (
              <div className="space-y-2 p-3">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => handleListingClick(listing)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedListing?.id === listing.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-blue-600 text-sm">
                          {listing.priceFormatted}
                        </h3>
                        <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                          {listing.address}
                        </p>
                        <p className="text-xs text-gray-500">
                          {listing.city}, {listing.state} {listing.zip}
                        </p>
                      </div>
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold text-white whitespace-nowrap"
                        style={{
                          backgroundColor: getStatusColor(listing.status, listing.contingent),
                        }}
                      >
                        {getDisplayStatus(listing.status, listing.contingent)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2 text-xs text-gray-600">
                      <span>&#x1F6CF;&#xFE0F; {listing.beds}</span>
                      <span>&#x1F6BF; {listing.baths}</span>
                      <span>
                        &#x1F4D0; {listing.sqft.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
          )}
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobile && drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto z-50">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">
                Properties ({listings.length})
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &#x2715;
              </button>
            </div>

            <div className="p-3">
              {listings.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p>No properties found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => handleListingClick(listing)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedListing?.id === listing.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-blue-600 text-sm">
                            {listing.priceFormatted}
                          </h3>
                          <p className="text-xs text-gray-700 mt-1 truncate">
                            {listing.address}
                          </p>
                          <p className="text-xs text-gray-500">
                            {listing.city}, {listing.state}
                          </p>
                        </div>
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold text-white whitespace-nowrap"
                          style={{
                            backgroundColor: getStatusColor(listing.status, listing.contingent),
                          }}
                        >
                          {getDisplayStatus(listing.status, listing.contingent)}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2 text-xs text-gray-600">
                        <span>&#x1F6CF;&#xFE0F; {listing.beds}</span>
                        <span>&#x1F6BF; {listing.baths}</span>
                        <span>
                          &#x1F4D0; {listing.sqft.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
