'use client'

// app/components/filters/shared/Section.tsx
// =============================================================================
// Standard section heading + body wrapper for the FilterSheet. Used by every
// section (Price, Beds, Baths, Home Type, Status, Sqft, Year Built, DOM).
// =============================================================================

import React from 'react'

type Props = {
  title: string
  hint?: string
  id?: string
  children: React.ReactNode
}

export default function Section({ title, hint, id, children }: Props) {
  return (
    <section id={id} className="border-b border-gray-200 px-5 py-5">
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {hint ? <p className="text-xs text-gray-500 mb-3">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </section>
  )
}
