// app/lib/reviews.ts
// =============================================================================
// Server-side fetcher for approved neighborhood reviews + aggregate stats.
//
// Runs through the public Supabase client (anon key). RLS allows reading rows
// where status='approved', so this works without leaking pending reviews.
// =============================================================================

import { createClient } from '@supabase/supabase-js';

export type ReviewRow = {
  id: string;
  neighborhood_slug: string;
  rating: number;
  title: string | null;
  pros: string | null;
  cons: string | null;
  years_lived: number | null;
  reviewer_name: string;
  created_at: string;
};

export type ReviewAggregate = {
  count: number;
  average: number; // rounded to 1 decimal
};

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function getApprovedReviews(slug: string): Promise<ReviewRow[]> {
  const sb = publicClient();
  const { data, error } = await sb
    .from('neighborhood_reviews')
    .select('id, neighborhood_slug, rating, title, pros, cons, years_lived, reviewer_name, created_at')
    .eq('neighborhood_slug', slug)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) {
    console.error('[reviews] getApprovedReviews error', error);
    return [];
  }
  return (data || []) as ReviewRow[];
}

export function aggregateReviews(rows: ReviewRow[]): ReviewAggregate {
  if (!rows.length) return { count: 0, average: 0 };
  const sum = rows.reduce((acc, r) => acc + r.rating, 0);
  return {
    count: rows.length,
    average: Math.round((sum / rows.length) * 10) / 10,
  };
}
