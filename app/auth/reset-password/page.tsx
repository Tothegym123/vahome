'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'

export default function ResetPasswordPage() {
  const [pwd1, setPwd1] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash and exchanges it automatically.
    // After that, getSession() returns a valid session in PASSWORD_RECOVERY mode.
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (pwd1.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (pwd1 !== pwd2) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.updateUser({ password: pwd1 })
      if (err) throw err
      setDone(true)
      setTimeout(() => router.push('/'), 2500)
    } catch (e: any) {
      setError(e?.message || 'Could not update password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set a new password</h1>
        {done ? (
          <div className="space-y-3">
            <p className="text-gray-600">Password updated. Redirecting you home…</p>
          </div>
        ) : hasSession === false ? (
          <div className="space-y-3">
            <p className="text-gray-600">
              This reset link looks invalid or expired.
            </p>
            <Link href="/auth/forgot-password" className="text-red-600 hover:underline font-medium">
              Request a new link →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input
                type="password"
                required
                minLength={8}
                value={pwd1}
                onChange={(e) => setPwd1(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
              <input
                type="password"
                required
                minLength={8}
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition"
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
