'use client';

import FavoriteButton from '../../../../components/FavoriteButton';
import type { Listing } from '../../../../lib/listings';

interface StickyMobileBarProps {
  listing: Listing;
  onTourClick: () => void;
}

// Bottom sticky bar shown on mobile only. Three-up: Tour / Save / Contact.
// Lifts above the iOS home indicator via env(safe-area-inset-bottom).
export default function StickyMobileBar({ listing, onTourClick }: StickyMobileBarProps) {
  const contactHref = `/contact?intent=info&address=${encodeURIComponent(
    `${listing.address}, ${listing.city}, ${listing.state || 'VA'} ${listing.zip || ''}`
  )}&mls=${listing.mlsNumber || ''}`;

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="toolbar"
      aria-label="Listing actions"
    >
      <div className="grid grid-cols-3 gap-2 px-3 py-2">
        <button
          onClick={onTourClick}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center"
        >
          Tour
        </button>
        <div className="flex items-center justify-center">
          <FavoriteButton listingId={listing.id} listingData={listing} size="md" />
        </div>
        <a
          href={contactHref}
          className="bg-white border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-lg text-sm flex items-center justify-center"
        >
          Contact
        </a>
      </div>
    </div>
  );
}
