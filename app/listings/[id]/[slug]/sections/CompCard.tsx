'use client';

import Image from 'next/image';

interface Comp {
  id: number;
  mls_number: string;
  address: string;
  street: string;
  city: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  lat: number | null;
  lng: number | null;
  photo: string | null;
  href: string;
  close_date?: string;
  sold_price?: number;
}

interface CompCardProps {
  comp: Comp;
  mode: 'active' | 'sold';
}

function fmtPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function fmtCloseDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

// Title-case the street portion only.
function titleCaseStreet(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    // Re-uppercase common direction abbreviations and unit markers
    .replace(/\b(N|S|E|W|Ne|Nw|Se|Sw)\b/g, (m) => m.toUpperCase())
    .replace(/(\bAve\b|\bSt\b|\bDr\b|\bRd\b|\bLn\b|\bCt\b|\bCir\b|\bBlvd\b|\bWay\b|\bPl\b|\bTer\b|\bPkwy\b)/gi, (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase());
}

export default function CompCard({ comp, mode }: CompCardProps) {
  const display = mode === 'sold' && comp.sold_price ? comp.sold_price : comp.price;
  const dateLine = mode === 'sold' && comp.close_date ? `Sold ${fmtCloseDate(comp.close_date)}` : null;

  return (
    <a
      href={comp.href}
      className="group block bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all overflow-hidden"
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {comp.photo ? (
          // Use plain <img> to avoid Next.js Image domain config friction —
          // photos already come from our own Vercel Blob CDN.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={comp.photo}
            alt={comp.street}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No photo
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              mode === 'sold'
                ? 'bg-gray-800 text-white'
                : comp.status === 'Active'
                ? 'bg-green-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {mode === 'sold' ? 'Sold' : comp.status}
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-lg font-bold text-gray-900">{fmtPrice(display)}</p>
        <p className="text-sm text-gray-700 mt-0.5 line-clamp-1">{titleCaseStreet(comp.street)}</p>
        <p className="text-xs text-gray-500 mt-2">
          {comp.beds} bd &middot; {comp.baths} ba &middot; {Number(comp.sqft).toLocaleString()} sqft
        </p>
        {dateLine && (
          <p className="text-xs text-gray-400 mt-1">{dateLine}</p>
        )}
      </div>
    </a>
  );
}
