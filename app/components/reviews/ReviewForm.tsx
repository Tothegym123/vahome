// app/components/reviews/ReviewForm.tsx
// =============================================================================
// Public review-submission form for neighborhood pages.
//
// Renders Cloudflare Turnstile widget; submits to /api/reviews/submit.
// On success, shows a "Thanks — we'll review it" confirmation card.
//
// Turnstile site key is read from NEXT_PUBLIC_TURNSTILE_SITE_KEY at build time.
// If not configured, the widget falls back to a hidden token of '' which the
// API will reject — that's intentional so we don't accept reviews from a
// half-configured deployment.
// =============================================================================
"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        selector: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

type Props = {
  neighborhoodSlug: string;
  neighborhoodName: string;
};

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export default function ReviewForm({ neighborhoodSlug, neighborhoodName }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [yearsLived, setYearsLived] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string>("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Render Turnstile after script load
  useEffect(() => {
    function tryRender() {
      if (!SITE_KEY) return;
      if (!window.turnstile || !widgetRef.current) return;
      if (widgetIdRef.current) return; // already rendered
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: SITE_KEY,
        theme: "light",
        callback: (t) => setToken(t),
        "error-callback": () => setToken(""),
        "expired-callback": () => setToken(""),
      });
    }
    tryRender();
    const interval = setInterval(tryRender, 500);
    return () => clearInterval(interval);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Please choose a rating from 1 to 5 stars.");
      return;
    }
    if (!pros.trim() && !cons.trim() && !title.trim()) {
      setError("Please share at least a title, pros, or cons.");
      return;
    }
    if (!token && SITE_KEY) {
      setError("Please complete the captcha.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          neighborhood_slug: neighborhoodSlug,
          rating,
          title: title.trim() || null,
          pros: pros.trim() || null,
          cons: cons.trim() || null,
          years_lived: yearsLived ? Number(yearsLived) : null,
          reviewer_name: name.trim(),
          reviewer_email: email.trim(),
          turnstile_token: token,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
      } else {
        const errMap: Record<string, string> = {
          rate_limit_ip: "You've already submitted the maximum number of reviews from this location today. Please try again tomorrow.",
          rate_limit_email: "You've already submitted the maximum reviews with this email today.",
          captcha_failed: "Captcha verification failed. Please try again.",
          captcha_required: "Please complete the captcha.",
          invalid_email: "That email doesn't look right.",
          invalid_rating: "Please pick a 1-5 star rating.",
          review_empty: "Please share at least a title, pros, or cons.",
        };
        setError(errMap[data.error] || "Something went wrong. Please try again.");
        // Reset captcha so user can retry
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
          setToken("");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <h3 className="text-lg font-semibold text-green-900">Thanks for sharing your experience!</h3>
        <p className="mt-2 text-sm text-green-800">
          Your review of {neighborhoodName} is in our moderation queue. We review submissions
          within 1-2 business days, and if approved it will appear on this page.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      <form onSubmit={onSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Write a review of {neighborhoodName}</h3>
        <p className="mt-1 text-sm text-gray-600">
          Your review helps other Hampton Roads families decide where to live. We review every
          submission before publishing.
        </p>

        <div className="mt-6 space-y-5">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Rating *</label>
            <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="text-3xl leading-none transition"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                  aria-checked={rating === n}
                  role="radio"
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  style={{
                    color: (hoverRating || rating) >= n ? "#f59e0b" : "#d1d5db",
                  }}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 self-center text-sm text-gray-600">
                {rating > 0 ? `${rating} of 5` : ""}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="rev-title" className="block text-sm font-medium text-gray-900">
              Headline (optional)
            </label>
            <input
              id="rev-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="e.g. Great neighborhood for Navy families"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Pros / Cons */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rev-pros" className="block text-sm font-medium text-gray-900">
                What you love
              </label>
              <textarea
                id="rev-pros"
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Schools, walkability, community, commute, parks..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="rev-cons" className="block text-sm font-medium text-gray-900">
                What could be better
              </label>
              <textarea
                id="rev-cons"
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Traffic, flooding, taxes, HOA, anything else..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Years lived */}
          <div>
            <label htmlFor="rev-years" className="block text-sm font-medium text-gray-900">
              Years lived in {neighborhoodName} (optional)
            </label>
            <input
              id="rev-years"
              type="number"
              step="0.5"
              min="0"
              max="100"
              value={yearsLived}
              onChange={(e) => setYearsLived(e.target.value)}
              placeholder="e.g. 5"
              className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Name + Email */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rev-name" className="block text-sm font-medium text-gray-900">
                Your name *
              </label>
              <input
                id="rev-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                maxLength={80}
                placeholder="First name + last initial works"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="rev-email" className="block text-sm font-medium text-gray-900">
                Your email * <span className="text-xs text-gray-500">(not displayed)</span>
              </label>
              <input
                id="rev-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Captcha */}
          <div ref={widgetRef} className="mt-2" />
          {!SITE_KEY && (
            <p className="text-xs text-amber-700">
              Captcha not yet configured. The form will not accept submissions until
              NEXT_PUBLIC_TURNSTILE_SITE_KEY is set in production.
            </p>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-md bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>
          <p className="text-xs text-gray-500">
            By submitting you agree your review may be displayed publicly with your first name.
            Your email will only be used for moderation and is never shown.
          </p>
        </div>
      </form>
    </>
  );
}
