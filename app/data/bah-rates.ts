// 2026 Basic Allowance for Housing (BAH) rates
// Source: DoD Defense Travel Management Office (DTMO), effective Jan 1, 2026
// Verified via mybaseguide.com/base/ns-norfolk/bah on April 28, 2026
//
// Currently covers Norfolk/Portsmouth/Newport News MHA (VA058) which contains all
// major Hampton Roads installations. Add other MHAs here as the platform expands.

export type BahRate = { withDeps: number; withoutDeps: number }

export type PayGrade =
  | 'E-1' | 'E-2' | 'E-3' | 'E-4' | 'E-5' | 'E-6' | 'E-7' | 'E-8' | 'E-9'
  | 'W-1' | 'W-2' | 'W-3' | 'W-4' | 'W-5'
  | 'O-1E' | 'O-2E' | 'O-3E'
  | 'O-1' | 'O-2' | 'O-3' | 'O-4' | 'O-5' | 'O-6' | 'O-7'

export const PAY_GRADES: PayGrade[] = [
  'E-1', 'E-2', 'E-3', 'E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9',
  'W-1', 'W-2', 'W-3', 'W-4', 'W-5',
  'O-1E', 'O-2E', 'O-3E',
  'O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6', 'O-7',
]

export const PAY_GRADE_LABELS: Record<PayGrade, string> = {
  'E-1': 'E-1 (Private / Seaman Recruit)',
  'E-2': 'E-2',
  'E-3': 'E-3',
  'E-4': 'E-4',
  'E-5': 'E-5',
  'E-6': 'E-6',
  'E-7': 'E-7',
  'E-8': 'E-8',
  'E-9': 'E-9',
  'W-1': 'W-1 (Warrant Officer)',
  'W-2': 'W-2',
  'W-3': 'W-3',
  'W-4': 'W-4',
  'W-5': 'W-5',
  'O-1E': 'O-1E (Prior Enlisted)',
  'O-2E': 'O-2E (Prior Enlisted)',
  'O-3E': 'O-3E (Prior Enlisted)',
  'O-1': 'O-1',
  'O-2': 'O-2',
  'O-3': 'O-3',
  'O-4': 'O-4',
  'O-5': 'O-5',
  'O-6': 'O-6',
  'O-7': 'O-7+',
}

// Norfolk/Portsmouth, VA Military Housing Area (MHA code VA058)
// Effective January 1, 2026
export const BAH_NORFOLK_2026: Record<PayGrade, BahRate> = {
  'E-1': { withDeps: 2229, withoutDeps: 1707 },
  'E-2': { withDeps: 2229, withoutDeps: 1707 },
  'E-3': { withDeps: 2229, withoutDeps: 1707 },
  'E-4': { withDeps: 2229, withoutDeps: 1707 },
  'E-5': { withDeps: 2430, withoutDeps: 1908 },
  'E-6': { withDeps: 2559, withoutDeps: 2043 },
  'E-7': { withDeps: 2604, withoutDeps: 2235 },
  'E-8': { withDeps: 2661, withoutDeps: 2463 },
  'E-9': { withDeps: 2796, withoutDeps: 2487 },
  'W-1': { withDeps: 2574, withoutDeps: 2166 },
  'W-2': { withDeps: 2628, withoutDeps: 2460 },
  'W-3': { withDeps: 2697, withoutDeps: 2496 },
  'W-4': { withDeps: 2832, withoutDeps: 2562 },
  'W-5': { withDeps: 3000, withoutDeps: 2616 },
  'O-1E': { withDeps: 2613, withoutDeps: 2427 },
  'O-2E': { withDeps: 2685, withoutDeps: 2481 },
  'O-3E': { withDeps: 2859, withoutDeps: 2547 },
  'O-1': { withDeps: 2454, withoutDeps: 2022 },
  'O-2': { withDeps: 2556, withoutDeps: 2367 },
  'O-3': { withDeps: 2694, withoutDeps: 2505 },
  'O-4': { withDeps: 3054, withoutDeps: 2601 },
  'O-5': { withDeps: 3318, withoutDeps: 2625 },
  'O-6': { withDeps: 3342, withoutDeps: 2673 },
  'O-7': { withDeps: 3366, withoutDeps: 2718 },
}

// Map every MHA code we support to its rate table.
// Future: add VA055 (Tidewater minor), DC area, etc.
export const BAH_BY_MHA: Record<string, Record<PayGrade, BahRate>> = {
  VA058: BAH_NORFOLK_2026,
}

export function getBah(mhaCode: string, payGrade: PayGrade, withDependents: boolean): number {
  const table = BAH_BY_MHA[mhaCode]
  if (!table) return 0
  const rate = table[payGrade]
  if (!rate) return 0
  return withDependents ? rate.withDeps : rate.withoutDeps
}
