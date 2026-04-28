// app/lib/mortgage/loanAssumptions.ts
// Default rates, fees, and assumption tables used by the mortgage calculator.
//
// IMPORTANT: These are SENSIBLE DEFAULTS for Q2 2026. Update quarterly:
//   - Refresh DEFAULT_RATES_2026 from Freddie Mac PMMS (https://www.freddiemac.com/pmms)
//   - Refresh VA_FUNDING_FEE_RATES from VA.gov when statute changes
//   - Refresh FHA MIP from HUD ML announcements
//   - Refresh property tax rates from each Hampton Roads jurisdiction's commissioner of revenue
// Tom's process: search "Freddie Mac PMMS" + "VA funding fee 2026" once per quarter.

import type { LoanType, LoanTerm, CreditScoreBand } from './types'

// -----------------------------------------------------------------------------
// Interest rates (annual %, 2026-Q2 reference)
// Source: Freddie Mac PMMS averages, May 2026. Refresh quarterly.
// -----------------------------------------------------------------------------

export const DEFAULT_RATES_2026: Record<LoanType, Record<LoanTerm, number>> = {
  conventional: { 30: 6.65, 25: 6.55, 20: 6.40, 15: 5.85 },
  fha:          { 30: 6.20, 25: 6.10, 20: 5.95, 15: 5.50 },
  va:           { 30: 6.10, 25: 6.00, 20: 5.85, 15: 5.40 },
  usda:         { 30: 6.30, 25: 6.20, 20: 6.05, 15: 5.60 },
  jumbo:        { 30: 6.85, 25: 6.75, 20: 6.60, 15: 6.05 },
  cash:         { 30: 0,    25: 0,    20: 0,    15: 0 },
  custom:       { 30: 6.65, 25: 6.55, 20: 6.40, 15: 5.85 },
}

export function getDefaultRate(type: LoanType, term: LoanTerm): number {
  return DEFAULT_RATES_2026[type]?.[term] ?? 6.65
}

// -----------------------------------------------------------------------------
// Down-payment minimums by loan type
// -----------------------------------------------------------------------------

export const MIN_DOWN_PAYMENT_PCT: Record<LoanType, number> = {
  conventional: 3,    // 3% conv 97 program; otherwise 5%
  fha: 3.5,
  va: 0,
  usda: 0,
  jumbo: 10,          // can vary 10-25%; 10% is generous floor
  cash: 100,
  custom: 0,
}

// -----------------------------------------------------------------------------
// Conventional PMI  -  annual rate as % of loan amount.
// Real PMI varies by LTV, credit score, and PMI provider. Lookup table:
// (LTV band, credit band) - annual PMI rate.
// Source: typical agency PMI rate cards 2026.
// -----------------------------------------------------------------------------

export interface PmiLookup {
  ltvMax: number       // upper bound (exclusive) of LTV band, e.g. 0.95
  byCredit: Record<CreditScoreBand, number>  // annual % of loan
}

export const PMI_TABLE: PmiLookup[] = [
  // LTV > 95% (3% down)
  {
    ltvMax: 1.00,
    byCredit: {
      '<620': 1.45, '620-679': 1.10, '680-739': 0.75, '740-799': 0.55, '800+': 0.45,
    },
  },
  // LTV 90.01-95% (5% down)
  {
    ltvMax: 0.9500001,
    byCredit: {
      '<620': 1.20, '620-679': 0.85, '680-739': 0.55, '740-799': 0.40, '800+': 0.30,
    },
  },
  // LTV 85.01-90% (10% down)
  {
    ltvMax: 0.9000001,
    byCredit: {
      '<620': 0.95, '620-679': 0.65, '680-739': 0.40, '740-799': 0.30, '800+': 0.20,
    },
  },
  // LTV 80.01-85% (15% down)
  {
    ltvMax: 0.8500001,
    byCredit: {
      '<620': 0.55, '620-679': 0.40, '680-739': 0.25, '740-799': 0.18, '800+': 0.15,
    },
  },
  // LTV - 80%  -  no PMI
  {
    ltvMax: 0.80,
    byCredit: {
      '<620': 0, '620-679': 0, '680-739': 0, '740-799': 0, '800+': 0,
    },
  },
]

export function getPmiAnnualRate(ltv: number, credit: CreditScoreBand): number {
  if (ltv <= 0.80) return 0
  // Walk highest-LTV band first
  for (const band of PMI_TABLE) {
    if (ltv > band.ltvMax) continue
    return band.byCredit[credit]
  }
  return 0
}

// -----------------------------------------------------------------------------
// VA funding fee  -  % of loan amount. As of statute extended through 2030.
// Source: VA.gov funding-fee chart (verify annually).
// -----------------------------------------------------------------------------

export interface VaFundingFeeKey {
  isFirstUse: boolean
  downPaymentPct: number   // 0, 5, 10
}

export function getVaFundingFeePct(isFirstUse: boolean, downPaymentPct: number): number {
  // Down payment - 10%
  if (downPaymentPct >= 10) {
    return isFirstUse ? 1.25 : 1.25
  }
  // 5% - DP < 10%
  if (downPaymentPct >= 5) {
    return isFirstUse ? 1.50 : 1.50
  }
  // DP < 5%
  return isFirstUse ? 2.15 : 3.30
}

// Funding-fee exemptions: receiving compensation for service-connected disability,
// surviving spouses receiving DIC, Purple Heart recipients on active duty.
// We expose a flag in inputs for this; users self-attest.

// -----------------------------------------------------------------------------
// FHA MIP  -  Mortgage Insurance Premium
// -----------------------------------------------------------------------------

export const FHA_UPFRONT_MIP_PCT = 1.75  // % of base loan amount
// Annual MIP, % of loan/year. Term-and-LTV dependent.
// Source: HUD Mortgagee Letter; current 2026 rates.
export function getFhaAnnualMipPct(loanAmount: number, ltv: number, term: LoanTerm): number {
  const isHighBalance = loanAmount > 766_550   // 2026 conforming limit threshold
  // Term - 15 years
  if (term <= 15) {
    if (ltv > 0.90) return isHighBalance ? 0.40 : 0.40
    if (ltv > 0.78) return isHighBalance ? 0.15 : 0.15
    return 0.15
  }
  // Term > 15 years (typical 30)
  if (ltv > 0.95) return isHighBalance ? 0.55 : 0.55
  if (ltv > 0.90) return isHighBalance ? 0.50 : 0.50
  return isHighBalance ? 0.50 : 0.50
}

// -----------------------------------------------------------------------------
// USDA fees
// -----------------------------------------------------------------------------

export const USDA_UPFRONT_GUARANTEE_FEE_PCT = 1.0    // % of loan
export const USDA_ANNUAL_FEE_PCT = 0.35              // % of remaining loan/year

// -----------------------------------------------------------------------------
// Hampton Roads property tax rates (% of assessed value, annual)
// Source: each city's commissioner of revenue.
// Refresh annually after July 1 fiscal year change.
// -----------------------------------------------------------------------------

export const HAMPTON_ROADS_TAX_RATES: Record<string, number> = {
  norfolk: 1.25,
  'virginia-beach': 1.025,
  chesapeake: 1.05,
  suffolk: 1.11,
  hampton: 1.18,
  'newport-news': 1.22,
  portsmouth: 1.30,
  yorktown: 0.795,
  'james-city': 0.83,
}

export function getEstimatedTaxRate(citySlug?: string): number {
  if (!citySlug) return 1.10  // Hampton Roads average fallback
  const key = citySlug.toLowerCase().replace(/\s+/g, '-')
  return HAMPTON_ROADS_TAX_RATES[key] ?? 1.10
}

// Coastal Virginia homeowners insurance  -  annual % of dwelling value.
// Wind/storm areas push rates higher than national average.
export const DEFAULT_INSURANCE_RATE_PCT = 0.45

// -----------------------------------------------------------------------------
// Closing costs + prepaids  -  rough Hampton Roads averages.
// -----------------------------------------------------------------------------

// % of purchase price (lender, title, recording, transfer tax, etc.)
export const ESTIMATED_CLOSING_COSTS_PCT = 2.5

// Typical prepaids: ~6 months tax escrow + 12 months insurance + odd-day interest
export function estimatePrepaidsAndEscrows(annualTax: number, annualInsurance: number): number {
  const taxEscrow = (annualTax / 12) * 6
  const insuranceEscrow = annualInsurance
  const oddInterest = 500  // generic placeholder
  return Math.round(taxEscrow + insuranceEscrow + oddInterest)
}

// -----------------------------------------------------------------------------
// DTI thresholds for affordability ranges
// -----------------------------------------------------------------------------

export const DTI_CONSERVATIVE = 0.36   // total monthly debt / gross monthly income
export const DTI_AGGRESSIVE = 0.50     // VA / aggressive cap

// -----------------------------------------------------------------------------
// 2026 FHA & conforming loan limits  -  Hampton Roads
// -----------------------------------------------------------------------------

export const CONFORMING_LOAN_LIMIT_2026 = 766_550   // 1-unit, most areas
export const FHA_LIMIT_2026_HAMPTON_ROADS = 524_225 // 1-unit Norfolk-VA Beach MSA
export const VA_LIMIT_NOTE = 'No VA loan limit for veterans with full entitlement (Blue Water Navy Vietnam Veterans Act of 2019).'
