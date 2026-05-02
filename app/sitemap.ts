import type { MetadataRoute } from "next";
import { CITY_SLUGS } from "./lib/cities";
import { NEIGHBORHOOD_SLUGS } from "./lib/neighborhoods";

const BASE = "https://vahome.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Top-level marketing/info pages
  const marketing: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/listings/", priority: 0.9, changeFrequency: "daily" },
    { path: "/map/", priority: 0.85, changeFrequency: "daily" },
    { path: "/about/", priority: 0.6, changeFrequency: "monthly" },
    { path: "/agents/", priority: 0.6, changeFrequency: "monthly" },
    { path: "/lenders/", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact/", priority: 0.6, changeFrequency: "monthly" },
    { path: "/sell/", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blog/", priority: 0.7, changeFrequency: "weekly" },
    { path: "/privacy/", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms/", priority: 0.3, changeFrequency: "yearly" },
  ];

  // Military Mode hub
  const militaryHub = [{ path: "/military/", priority: 0.95, changeFrequency: "weekly" as const }];

  // Military bases
  const bases = [
    "naval-station-norfolk",
    "nas-oceana",
    "jeb-little-creek-fort-story",
    "joint-base-langley-eustis",
  ];

  // Cluster pages per base
  const baseClusters = ["bases", "homes-near", "best-neighborhoods-near", "schools-near", "commute-to"];

  const baseClusterUrls = bases.flatMap((b) =>
    baseClusters.map((c) => ({
      path: `/military/${c}/${b}/`,
      priority: c === "bases" ? 0.85 : 0.8,
      changeFrequency: "weekly" as const,
    }))
  );

  // City neighborhood guides
  const cities = ["virginia-beach", "norfolk", "chesapeake", "portsmouth", "hampton", "newport-news", "suffolk", "williamsburg"];
  const cityUrls = cities.map((c) => ({
    path: `/military/military-friendly-neighborhoods/${c}/`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  // BAH paygrade pages
  const paygrades = ["e-5", "e-6", "o-3", "o-4", "o-5"];
  const bahUrls = paygrades.map((p) => ({
    path: `/military/bah/${p}/norfolk-mha/`,
    priority: 0.75,
    changeFrequency: "monthly" as const,
  }));

  // City listing landing pages — clean indexable URLs (companion to /listings/?city=)
  const cityListingUrls = CITY_SLUGS.map((slug) => ({
    path: `/listings/${slug}/`,
    priority: 0.85,
    changeFrequency: "daily" as const,
  }));

  // Neighborhood detail pages (80 — Hampton Roads neighborhoods)
  const neighborhoodUrls = NEIGHBORHOOD_SLUGS.map((slug) => ({
    path: `/neighborhoods/${slug}/`,
    priority: 0.7,
    changeFrequency: "daily" as const,
  }));

  // Other military pages
  const militaryOther = [
    { path: "/military/bah-calculator/hampton-roads/", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/military/va-loan-homes/hampton-roads/", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/military/pcs-to/hampton-roads/", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/military/pcs-checklist/hampton-roads/", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/military/relocation/hampton-roads/", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/military/flood-zones/hampton-roads/", priority: 0.75, changeFrequency: "monthly" as const },
  ];

  const all = [
    ...marketing,
    ...cityListingUrls,
    ...neighborhoodUrls,
    ...militaryHub,
    ...baseClusterUrls,
    ...cityUrls,
    ...bahUrls,
    ...militaryOther,
  ];

  return all.map((entry) => ({
    url: `${BASE}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
