import type { Metadata } from "next";
import Link from "next/link";
import HamptonRoadsAreaGuide from '../../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: "E-6 BAH Norfolk MHA (2026): $2,559/mo with Dependents | VaHome",
  description:
    "2026 verified BAH rate for E-6 with dependents in the Norfolk Military Housing Area: $2,559/mo. See max home price, top neighborhoods, and how to use it with a VA loan.",
  alternates: { canonical: "https://vahome.com/military/bah/e-6/norfolk-mha/" },
  openGraph: { title: "E-6 BAH Norfolk MHA (2026)", description: "$2,559/mo with dependents. Max home price ~$410,000.", url: "https://vahome.com/military/bah/e-6/norfolk-mha/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "E-6 BAH in the Norfolk MHA (2026)",
  description: "Verified 2026 BAH rate for E-6 with dependents in Norfolk MHA, with affordability math and Hampton Roads home recommendations.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/bah/e-6/norfolk-mha/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "BAH", item: "https://vahome.com/military/bah/" },
    { "@type": "ListItem", position: 4, name: "E-6", item: "https://vahome.com/military/bah/e-6/" },
    { "@type": "ListItem", position: 5, name: "Norfolk MHA", item: "https://vahome.com/military/bah/e-6/norfolk-mha/" },
  ],
};

export default function BAHPageE6() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bah-calculator/hampton-roads/" className="hover:underline">BAH</Link>
            <span className="mx-2">/</span>
            <span className="text-white">E-6 - Norfolk MHA</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">E-6 BAH in the Norfolk MHA (2026)</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Official 2026 BAH for E-6 with dependents in the Norfolk Military Housing Area. Plus the max home price this rate supports on a VA loan and the Hampton Roads neighborhoods that fit best.
          </p>
        </div>
      </section>

      {/* Verified rate card */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase">2026 BAH (with dependents)</p>
            <p className="mt-1 text-3xl font-bold text-blue-700">$2,559</p>
            <p className="text-xs text-gray-600">per month</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Max home price</p>
            <p className="mt-1 text-3xl font-bold text-blue-700">~$410,000</p>
            <p className="text-xs text-gray-600">VA loan, 0% down</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">MHA</p>
            <p className="mt-1 text-3xl font-bold text-blue-700">IZ325</p>
            <p className="text-xs text-gray-600">Norfolk / Hampton Roads</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          The E-6 with-dependents rate of <strong>$2,559/mo</strong> applies uniformly across all Hampton Roads installations: Naval Station Norfolk, NAS Oceana, JEB Little Creek-Fort Story, Joint Base Langley-Eustis, Norfolk Naval Shipyard, NSA Hampton Roads, Naval Medical Center Portsmouth, and Coast Guard Base Portsmouth.
        </p>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">Defense Travel Management Office BAH Calculator</a> (Norfolk MHA, ZIP 23511). Verify your exact rate using your specific installation ZIP.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who This Rate Fits</h2>
          <p className="mt-3 text-gray-700">Mid-grade enlisted with family. Settled into 6-12 years of service with a stable family situation.</p>
          <p className="mt-4 text-gray-700">At $2,559/mo, an E-6 with dependents can support a home around $410K. This opens up Greenbrier (Chesapeake), Larchmont (Norfolk), Aragona Village, and Princess Anne (VB).</p>
          <p className="mt-3 text-xs text-gray-500 italic">
            Max home price assumes 30-year fixed VA loan, current 2026 rates, no other significant debt, and BAH covering 100% of principal + interest + taxes + insurance. Actual approval depends on credit and lender overlays.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Listings That Fit Your E-6 BAH</h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link href="/listings?max_price=410000&va_eligible=true" className="border border-gray-200 rounded-lg p-5 hover:border-blue-600">
            <p className="font-semibold text-gray-900">All listings under $410,000</p>
            <p className="text-sm text-gray-600 mt-1">VA-eligible Hampton Roads inventory.</p>
          </Link>
          <Link href="/military/bah-calculator/hampton-roads/" className="border border-gray-200 rounded-lg p-5 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Full BAH table</p>
            <p className="text-sm text-gray-600 mt-1">All paygrades with verified rates.</p>
          </Link>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Ready to get pre-approved?</p>
            <p className="text-blue-100 mt-1">I can connect you with a Hampton Roads VA-specialist lender and send a curated home list.</p>
          </div>
          <Link href="/contact?source=bah-e-6" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my pre-approval</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH Calculator</a>; <a href="https://www.va.gov/housing-assistance/home-loans/" target="_blank" rel="noopener noreferrer" className="underline">VA Home Loans</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>.
        </p>
      </section>
      <HamptonRoadsAreaGuide />
    </main>
  );
}
