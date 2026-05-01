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
  'W-5':  { with