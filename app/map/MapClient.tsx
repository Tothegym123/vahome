'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

// Color mapping for listing status
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return '#22c55e'; // green
    case 'pending':
      return '#eab308'; // yellow
    case 'sold':
      return '#ef4444'; // red
    default:
      return '#6366f1'; // indigo
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function MapClient() {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const videoMarkersRef = useRef<Map<string, any>>(new Map());
  const infoWindowsRef = useRef<Map<string, any>>(new Map());
  const currentInfoWindowRef = useRef<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const boundsRef = useRef<any>(null);

  const [listings, setListings] = useState<MapListing[]>([]);
  const [videos, setVideos] = useState<MapVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MapListing | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
  });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch listings and videos based on bounds and filters
  const fetchMapData = useCallback(async (bounds: MapBounds) => {
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

      const fetchedListings: MapListing[] = listingsJson.listings || listingsJson || [];
      const fetchedVideos: MapVideo[] = videosJson.videos || videosJson || [];

      setListings(fetchedListings);
      // Only show video markers if fewer than 500 listings
      setVideos(fetchedListings.length < 500 ? fetchedVideos : []);
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create marker SVG icon - returns data URI
  const createMarkerIcon = (color: string, isVideo = false): string => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
      ${isVideo ? '<text x="16" y="20" font-size="12" fill="white" text-anchor="middle" font-weight="bold">▶</text>' : ''}
    </svg>`;
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml,${encoded}`;
  };

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!containerRef.current || typeof google === 'undefined' || !google.maps) {
      return;
    }

    if (mapRef.current) {
      return; // Already initialized
    }

    const map = new google.maps.Map(containerRef.current, {
      zoom: 10,
      center: { lat: 36.85, lng: -76.28 },
      mapTypeControl: true,
      streetViewControl: true,
      zoomControl: true,
      fullscreenControl: true,
    });

    mapRef.current = map;
    boundsRef.current = map.getBounds() || null;

    // Fetch initial data
    if (boundsRef.current) {
      const bounds: MapBounds = {
        sw_lat: boundsRef.current.getSouthWest().lat(),
        sw_lng: boundsRef.current.getSouthWest().lng(),
        ne_lat: boundsRef.current.getNorthEast().lat(),
        ne_lng: boundsRef.current.getNorthEast().lng(),
      };
      fetchMapData(bounds);
    }

    // Handle map idle (bounds changed, zoom changed, etc.)
    map.addListener('idle', () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const newBounds = map.getBounds();
        if (newBounds) {
          boundsRef.current = newBounds;
          const bounds: MapBounds = {
            sw_lat: newBounds.getSouthWest().lat(),
            sw_lng: newBounds.getSouthWest().lng(),
            ne_lat: newBounds.getNorthEast().lat(),
            ne_lng: newBounds.getNorthEast().lng(),
          };
          fetchMapData(bounds);
        }
      }, 300);
    });
  }, [fetchMapData]);

  // Load Google Maps script with proper race condition fix
  useEffect(() => {
    // If google maps already loaded, init immediately
    if (typeof google !== 'undefined' && google.maps) {
      initializeMap();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) {
      // Script exists but may not be loaded yet - poll for google.maps
      const interval = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          clearInterval(interval);
          initializeMap();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    // Load script fresh
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => initializeMap();
    script.onerror = () => console.error('Failed to load Google Maps API');
    document.head.appendChild(script);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [initializeMap]);

  // Render listing markers
  useEffect(() => {
    if (!mapRef.current || typeof google === 'undefined' || !google.maps) {
      return;
    }

    // Clear old listing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.clear();
    infoWindowsRef.current.forEach((iw) => iw.close());
    infoWindowsRef.current.clear();

    // Create new markers for each listing
    listings.forEach((listing) => {
      const color = getStatusColor(listing.status);
      const marker = new google.maps.Marker({
        position: { lat: listing.lat, lng: listing.lng },
        map: mapRef.current,
        icon: createMarkerIcon(color),
        title: listing.address,
      });

      markersRef.current.set(listing.id, marker);

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="w-64 p-3 font-sans">
            <h3 class="text-lg font-bold">${listing.priceFormatted}</h3>
            <p class="text-sm text-gray-700">${listing.address}</p>
            <p class="text-xs text-gray-600">${listing.city}, ${listing.state} ${listing.zip}</p>
            <div class="flex gap-4 my-2 text-xs">
              <span>🛏️ ${listing.beds} Beds</span>
              <span>🚿 ${listing.baths} Baths</span>
              <span>📐 ${listing.sqft.toLocaleString()} sqft</span>
            </div>
            <a href="/listings/${listing.id}/${listing.slug}" class="text-blue-600 hover:text-blue-800 text-sm font-semibold">View Details →</a>
          </div>
        `,
      });

      infoWindowsRef.current.set(`listing-${listing.id}`, infoWindow);

      marker.addListener('click', () => {
        if (currentInfoWindowRef.current) {
          currentInfoWindowRef.current.close();
        }
        infoWindow.open(mapRef.current, marker);
        currentInfoWindowRef.current = infoWindow;
        setSelectedListing(listing);
      });
    });
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
        infoWindow.open(mapRef.current, marker);
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
      infoWindow.open(mapRef.current, marker);
      currentInfoWindowRef.current = infoWindow;
    }

    setSelectedListing(listing);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Map Container */}
      <div
        className={`${
          isMobile ? 'w-full' : 'w-3/5'
        } relative flex flex-col bg-white shadow-lg`}
      >
        {/* Filter Bar */}
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
          </div>
        </div>

        {/* Map */}
        <div
          ref={containerRef}
          className="flex-1 relative"
          style={{ minHeight: '400px' }}
        />

        {/* Badge - Listing and Video Count */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm font-semibold text-gray-800 z-10">
          <div>📍 {listings.length} Listings</div>
          {videos.length > 0 && <div>🎥 {videos.length} Video Tours</div>}
        </div>

        {/* Mobile View Listings Button */}
        {isMobile && (
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
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">
              Properties ({listings.length})
            </h2>
            {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
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
                        style={{ backgroundColor: getStatusColor(listing.status) }}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2 text-xs text-gray-600">
                      <span>🛏️ {listing.beds}</span>
                      <span>🚿 {listing.baths}</span>
                      <span>📐 {listing.sqft.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
              <h2 className="text-lg font-bold">Properties ({listings.length})</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
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
                          style={{ backgroundColor: getStatusColor(listing.status) }}
                        >
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2 text-xs text-gray-600">
                        <span>🛏️ {listing.beds}</span>
                        <span>🚿 {listing.baths}</span>
                        <span>📐 {listing.sqft.toLocaleString()} sqft</span>
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
