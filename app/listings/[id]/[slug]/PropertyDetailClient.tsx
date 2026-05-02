'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDisplayStatus, getDisplayStatusColor, getDisplayStatusTextColor, type DisplayStatus } from '../../../lib/listing-status';
import ListingMapEmbed from './ListingMapEmbed';
import { CITIES, citySlugFromName } from '../../../lib/cities';
import { Listing, formatPriceFull, formatPrice, getFullAddress } from '../../../lib/listings';
import FavoriteButton from '../../../components/FavoriteButton'
import { createClient } from '../../../lib/supabase/client'
import CommuteTimes from '../../../components/CommuteTimes';
import PhotoGallery from '../../../components/PhotoGallery';

interface PropertyDetailClientProps {
  listing: Listing;
}

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: string;
  iconBg: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  id,
  title,
  icon,
  iconBg,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <span className="text-lg">{icon}</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 flex-1 text-left">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-5 py-3">{children}</div>}
    </div>
  );
}

function DetailGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      {items.map((item, idx) => (
        <div key={idx}>
          <p className="text-sm text-gray-500 mb-0.5">{item.label}</p>
          <p className="text-base font-medium text-gray-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function SchoolCard({ label, school }: { label: string; school: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-base font-semibold text-gray-500 mb-2">{label}</p>
      <p className="text-lg font-medium text-gray-900">{school || 'N/A'}</p>
    </div>
  );
}



// Convert REIN's ALL-CAPS address strings into Title Case for display, while
// preserving the address itself (numbers, punctuation, common suffixes work).
function titleCaseAddress(s: string): string {
  if (!s) return '';
  return s
    .toLowerCase()
    .split(/(\s+|,|-)/)
    .map((part) => {
      if (/^\s+|,|-$/.test(part)) return part;
      // Keep state abbreviations uppercase (VA, NC, MD, etc.)
      if (/^(va|nc|md|dc|pa|ny|tn|wv|ky|sc)$/i.test(part)) return part.toUpperCase();
      return part.replace(/\b([a-z])/g, (c) => c.toUpperCase());
    })
    .join('');
}

// Take just the street portion (everything before the first comma).
function streetOnly(addr: string): string {
  return (addr || '').split(',')[0].trim();
}

/* -- Listing Status Tracker -- */

function ListingStatusTracker({ status, daysOnMarket, contingent }: { status: string; daysOnMarket: number; contingent?: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Helper: convert a saturated #rrggbb to an rgba() with the given alpha,
  // used for the soft "inactive" tint on tracker pills (active pill keeps
  // the full saturated hex from the central palette).
  const withAlpha = (hex: string, alpha: number): string => {
    const m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  };

  // Single source of truth: status labels + their meanings. Colors are
  // derived at render time from the central palette in app/lib/listing-status,
  // so any palette change there propagates to this tracker automatically.
  const statuses: { label: DisplayStatus; desc: string }[] = [
    {
      label: 'Active',
      desc: 'The home is available with no accepted contracts',
    },
    {
      label: 'Under Contract',
      desc: 'Under contract with conditions (inspection, financing, etc.) and may return to market',
    },
    {
      label: 'Pending',
      desc: 'All contingencies removed; the sale is very likely to close',
    },
    {
      label: 'Sold',
      desc: 'The transaction has been completed',
    },
  ];

  const normalizedStatus = getDisplayStatus(status, contingent).toLowerCase();
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        {/* Info tooltip trigger */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            onBlur={() => setTimeout(() => setShowTooltip(false), 200)}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Status definitions"
            title="Click for status definitions"
          >
            ?
          </button>
          {showTooltip && (
            <div className="absolute left-0 top-8 z-50 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 text-left">
              <p className="text-sm font-semibold text-gray-800 mb-3">Listing Status Guide</p>
              {statuses.map((s) => {
                const bg = getDisplayStatusColor(s.label);
                const fg = getDisplayStatusTextColor(s.label);
                return (
                  <div key={s.label} className="mb-2.5 last:mb-0">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-semibold mr-2"
                      style={{ backgroundColor: bg, color: fg }}
                    >
                      {s.label}
                    </span>
                    <span className="text-xs text-gray-600 leading-relaxed">{s.desc}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status pills */}
        <div className="grid grid-cols-4 gap-2">
          {statuses.map((s) => {
            const isCurrent = normalizedStatus === s.label.toLowerCase();
            const sat = getDisplayStatusColor(s.label);
            const fg = getDisplayStatusTextColor(s.label);
            const style: React.CSSProperties = isCurrent
              ? {
                  backgroundColor: sat,
                  color: fg,
                  border: `1px solid ${sat}`,
                  boxShadow: `0 0 0 2px ${withAlpha(sat, 0.35)}`,
                }
              : {
                  backgroundColor: withAlpha(sat, 0.12),
                  color: sat,
                  border: `1px solid ${withAlpha(sat, 0.35)}`,
                  opacity: 0.6,
                };
            return (
              <div
                key={s.label}
                className="px-2 py-1 rounded-md text-center text-xs font-semibold transition-all"
                style={style}
              >
                {s.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Days on Market */}
      <p className="text-center text-sm text-gray-500 mt-2">
        {daysOnMarket} days on market
      </p>
    </div>
  );
}
/* ── Tour Scheduling Modal ── */

function getUpcomingDays(count: number): Array<{ date: Date; dayName: string; monthDay: string }> {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    days.push({ date: d, dayName, monthDay });
  }
  return days;
}

const TOUR_TIMES = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM',
];

function TourModal({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const allDays = getUpcomingDays(14);
  const [page, setPage] = useState(0);
  const daysPerPage = 3;
  const totalPages = Math.ceil(allDays.length / daysPerPage);
  const visibleDays = allDays.slice(page * daysPerPage, page * daysPerPage + daysPerPage);

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [step, setStep] = useState<'pick' | 'form' | 'done'>('pick');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tourType, setTourType] = useState<'in-person' | 'video'>('in-person');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const chosenDate = allDays[page * daysPerPage + selectedDay];

  const handleSubmit = async () => {
    setSubmitError(null)
    if (!email && !phone) {
      setSubmitError('Please provide an email or phone number so we can confirm.')
      return
    }
    try {
      const res = await fetch('/api/tour-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: chosenDate ? chosenDate.dayName + ' ' + chosenDate.monthDay : null,
          time: selectedTime,
          tour_type: tourType,
          mls_number: listing.mlsNumber || listing.id.toString(),
          listing_address: listing.address,
          listing_city: listing.city,
          listing_state: listing.state,
          listing_zip: listing.zip,
          listing_price: listing.price,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const errCode = data?.error || 'unknown'
        if (errCode === 'contact_required') {
          setSubmitError('Please provide an email or phone number so we can confirm.')
        } else {
          setSubmitError('Something went wrong. Please try again or call (757) 777-7577.')
        }
        return
      }
    } catch {
      setSubmitError('Network error. Please try again or call (757) 777-7577.')
      return
    }
    setStep('done')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            {step === 'done' ? 'Tour Requested!' : 'Schedule a Tour'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 'pick' && (
          <div className="p-6">
            {/* Tour Type Toggle */}
            <div className="flex rounded-lg border border-gray-200 mb-6 overflow-hidden">
              <button
                onClick={() => setTourType('in-person')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  tourType === 'in-person'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                In Person
              </button>
              <button
                onClick={() => setTourType('video')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  tourType === 'video'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Video Chat
              </button>
            </div>

            {/* Date Picker */}
            <p className="text-sm font-semibold text-gray-700 mb-3">Select a date</p>
            <div className="flex items-center gap-2 mb-5">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2 flex-1 justify-center">
                {visibleDays.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className={`flex-1 py-3 rounded-xl text-center transition-all border-2 ${
                      selectedDay === idx
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <p className={`text-xs font-bold ${selectedDay === idx ? 'text-blue-600' : 'text-gray-400'}`}>
                      {day.dayName}
                    </p>
                    <p className={`text-sm font-semibold mt-0.5 ${selectedDay === idx ? 'text-blue-700' : 'text-gray-800'}`}>
                      {day.monthDay}
                    </p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Time Picker */}
            <p className="text-sm font-semibold text-gray-700 mb-3">Select a time</p>
            <div className="relative mb-6">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                {TOUR_TIMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => setStep('form')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              Next
            </button>
          </div>
        )}

        {step === 'form' && (
          <div className="p-6">
            {/* Selected Summary */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  {chosenDate?.dayName} {chosenDate?.monthDay} at {selectedTime}
                </p>
                <p className="text-xs text-blue-600 capitalize">{tourType} tour</p>
              </div>
              <button onClick={() => setStep('pick')} className="ml-auto text-blue-600 hover:text-blue-800 text-xs font-semibold">
                Change
              </button>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 555-5555"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit */}
            <p className="text-xs text-gray-500 mt-3 leading-snug" data-tcpa="tcpa-consent-vahome">
            By submitting this form, you consent to be contacted by the VaHome Team and Tom &amp; Dariya Milan, LPT Realty by phone, text message, and email at the contact information provided, including via automated systems, regarding real estate inquiries and listings. Message and data rates may apply. Message frequency varies. Consent is not a condition of any purchase. Reply STOP to unsubscribe at any time. See our <a href="/privacy" className="underline">Privacy Policy</a> and <a href="/terms" className="underline">Terms</a>.
          </p>
            {submitError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {submitError}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={!name || !phone}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm mt-6"
            >
              Request Tour
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              By submitting, you agree to be contacted by the VaHome Team.
            </p>
          </div>
        )}

        {step === 'done' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">You&apos;re all set!</h4>
            <p className="text-sm text-gray-600 mb-2">
              Tour requested for <span className="font-semibold">{chosenDate?.dayName} {chosenDate?.monthDay}</span> at <span className="font-semibold">{selectedTime}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              The VaHome Team will reach out shortly to confirm your tour.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ── */

export default function PropertyDetailClient({ listing }: PropertyDetailClientProps) {
  const [showTourModal, setShowTourModal] = useState(false);
  const [selectedBase, setSelectedBase] = useState<{name: string; shortName: string; lat: number; lng: number; branch: string} | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<{driveMinutes: number; driveMiles: number} | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeExpanded, setAnalyzeExpanded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vahome_selected_base');
      if (saved) setSelectedBase(JSON.parse(saved));
    } catch {}
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedBase) return;
    if (analyzeResult) { setAnalyzeExpanded(prev => !prev); return; }
    setAnalyzeLoading(true);
    setAnalyzeExpanded(true);
    try {
      // Call our drive-times API which uses Google Maps Distance Matrix
      const resp = await fetch(`/api/drive-times?lat=${listing.lat}&lng=${listing.lng}&count=10`);
      const data = await resp.json();
      const match = data.bases?.find((b: any) => b.shortName === selectedBase.shortName);
      if (!match) throw new Error("Base not found in drive-times response");
      setAnalyzeResult({
        driveMinutes: match.driveMinutes,
        driveMiles: match.driveMiles,
      });
    } catch (err) { console.error('Analyze error:', err); }
    finally { setAnalyzeLoading(false); }
  }, [selectedBase, analyzeResult, listing.lat, listing.lng]);
    const photos = listing.photos && listing.photos.length > 0 ? listing.photos : [listing.img];
  const pricePerSqft = listing.sqft > 0 ? Math.round(listing.price / listing.sqft) : 0;
  const isActive = listing.status?.toLowerCase() === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tour Modal */}
      {showTourModal && (
        <TourModal listing={listing} onClose={() => setShowTourModal(false)} />
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">
            Home
          </a>
          <span>/</span>
          <a href="/listings" className="hover:text-gray-900">
            Virginia
          </a>
          <span>/</span>
          <a href={`/listings?city=${listing.city}`} className="hover:text-gray-900">
            {listing.city}
          </a>
          <span>/</span>
          <span>{listing.neighborhood || listing.subdivision}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{listing.address}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Main Column */}
          <div className="space-y-3">
            {/* Photo Gallery */}
          <PhotoGallery photos={photos} address={listing.address} />

          {/* Price Bar */}
                          <div className="bg-white rounded-xl border border-gray-100 px-6 py-3 mb-2">
                <ListingStatusTracker status={listing.status} contingent={listing.contingent} daysOnMarket={listing.daysOnMarket} />
              </div>

            {/* Military Analyze Button */}
            {selectedBase && (
              <div className="bg-white rounded-xl border-2 border-red-200 overflow-hidden transition-all duration-300">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzeLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-5 px-6 text-2xl transition-colors flex items-center justify-center gap-3"
                >
                  {analyzeLoading ? (
                    <>
                      <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Analyze</span>
                      {analyzeResult && (
                        <svg className={`w-5 h-5 ml-1 transition-transform ${analyzeExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </>
                  )}
                </button>
                {analyzeExpanded && analyzeResult && (
                  <div className="px-6 py-5 bg-red-50 border-t border-red-200">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-2xl">{selectedBase.branch === 'Navy' ? '\u2693' : selectedBase.branch === 'Air Force' ? '\u2708\uFE0F' : selectedBase.branch === 'Army' ? '\u2B50' : selectedBase.branch === 'Marines' ? '\uD83E\uDE96' : '\uD83C\uDFDB\uFE0F'}</span>
                      <span className="text-lg font-bold text-gray-900">Drive to {selectedBase.shortName}</span>
                    </div>
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <span className="text-4xl font-black text-red-600">{analyzeResult.driveMinutes}</span>
                        <p className="text-sm text-gray-500 mt-1">minutes</p>
                      </div>
                      <div className="w-px h-12 bg-red-200"></div>
                      <div className="text-center">
                        <span className="text-4xl font-black text-gray-800">{analyzeResult.driveMiles}</span>
                        <p className="text-sm text-gray-500 mt-1">miles</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">Estimated drive time via Google Maps</p>
                  </div>
                )}
              </div>
            )}

<div className="bg-white rounded-xl border border-gray-100 px-6 py-5 flex items-center justify-between">
              
              <p className="text-5xl font-bold text-gray-900">{formatPriceFull(listing.price)}</p>
              <FavoriteButton listingId={listing.id} listingData={listing} size="lg" />
            </div>

            {/* Address & MLS Info */}
            <div className="bg-white rounded-xl border border-gray-100 px-6 py-5">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{titleCaseAddress(streetOnly(listing.address))}</h1>
              <p className="text-gray-600 text-sm">
                {titleCaseAddress(listing.city)}, {(listing.state || 'VA').length === 2 ? (listing.state || 'VA').toUpperCase() : titleCaseAddress(listing.state || 'Virginia')} {listing.zip}
              </p>
              <p className="text-gray-500 text-base mt-3">
                MLS# {listing.mlsNumber} &middot; {listing.subdivision} &middot; {listing.county}
              </p>
            </div>

            {/* Key Stats */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-6 divide-x divide-gray-200">
                {[
                  { label: 'Beds', value: listing.beds.toString() },
                  { label: 'Baths', value: `${listing.baths}${listing.halfBaths ? `.${listing.halfBaths}` : ''}` },
                  { label: 'Sq Ft', value: listing.sqft.toLocaleString() },
                  { label: '$/Sq Ft', value: `$${pricePerSqft}` },
                  { label: 'Built', value: listing.yearBuilt.toString() },
                  { label: 'Garage', value: listing.garage.toString() },
                ].map((stat, idx) => (
                  <div key={idx} className="px-4 py-4 text-center">
                    <p className="text-lg text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Facts Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                listing.propertyType,
                listing.style,
                listing.stories && `${listing.stories} Story`,
                listing.hoaFee > 0 && `HOA: $${listing.hoaFee}/${listing.hoaFrequency}`,
                listing.waterfront && 'Waterfront',
              ]
                .filter(Boolean)
                .map((fact, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-base font-medium"
                  >
                    {fact}
                  </span>
                ))}
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              {/* Description */}
              <CollapsibleSection
                id="description"
                title="Description"
                icon={"\uD83D\uDCDD"}
                iconBg="bg-blue-100"
              
                  defaultOpen={true}>
                <p className="text-gray-700 text-lg leading-8">
                  {listing.remarks || listing.description || 'No description available.'}
                </p>
              </CollapsibleSection>

              {/* Property Details */}
              <CollapsibleSection
                id="property-details"
                title="Property Details"
                icon={"\uD83C\uDFE0"}
                iconBg="bg-green-100"
              
                  defaultOpen={true}>
                <DetailGrid
                  items={[
                    { label: 'Property Type', value: listing.propertyType },
                    { label: 'Style', value: listing.style },
                    { label: 'Stories', value: listing.stories.toString() },
                    { label: 'Year Built', value: listing.yearBuilt.toString() },
                    { label: 'Approx Sq Ft', value: listing.sqft.toLocaleString() },
                    { label: 'Bedrooms', value: listing.beds.toString() },
                    { label: 'Full Baths', value: listing.baths.toString() },
                    { label: 'Half Baths', value: listing.halfBaths.toString() },
                    { label: 'Fireplaces', value: listing.fireplaces.toString() },
                    { label: 'Lot Size', value: listing.lotSize },
                  ]}
                />
              </CollapsibleSection>

              {/* Construction & Exterior */}
              <CollapsibleSection
                id="construction"
                title="Construction &amp; Exterior"
                icon={"\uD83D\uDD28"}
                iconBg="bg-amber-100"
              >
                <DetailGrid
                  items={[
                    { label: 'Exterior', value: listing.construction.join(', ') || 'N/A' },
                    { label: 'Foundation', value: listing.foundation },
                    { label: 'Roof', value: listing.roof },
                    { label: 'Exterior Features', value: listing.exteriorFeatures.join(', ') || 'N/A' },
                    { label: 'Pool', value: listing.pool },
                    { label: 'Fencing', value: listing.fencing },
                    {
                      label: 'Waterfront',
                      value: listing.waterfront ? listing.waterfrontDescription : 'Not Waterfront',
                    },
                  ]}
                />
              </CollapsibleSection>

              {/* Interior Features */}
              <CollapsibleSection
                id="interior"
                title="Interior Features"
                icon={"\u2728"}
                iconBg="bg-purple-100"
              >
                <DetailGrid
                  items={[
                    { label: 'Flooring', value: listing.flooring.join(', ') || 'N/A' },
                    { label: 'Cooling', value: listing.cooling },
                    { label: 'Heating', value: listing.heating },
                    { label: 'Laundry', value: listing.laundry },
                    {
                      label: 'Interior Features',
                      value: listing.interiorFeatures.join(', ') || 'N/A',
                    },
                  ]}
                />
              </CollapsibleSection>

              {/* Appliances & Equipment */}
              {listing.appliancesIncluded && listing.appliancesIncluded.length > 0 && (
                <CollapsibleSection
                  id="appliances"
                  title="Appliances &amp; Equipment"
                  icon={"\u2699\uFE0F"}
                  iconBg="bg-slate-100"
                >
                  <div className="space-y-2">
                    {listing.appliancesIncluded.map((appliance, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-lg text-gray-700">
                        <span className="text-green-600 font-bold">{"\u2713"}</span>
                        <span>{appliance}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {/* Parking & Garage */}
              <CollapsibleSection
                id="parking"
                title="Parking &amp; Garage"
                icon={"\uD83D\uDE97"}
                iconBg="bg-blue-100"
              >
                <DetailGrid
                  items={[
                       { label: 'Garage', value: listing.garage > 0 ? 'Yes' : 'No' },
                    { label: 'Parking', value: listing.parkingFeatures.join(', ') || 'N/A' },
                  ]}
                />
              </CollapsibleSection>

              {/* Utilities */}
              <CollapsibleSection
                id="utilities"
                title="Utilities"
                icon={"\u26A1"}
                iconBg="bg-green-100"
              >
                <DetailGrid
                  items={[
                    { label: 'Water', value: listing.waterSource },
                    { label: 'Sewer', value: listing.sewer },
                    { label: 'Heating', value: listing.heating },
                    { label: 'Cooling', value: listing.cooling },
                  ]}
                />
              </CollapsibleSection>

              {/* Financial Details */}
              <CollapsibleSection
                id="financial"
                title="Financial Details"
                icon={"\uD83D\uDCB0"}
                iconBg="bg-amber-100"
              >
                <DetailGrid
                  items={[
                    { label: 'List Price', value: formatPriceFull(listing.price) },
                    { label: 'Price/Sq Ft', value: `$${pricePerSqft}` },
                    { label: 'Approx Taxes', value: `$${listing.taxAmount.toLocaleString()}/yr` },
                    {
                      label: 'HOA',
                      value:
                        listing.hoaFee > 0
                          ? `$${listing.hoaFee}/${listing.hoaFrequency}`
                          : 'None',
                    },
                  ]}
                />
              </CollapsibleSection>

              {/* Schools */}
              <CollapsibleSection
                id="schools"
                title="Schools"
                icon={"\uD83C\uDF93"}
                iconBg="bg-blue-100"
              >
                <div className="grid grid-cols-3 gap-4">
                  <SchoolCard label="Elementary School" school={listing.elementarySchool} />
                  <SchoolCard label="Middle School" school={listing.middleSchool} />
                  <SchoolCard label="High School" school={listing.highSchool} />
                </div>
              </CollapsibleSection>

              {/* Location & Zoning */}
              <CollapsibleSection
                id="location"
                title="Location &amp; Zoning"
                icon={"\uD83D\uDCCD"}
                iconBg="bg-red-100"
              >
                <DetailGrid
                  items={[
                    { label: 'County', value: listing.county },
                    { label: 'Subdivision', value: listing.subdivision },
                    { label: 'Directions', value: listing.directions },
                  ]}
                />
              </CollapsibleSection>

                {/* Military Base Commute Times */}
                <CollapsibleSection
                  id="commute-times"
                  title="Military Base Commute Times"
                  icon={"\uD83C\uDFDB\uFE0F"}
                  iconBg="bg-indigo-50"
                  defaultOpen={true}
                >
                  <CommuteTimes lat={listing.lat} lng={listing.lng} />
                </CollapsibleSection>

                {/* Embedded Google Map + Street View — gives Google a strong physical-location signal */}
                <ListingMapEmbed lat={listing.lat} lng={listing.lng} address={streetOnly(listing.address)} city={listing.city} />

                {/* City context — pulled from app/lib/cities.ts so the listing detail
                    inherits the same canonical city copy used on /listings/[city]/. */}
                {(() => {
                  const slug = citySlugFromName(listing.city);
                  const c = slug ? CITIES[slug] : undefined;
                  if (!c) return null;
                  return (
                    <section className="bg-white rounded-xl border border-gray-100 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">About buying in {c.displayName}</h2>
                      <p className="text-gray-700 leading-relaxed text-sm">{c.intro}</p>
                      <p className="mt-3 text-sm">
                        <a href={`/listings/${c.slug}/`} className="text-primary-600 hover:underline font-medium">
                          See more {c.displayName} homes for sale →
                        </a>
                      </p>
                    </section>
                  );
                })()}
            </div>

            {/* Footer Info */}
            <div className="bg-white rounded-xl border border-gray-100 px-6 py-5 text-center text-base text-gray-500">
              <p className="mb-2">
                {listing.listingOffice && !/^\d+$/.test(String(listing.listingOffice).trim()) && (
                  <>
                    Listed by{' '}
                    <span className="font-medium text-gray-700">{listing.listingOffice}</span>{' '}
                    &middot;{' '}
                  </>
                )}
                MLS#{' '}
                <span className="font-medium text-gray-700">{listing.mlsNumber}</span>
              </p>
              <p>Data provided by REIN MLS. Information deemed reliable but not guaranteed.</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit">
            {/* CTA Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {isActive ? 'ACTIVE LISTING' : 'SOLD'}
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-3">
                {formatPriceFull(listing.price)}
              </p>
              <p className="text-lg font-medium text-gray-700 mb-1">{listing.address}</p>
              <p className="text-sm text-gray-600 mb-6">
                {listing.city}, {listing.state} {listing.zip}
              </p>

              <button
                onClick={() => setShowTourModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-3"
              >
                Schedule a Tour
              </button>
              <a
                href={`/contact?intent=info&address=${encodeURIComponent(listing.address + ', ' + listing.city + ', ' + listing.state + ' ' + listing.zip)}&mls=${listing.mlsNumber || ''}`}
                className="block text-center w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-4 rounded-lg border-2 border-blue-600 transition-colors mb-4"
              >
                Request Info
              </a>
            </div>

            {/* Quick Facts Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Quick Facts</h3>
              <div className="space-y-3">
                {[
                  { label: 'Type', value: listing.type },
                  { label: 'Year Built', value: listing.yearBuilt.toString() },
                  { label: 'Lot Size', value: listing.lotSize },
                  { label: 'Taxes', value: `$${listing.taxAmount.toLocaleString()}/yr` },
                  {
                    label: 'HOA',
                    value: listing.hoaFee > 0 ? `${listing.hoaFee}/${listing.hoaFrequency || 'mo'}` : 'None',
                  },
                  { label: 'Parking', value: `${listing.garage} Car Garage` },
                  { label: 'Heating', value: listing.heating },
                  { label: 'Cooling', value: listing.cooling },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-base text-gray-600">{item.label}</span>
                    <span className="text-base font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
