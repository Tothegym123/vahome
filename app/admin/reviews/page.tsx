// app/admin/reviews/page.tsx
// =============================================================================
// Admin moderation queue for neighborhood reviews.
//
// Gated by the existing site admin cookie (admin_ok). If the cookie isn't
// set, the page renders a password prompt that POSTs to /api/admin-auth and
// reloads on success — same pattern as the rest of the admin pages.
// =============================================================================

import AdminReviewsClient from "./AdminReviewsClient";
import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Review Moderation | VaHome Admin",
  robots: { index: false, follow: false },
};

export default function AdminReviewsPage() {
  const isAdmin = cookies().get("admin_ok")?.value === "1";
  if (!isAdmin) {
    return <AdminLogin />;
  }
  return <AdminReviewsClient />;
}
