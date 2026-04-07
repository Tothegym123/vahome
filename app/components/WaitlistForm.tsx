'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase/client'

interface WaitlistFormProps {
  type: 'agent' | 'lender'
  title: string
}

export default function WaitlistForm({ type, title }: WaitlistFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({ type, name, email, phone })
        .select()
      if (insertError) throw insertError
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 mb-8 rounded">
            <p className="text-lg text-gray-800 font-medium">
              We are full now. Leave your name, email and number to be waitlisted.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
              <h2 className="text-xl font-bold text-green-900 mb-2">You&apos;re on the list!</h2>
              <p className="text-green-800">
                Thanks {name}. We&apos;ll reach out to you when a spot opens up.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(757) 555-1234"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-6 rounded-lg transition-colors"
              >
                {submitting ? 'Submitting...' : 'Join the Waitlist'}
              </button>

              <p className="text-xs text-gray-500 mt-3 leading-snug" data-tcpa="tcpa-consent-vahome">
            By submitting this form, you consent to be contacted by the VaHome Team and Tom &amp; Dariya Milan, LPT Realty by phone, text message, and email at the contact information provided, including via automated systems, regarding real estate inquiries and listings. Message and data rates may apply. Message frequency varies. Consent is not a condition of any purchase. Reply STOP to unsubscribe at any time. See our <a href="/privacy" className="underline">Privacy Policy</a> and <a href="/terms" className="underline">Terms</a>.
          </p>

            </form>
          )}
        </div>
      </div>
    </div>
  )
}
