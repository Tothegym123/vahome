// app/admin/reviews/AdminLogin.tsx
// =============================================================================
// Lightweight admin password prompt. POSTs to /api/admin-auth which sets the
// admin_ok cookie on success, then we reload to land on the queue.
// =============================================================================
"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (r.ok) {
        window.location.reload();
      } else {
        setErr("Wrong password.");
      }
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Admin login</h1>
        <p className="mt-1 text-sm text-gray-600">Enter the admin password to moderate reviews.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="mt-4 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
          required
        />
        {err && <div className="mt-3 text-sm text-red-700">{err}</div>}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
