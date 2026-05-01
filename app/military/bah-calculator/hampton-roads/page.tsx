import type { Metadata } from "next";
import Link from "next/link";
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'
import {
  PAY_GRADES,
  PAY_GRADE_LABELS,
  BAH_VA297_HAMPTON_NEWPORT_NEWS_2026,
  BAH_VA298_NORFOLK_PORTSMOUTH_2026,
  maxHomePrice,
  type PayGrade,
} from '../../../data/bah-rates'

export const metadata: Metadata = {
  title: "2026 Hampton Roads BAH Calculator | Peninsula & Southside Rates by Paygrade | VaHome",
  description:
    "Official 2026 DTMO BAH rates for both Hampton Roads MHAs: VA297 Hampton/Newport News (Peninsula) and VA298 Norfolk/Portsmouth (Southside). All 24 paygrades, with and without dependents, plus max home price each rate supports on a 30-year VA loan.",
  alternates: { canonical: "https://vahome.com/military/bah-calculator/hampton-roads/" },
  openGraph: {
    title: "2026 Hampton Roads BAH Calculator",
    description: "Official DTMO 2026 rates for VA297 (Peninsula) and VA298 (Southside) MHAs. All 24 paygrades.",
    url: "https://vahome.com/military/bah-calculator/hampton-roads/",
    type: "website",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "2026 Hampton Roads BAH Calculator",
  description:
    "Official 2026 BAH rates for both Hampton Roads MHAs (VA297 Peninsula and VA298 Southside) by paygrade with and without dependents, sourced directly from the U.S. Department of Defense Travel Management Office (DTMO).",
  datePublished: "2026-04-28",
  dateModified: "2026-05-01",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/bah-calculator/hampton-roads/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "BAH Calculator", item: "https://vahome.com/military/bah-calculator/" },
    { "@type": "ListItem", position: 4, name: "Hampton Roads", item: "https://vahome.com/military/bah-calculator/hampton-roads/" },
  ],
};

const fmt = (n: number) => `$${n.toLocaleString()}`;

type RateTable = Record<PayGrade, { withDeps: number; withoutDeps: number }>;

function BahRateTable({ rates }: { rates: RateTable }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-3 text-left font-semibold text-gray-900">Paygrade</th>
            <th className="px-3 py-3 text-right font-semibold text-gray-900">With dependents</th>
            <th className="px-3 py-3 text-right font-semibold text-gray-900">Without dependents</th>
            <th className="px-3 py-3 text-right font-semibold text-gray-900">Max home price (with deps)</th>
            <th className="px-3 py-3 text-right font-semibold text-gray-900">Max home price (no deps)</th>
          </tr>
        </thead>
        <tbody>
          {PAY_GRADES.map((grade, i) => {
            const r = rates[grade];
            return (
              <tr key={grade} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 font-medium text-gray-900">{PAY_GRADE_LABELS[grade]}</td>
                <td className="px-3 py-2 text-right text-gray-800">{fmt(r.withDeps)}/mo</td>
                <td className="px-3 py-2 text-right text-gray-800">{fmt(r.withoutDeps)}/mo</td>
                <td className="px-3 py-2 text-right text-blue-700 font-semibold">{fmt(maxHomePrice(r.withDeps))}</td>
                <td className="px-3 py-2 text-right text-blue-700 font-semibold">{fmt(maxHomePrice(r.withoutDeps))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function BAHCalculatorPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">BAH Calculator</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            2026 Hampton Roads BAH Calculator
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Official 2026 Basic Allowance for Housing rates for both Hampton Roads Military Housing Areas, sourced directly from the U.S. Department of Defense Travel Management Office (DTMO). All 24 paygrades, with and without dependents, plus the max home price each rate supports on a 30-year VA loan.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          Hampton Roads is split into two Military Housing Areas. Norfolk/Portsmouth pays $108–$225 more per paygrade than Hampton/Newport News, so check the table that matches your duty station before you set a home-buying budget.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
            <p className="text-xs font-mono text-gray-500">VA297 — Peninsula</p>
            <p className="text-lg font-bold text-gray-900 mt-1">Hampton / Newport News</p>
            <p className="text-sm text-gray-700 mt-2">Cities: Hampton, Newport News, Williamsburg, Yorktown, Poquoson, James City County</p>
            <p className="text-sm text-gray-700 mt-2"><strong>Bases:</strong> Joint Base Langley-Eustis (JBLE), Naval Weapons Station Yorktown</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
            <p className="text-xs font-mono text-gray-500">VA298 — Southside</p>
            <p className="text-lg font-bold text-gray-900 mt-1">Norfolk / Portsmouth</p>
            <p className="text-sm text-gray-700 mt-2">Cities: Norfolk, Portsmouth, Virginia Beach, Chesapeake, Suffolk</p>
            <p className="text-sm text-gray-700 mt-2"><strong>Bases:</strong> Naval Station Norfolk, NAS Oceana, JEB Little Creek-Fort Story, Naval Medical Center Portsmouth, Norfolk Naval Shipyard, Coast Guard Base Portsmouth, NSA Hampton Roads, Dam Neck Annex</p>
          </div>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed mt-6">
          The max-home-price column in each table assumes a 0% down VA loan, current 2026 rates, and BAH covering the full PITI payment. Use that number as a ceiling for budgeting, not a target — most clients I close with land 10–15% below their max for breathing room.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-3">
            <span className="inline-block bg-slate-900 text-white text-xs font-mono px-2 py-1 rounded">VA297</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Hampton / Newport News (Peninsula)</h2>
          </div>
          <p className="mt-3 text-gray-700">
            For service members at Joint Base Langley-Eustis or Naval Weapons Station Yorktown, or buying a home on the Peninsula side of Hampton Roads.
          </p>
          <div className="mt-6">
            <BahRateTable rates={BAH_VA297_HAMPTON_NEWPORT_NEWS_2026} />
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-3">
            <span className="inline-block bg-blue-900 text-white text-xs font-mono px-2 py-1 rounded">VA298</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Norfolk / Portsmouth (Southside)</h2>
          </div>
          <p className="mt-3 text-gray-700">
            For service members at Naval Station Norfolk, NAS Oceana, JEB Little Creek-Fort Story, NMC Portsmouth, Norfolk Naval Shipyard, CGB Portsmouth, NSA Hampton Roads, or Dam Neck Annex — or buying in Norfolk, Portsmouth, Virginia Beach, Chesapeake, or Suffolk.
          </p>
          <div className="mt-6">
            <BahRateTable rates={BAH_VA298_NORFOLK_PORTSMOUTH_2026} />
          </div>
          <div className="mt-6 border-t border-gray-200 pt-4 text-xs text-gray-500 space-y-2">
            <p>
              <strong>Source:</strong> Defense Travel Management Office (DTMO), U.S. Department of Defense — 2026 BAH Rates, effective January 1, 2026. Rates above are reproduced verbatim from the DTMO annual rate table for MHAs VA297 and VA298. <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">View the DTMO BAH Rate Lookup</a> to verify or look up rates for other locations.
            </p>
            <p>
              <strong>Max home price formula:</strong> BAH × 160, rounded to the nearest $1,000. Assumes 30-year fixed VA loan at current 2026 rates, no other debt, taxes and insurance included in payment, and BAH covering 100% of PITI. Actual loan approval depends on credit, total debt, and lender overlays.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Use This Number</h2>
        <div className="mt-6 space-y-5 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900">1. Treat it as a ceiling, not a target</h3>
            <p>Buying at your max BAH leaves zero margin if rates spike, HOA increases, or you want to refi. Most sailors I close with target 85-90% of max.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">2. Add property tax + insurance into the math</h3>
            <p>Hampton Roads property tax rates run 0.97% (Virginia Beach) to 1.25% (Norfolk effective rate) depending on city. Homeowners insurance averages $1,400-$2,200/year. Flood insurance adds $0-$2,400/year depending on zone.</p>
            <p className="text-xs text-gray-500 mt-1">Source: City tax assessor offices, 2025. Hampton Roads property tax comparison.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">3. Pre-approval beats pre-qualification</h3>
            <p>A pre-qual is a back-of-the-napkin estimate. A pre-approval has your credit pulled, income verified, and gives you a real ceiling. Sellers in Hampton Roads will not entertain a pre-qual offer.</p>
          </div>
          <div>
      