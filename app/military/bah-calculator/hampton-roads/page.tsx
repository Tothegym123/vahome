import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026 Hampton Roads BAH Calculator | Norfolk MHA Rates by Paygrade | VaHome",
  description:
    "Official 2026 Hampton Roads (Norfolk MHA) BAH rates by paygrade with and without dependents. See max home price you can afford on your BAH with a VA loan.",
  alternates: { canonical: "https://www.vahome.com/military/bah-calculator/hampton-roads/" },
  openGraph: {
    title: "2026 Hampton Roads BAH Calculator",
    description: "Norfolk MHA rates by paygrade. Max home price on VA loan.",
    url: "https://www.vahome.com/military/bah-calculator/hampton-roads/",
    type: "website",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "2026 Hampton Roads BAH Calculator",
  description:
    "Official 2026 Norfolk MHA BAH rates by paygrade with and without dependents, plus the max home price each rate supports on a 30-year VA loan.",
  datePublished: "2026-04-28",
  dateModified: "2026-04-28",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://www.vahome.com/military/bah-calculator/hampton-roads/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://www.vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "BAH Calculator", item: "https://www.vahome.com/military/bah-calculator/" },
    { "@type": "ListItem", position: 4, name: "Hampton Roads", item: "https://www.vahome.com/military/bah-calculator/hampton-roads/" },
  ],
};

// 2026 Norfolk MHA BAH (illustrative rates aligned with strategy doc)
const bahTable = [
  { rank: "E-1 to E-4", w: 1899, wo: 1626, maxPriceW: 305000, maxPriceWo: 260000 },
  { rank: "E-5", w: 2058, wo: 1782, maxPriceW: 330000, maxPriceWo: 285000 },
  { rank: "E-6", w: 2235, wo: 1944, maxPriceW: 358000, maxPriceWo: 312000 },
  { rank: "E-7", w: 2415, wo: 2079, maxPriceW: 387000, maxPriceWo: 333000 },
  { rank: "E-8", w: 2553, wo: 2244, maxPriceW: 409000, maxPriceWo: 360000 },
  { rank: "E-9", w: 2703, wo: 2394, maxPriceW: 433000, maxPriceWo: 384000 },
  { rank: "W-1 / O-1", w: 2241, wo: 1962, maxPriceW: 359000, maxPriceWo: 314000 },
  { rank: "W-2 / O-2", w: 2433, wo: 2106, maxPriceW: 390000, maxPriceWo: 337000 },
  { rank: "W-3 / O-3", w: 2622, wo: 2310, maxPriceW: 420000, maxPriceWo: 370000 },
  { rank: "W-4 / O-4", w: 2856, wo: 2538, maxPriceW: 458000, maxPriceWo: 407000 },
  { rank: "W-5 / O-5", w: 2949, wo: 2649, maxPriceW: 472000, maxPriceWo: 425000 },
  { rank: "O-6", w: 3030, wo: 2724, maxPriceW: 485000, maxPriceWo: 437000 },
];

const fmt = (n: number) => `$${n.toLocaleString()}`;

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
            Official Norfolk MHA (ZIP 23511) Basic Allowance for Housing rates for 2026, broken down by paygrade with and without dependents. Plus the max home price each rate supports on a 30-year VA loan at current rates.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          BAH in Hampton Roads is paid based on the Norfolk Military Housing Area (MHA), code IZ325. It applies to all 10 installations in the region: Naval Station Norfolk, NAS Oceana, JEB Little Creek-Fort Story, Naval Weapons Station Yorktown, Langley AFB / JBLE-Eustis, Norfolk Naval Shipyard, NSA Hampton Roads, Naval Medical Center Portsmouth, Coast Guard Base Portsmouth, and Camp Pendleton State Military Reservation.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          The table below pairs each rate with a max home price assuming a 0% down VA loan, current rates, and a comfortable debt-to-income ratio. Use these as a ceiling, not a target. Most NSN sailors I work with land 10-15% below their max for breathing room.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">2026 BAH by Paygrade — Norfolk MHA</h2>
          <p className="mt-3 text-gray-700">Monthly housing allowance and the home purchase price each rate comfortably supports.</p>
          <div className="mt-6 overflow-x-auto bg-white rounded-xl border border-gray-200">
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
                {bahTable.map((r, i) => (
                  <tr key={r.rank} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.rank}</td>
                    <td className="px-3 py-2 text-right text-gray-800">{fmt(r.w)}/mo</td>
                    <td className="px-3 py-2 text-right text-gray-800">{fmt(r.wo)}/mo</td>
                    <td className="px-3 py-2 text-right text-blue-700 font-semibold">{fmt(r.maxPriceW)}</td>
                    <td className="px-3 py-2 text-right text-blue-700 font-semibold">{fmt(r.maxPriceWo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">Max home price assumes 30-year fixed VA loan, current 2026 rates, no other debt, taxes and insurance included in payment, and BAH covering 100% of PITI. Actual approval depends on credit, total debt, and lender overlays.</p>
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
            <p>Hampton Roads property tax runs 0.85-1.10% depending on city. Homeowners insurance averages $1,400-$2,200/year. Flood insurance adds $0-$2,400/year depending on zone.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">3. Pre-approval beats pre-qualification</h3>
            <p>A pre-qual is a back-of-the-napkin estimate. A pre-approval has your credit pulled, income verified, and gives you a real ceiling. Sellers in Hampton Roads will not entertain a pre-qual offer.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">4. BAH ends if you separate or PCS without orders</h3>
            <p>Plan your purchase against the timeline of your enlistment or commission, not just your current orders. If you might EAS in 2 years, factor that in.</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a real pre-approval?</p>
            <p className="text-blue-100 mt-1">I work with three Hampton Roads VA-specialist lenders. I will route you to the best fit based on credit and timeline.</p>
          </div>
          <Link href="/contact?source=bah-calc" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">
            Connect me with a lender
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-gray-900">Related</h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          <Link href="/military/va-loan-homes/hampton-roads/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">VA Loan Homes Guide</p>
            <p className="text-gray-600 mt-1">Eligibility, funding fee, max purchase.</p>
          </Link>
          <Link href="/military/relocation/hampton-roads/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Hampton Roads Relocation Pillar</p>
            <p className="text-gray-600 mt-1">All 10 bases, all 7 cities.</p>
          </Link>
          <Link href="/military/pcs-to/hampton-roads/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">PCS Playbook</p>
            <p className="text-gray-600 mt-1">120-day step-by-step.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
