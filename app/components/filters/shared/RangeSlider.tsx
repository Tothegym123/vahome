'use client'

// app/components/filters/shared/RangeSlider.tsx
// =============================================================================
// Two-handle range slider wrapping rc-slider's Range component with our
// styling. Handles are clamped to [min, max], snap to `step`, and the parent
// receives [lo, hi] tuples on change. The Range itself doesn't render labels;
// callers usually pair it with their own min/max number inputs below.
// =============================================================================

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

type Props = {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (next: [number, number]) => void
}

export default function RangeSlider({ min, max, step = 1, value, onChange }: Props) {
  return (
    <div className="px-1 py-2">
      <Slider
        range
        min={min}
        max={max}
        step={step}
        value={value}
        allowCross={false}
        onChange={(v) => {
          if (Array.isArray(v) && v.length === 2) {
            onChange([v[0] as number, v[1] as number])
          }
        }}
        styles={{
          track: { backgroundColor: '#dc2626', height: 4 },
          rail: { backgroundColor: '#e5e7eb', height: 4 },
          handle: {
            borderColor: '#dc2626',
            backgroundColor: '#ffffff',
            opacity: 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            width: 20,
            height: 20,
            marginTop: -8,
          },
        }}
      />
    </div>
  )
}
