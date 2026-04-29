import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PCS to Hampton Roads: 2026 Complete Playbook for Military Families | VaHome",
  description:
    "The full PCS playbook for orders to Hampton Roads, VA. Covers timing, base-by-base housing, BAH, schools, what to do months 1-6, and avoidable rookie mistakes.",
  alternates: { canonical: "https://www.vahome.com/military/pcs-to/hampton-roads/" },
  openGraph: {
    title: "PCS to Hampton Roads: 2026 Complete Playbook",
    description: "Step-by-step guide for military families PCSing to Hampton Roads, VA.",
    url: "https://www.vahome.com/military/pcs-to/hampton-roads/",
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "PCS to Hampton Roads: 2026 Complete Playbook for Military Families",
  description:
    "Step-by-step PCS guide for service members and military families relocating to Hampton Roads, Virginia. Covers all 10 installations, timing, BAH, schools, and home buying.",
  datePublished: "2026-04-28",
  dateModified: "2026-04-28",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor", url: "https://www.vahome.com/about/" },
  publisher: { "@type": "Organization", name: "VaHome", url: "https://www.vahome.com/" },
  mainEntityOfPage: "https://www.vahome.com/military/pcs-to/hampton-roads/",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How early should I start house-hunting before my Hampton Roads PCS?",
      acceptedAnswer: { "@type": "Answer", text: "Start research 90 days out, get a VA loan pre-approval at 60 days, and plan a house-hunting trip at 30-45 days. The Hampton Roads market moves fast in PCS season (May-August) and inventory under $400K can sell in under a week." } },
    { "@type": "Question", name: "Should I rent or buy when PCSing to Hampton Roads?",
      acceptedAnswer: { "@type": "Answer", text: "If your tour is 3+ years and BAH covers a mortgage at 2026 rates, buying with 0% down VA loan typically wins. If your tour is 2 years or less, rent. Hampton Roads has high transaction costs and you need 3-4 years of appreciation to break even on a sale." } },
    { "@type": "Question", name: "Which Hampton Roads city has the best schools for military families?",
      acceptedAnswer: { "@type": "Answer", text: "Chesapeake Public Schools and the southern Virginia Beach school zones consistently rank highest. Suffolk's Harbour View area and northern Virginia Beach are also strong. Norfolk and Portsmouth have stronger magnet/charter options but mixed traditional school ratings." } },
    { "@type": "Question", name: "How do I find a military-friendly Realtor in Hampton Roads?",
      acceptedAnswer: { "@type": "Answer", text: "Look for an agent who has personally closed 10+ VA loan deals, knows BAH rates by paygrade, and can name the commute time to your specific gate. Veteran-status alone is not the indicator. Closing volume on VA-financed homes is." } },
    { "@type": "Question", name: "What is the biggest mistake military buyers make in Hampton Roads?",
      acceptedAnswer: { "@type": "Answer", text: "Buying based on price-per-square-foot without checking the FEMA flood zone. AE/VE flood insurance can add $200-600/month and crater the deal at appraisal. Always pull the flood map before writing the offer." } },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://www.vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "PCS To", item: "https://www.vahome.com/military/pcs-to/" },
    { "@type": "ListItem", position: 4, name: "Hampton Roads", item: "https://www.vahome.com/military/pcs-to/hampton-roads/" },
  ],
};

const timeline = [
  { phase: "120-90 days out", actions: ["Read the orders carefully (UIC, report date, gaining command POC)", "Apply for housing wait list at base (don't commit, just queue)", "Start a Hampton Roads listings alert", "Pull your VA Certificate of Eligibility"] },
  { phase: "90-60 days out", actions: ["Get VA loan pre-approval (NOT just pre-qual)", "Pick your duty-station-aligned city: Norfolk/VB for NSN, VB for Oceana, Hampton/Newport News for Langley/JBLE", "Schedule HHG move date", "Identify 5-10 candidate neighborhoods"] },
  { phase: "60-30 days out", actions: ["House-hunting trip (3-5 days, 8-12 showings)", "Submit offers — be ready to write within 24 hours of seeing the right home", "Lock your rate when ratified", "Start school enrollment paperwork"] },
  { phase: "30-0 days out", actions: ["Final walkthrough (in person or virtual via your Realtor)", "Closing scheduled to align with HHG arrival ±3 days", "Set up Dominion Energy, water, internet at new address", "Forward mail to gaining command, not the new house yet"] },
  { phase: "Move week", actions: ["Inspect HHG load and unload day-of", "Check in at gaining command (don't skip the personnel office)", "Register vehicles in VA within 30 days (DMV Hampton Roads has 4 locations)"] },
  { phase: "First 90 days at command", actions: ["Get VA in-state tuition/registration paperwork to dependents", "Register for Tricare regional", "Update DEERS with new address", "Find a primary care manager (Naval Medical Center Portsmouth or Tricare network)"] },
];

const baseRouting = [
  { base: "Naval Station Norfolk", best: "Norfolk, VB north, Chesapeake Greenbrier", drive: "5-25 min" },
  { base: "Naval Air Station Oceana", best: "Virginia Beach (Kempsville, Princess Anne)", drive: "5-15 min" },
  { base: "JEB Little Creek-Fort Story", best: "Norfolk East Beach, VB north", drive: "10-20 min" },
  { base: "Langley AFB / JBLE", best: "Hampton, Yorktown, Newport News", drive: "5-25 min" },
  { base: "Naval Weapons Station Yorktown", best: "Yorktown, Newport News", drive: "5-20 min" },
  { base: "NSA Hampton Roads (Northwest)", best: "Chesapeake, Suffolk", drive: "15-30 min" },
  { base: "Norfolk Naval Shipyard (Portsmouth)", best: "Portsmouth, Chesapeake", drive: "5-20 min" },
];

export default function PCSToHRPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">PCS to Hampton Roads</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            PCS to Hampton Roads: 2026 Complete Playbook
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Orders just dropped for Hampton Roads? Here is the step-by-step playbook covering all 10 installations, BAH, schools, and home-buying timing. Built by a local Realtor who has closed 50+ PCS deals here.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div><p className="text-2xl font-bold text-blue-700">10</p><p className="text-xs text-gray-600 mt-1">Installations</p></div>
          <div><p className="text-2xl font-bold text-blue-700">~80K</p><p className="text-xs text-gray-600 mt-1">Active duty</p></div>
          <div><p className="text-2xl font-bold text-blue-700">7</p><p className="text-xs text-gray-600 mt-1">Cities</p></div>
          <div><p className="text-2xl font-bold text-blue-700">$340K</p><p className="text-xs text-gray-600 mt-1">Median home price</p></div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step 1: Match City to Duty Station</h2>
        <p className="mt-3 text-gray-700">The single biggest decision is where to live relative to your gate. Hampton Roads is split by water (Hampton Roads harbor and the Chesapeake Bay) and your commute will be defined by which side you live on.</p>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-900">Base</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-900">Best cities</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-900">Typical commute</th>
              </tr>
            </thead>
            <tbody>
              {baseRouting.map((r) => (
                <tr key={r.base} className="border-t border-gray-200">
                  <td className="px-3 py-2 font-medium text-gray-900">{r.base}</td>
                  <td className="px-3 py-2 text-gray-700">{r.best}</td>
                  <td className="px-3 py-2 text-gray-700">{r.drive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step 2: The 120-Day PCS Timeline</h2>
          <p className="mt-3 text-gray-700">Work backwards from your report date. Anything you can do early reduces the chance you arrive without a place to live.</p>
          <div className="mt-8 space-y-5">
            {timeline.map((t) => (
              <div key={t.phase} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-700">{t.phase}</h3>
                <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
                  {t.actions.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Step 3: Rent vs Buy Decision</h2>
        <p className="mt-3 text-gray-700">For tours of 3+ years, buying with a VA loan typically beats renting in Hampton Roads. The math gets close on 2-year tours and rent usually wins. Run real numbers in our calculator before deciding.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link href="/military/bah-calculator/hampton-roads/" className="border border-gray-200 rounded-lg p-5 hover:border-blue-600">
            <p className="font-semibold text-gray-900">2026 BAH Calculator</p>
            <p className="text-sm text-gray-600 mt-1">Plug in paygrade and dependents, see your rate.</p>
          </Link>
          <Link href="/military/va-loan-homes/hampton-roads/" className="border border-gray-200 rounded-lg p-5 hover:border-blue-600">
            <p className="font-semibold text-gray-900">VA Loan Homes Guide</p>
            <p className="text-sm text-gray-600 mt-1">Eligibility, funding fee, max purchase price.</p>
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Avoidable Rookie Mistakes</h2>
          <ol className="mt-6 space-y-4 text-gray-700 list-decimal list-inside">
            <li><span className="font-semibold text-gray-900">Skipping the flood zone check.</span> Norfolk and Virginia Beach have AE and VE zones where flood insurance can run $200-$600/month. Always pull the FEMA map before you write.</li>
            <li><span className="font-semibold text-gray-900">Using a non-local lender.</span> National lenders that advertise on TV often miss Virginia-specific things. Use a Hampton Roads VA-specialist lender.</li>
            <li><span className="font-semibold text-gray-900">Buying without a house-hunting trip.</span> Photos lie. Walk the neighborhood. Drive the commute at 0600.</li>
            <li><span className="font-semibold text-gray-900">Ignoring resale.</span> You will PCS again. Buy in a neighborhood where homes sell in less than 30 days, not where they sit for 90.</li>
            <li><span className="font-semibold text-gray-900">Passing on the VA inspection.</span> The VA appraisal is not a home inspection. Pay for both.</li>
          </ol>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-5">
          {faqSchema.mainEntity.map((q) => (
            <details key={q.name} className="border border-gray-200 rounded-lg p-4 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">{q.name}</summary>
              <p className="mt-3 text-gray-700">{q.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">PCSing here? Let me build your plan.</p>
            <p className="text-blue-100 mt-1">Tell me your gaining command, paygrade, family size, and report date. I will send a custom PCS plan inside 24 hours.</p>
          </div>
          <Link href="/contact?source=pcs-hr" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">
            Build my plan
          </Link>
        </div>
      </section>
    </main>
  );
}
