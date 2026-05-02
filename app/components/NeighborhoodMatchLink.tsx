// app/components/NeighborhoodMatchLink.tsx
// =============================================================================
// Small server component that renders a "View [Neighborhood] homes →" link
// if the given name matches any known neighborhood from app/lib/neighborhoods.
//
// Used on the military-friendly-neighborhoods pages so each neighborhood card
// links to its detail page. Some military-page names are compound (e.g.
// "Pungo / Sandbridge / First Landing", "Bayside / Pembroke (Town Center)") —
// we tokenize on '/', strip parentheses, and emit a link for each token that
// resolves to a real neighborhood. Tokens that don't match render nothing.
// =============================================================================

import { NEIGHBORHOODS, type NeighborhoodData } from "../lib/neighborhoods";

function slugifyToken(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findNeighborhoodsByName(rawName: string): NeighborhoodData[] {
  if (!rawName) return [];
  // Split on '/', drop parenthetical "(Town Center)" suffixes, trim.
  const tokens = rawName
    .split(/\//)
    .map((t) => t.replace(/\([^)]*\)/g, "").trim())
    .filter(Boolean);

  const matched: NeighborhoodData[] = [];
  const seen = new Set<string>();
  for (const t of tokens) {
    const slug = slugifyToken(t);
    // Exact slug match first
    if (NEIGHBORHOODS[slug] && !seen.has(NEIGHBORHOODS[slug].slug)) {
      matched.push(NEIGHBORHOODS[slug]);
      seen.add(NEIGHBORHOODS[slug].slug);
      continue;
    }
    // Fuzzy match — slug starts with or equals the token, or displayName contains token
    const tLower = t.toLowerCase();
    for (const n of Object.values(NEIGHBORHOODS)) {
      if (seen.has(n.slug)) continue;
      if (n.slug === slug || n.slug.startsWith(slug + "-") || n.slug === slug + "-virginia-beach") {
        matched.push(n);
        seen.add(n.slug);
        break;
      }
      if (n.displayName.toLowerCase() === tLower) {
        matched.push(n);
        seen.add(n.slug);
        break;
      }
    }
  }
  return matched;
}

export default function NeighborhoodMatchLink({ name }: { name: string }) {
  const matches = findNeighborhoodsByName(name);
  if (matches.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {matches.map((n) => (
        <a
          key={n.slug}
          href={`/neighborhoods/${n.slug}/`}
          className="text-xs font-medium text-blue-700 hover:text-blue-900 hover:underline"
        >
          View {n.displayName} homes →
        </a>
      ))}
    </div>
  );
}
