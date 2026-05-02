// app/components/AnalyticsEventTracker.tsx
// =============================================================================
// Sitewide GA4 event wiring for vahome.com.
//
// Mounted once in app/layout.tsx (after the GoogleAnalytics tag), this client
// component installs delegated event listeners that fire structured GA4 events
// for the actions that matter for lead-gen and listing engagement:
//
//   • phone_click       — any <a href="tel:..."> click anywhere on the site
//   • generate_lead     — any <form> submit (the canonical GA4 lead event)
//   • form_submit       — same trigger, structured-event form name
//   • listing_view      — when a /listings/[id]/[slug]/ page loads
//   • map_pin_click     — when an interactive-map pin / pill is clicked
//                          (looks for [data-listing-id] attribute on click)
//   • address_search    — when the search bar submits
//   • favorite_listing  — when a favorite/heart toggle fires
//
// Why delegated listeners on document.body: the listings page rerenders pins/
// cards constantly as the map moves, so per-element binding is fragile. We use
// event bubbling against the document body — works for new DOM nodes added
// after mount with zero re-binding.
//
// All events are sent through window.gtag, which is initialized by the
// @next/third-parties/google <GoogleAnalytics> tag in layout.tsx
// (GA4 measurement ID G-6DVKNGSKMB).
// =============================================================================
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const g = (window as unknown as { gtag?: GtagFn }).gtag;
  return typeof g === "function" ? g : null;
}

function fire(event: string, params: Record<string, unknown> = {}) {
  const gtag = getGtag();
  if (!gtag) return;
  try {
    gtag("event", event, {
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...params,
    });
  } catch {
    /* no-op */
  }
}

export default function AnalyticsEventTracker() {
  const pathname = usePathname();

  // Listing view event — fire when a /listings/[id]/[slug]/ page loads
  useEffect(() => {
    if (!pathname) return;
    const m = pathname.match(/^\/listings\/(\d+)\/([a-z0-9-]+)\/?$/);
    if (m) {
      fire("listing_view", {
        listing_id: m[1],
        listing_slug: m[2],
      });
    }
    // /va/ city pages
    const cityMatch = pathname.match(/^\/(?:va|listings)\/([a-z-]+)\/?$/);
    if (cityMatch && !m) {
      fire("city_page_view", { city_slug: cityMatch[1] });
    }
    // /neighborhoods/[slug]
    const nbhdMatch = pathname.match(/^\/neighborhoods\/([a-z0-9-]+)\/?$/);
    if (nbhdMatch) {
      fire("neighborhood_page_view", { neighborhood_slug: nbhdMatch[1] });
    }
  }, [pathname]);

  // Delegated click listener — phone clicks, map pins, favorite toggles
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (link) {
        const href = link.getAttribute("href") || "";
        fire("phone_click", {
          phone_number: href.replace(/^tel:/, ""),
          link_text: (link.textContent || "").trim().slice(0, 80),
        });
        return;
      }
      // Map pin / listing card click — anything carrying data-listing-id
      const pin = target.closest("[data-listing-id]") as HTMLElement | null;
      if (pin) {
        fire("map_pin_click", {
          listing_id: pin.getAttribute("data-listing-id") || "",
          listing_city: pin.getAttribute("data-listing-city") || "",
        });
        return;
      }
      // Favorite button — assumes [data-favorite] or aria-label includes "favorite"
      const fav = target.closest('[data-favorite], [aria-label*="favorite" i]') as HTMLElement | null;
      if (fav) {
        const id = fav.getAttribute("data-listing-id") || "";
        fire("favorite_listing", { listing_id: id });
      }
    }
    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Delegated form-submit listener — fires generate_lead + form_submit
  useEffect(() => {
    function onSubmit(e: Event) {
      const form = e.target as HTMLFormElement | null;
      if (!form || form.tagName !== "FORM") return;
      const formId = form.id || form.getAttribute("name") || "unknown";
      const formAction = form.getAttribute("action") || "";
      fire("generate_lead", {
        form_id: formId,
        form_action: formAction,
        value: 50.0,
        currency: "USD",
      });
      fire("form_submit", { form_id: formId });
    }
    document.addEventListener("submit", onSubmit, true);
    return () => document.removeEventListener("submit", onSubmit, true);
  }, []);

  // Delegated address-search submit — most search bars on the site dispatch a
  // submit on a form OR a dedicated change/keydown on an input. We catch
  // forms above; this handles the explicit address search input pattern.
  useEffect(() => {
    function onAddressSubmit(e: Event) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const inp = target as HTMLInputElement;
      if (
        inp.tagName === "INPUT" &&
        (inp.id === "addressSearch" ||
          /address/i.test(inp.getAttribute("placeholder") || "")) &&
        (e as KeyboardEvent).key === "Enter"
      ) {
        fire("address_search", { query: (inp.value || "").slice(0, 120) });
      }
    }
    document.addEventListener("keydown", onAddressSubmit);
    return () => document.removeEventListener("keydown", onAddressSubmit);
  }, []);

  return null;
}
