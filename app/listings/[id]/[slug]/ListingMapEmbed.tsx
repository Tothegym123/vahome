// app/listings/[id]/[slug]/ListingMapEmbed.tsx
// =============================================================================
// Server-rendered Google Maps + Street View embed for the listing detail page.
//
// Why iframes (vs. the JS Maps API the site uses elsewhere): the listing-
// detail page is server-rendered, and we want the map to be a strong
// physical-location signal to Google's crawler before any client JS runs.
// Google's Maps Embed API (the iframe form) loads asynchronously and shows
// up in the DOM with a real google.com origin — exactly what crawlers can
// see and what address-knowledge-graph features are most likely to react to.
//
// Google Maps Embed API (free, no separate billing for /embed/v1):
//   https://developers.google.com/maps/documentation/embed/get-started
//
// Renders nothing if lat/lng aren't available — no point showing a blank
// embed for a listing whose geocoding failed.
// =============================================================================

const EMBED_BASE = "https://www.google.com/maps/embed/v1";

type Props = {
  lat: number | null | undefined;
  lng: number | null | undefined;
  address: string;
  city?: string;
};

function getKey(): string | undefined {
  // The same public Maps API key already used by /map and the homepage.
  // Restricted at the Google Cloud Console to vahome.com referrers.
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}

export default function ListingMapEmbed({ lat, lng, address, city }: Props) {
  const key = getKey();
  if (!key || typeof lat !== "number" || typeof lng !== "number" || (!lat && !lng)) {
    return null;
  }
  const coord = `${lat},${lng}`;
  const placeUrl = `${EMBED_BASE}/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(coord)}&zoom=15`;
  const streetUrl = `${EMBED_BASE}/streetview?key=${encodeURIComponent(key)}&location=${encodeURIComponent(coord)}&heading=210&pitch=10&fov=90`;
  const fullAddress = [address, city].filter(Boolean).join(", ");

  return (
    <section className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Location & Street View</h2>
      <p className="text-sm text-gray-600 mb-4">{fullAddress}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <iframe
            title={`Map of ${fullAddress}`}
            src={placeUrl}
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <iframe
            title={`Street View at ${fullAddress}`}
            src={streetUrl}
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Map and Street View imagery © Google. Imagery may not be current.
      </p>
    </section>
  );
}
