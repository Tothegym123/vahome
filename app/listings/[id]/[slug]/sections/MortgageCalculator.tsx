'use client';

import { useMemo, useState } from 'react';

interface MortgageCalculatorProps {
  price: number;
  taxAmountAnnual?: number;
  hoaFeeMonthly?: number;
}

// Monthly P+I given principal P, annual rate r (decimal), term in years.
function monthlyPI(principal: number, annualRatePct: number, termYears: number): number {
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function MortgageCalculator({
  price,
  taxAmountAnnual = 0,
  hoaFeeMonthly = 0,
}: MortgageCalculatorProps) {
  const [downPct, setDownPct] = useState(20);
  const [ratePct, setRatePct] = useState(6.75);
  const [termYears, setTermYears] = useState(30);

  const downAmount = Math.round((price * downPct) / 100);
  const principal = Math.max(0, price - downAmount);

  const result = useMemo(() => {
    const pi = monthlyPI(principal, ratePct, termYears);
    const tax = (taxAmountAnnual || 0) / 12;
    // Rough homeowner's insurance estimate: 0.35% of home value annually
    const ins = (price * 0.0035) / 12;
    // PMI applies if down < 20%: ~0.5% of loan annually
    const pmi = downPct < 20 ? (principal * 0.005) / 12 : 0;
    const total = pi + tax + ins + pmi + (hoaFeeMonthly || 0);
    return { pi, tax, ins, pmi, hoa: hoaFeeMonthly || 0, total };
  }, [principal, ratePct, termYears, downPct, taxAmountAnnual, hoaFeeMonthly, price]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Estimate your monthly payment</h2>
        <span className="text-2xl font-bold text-gray-900">{fmt(result.total)}<span className="text-sm font-normal text-gray-500">/mo</span></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <label className="block">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Down payment</span>
            <span className="font-medium text-gray-900">{downPct}% &middot; {fmt(downAmount)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="w-full accent-blue-600"
            aria-label="Down payment percent"
          />
        </label>
        <label className="block">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Interest rate</span>
            <span className="font-medium text-gray-900">{ratePct.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min={3}
            max={10}
            step={0.125}
            value={ratePct}
            onChange={(e) => setRatePct(Number(e.target.value))}
            className="w-full accent-blue-600"
            aria-label="Interest rate"
          />
        </label>
        <label className="block">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Loan term</span>
            <span className="font-medium text-gray-900">{termYears} years</span>
          </div>
          <select
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Loan term"
          >
            <option value={15}>15 years</option>
            <option value={20}>20 years</option>
            <option value={30}>30 years</option>
          </select>
        </label>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <Row label="Principal &amp; interest" value={fmt(result.pi)} />
          <Row label="Property tax" value={fmt(result.tax)} />
          <Row label="Home insurance" value={fmt(result.ins)} />
          <Row label="PMI" value={result.pmi > 0 ? fmt(result.pmi) : 'None'} />
          <Row label="HOA" value={result.hoa > 0 ? fmt(result.hoa) : 'None'} />
        </div>
        <p className="text-xs text-gray-400 mt-4 leading-relaxed">
          Estimate only. Insurance assumed at 0.35% of home value annually. Actual taxes, insurance, and rate
          will vary by lender, credit, and property. Contact a lender for a personalized quote.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
