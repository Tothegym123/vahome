// app/lib/listing-status.ts
// =============================================================================
// Single source of truth for buyer-facing listing status labels and colors.
//
// The REIN MLS feed uses internal status labels that don't match consumer
// real estate vocabulary. This helper translates REIN's data into the labels
// buyers expect to see across the site (listing cards, detail pages, the map).
//
// Translation rules:
//   - REIN status='Active' + ContingencyExists='Contingent' -> "Under Contract"
//   - REIN status='Active' + no contingency                 -> "Active"
//   - REIN status='New Listing'                             -> "New Listing"
//   - REIN status='Under Contract'                          -> "Pending"
//   - REIN status='Sold'                                    -> "Sold"
//   - REIN status='Coming Soon'                             -> "Coming Soon"
//   - Anything else (Off Market, Rented, etc.)              -> passes through
//
// Why "Under Contract" vs "Pending":
//   In REIN, "Under Contract" is the post-contingency state where the deal is
//   firm — what most consumers know as "Pending." A truly contingent listing
//   (inspection pending, financing TBD, etc.) reads as "Active" in REIN's
//   status column with the contingency surfaced via ContingencyExists. To make
//   this legible to a normal buyer we relabel:
//     active+contingency -> "Under Contract" (yellow — deal in progress, may fall through)
//     under contract     -> "Pending" (orange — firm, very likely to close)
// =============================================================================

export type DisplayStatus =
  | "Active"
  | "New Listing"
  | "Under Contract"
  | "Pending"
  | "Sold"
  | "Coming Soon"
  | "Off Market"
  | "Rented"
  | "Unknown";

export function getDisplayStatus(
  status: string | null | undefined,
  contingent?: boolean | null,
): DisplayStatus {
  const s = (status ?? "").toLowerCase().trim();

  // Contingency override — only meaningful for non-terminal headline statuses.
  // A Sold/Off-Market/Rented listing's "contingency" is moot, so we ignore it.
  const isTerminal = s === "sold" || s === "off market" || s === "rented";
  if (contingent && !isTerminal) {
    // Active+contingent and New Listing+contingent both read as "Under Contract"
    // for buyer-facing display.
    if (s === "active" || s === "new listing" || s === "" || s === "contingent") {
      return "Under Contract";
    }
  }

  switch (s) {
    case "active":
      return "Active";
    case "new listing":
      return "New Listing";
    case "contingent":
      return "Under Contract";
    case "under contract":
      return "Pending";
    case "pending":
      return "Pending";
    case "sold":
      return "Sold";
    case "coming soon":
      return "Coming Soon";
    case "off market":
      return "Off Market";
    case "rented":
      return "Rented";
    default:
      return "Unknown";
  }
}

// Hex color for status pill backgrounds. Used by inline style across the
// site so every surface (map pills, sidebar pills, card photo overlays,
// detail-page tracker active state) renders the exact same byte-for-byte
// color value.
//
// Palette picked 2026-05-02: iOS system green/red + Bootstrap yellow/orange.
//   Active / New Listing  -> #34c759 (iOS system green)
//   Under Contract        -> #ffc107 (Bootstrap warning yellow — dark text)
//   Pending               -> #fd7e14 (Bootstrap orange)
//   Sold                  -> #ff3b30 (iOS system red)
//   Coming Soon           -> #007aff (iOS system blue, kept consistent with iOS picks)
//   Off Market / Rented   -> #6b7280 (neutral gray)
export function getDisplayStatusColor(display: DisplayStatus): string {
  switch (display) {
    case "Active":
    case "New Listing":
      return "#34c759";
    case "Under Contract":
      return "#ffc107";
    case "Pending":
      return "#fd7e14";
    case "Sold":
      return "#ff3b30";
    case "Coming Soon":
      return "#007aff";
    case "Off Market":
    case "Rented":
    case "Unknown":
    default:
      return "#6b7280";
  }
}

// Foreground text color for status pills. Yellow (#ffc107) needs dark text
// for accessibility/legibility; everything else uses white.
export function getDisplayStatusTextColor(display: DisplayStatus): string {
  if (display === "Under Contract") return "#1a1a1a";
  return "#ffffff";
}

// Convenience: pill colors keyed on (raw status, contingent) — wraps both
// getDisplayStatus and getDisplayStatusColor so callers can ask for the
// final pill color in one call.
export function getStatusPillBg(status: string | null | undefined, contingent?: boolean | null): string {
  return getDisplayStatusColor(getDisplayStatus(status, contingent));
}
export function getStatusPillFg(status: string | null | undefined, contingent?: boolean | null): string {
  return getDisplayStatusTextColor(getDisplayStatus(status, contingent));
}

// Tailwind class set for status pills/badges across the site. Used by listing
// cards, the city page badge, and PropertyDetailClient's status row.
export function getDisplayStatusBadgeClasses(display: DisplayStatus): string {
  switch (display) {
    case "Active":
    case "New Listing":
      return "bg-green-500 text-white";
    case "Under Contract":
      return "bg-yellow-500 text-white";
    case "Pending":
      return "bg-orange-500 text-white";
    case "Sold":
      return "bg-red-500 text-white";
    case "Coming Soon":
      return "bg-blue-500 text-white";
    case "Off Market":
    case "Rented":
    case "Unknown":
    default:
      return "bg-gray-500 text-white";
  }
}

// Convenience: derive contingent boolean from a Supabase row's `raw` JSONB.
export function isContingentFromRaw(raw: any): boolean {
  if (!raw) return false;
  const exists = raw.ContingencyExists;
  if (typeof exists === "string" && exists.trim().toLowerCase() === "contingent") {
    return true;
  }
  const text = raw.Contingencies;
  if (typeof text === "string" && text.trim().length > 0) {
    return true;
  }
  return false;
}
