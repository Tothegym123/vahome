// app/lib/mortgage/calculations.ts
// Core mortgage math. Pure functions. No React imports — testable in isolation.

import type {
  CalculatorInputs,
  CalculationResult,
  PaymentBreakdown,
  CashToClose,
  BahCoverage,
} from './types'
import {
  getDefaultRate,
  getPmiAnnualRate,
  getVaFundingFeePct,
  FHA_UPFRONT_MIP_PCT,
  getFhaAnnualMipPct,
  USDA_UPFRONT_GUARANTEE_FEE_PCT,
  USDA_ANNUAL_FEE_PCT,
  ESTIMATED_CLOSING_COSTS_PCT,
  estimatePrepaidsAndEscrows,
  DTI_CONSERVATIVE,
  DTI_AGGRESSIVE,
  CONFORMING_LOAN_LIMIT_2026,
  FHA_LIMIT_2026_HAMPTON_ROADS,
} from './loanAssumptions'

// -----------------------------------------------------------------------------
// Core P&I formula
// -----------------------------------------------------------------------------

/**
 * Standard amortization formula:
 *   M = P * (r(1+r)^n) / ((1+r)^n - 1)
 * where:
 *   P = principal (loan amount)
 *   r = monthly interest rate (annual / 12 / 100)
 *   n = total number of payments (term years × 12)
 *
 * Returns 0 if principal is 0 or non-finite. Handles 0% interest by linear amortization.
 */
export function principalAndInterestMonthly(
  principal: number,
  annualRatePct: number,
  termYears: number,
): number {
  if (!principal || principal <= 0) return 0
  if (!termYears || termYears <= 0) return 0
  const n = termYears * 12
  if (annualRatePct === 0) return principal / n
  const r = annualRatePct / 100 / 12
  const factor = Math.pow(1 + r, n)
  return (principal * (r * factor)) / (factor - 1)
}

// -----------------------------------------------------------------------------
// Per-loan-type payment calculators
// -----------------------------------------------------------------------------

interface CalcContext {
  baseLoan: number       // loan after down payment, BEFORE financed fees
  ltv: number            // baseLoan / purchasePrice
  inputs: CalculatorInputs
}

function buildContext(inputs: CalculatorInputs): CalcContext {
  const baseLoan = Math.max(0, inputs.purchasePrice - inputs.downPayment)
  const ltv = inputs.purchasePrice > 0 ? baseLoan / inputs.purchasePrice : 0
  return { baseLoan, ltv, inputs }
}

// -----------------------------------------------------------------------------
// Main calculate() — dispatches by loan type, returns full result
// -----------------------------------------------------------------------------

export function calculate(inputs: CalculatorInputs): CalculationResult {
  const ctx = buildContext(inputs)
  const warnings: string[] = []
  const disclaimers = standardDisclaimers()

  // Validation warnings
  if (inputs.purchasePrice <= 0) warnings.push('Enter a purchase price.')
  if (inputs.downPayment > inputs.purchasePrice) warnings.push('Down payment exceeds purchase price.')

  // Loan-type-specific routing
  let effectiveLoan = ctx.baseLoan
  let financedFee = 0
  let upfrontFee = 0
  let pmi = 0
  let fhaMipMonthly = 0
  let usdaMonthlyFee = 0
  let vaFundingFeeAmortized = 0

  switch (inputs.loanType) {
    case 'conventional': {
      pmi = conventionalPmiMonthly(ctx)
      checkConformingLimit(ctx.baseLoan, warnings)
      break
    }
    case 'fha': {
      const result = fhaFees(ctx)
      upfrontFee = result.upfront
      effectiveLoan = ctx.baseLoan + result.upfront  // typical: financed
      fhaMipMonthly = result.monthly
      checkFhaLimit(ctx.baseLoan, warnings)
      break
    }
    case 'va': {
      const result = vaFees(ctx)
      financedFee = result.financed
      effectiveLoan = ctx.baseLoan + result.financed
      vaFundingFeeAmortized = principalAndInterestMonthly(
        result.financed,
        rateFor(inputs),
        inputs.loanTerm,
      )
      // VA loans never carry PMI/MIP
      break
    }
    case 'usda': {
      const result = usdaFees(ctx)
      upfrontFee = result.upfront
      effectiveLoan = ctx.baseLoan + result.upfront  // typical: financed
      usdaMonthlyFee = result.monthlyFee
      // USDA income/area eligibility disclaimer
      warnings.push('USDA loans require rural-area eligibility and income limits. Confirm with a USDA-approved lender.')
      break
    }
    case 'jumbo': {
      // No government MI; PMI may apply if LTV > 80% — many jumbo lenders
      // require 20%+ down. Use conventional PMI table when applicable.
      pmi = conventionalPmiMonthly(ctx)
      if (ctx.baseLoan <= CONFORMING_LOAN_LIMIT_2026) {
        warnings.push('Loan amount is under the 2026 conforming limit; a Conventional loan may price better than Jumbo.')
      }
      break
    }
    case 'cash': {
      // No loan; only taxes/insurance/HOA below.
      effectiveLoan = 0
      break
    }
    case 'custom': {
      // User overrides drive everything. Use conventional PMI as default if LTV > 80%.
      pmi = conventionalPmiMonthly(ctx)
      break
    }
  }

  // Honor manual overrides if provided
  if (inputs.pmiRateOverride && inputs.pmiRateOverride > 0) {
    pmi = (effectiveLoan * (inputs.pmiRateOverride / 100)) / 12
  }
  if (inputs.fhaMonthlyMipOverride && inputs.fhaMonthlyMipOverride > 0) {
    fhaMipMonthly = inputs.fhaMonthlyMipOverride
  }

  const rate = rateFor(inputs)
  const baseLoanPI = principalAndInterestMonthly(ctx.baseLoan, rate, inputs.loanTerm)
  const principalAndInterest = inputs.loanType === 'cash'
    ? 0
    : baseLoanPI + vaFundingFeeAmortized

  const propertyTax = inputs.annualPropertyTax / 12
  const insurance = inputs.annualInsurance / 12
  const hoa = inputs.monthlyHoa || 0

  const totalMonthly =
    principalAndInterest + propertyTax + insurance + hoa + pmi + fhaMipMonthly + usdaMonthlyFee

  const payment: PaymentBreakdown = {
    principalAndInterest,
    propertyTax,
    insurance,
    hoa,
    pmi,
    fhaMip: fhaMipMonthly,
    vaFundingFeeAmortized,
    usdaAnnualFee: usdaMonthlyFee,
    totalMonthly,
  }

  // Cash to close
  const closingCosts = inputs.purchasePrice * (ESTIMATED_CLOSING_COSTS_PCT / 100)
  const prepaids = estimatePrepaidsAndEscrows(inputs.annualPropertyTax, inputs.annualInsurance)

  const cashToClose: CashToClose = {
    downPayment: inputs.downPayment,
    estimatedClosingCosts: closingCosts,
    prepaidsAndEscrows: prepaids,
    vaFundingFeePaidUpfront: 0,    // we assume financed by default
    fhaUpfrontMip: 0,              // financed by default
    usdaUpfrontGuaranteeFee: 0,    // financed by default
    total:
      inputs.downPayment + closingCosts + prepaids,
  }

  // DTI + affordability
  let dti: number | undefined
  let affordabilityRange: { conservative: number; aggressive: number } | undefined
  if (inputs.grossMonthlyIncome && inputs.grossMonthlyIncome > 0) {
    const monthlyDebts = inputs.monthlyDebts || 0
    dti = (totalMonthly + monthlyDebts) / inputs.grossMonthlyIncome
    affordabilityRange = computeAffordabilityRange(inputs)
  }

  // BAH coverage
  let bahCoverage: BahCoverage | undefined
  if (inputs.bahMonthly && inputs.bahMonthly > 0) {
    bahCoverage = computeBahCoverage(inputs.bahMonthly, totalMonthly)
  }

  return {
    inputs,
    loanAmount: ctx.baseLoan,
    effectiveLoanAmount: effectiveLoan,
    payment,
    cashToClose,
    loanToValue: ctx.ltv,
    debtToIncome: dti,
    affordabilityRange,
    bahCoverage,
    warnings,
    disclaimers,
  }
}

// -----------------------------------------------------------------------------
// Helpers per loan type
// -----------------------------------------------------------------------------

function rateFor(inputs: CalculatorInputs): number {
  return inputs.interestRate > 0
    ? inputs.interestRate
    : getDefaultRate(inputs.loanType, inputs.loanTerm)
}

function conventionalPmiMonthly(ctx: CalcContext): number {
  if (ctx.ltv <= 0.80) return 0
  const credit = ctx.inputs.creditScoreBand || '680-739'
  const annualPct = getPmiAnnualRate(ctx.ltv, credit)
  return (ctx.baseLoan * (annualPct / 100)) / 12
}

function fhaFees(ctx: CalcContext): { upfront: number; monthly: number } {
  const upfront = ctx.baseLoan * (FHA_UPFRONT_MIP_PCT / 100)
  const annualPct = getFhaAnnualMipPct(ctx.baseLoan, ctx.ltv, ctx.inputs.loanTerm)
  const monthly = (ctx.baseLoan * (annualPct / 100)) / 12
  return { upfront, monthly }
}

function vaFees(ctx: CalcContext): { financed: number } {
  const isFirstUse = ctx.inputs.isFirstTimeVaUse !== false  // default true unless set false
  const dpPct = ctx.inputs.downPaymentPct
  if (ctx.inputs.vaFundingFeeOverride && ctx.inputs.vaFundingFeeOverride > 0) {
    const pct = ctx.inputs.vaFundingFeeOverride
    return { financed: ctx.baseLoan * (pct / 100) }
  }
  const pct = getVaFundingFeePct(isFirstUse, dpPct)
  return { financed: ctx.baseLoan * (pct / 100) }
}

function usdaFees(ctx: CalcContext): { upfront: number; monthlyFee: number } {
  const upfront = ctx.baseLoan * (USDA_UPFRONT_GUARANTEE_FEE_PCT / 100)
  const monthlyFee = (ctx.baseLoan * (USDA_ANNUAL_FEE_PCT / 100)) / 12
  return { upfront, monthlyFee }
}

function checkConformingLimit(loan: number, warnings: string[]) {
  if (loan > CONFORMING_LOAN_LIMIT_2026) {
    warnings.push(
      `Loan amount exceeds the 2026 conforming limit ($${CONFORMING_LOAN_LIMIT_2026.toLocaleString()}). Consider a Jumbo loan.`,
    )
  }
}

function checkFhaLimit(loan: number, warnings: string[]) {
  if (loan > FHA_LIMIT_2026_HAMPTON_ROADS) {
    warnings.push(
      `Loan exceeds the 2026 FHA limit for Hampton Roads ($${FHA_LIMIT_2026_HAMPTON_ROADS.toLocaleString()}). FHA may not be available at this price.`,
    )
  }
}

// -----------------------------------------------------------------------------
// Affordability range
// -----------------------------------------------------------------------------

/**
 * Reverse the P&I formula: given a max monthly housing payment, compute the
 * supportable principal at the given rate/term.
 */
export function maxLoanFromMonthlyPayment(
  monthly: number,
  annualRatePct: number,
  termYears: number,
): number {
  if (monthly <= 0) return 0
  if (annualRatePct === 0) return monthly * termYears * 12
  const n = termYears * 12
  const r = annualRatePct / 100 / 12
  const factor = Math.pow(1 + r, n)
  return (monthly * (factor - 1)) / (r * factor)
}

function computeAffordabilityRange(inputs: CalculatorInputs): { conservative: number; aggressive: number } {
  const income = inputs.grossMonthlyIncome || 0
  const debts = inputs.monthlyDebts || 0
  const rate = rateFor(inputs)
  const term = inputs.loanTerm

  // Reserve ~25% of total payment for tax+insurance+HOA+MI to back into max loan
  const reserveFactor = 0.75
  const conservativeMonthly = Math.max(0, income * DTI_CONSERVATIVE - debts) * reserveFactor
  const aggressiveMonthly = Math.max(0, income * DTI_AGGRESSIVE - debts) * reserveFactor

  return {
    conservative: maxLoanFromMonthlyPayment(conservativeMonthly, rate, term),
    aggressive: maxLoanFromMonthlyPayment(aggressiveMonthly, rate, term),
  }
}

// -----------------------------------------------------------------------------
// BAH coverage
// -----------------------------------------------------------------------------

export function computeBahCoverage(bah: number, payment: number): BahCoverage {
  const delta = bah - payment   // positive = under BAH
  const pctOfBah = bah > 0 ? payment / bah : 0
  let status: BahCoverage['status']
  if (Math.abs(delta) < 1) status = 'covered'
  else if (delta > 0) status = 'below'
  else status = 'above'
  return { bahMonthly: bah, paymentMonthly: payment, status, delta, pctOfBah }
}

// -----------------------------------------------------------------------------
// Standard disclaimers
// -----------------------------------------------------------------------------

export function standardDisclaimers(): string[] {
  return [
    'Estimates are for informational purposes only and do not constitute a loan offer or pre-approval.',
    'Actual rates, fees, taxes, and insurance vary by lender, credit profile, and property.',
    'Property tax estimates are based on local averages; actual assessments may differ.',
    'Speak with a licensed lender for an official Loan Estimate before making any purchase decision.',
  ]
}

// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------

export function fmtUsd(n: number): string {
  if (!isFinite(n)) return '—'
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export function fmtPct(n: number, digits = 1): string {
  if (!isFinite(n)) return '—'
  return `${n.toFixed(digits)}%`
}
