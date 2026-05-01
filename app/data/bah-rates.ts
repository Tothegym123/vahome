// 2026 Basic Allowance for Housing (BAH) rates — Hampton Roads
//
// SOURCE: Defense Travel Management Office (DTMO), U.S. Department of Defense
//   Effective:  January 1, 2026
//   URL:        https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/
//   Document:   "2026 BAH Rates" full annual rate table (downloaded from DTMO BAH Rate Lookup)
//   Captured:   2026-04-30
//
// Hampton Roads contains TWO Military Housing Areas. Norfolk/Portsmouth pays
// $108-$225 more per paygrade than Hampton/Newport News across the board.
//
//   VA297  HAMPTON / NEWPORT NEWS, VA  (Peninsula)
//          - Cities: Hampton, Newport News, Williamsburg, Yorktown, Poquoson, James City County
//          - Bases:  Joint Base Langley-Eustis (JBLE), Naval Weapons Station Yorktown
//
//   VA298  NORFOLK / PORTSMOUTH, VA   (Southside)
//          - Cities: Norfolk, Portsmouth, Virginia Beach, Chesapeake, Suffolk
//          - Bases:  Naval Station Norfolk, NAS Oceana, JEB Little Creek-Fort Story,
//                    Naval Medical Center Portsmouth, Norfolk Naval Shipyard,
//                    Coast Guard Base Portsmouth, NSA Hampton Roads, Dam Neck Annex
//
// To update: download the next year's rate table from DTMO and replace the
// values below verbatim. Do not source from third parties.

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

// VA297 — HAMPTON/NEWPORT NEWS, VA (Peninsula)
// DTMO 2026 — values verbatim from DTMO BAH Rate Lookup tool
export const BAH_VA297_HAMPTON_NEWPORT_NEWS_2026: Record<PayGrade, BahRate> = {
  'E-1':  { withDeps: 2082, withoutDeps: 1599 },
  'E-2':  { withDeps: 2082, withoutDeps: 1599 },
  'E-3':  { withDeps: 2082, withoutDeps: 1599 },
  'E-4':  { withDeps: 2082, withoutDeps: 1599 },
  'E-5':  { withDeps: 2274, withoutDeps: 1779 },
  'E-6':  { withDeps: 2421, withoutDeps: 1905 },
  'E-7':  { withDeps: 2439, withoutDeps: 2088 },
  'E-8':  { withDeps: 2457, withoutDeps: 2310 },
  'E-9':  { withDeps: 2571, withoutDeps: 2343 },
  'W-1':  { withDeps: 2436, withoutDeps: 2022 },
  'W-2':  { withDeps: 2445, withoutDeps: 2307 },
  'W-3':  { withDeps: 2478, withoutDeps: 2349 },
  'W-4':  { withDeps: 2610, withoutDeps: 2415 },
  'W-5':  { withDeps: 2778, withoutDeps: 2439 },
  'O-1E': { withDeps: 2442, withoutDeps: 2271 },
  'O-2E': { withDeps: 2466, withoutDeps: 2334 },
  'O-3E': { withDeps: 2637, withoutDeps: 2409 },
  'O-1':  { withDeps: 2301, withoutDeps: 1884 },
  'O-2':  { withDeps: 2418, withoutDeps: 2214 },
  'O-3':  { withDeps: 2475, withoutDeps: 2361 },
  'O-4':  { withDeps: 2835, withoutDeps: 2427 },
  'O-5':  { withDeps: 3099, withoutDeps: 2442 },
  'O-6':  { withDeps: 3123, withoutDeps: 2451 },
  'O-7':  { withDeps: 3144, withoutDeps: 2493 },
}

// VA298 — NORFOLK/PORTSMOUTH, VA (Southside)
// DTMO 2026 — values verbatim from DTMO BAH Rate Lookup tool
export const BAH_VA298_NORFOLK_PORTSMOUTH_2026: Record<PayGrade, BahRate> = {
  'E-1':  { withDeps: 2229, withoutDeps: 1707 },
  'E-2':  { withDeps: 2229, withoutDeps: 1707 },
  'E-3':  { withDeps: 2229, withoutDeps: 1707 },
  'E-4':  { withDeps: 2229, withoutDeps: 1707 },
  'E-5':  { withDeps: 2430, withoutDeps: 1908 },
  'E-6':  { withDeps: 2559, withoutDeps: 2043 },
  'E-7':  { withDeps: 2604, withoutDeps: 2235 },
  'E-8':  { withDeps: 2661, withoutDeps: 2463 },
  'E-9':  { withDeps: 2796, withoutDeps: 2487 },
  'W-1':  { withDeps: 2574, withoutDeps: 2166 },
  'W-2':  { withDeps: 2628, withoutDeps: 2460 },
  'W-3':  { withDeps: 2697, withoutDeps: 2496 },
  'W-4':  { withDeps: 2832, withoutDeps: 2562 },
  'W-5':  { withDeps: 3000, withoutDeps: 2616 },
  'O-1E': { withDeps: 2613, withoutDeps: 2427 },
  'O-2E': { withDeps: 2685, withoutDeps: 2481 },
  'O-3E': { withDeps: 2859, withoutDeps: 2547 },
  'O-1':  { withDeps: 2454, withoutDeps: 2022 },
  'O-2':  { withDeps: 2556, withoutDeps: 2367 },
  'O-3':  { withDeps: 2694, withoutDeps: 2505 },
  'O-4':  { withDeps: 3054, withoutDeps: 2601 },
  'O-5':  { withDeps: 3318, withoutDeps: 2625 },
  'O-6':  { withDeps: 3342, withoutDeps: 2673 },
  'O-7':  { withDeps: 3366, withoutDeps: 2718 },
}

// Map MHA code → rate table.
// Add other MHAs (D.C., San Diego, Jacksonville, etc.) here as the platform expands.
export const BAH_BY_MHA: Record<string, Record<PayGrade, BahRate>> = {
  VA297: BAH_VA297_HAMPTON_NEWPORT_NEWS_2026,
  VA298: BAH_VA298_NORFOLK_PORTSMOUTH_2026,
}

export const MHA_LABELS: Record<string, string> = {
  VA297: 'Hampton / Newport News (Peninsula)',
  VA298: 'Norfolk / Portsmouth (Southside)',
}

// Cities → MHA mapping, used to surface the right rate based on user context.
export const HAMPTON_ROADS_CITY_TO_MHA: Record<string, 'VA297' | 'VA298'> = {
  'hampton':         'VA297',
  'newport-news':    'VA297',
  'williamsburg':    'VA297',
  'yorktown':        'VA297',
  'york-county':     'VA297',
  'poquoson':        'VA297',
  'james-city':      'VA297',
  'norfolk':         'VA298',
  'portsmouth':      'VA298',
  'virginia-beach':  'VA298',
  'chesapeake':      'VA298',
  'suffolk':         'VA298',
}

// Backward-compatible alias for callers that still reference the old name.
// All Norfolk-MHA callers should migrate to BAH_BY_MHA['VA298'].
export const BAH_NORFOLK_2026 = BAH_VA298_NORFOLK_PORTSMOUTH_2026

export function getBah(mhaCode: string, payGrade: PayGrade, withDependents: boolean): number {
  const table = BAH_BY_MHA[mhaCode]
  if (!table) return 0
  const rate = table[payGrade]
  if (!rate) return 0
  return withDependents ? rate.withDeps : rate.withoutDeps
}

// Helper: rough max home price a given BAH supports on a 30-year VA loan at
// current rates, after typical Hampton Roads property tax (~1.1%) and
// homeowner's insurance (~$1,500/yr). Rule of thumb: BAH × 160. This is a
// budgeting ceiling, not a pre-approval.
export function maxHomePrice(monthlyBah: number): number {
  return Math.round((monthlyBah * 160) / 1000) * 1000
}
