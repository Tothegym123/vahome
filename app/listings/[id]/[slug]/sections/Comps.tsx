'use client';

import { useEffect, useState } from 'react';
import CompCard from './CompCard';

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

interface CompsResponse {
  active: Comp[];
  sold: Comp[];
  fallback: { active: boolean; sold: boolean };
}

interface CompsProps {
  mlsNumber: string;
}

type Tab = 'active' | 'sold';

export default function Comps({ mlsNumber }: CompsProps) {
  const [data, setData] = useState<CompsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('active');

  useEffect(() => {
    let cancelled = false;
    if (!mlsNumber) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/comps/${encodeURIComponent(mlsNumber)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: CompsResponse) => {
        if (!cancelled) setData(json);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mlsNumber]);

  const list = data ? (tab === 'active' ? data.active : data.sold) : [];
  const isFallback = data ? (tab === 'active' ? data.fallback.active : data.fallback.sold) : false;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold text-gray-900">Comparable Properties</h2>
        <div className="inline-flex rounded-lg bg-gray-100 p-1" role="tablist" aria-label="Comp type">
          <button
            role="tab"
            aria-selected={tab === 'active'}
            onClick={() => setTab('active')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active
            {data && data.active.length > 0 && (
              <span className="ml-1.5 text-xs text-gray-400">{data.active.length}</span>
            )}
          </button>
          <button
            role="tab"
            aria-selected={tab === 'sold'}
            onClick={() => setTab('sold')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'sold' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recently Sold
            {data && data.sold.length > 0 && (
              <span className="ml-1.5 text-xs text-gray-400">{data.sold.length}</span>
            )}
          </button>
        </div>
      </div>

      {isFallback && !loading && list.length > 0 && (
        <p className="text-xs text-gray-500 mb-3">
          Showing nearby matches with a relaxed similarity envelope — no exact matches in {tab === 'active' ? 'active inventory' : 'recent sales'}.
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg animate-pulse h-72" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-gray-500">
          Couldn&apos;t load comparable properties right now. {error}
        </p>
      )}

      {!loading && !error && list.length === 0 && (
        <p className="text-sm text-gray-500">
          No comparable {tab === 'active' ? 'active listings' : 'recent sales'} found in this area.
        </p>
      )}

      {!loading && !error && list.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((c) => (
            <CompCard key={c.id} comp={c} mode={tab} />
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 leading-relaxed">
        Comps are selected by city, bed count, square footage and price proximity. Composite similarity score weights bed match, sqft variance, price variance, and straight-line distance.
      </p>
    </div>
  );
}
