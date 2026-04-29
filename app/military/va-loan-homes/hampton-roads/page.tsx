import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VA Loan Homes in Hampton Roads (2026 Guide) | 0% Down for Veterans | VaHome",
  description:
    "Complete 2026 guide to VA loan home buying in Hampton Roads, Virginia. Eligibility, funding fee, max loan amount, VA appraisal, and how to use it with 0% down.",
  alternates: { canonical: "https://vahome.com/military/va-loan-homes/hampton-roads/" },
  openGraph: {
    title: "VA Loan Homes in Hampton Roads (2026 Guide)",
    description: "Eligibility, funding fee, VA appraisal, max loan, all explained.",
    url: "https://vahome.com/military/va-loan-homes/hampton-roads/",
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "VA Loan Homes in Hampton Roads (2026 Guide)",
  description:
    "Comprehensive 2026 VA loan guide for Hampton Roads, Virginia. Covers eligibility, funding fee, VA appraisal, condition standards, and using your VA loan with 0% down.",
  datePublished: "2026-04-28",
  dateModified: "2026-04-28",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/va-loan-homes/hampton-roads/",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Who is eligible for a VA loan in 2026?",
      acceptedAnswer: { "@type": "Answer", text: "Active-duty service members with 90+ days, veterans who served 90 days during wartime or 181 days during peacetime, National Guard/Reserve members with 6+ years of service, and surviving spouses of service members who died in the line of duty are typically eligible. Pull your Certificate of Eligibility (COE) on the VA eBenefits portal." } },
    { "@type": "Question", name: "What is the VA funding fee in 2026?",
      acceptedAnswer: { "@type": "Answer", text: "For first-time use of the VA loan with 0% down, the 2026 funding fee is 2.15% of the loan amount. Subsequent uses are 3.3%. (The Reserve/Guard surcharge was eliminated effective Jan 1, 2020.) Veterans with a service-connected disability rating of 10% or higher are exempt. Starting tax year 2026, the funding fee is tax-deductible (subject to filing rules)." } },
    { "@type": "Question", name: "Is there a max VA loan amount in Hampton Roads?",
      acceptedAnswer: { "@type": "Answer", text: "For 2026, veterans with full entitlement have no max loan amount, but the home must appraise and you must qualify based on income. For veterans with reduced entitlement, the conforming loan limit applies. 2026 baseline conforming limit is $832,750 for one-unit properties (Norfolk-Virginia Beach-Newport News MSA falls under the baseline). Veterans with FULL entitlement have NO VA-imposed maximum loan amount under the Blue Water Navy Veterans Act (effective Jan 1, 2020)." } },
    { "@type": "Question", name: "What is the VA appraisal looking for?",
      acceptedAnswer: { "@type": "Answer", text: "The VA appraisal verifies the home meets Minimum Property Requirements (MPRs): functional roof and HVAC, no termite or moisture issues, working utilities, no peeling paint on pre-1978 homes, and safe egress. It is NOT a home inspection Ã¢ÂÂ always pay for a separate professional inspection." } },
    { "@type": "Question", name: "Can I use a VA loan more than once?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The VA loan benefit is reusable. If your first VA-financed home is paid off, your full entitlement restores. If you still have an active VA loan, you may have partial entitlement available for a second VA loan, common with PCS moves." } },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "VA Loan Homes", item: "https://vahome.com/military/va-loan-homes/" },
    { "@type": "ListItem", position: 4, name: "Hampton Roads", item: "https://vahome.com/military/va-loan-homes/hampton-roads/" },
  ],
};

const fundingFeeTable = [
  { down: "0% down Ã¢ÂÂ first use", regular: "2.15%", subsequent: "3.30%" },
  { down: "5%-9% down", regular: "1.50%", subsequent: "1.50%" },
  { down: "10%+ down", regular: "1.25%", subsequent: "1.25%" },
];

export default function VALoanHomesPage() {
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
            <span className="text-white">VA Loan Homes</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            VA Loan Homes in Hampton Roads (2026 Guide)
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            The VA loan is the most powerful home-buying benefit in America: 0% down, no PMI, competitive rates. Here is how to use it in Hampton Roads in 2026.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div><p className="text-2xl font-bold text-blue-700">0%</p><p className="text-xs text-gray-600 mt-1">Down payment</p></div>
          <div><p className="text-2xl font-bold text-blue-700">No PMI</p><p className="text-xs text-gray-600 mt-1">Ever</p></div>
          <div><p className="text-2xl font-bold text-blue-700">2.15%</p><p className="text-xs text-gray-600 mt-1">Funding fee (1st use)</p></div>
          <div><p className="text-2xl font-bold text-blue-700">41%</p><p className="text-xs text-gray-600 mt-1">VA share of HR purchase loans (2024)</p></div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          In 2024, VA loans accounted for 41% of all home-purchase loans in Hampton Roads â about 5x the national average â reflecting the region's heavy military presence. It is the right choice for most active-duty and veteran buyers because it removes the two biggest barriers to home ownership: the down payment and PMI. In a market where the median home is around $340K, a VA loan saves roughly $17K-$68K up front and $200-$400/month in PMI.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          But the VA loan is not free, and it is not the right answer in every situation. This guide walks through eligibility, the funding fee, max loan amounts, the VA appraisal process, and the real trade-offs of using your VA benefit in Hampton Roads.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">VA Loan Eligibility (2026)</h2>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li><span className="font-semibold text-gray-900">Active duty:</span> 90+ continuous days of active service</li>
            <li><span className="font-semibold text-gray-900">Veterans:</span> 90+ days during wartime, or 181+ days during peacetime</li>
            <li><span className="font-semibold text-gray-900">National Guard / Reserve:</span> 6+ years of service, or 90+ days of active duty under Title 10</li>
            <li><span className="font-semibold text-gray-900">Surviving spouses:</span> spouses of service members who died in line of duty or from service-connected disability</li>
          </ul>
          <p className="mt-4 text-gray-700">Pull your Certificate of Eligibility (COE) on VA eBenefits, or have your lender pull it for you. It takes minutes and is required before any VA-backed offer.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">2026 VA Funding Fee</h2>
        <p className="mt-3 text-gray-700">The funding fee is a one-time fee that goes to the VA to keep the program running. It can be rolled into the loan, so you do not have to pay it out of pocket. Veterans with a service-connected disability rating of 10% or higher are exempt.</p>
        <div className="mt-6 overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-3 text-left font-semibold text-gray-900">Down payment</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-900">First use</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-900">Subsequent use</th>
              </tr>
            </thead>
            <tbody>
              {fundingFeeTable.map((r, i) => (
                <tr key={r.down} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-3 py-2 font-medium text-gray-900">{r.down}</td>
                  <td className="px-3 py-2 text-right text-gray-800">{r.regular}</td>
                  <td className="px-3 py-2 text-right text-gray-800">{r.subsequent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The VA Appraisal in Hampton Roads</h2>
          <p className="mt-3 text-gray-700">The VA appraiser is checking two things: market value and Minimum Property Requirements (MPRs). MPRs are stricter than a conventional appraisal and they trip up a lot of Hampton Roads deals.</p>
          <h3 className="mt-6 font-semibold text-gray-900">Common Hampton Roads MPR snags</h3>
          <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
            <li>Roof life under 3 years remaining (very common in 1980s-1990s homes)</li>
            <li>HVAC over 20 years old or non-functioning</li>
            <li>Active termite damage or evidence (Hampton Roads has high termite pressure)</li>
            <li>Peeling lead paint on homes built before 1978</li>
            <li>Failing wood siding, fascia, or rotted soffits</li>
            <li>Standing water in crawl space</li>
            <li>Missing handrails on staircases</li>
          </ul>
          <p className="mt-4 text-gray-700">If the VA appraiser flags any of these, the seller has to fix it before closing or the deal dies. This is why your offer should always include a VA appraisal contingency and your inspector should pre-flight the obvious issues.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">When NOT to Use a VA Loan</h2>
        <div className="mt-6 space-y-4 text-gray-700">
          <p><span className="font-semibold text-gray-900">1. The home will not pass MPRs.</span> If you are looking at a fixer-upper, a VA loan will not work. Conventional or FHA 203k is the right tool.</p>
          <p><span className="font-semibold text-gray-900">2. You are competing against multiple cash offers.</span> In a hot bidding war, sellers occasionally pass on VA offers fearing the appraisal. Sometimes adding 10-20% down on a conventional loan wins you the house.</p>
          <p><span className="font-semibold text-gray-900">3. You are buying an investment property.</span> The VA loan is owner-occupied only. You must move in within 60 days.</p>
          <p><span className="font-semibold text-gray-900">4. You have substantial down payment cash.</span> Putting 20% down on a conventional loan and saving the funding fee can be the right call if rates are similar.</p>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {faqSchema.mainEntity.map((q) => (
              <details key={q.name} className="bg-white border border-gray-200 rounded-lg p-4">
                <summary className="font-semibold text-gray-900 cursor-pointer">{q.name}</summary>
                <p className="mt-3 text-gray-700">{q.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Ready to use your VA benefit?</p>
            <p className="text-blue-100 mt-1">I can connect you with a VA-specialist lender and walk you through your first offer.</p>
          </div>
          <Link href="/contact?source=va-loan-hr" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">
            Start my VA pre-approval
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-gray-900">Related</h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          <Link href="/military/bah-calculator/hampton-roads/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">2026 BAH Calculator</p>
            <p className="text-gray-600 mt-1">By paygrade and dependents.</p>
          </Link>
          <Link href="/military/relocation/hampton-roads/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Relocation Pillar</p>
            <p className="text-gray-600 mt-1">Full Hampton Roads military overview.</p>
          </Link>
          <Link href="/military/pcs-to/hampton-roads/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">PCS Playbook</p>
            <p className="text-gray-600 mt-1">120-day step-by-step guide.</p>
          </Link>
        </div>
      </section>
    
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://www.tieronecoastal.com/va-loans-hampton-roads-military-buyers/" target="_blank" rel="noopener noreferrer" className="underline">2024 HMDA via Tier One Coastal</a> (VA loan share); <a href="https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-values-for-2026" target="_blank" rel="noopener noreferrer" className="underline">FHFA 2026 Conforming Loan Limits</a>; <a href="https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/" target="_blank" rel="noopener noreferrer" className="underline">VA Funding Fee schedule</a>; <a href="https://www.va.gov/housing-assistance/home-loans/eligibility/" target="_blank" rel="noopener noreferrer" className="underline">VA Eligibility</a>; <a href="https://www.benefits.va.gov/homeloans/bwnact.asp" target="_blank" rel="noopener noreferrer" className="underline">Blue Water Navy Veterans Act</a>.
        </p>
      </section>
    </main>
  );
}
