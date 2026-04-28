// app/lib/mortgage/types.ts
// All TypeScript types for the VaHome mortgage calculator system.

export type LoanType =
  | 'conventional'
  | 'fha'
  | 'va'
  | 'usda'
  | 'jumbo'
  | 'cash'
  | 'custom'

export type LoanTerm = 15 | 20 | 25 | 30

export type CreditScoreBand = '<620' | '620-679' | '680-739' | '740-799' | '800+'

export type MilitaryStatus = 'civilian' | 'active-duty' | 'veteran' | 'spouse' | 'reservist'

/** Inputs the user controls in the calculator. */
export interface CalculatorInputs {
  purchasePrice: number
  downPayment: number          // dollars
  downPaymentPct: number       // percent (0–100)
  loanType: LoanType
  loanTerm: LoanTerm
  interestRate: number         // annual percent (e.g. 6.5 means 6.5%)
  // Recurring monthly costs
  annualPropertyTax: number    // dollars/year
  annualInsurance: number      // dollars/year
  monthlyHoa: number           // dollars/month
  // Loan-specific overrides — leave 0 to use defaults from loanAssumptions
  pmiRateOverride?: number     // annual percent
  vaFundingFeeOverride?: number
  fhaMonthlyMipOverride?: number
  // Affordability inputs
  grossMonthlyIncome?: number
  monthlyDebts?: number
  bahMonthly?: number
  desiredMaxMonthly?: number
  // Buyer profile
  isFirstTimeVaUse?: boolean   // for VA funding fee tiering
  isFirstTimeBuyer?: boolean
  militaryStatus?: MilitaryStatus
  creditScoreBand?: CreditScoreBand
}

/** Components of the monthly payment, all in dollars/month. */
export interface PaymentBreakdown {
  principalAndInterest: number
  propertyTax: number
  insurance: number
  hoa: number
  pmi: number          // conventional PMI
  fhaMip: number       // FHA monthly MIP
  vaFundingFeeAmortized: number  // VA funding fee, financed and amortized
  usdaAnnualFee: number          // USDA annual fee, monthly portion
  totalMonthly: number
}

/** One-time / cash-to-close items. */
export interface CashToClose {
  downPayment: number
  estimatedClosingCosts: number
  prepaidsAndEscrows: number
  vaFundingFeePaidUpfront: number   // 0 if financed
  fhaUpfrontMip: number
  usdaUpfrontGuaranteeFee: number
  total: number
}

/** Top-level result the UI renders. */
export interface CalculationResult {
  inputs: CalculatorInputs
  loanAmount: number
  effectiveLoanAmount: number      // after financing VA/FHA/USDA fees
  payment: PaymentBreakdown
  cashToClose: CashToClose
  loanToValue: number              // 0–1
  debtToIncome?: number            // 0–1, only if income provided
  affordabilityRange?: { conservative: number; aggressive: number }
  bahCoverage?: BahCoverage
  warnings: string[]               // things the user should know
  disclaimers: string[]
}

export interface BahCoverage {
  bahMonthly: number
  paymentMonthly: number
  status: 'covered' | 'above' | 'below'  // payment relative to BAH
  delta: number                            // dollars (positive = under BAH)
  pctOfBah: number                         // payment as % of BAH
}

/** Lead-capture event types fed to the CRM webhook. */
export type LeadEventType =
  | 'mortgage_calculator_submit'
  | 'va_bah_calculator_submit'
  | 'listing_payment_estimate'
  | 'affordability_report_request'
  | 'saved_payment_estimate'
  | 'see_homes_in_payment_range'
  | 'check_va_eligibility'

/** Listing context auto-passed when calculator runs on a property page. */
export interface ListingContext {
  mlsId: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  annualTaxes?: number
  monthlyHoa?: number
  insuranceEstimate?: number
  propertyType?: string
  url?: string
}

/** Lead form fields the user fills in. */
export interface LeadFormData {
  name: string
  email: string
  phone: string
  buyingTimeline: '0-3-months' | '3-6-months' | '6-12-months' | '12-plus-months' | 'just-looking'
  militaryStatus: MilitaryStatus
  desiredCity?: string
  notes?: string
}

/** Full payload sent to webhook / Supabase. */
export interface LeadPayload {
  eventType: LeadEventType
  capturedAt: string                     // ISO timestamp
  form: LeadFormData
  calculation: {
    loanType: LoanType
    purchasePrice: number
    monthlyPayment: number
    loanAmount: number
    downPayment: number
    interestRate: number
    loanTerm: LoanTerm
    bahMonthly?: number
    bahCoverage?: BahCoverage
  }
  listing?: ListingContext
  attribution: {
    pageUrl: string
    referrer: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmTerm?: string
    utmContent?: string
  }
}
