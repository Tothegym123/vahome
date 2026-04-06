'use client'

import { useState, useMemo } from 'react'

type Props = {
  defaultPrice?: number
  isMilitary?: boolean
}

export default function MortgageCalculator({ defaultPrice = 350000, isMilitary = false }: Props) {
  const [price, setPrice] = useState(defaultPrice)
  const [downPercent, setDownPercent] = useState(isMilitary ? 0 : 5)
  const [rate, setRate] = useState(6.5)
  const [term, setTerm] = useState(30)
  const [showDetails, setShowDetails] = useState(false)

  const calc = useMemo(() => {
    const down = price * (downPercent / 100)
    const principal = price - down
    const monthlyRate = rate / 100 / 12
    const payments = term * 12
    const monthly = monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1)
      : principal / payments
    const tax = (price * 0.01) / 12
    const insurance = (price * 0.004) / 12
    const pmi = downPercent < 20 && !isMilitary ? (principal * 0.007) / 12 : 0
    const vaFunding = isMilitary ? (principal * 0.023) / payments : 0
    const total = monthly + tax + insurance + pmi + vaFunding

    return {
      monthly: Math.round(monthly),
      tax: Math.round(tax),
      insurance: Math.round(insurance),
      pmi: Math.round(pmi),
      vaFunding: Math.round(vaFunding),
      total: Math.round(total),
      down: Math.round(down),
      principal: Math.round(principal),
    }
  }, [price, downPercent, rate, term, isMilitary])

  const accent = isMilitary ? '#C5A55A' : '#dc2626'
  const accentBg = isMilitary ? 'rgba(197,165,90,0.08)' : 'rgba(220,38,38,0.05)'

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: isMilitary ? 'rgba(197,165,90,0.2)' : '#fee2e2' }}>
      <div className="px-6 py-4 flex items-center gap-2" style={{ background: accentBg }}>
        <svg className="w-5 h-5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-bold" style={{ color: accent }}>
          {isMilitary ? 'VA Loan Calculator' : 'Mortgage Calculator'}
        </h3>
      </div>
      <div className="p-6 space-y-4 bg-white">
        {/* Big monthly payment display */}
        <div className="text-center py-4">
          <div className="text-4xl font-black" style={{ color: accent }}>${calc.total.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Estimated monthly payment</div>
        </div>

        {/* Price slider */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Home Price</span>
            <span className="font-bold text-gray-900">${price.toLocaleString()}</span>
          </div>
          <input type="range" min={100000} max={1000000} step={5000} value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: accent }}
          />
        </div>

        {/* Down payment slider */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Down Payment</span>
            <span className="font-bold text-gray-900">{downPercent}% (${calc.down.toLocaleString()})</span>
          </div>
          <input type="range" min={0} max={30} step={1} value={downPercent}
            onChange={(e) => setDownPercent(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: accent }}
          />
          {isMilitary && downPercent === 0 && (
            <p className="text-xs mt-1 font-medium" style={{ color: accent }}>&#x2713; VA Loan: $0 down payment</p>
          )}
        </div>

        {/* Interest rate */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Interest Rate</span>
            <span className="font-bold text-gray-900">{rate}%</span>
          </div>
          <input type="range" min={3} max={10} step={0.125} value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: accent }}
          />
        </div>

        {/* Term toggle */}
        <div className="flex gap-2">
          {[15, 20, 30].map((t) => (
            <button key={t} onClick={() => setTerm(t)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                term === t ? 'text-white' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              style={term === t ? { background: accent } : {}}
            >
              {t} yr
            </button>
          ))}
        </div>

        {/* Payment breakdown */}
        <button onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          <span>Payment Breakdown</span>
          <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {showDetails && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Principal &amp; Interest</span><span className="font-medium">${calc.monthly.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Property Tax (est.)</span><span className="font-medium">${calc.tax.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Insurance (est.)</span><span className="font-medium">${calc.insurance.toLocaleString()}</span></div>
            {calc.pmi > 0 && <div className="flex justify-between"><span className="text-gray-500">PMI</span><span className="font-medium">${calc.pmi.toLocaleString()}</span></div>}
            {calc.vaFunding > 0 && <div className="flex justify-between"><span className="text-gray-500">VA Funding Fee (amortized)</span><span className="font-medium">${calc.vaFunding.toLocaleString()}</span></div>}
            <div className="flex justify-between pt-2 border-t border-gray-200 font-bold"><span>Total Monthly</span><span style={{ color: accent }}>${calc.total.toLocaleString()}</span></div>
          </div>
        )}
      </div>
    </div>
  )
}
