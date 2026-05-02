// app/admin/reviews/AdminReviewsClient.tsx
// =============================================================================
// Moderation queue UI. Lists pending reviews by default; tabs switch to
// approved/rejected/spam/all.
//
// Each row has Approve / Reject buttons that POST to /api/admin/reviews/action.
// Optimistic UI: row is removed from the current tab on success.
// =============================================================================
"use client";

import { useEffect, useState, useCallback } from "react";

type AdminReview = {
  id: string;
  neighborhood_slug: string;
  rating: number;
  title: string | null;
  pros: string | null;
  cons: string | null;
  years_lived: number | null;
  reviewer_name: string;
  reviewer_email: string;
  status: "pending" | "approved" | "rejected" | "spam";
  created_at: string;
  ip_address: string | null;
};

const STATUS_TABS = [
  { key: "pending", label: "Pending", color: "bg-amber-100 text-amber-800" },
  { key: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { key: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { key: "spam", label: "Spam", color: "bg-gray-200 text-gray-700" },
  { key: "all", label: "All", color: "bg-blue-100 text-blue-800" },
] as const;

type StatusKey = typeof STATUS_TABS[number]["key"];

function StarRow({ value }: { value: number }) {
  return (
    <span className="text-amber-500" aria-label={`${value} stars`}>
      {"★".repeat(value)}
      <span className="text-gray-300">{"★".repeat(5 - value)}</span>
    </span>
  );
}

export default function AdminReviewsClient() {
  const [tab, setTab] = useState<StatusKey>("pending");
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`/api/admin/reviews?status=${tab}`, { cache: "no-store" });
      const data = await r.json();
      if (data.ok) setReviews(data.reviews);
      else setErr(data.error || "Load error");
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: "approve" | "reject") {
    setBusyIds((s) => new Set(s).add(id));
    try {
      const r = await fetch("/api/admin/reviews/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await r.json();
      if (data.ok) {
        if (tab === "pending") {
          setReviews((rs) => rs.filter((x) => x.id !== id));
        } else {
          load();
        }
      } else {
        alert("Failed: " + (data.error || "unknown"));
      }
    } catch {
      alert("Network error");
    } finally {
      setBusyIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review moderation</h1>
            <p className="text-sm text-gray-600">Approve, reject, or mark as spam.</p>
          </div>
          <button
            onClick={load}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                tab === t.key
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {err && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {err}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            No reviews in this tab.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <article key={r.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <StarRow value={r.rating} />
                    <span className="font-semibold text-gray-900">{r.reviewer_name}</span>
                    <span className="text-xs text-gray-500">&lt;{r.reviewer_email}&gt;</span>
                    {r.years_lived != null && (
                      <span className="text-xs text-gray-500">· {r.years_lived} yr</span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      STATUS_TABS.find((t) => t.key === r.status)?.color || "bg-gray-100 text-gray-700"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    /neighborhoods/<a href={`/neighborhoods/${r.neighborhood_slug}/`} className="text-blue-700 hover:underline" target="_blank" rel="noopener">{r.neighborhood_slug}</a>/ ·{" "}
                    <time dateTime={r.created_at}>
                      {new Date(r.created_at).toLocaleString()}
                    </time>
                  </div>
                </header>

                {r.title && <h3 className="mt-3 text-base font-semibold text-gray-900">{r.title}</h3>}
                {r.pros && (
                  <div className="mt-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-green-700">Pros</div>
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-800">{r.pros}</p>
                  </div>
                )}
                {r.cons && (
                  <div className="mt-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-red-700">Cons</div>
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-800">{r.cons}</p>
                  </div>
                )}
                {r.ip_address && (
                  <div className="mt-3 text-xs text-gray-400">IP: {r.ip_address}</div>
                )}

                {(r.status === "pending" || r.status === "rejected" || r.status === "spam") && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => act(r.id, "approve")}
                      disabled={busyIds.has(r.id)}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      Approve
                    </button>
                    {r.status !== "rejected" && (
                      <button
                        onClick={() => act(r.id, "reject")}
                        disabled={busyIds.has(r.id)}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
