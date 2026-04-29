import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hampton Roads PCS Checklist: 90 Days Before You Move | VaHome",
  description:
    "Step-by-step PCS checklist for military families relocating to Hampton Roads. 90 days out through arrival — orders, BAH, schools, lease vs buy, lender, agent, and inspection essentials.",
  alternates: { canonical: "https://www.vahome.com/military/pcs-checklist/hampton-roads/" },
  openGraph: { title: "Hampton Roads PCS Checklist", description: "90-day countdown checklist for moving to Hampton Roads.", url: "https://www.vahome.com/military/pcs-checklist/hampton-roads/", type: "article" },
};

const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: "Hampton Roads PCS Checklist: 90 Days Before You Move", description: "Comprehensive 90-day PCS checklist for military families relocating to Hampton Roads, Virginia.", datePublished: "2026-04-29", dateModified: "2026-04-29", author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" }, publisher: { "@type": "Organization", name: "VaHome" }, mainEntityOfPage: "https://www.vahome.com/military/pcs-checklist/hampton-roads/" };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vahome.com/" },
  { "@type": "ListItem", position: 2, name: "Military", item: "https://www.vahome.com/military/" },
  { "@type": "ListItem", position: 3, name: "PCS Checklist", item: "https://www.vahome.com/military/pcs-checklist/" },
  { "@type": "ListItem", position: 4, name: "Hampton Roads", item: "https://www.vahome.com/military/pcs-checklist/hampton-roads/" },
] };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Should I rent or buy when PCS-ing to Hampton Roads?", acceptedAnswer: { "@type": "Answer", text: "Buy if (1) tour length is 3+ years, (2) BAH covers PITI on a home you'd actually want, and (3) you can afford a temporary rental during house-hunting. Rent first if tour is short, your job is unstable, or you need time to learn the area before committing." } },
  { "@type": "Question", name: "How early should I contact a Hampton Roads agent?", acceptedAnswer: { "@type": "Answer", text: "60-90 days out. That's enough time to align on neighborhoods, get pre-approved with a VA-specialist lender, and identify target listings before your house-hunting trip." } },
  { "@type": "Question", name: "Can I use VA loan multiple times?", acceptedAnswer: { "@type": "Answer", text: "Yes. Your VA entitlement is restorable. You can use a VA loan for each new PCS, sell or rent the prior home, and reuse entitlement. Talk to a VA-specialist lender about partial entitlement scenarios if you keep the prior home as a rental." } },
] };

export default function PCSChecklist() {
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
            <span className="text-white">PCS Checklist</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Hampton Roads PCS Checklist: 90 Days Before You Move</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            A practical countdown for military families moving to Hampton Roads. Each phase has specific real-estate decisions, finance milestones, and family logistics.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">90 Days Out</h2>
        <ul className="mt-4 space-y-3 text-gray-700">
          <li><strong>Confirm orders.</strong> Cut PCS orders give you the legal basis for DLA, dislocation allowance, and TDY/HHG entitlements.</li>
          <li><strong>Pull your VA Certificate of Eligibility (COE).</strong> Through eBenefits or have your lender pull it. <a href="https://www.va.gov/housing-assistance/home-loans/how-to-apply/" target="_blank" rel="noopener noreferrer" className="underline">VA.gov</a>.</li>
          <li><strong>Lock in your installation and BAH paygrade.</strong> Use the <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH calculator</a>. Hampton Roads is one Norfolk MHA (IZ325) for all installations.</li>
          <li><strong>Decide rent vs buy.</strong> Buy if 3+ year tour and BAH covers PITI. <Link href="/military/va-loan-homes/hampton-roads/" className="text-blue-700 underline">VA loan homes guide</Link>.</li>
          <li><strong>Reach out to a local agent.</strong> Get on email auto-search early. Hampton Roads is competitive in some sub-markets.</li>
        </ul>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">60 Days Out</h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li><strong>Get pre-approved with a VA-specialist lender.</strong> Not all lenders handle VA equally; use one familiar with Norfolk MHA and military overlays.</li>
            <li><strong>Pick your target neighborhoods.</strong> 3-5 areas based on installation, school priority, BAH, and commute. See city guides: <Link href="/military/military-friendly-neighborhoods/virginia-beach/" className="text-blue-700 underline">VB</Link>, <Link href="/military/military-friendly-neighborhoods/norfolk/" className="text-blue-700 underline">Norfolk</Link>, <Link href="/military/military-friendly-neighborhoods/chesapeake/" className="text-blue-700 underline">Chesapeake</Link>, <Link href="/military/military-friendly-neighborhoods/portsmouth/" className="text-blue-700 underline">Portsmouth</Link>, <Link href="/military/military-friendly-neighborhoods/hampton/" className="text-blue-700 underline">Hampton</Link>, <Link href="/military/military-friendly-neighborhoods/newport-news/" className="text-blue-700 underline">Newport News</Link>, <Link href="/military/military-friendly-neighborhoods/suffolk/" className="text-blue-700 underline">Suffolk</Link>.</li>
            <li><strong>Verify schools per zone.</strong> Use <a href="https://schoolquality.virginia.gov" target="_blank" rel="noopener noreferrer" className="underline">VA DOE</a> for ratings. Don't trust city averages — zoning matters.</li>
            <li><strong>Schedule HHG counseling.</strong> Through your installation TMO/PPSO. Decide PPM (DITY) vs full government move.</li>
            <li><strong>Book your house-hunting trip (HHT).</strong> 3-5 days minimum. Plan to see 8-12 properties.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">30 Days Out</h2>
        <ul className="mt-4 space-y-3 text-gray-700">
          <li><strong>Finalize rent vs buy decision.</strong> If buying: target listings curated and ready to tour during HHT.</li>
          <li><strong>If renting first:</strong> short-term rental options include extended-stay hotels near base, mil-friendly rental property managers, or Airbnb (verify month-long discounts).</li>
          <li><strong>Get FEMA flood maps for any candidate address.</strong> <a href="https://msc.fema.gov" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>. <Link href="/military/flood-zones/hampton-roads/" className="text-blue-700 underline">Hampton Roads flood zones guide</Link>.</li>
          <li><strong>Lock interest rate or float.</strong> Discuss with your lender. Most VA lenders offer free re-locks if rates drop.</li>
          <li><strong>Update vehicle registration and DEERS.</strong> Notify TRICARE region of your move.</li>
          <li><strong>Inspection checklist:</strong> Hampton Roads has high humidity — prioritize moisture/mold inspection, HVAC age, roof age, and crawlspace if applicable.</li>
        </ul>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">House-Hunting Trip (Days 0)</h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li><strong>Drive the actual commute</strong> from each target neighborhood at peak hours. The HRBT and MMMBT are tunnel chokepoints — drive them at 0700-0800 to feel the real impact.</li>
            <li><strong>Tour 8-12 properties</strong> across 2-3 days. Take photos and notes; properties blur fast.</li>
            <li><strong>Re-visit your top 2-3</strong> on the last day before writing offers.</li>
            <li><strong>Write strong offers fast</strong> on your favorite. Hampton Roads sub-markets can move quickly. VA loans can compete — your lender's pre-approval letter and a local-agent submission help.</li>
            <li><strong>Verify FEMA flood zone</strong> on the contract address before removing financing contingency.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">After Closing / On Arrival</h2>
        <ul className="mt-4 space-y-3 text-gray-700">
          <li><strong>Update DD Form 2058</strong> for state of legal residence if changing.</li>
          <li><strong>Register VA vehicle within 30 days</strong> (or claim non-resident exemption if maintaining home-state residency under SCRA).</li>
          <li><strong>Schedule sponsor checkin</strong> at your new command.</li>
          <li><strong>Enroll kids in schools</strong> — bring orders, immunization records, prior school transcripts. Some districts offer interstate compact accommodations for military kids.</li>
          <li><strong>Establish flood insurance</strong> if applicable — required for VA loans in SFHAs (Zones A* or V*).</li>
        </ul>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">PCS-ing to Hampton Roads?</p>
            <p className="text-blue-100 mt-1">I'll get you on auto-search now and walk every step from pre-approval to keys.</p>
          </div>
          <Link href="/contact?source=pcs-checklist" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Start my PCS plan</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://www.va.gov/housing-assistance/home-loans/" target="_blank" rel="noopener noreferrer" className="underline">VA Home Loans</a>; <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH</a>; <a href="https://msc.fema.gov" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>; <a href="https://schoolquality.virginia.gov" target="_blank" rel="noopener noreferrer" className="underline">VA DOE</a>.
        </p>
      </section>
    </main>
  );
}
