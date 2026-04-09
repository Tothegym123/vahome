'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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

export default function MapClient() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement | google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [listings, setListings] = useState<MapListing[]>([]);
  const [videos, setVideos] = useState<MapVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MapListing | null>(null);
  const [filter, setFilter] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: 36.85, lng: -76.28 },
      zoom: 10,
      mapId: 'vahome_map',
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeControl: true,
    });

    mapInstanceRef.current = mapInstance;

    // Debounced fetch on map idle
    const handleIdle = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        fetchListingsForBounds();
      }, 300);
    };

    mapInstance.addListener('idle', handleIdle);

    return () => {
      google.maps.event.clearListeners(mapInstance, 'idle');
    };
  }, [mapsLoaded]);

  // Fetch listings for current bounds
  const fetchListingsForBounds = useCallback(async () => {
    if (!mapInstanceRef.current) return;

    const bounds = mapInstanceRef.current.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    setLoading(true);
    try {
      const params = new URLSearchParams({
        sw_lat: sw.lat().toString(),
        sw_lng: sw.lng().toString(),
        ne_lat: ne.lat().toString(),
        ne_lng: ne.lng().toString(),
        limit: '500',
        ...(filter.type && { type: filter.type }),
        ...(filter.minPrice && { min_price: filter.minPrice }),
        ...(filter.maxPrice && { max_price: filter.maxPrice }),
        ...(filter.beds && { beds: filter.beds }),
      });

      const listingsRes = await fetch(`/api/map-listings?${params}`);
      const listingsData = await listingsRes.json();
      setListings(listingsData.listings || []);

      // Fetch videos only if listings < 500
      let fetchedVideos: MapVideo[] = [];
      if ((listingsData.listings || []).length < 500) {
        const videosRes = await fetch(
          `/api/map-videos?sw_lat=${sw.lat()}&sw_lng=${sw.lng()}&ne_lat=${ne.lat()}&ne_lng=${ne.lng()}`
        );
        const videosData = await videosRes.json();
        fetchedVideos = videosData.videos || [];
        setVideos(fetchedVideos);
      } else {
        setVideos([]);
      }

      renderMarkers(listingsData.listings || [], fetchedVideos);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Render markers on map
  const renderMarkers = useCallback((mapListings: MapListing[], mapVideos: MapVideo[]) => {
    if (!mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach((marker) => {
      if ('map' in marker) marker.map = null;
    });
    markersRef.current.clear();

    // Add listing markers
    mapListings.forEach((listing) => {
      const statusColor = getStatusColor(listing.status);
      const markerKey = `listing-${listing.id}`;

      // Try to use AdvancedMarkerElement if available
      if (google.maps.marker?.AdvancedMarkerElement) {
        const priceDiv = document.createElement('div');
        const priceLabel = listing.price >= 1000000
          ? '$' + (listing.price / 1000000).toFixed(1) + 'M'
          : '$' + Math.round(listing.price / 1000) + 'K';
        priceDiv.innerHTML = `
          <div style="background-color: ${statusColor}; padding: 4px 8px; border-radius: 9999px; color: white; font-size: 12px; font-weight: 600; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: pointer;">
            ${priceLabel}
          </div>
        `;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: listing.lat, lng: listing.lng },
          map: mapInstanceRef.current,
          content: priceDiv,
          title: listing.address,
        });

        marker.addListener('click', () => openListingInfo(listing));
        markersRef.current.set(markerKey, marker);
      } else {
        // Fallback to regular marker
        const marker = new google.maps.Marker({
          position: { lat: listing.lat, lng: listing.lng },
          map: mapInstanceRef.current,
          title: listing.address,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: statusColor,
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
        });

        marker.addListener('click', () => openListingInfo(listing));
        markersRef.current.set(markerKey, marker);
      }
    });

    // Add video markers only if < 500 listings
    if (mapListings.length < 500) {
      mapVideos.forEach((video) => {
        const videoKey = `video-${video.id}`;
        const videoDiv = document.createElement('div');
        videoDiv.innerHTML = `
          <div class="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition cursor-pointer">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
          </div>
        `;

        if (google.maps.marker?.AdvancedMarkerElement) {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: video.lat, lng: video.lng },
            map: mapInstanceRef.current,
            content: videoDiv,
            title: video.title,
          });

          marker.addListener('click', () => openVideoInfo(video));
          markersRef.current.set(videoKey, marker);
        } else {
          const marker = new google.maps.Marker({
            position: { lat: video.lat, lng: video.lng },
            map: mapInstanceRef.current,
            title: video.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#dc2626',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            },
          });

          marker.addListener('click', () => openVideoInfo(video));
          markersRef.current.set(videoKey, marker);
        }
      });
    }
  }, []);

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

  const openListingInfo = (listing: MapListing) => {
    setSelectedListing(listing);
    if (isMobile) {
      setShowDrawer(true);
    } else {
      const content = `
        <div class="max-w-xs">
          <p class="font-bold text-lg">$${listing.priceFormatted}</p>
          <p class="text-gray-700">${listing.address}</p>
          <p class="text-gray-600 text-sm mt-1">${listing.beds} bed &middot; ${listing.baths} bath &middot; ${listing.sqft?.toLocaleString()} sqft</p>
          <a href="/listings/${listing.id}/${listing.slug}" class="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">View Details</a>
        </div>
      `;

      if (infoWindowRef.current) infoWindowRef.current.close();
      infoWindowRef.current = new google.maps.InfoWindow({ content });
      infoWindowRef.current.open(mapInstanceRef.current, undefined);
      infoWindowRef.current.setPosition({ lat: listing.lat, lng: listing.lng });
    }
  };

  const openVideoInfo = (video: MapVideo) => {
    const youtubeId = extractYoutubeId(video.youtube_url);
    const content = `
      <div class="max-w-sm">
        <p class="font-bold text-lg">${video.title}</p>
        <p class="text-gray-600 text-sm">${video.neighborhood}</p>
        <iframe class="w-full h-auto mt-2 rounded" style="aspect-ratio: 16/9" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen></iframe>
      </div>
    `;

    if (infoWindowRef.current) infoWindowRef.current.close();
    infoWindowRef.current = new google.maps.InfoWindow({ content });
    infoWindowRef.current.open(mapInstanceRef.current, undefined);
    infoWindowRef.current.setPosition({ lat: video.lat, lng: video.lng });
  };

  const extractYoutubeId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const flyToListing = (listing: MapListing) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.panTo({ lat: listing.lat, lng: listing.lng });
    mapInstanceRef.current.setZoom(16);
    setSelectedListing(listing);
    openListingInfo(listing);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchListingsForBounds();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: Map (60% on desktop, full on mobile) */}
      <div className={`${isMobile ? 'w-full' : 'w-3/5'} flex flex-col`}>
        {/* Filter Bar */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={filter.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Type</option>
              <option value="Single Family">Single Family</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Land">Land</option>
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={filter.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filter.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />

            <select
              value={filter.beds}
              onChange={(e) => handleFilterChange('beds', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Beds</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>

            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* Map */}
        <div ref={mapRef} className="flex-1 relative">
          {loading && (
            <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded shadow-lg text-sm font-medium">
              Loading listings...
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded shadow-lg text-sm">
            <p className="font-medium">{listings.length} listings</p>
            {videos.length > 0 && <p className="text-gray-600">{videos.length} video tours</p>}
          </div>
          {isMobile && listings.length > 0 && (
            <button
              onClick={() => setShowDrawer(true)}
              className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg text-sm font-medium hover:bg-blue-700"
            >
              View Listings
            </button>
          )}
        </div>
      </div>

      {/* Right: Listings panel (40% on desktop, drawer on mobile) */}
      {!isMobile && (
        <div className="w-2/5 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {listings.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>Pan and zoom the map to see listings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => flyToListing(listing)}
                    className={`p-3 border rounded cursor-pointer transition ${
                      selectedListing?.id === listing.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-bold text-lg">${listing.priceFormatted}</p>
                    <p className="text-gray-700 text-sm mt-1">{listing.address}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {listing.beds} bed &middot; {listing.baths} bath &middot; {listing.sqft?.toLocaleString()} sqft
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded text-white ${
                          listing.status.toLowerCase() === 'active'
                            ? 'bg-green-600'
                            : listing.status.toLowerCase() === 'pending'
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                      >
                        {listing.status}
                      </span>
                      <a
                        href={`/listings/${listing.id}/${listing.slug}`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Details &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {isMobile && showDrawer && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex flex-col-reverse">
          <div className="bg-white rounded-t-lg max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="font-bold">Listings ({listings.length})</h3>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-3">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => {
                    flyToListing(listing);
                    setShowDrawer(false);
                  }}
                  className="p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                >
                  <p className="font-bold">${listing.priceFormatted}</p>
                  <p className="text-gray-700 text-sm">{listing.address}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {listing.beds} bed &middot; {listing.baths} bath &middot; {listing.sqft?.toLocaleString()} sqft
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
