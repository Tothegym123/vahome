// app/components/reviews/ReviewList.tsx
// =============================================================================
// Client-side display of approved neighborhood reviews with sort controls.
//
// Receives the full list of approved reviews from a server component and
// renders newest-first by default, with a toggle to switch to highest-rated.
// =============================================================================
"use client";

import { useMemo, useState } from "react";

export type DisplayReview = {
  id: string;
  rating: number;
  title: string | null;
  pros: string | null;
  cons: string | null;
  years_lived: number | null;
  reviewer_name: string;
  created_at: string;
};

type Props = {
  reviews: DisplayReview[];
  neighborhoodName: string;
};

function StarBar({ value }: { value: number }) {
  return (
    <span aria-label={`${value} out of 5`} className="text-amber-500">
      {"★".repeat(value)}
      <span className="text-gray-300">{"★".repeat(5 - value)}</span>
    </span>
  );
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ReviewList({ reviews, neighborhoodName }: Props) {
  const [sort, setSort] = useState<"newest" | "highest">("newest");

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (sort === "highest") {
      copy.sort((a, b) => b.rating - a.rating || +new Date(b.created_at) - +new Date(a.created_at));
    } else {
      copy.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    }
    return copy;
  }, [reviews, sort]);

  if (!reviews.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
        <p className="text-sm text-gray-600">
          No published reviews of {neighborhoodName} yet. Be the first to share your experience.
        </p>
      </div>
    );
  }

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <StarBar value={Math.round(avg)} />
          <span className="font-semibold">{avg.toFixed(1)}</span>
          <span className="text-gray-500">
            · {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <span>Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "highest")}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest rated</option>
          </select>
        </label>
      </div>

      <div className="space-y-4">
        {sorted.map((r) => (
          <article key={r.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-center gap-3">
                <StarBar value={r.rating} />
                <span className="font-semibold text-gray-900">{r.reviewer_name}</span>
                {r.years_lived != null && (
                  <span className="text-xs text-gray-500">
                    · Lived {r.years_lived} year{r.years_lived === 1 ? "" : "s"}
                  </span>
                )}
              </div>
              <time className="text-xs text-gray-500" dateTime={r.created_at}>
                {fmtDate(r.created_at)}
              </time>
            </header>
            {r.title && <h4 className="mt-2 text-base font-semibold text-gray-900">{r.title}</h4>}
            {r.pros && (
              <div className="mt-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-green-700">Pros</div>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-800">{r.pros}</p>
              </div>
            )}
            {r.cons && (
              <div className="mt-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-red-700">Cons</div>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-800">{r.cons}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
