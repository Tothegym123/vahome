import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Homes Near Joint Base Langley-Eustis (JBLE) | VaHome",
  description:
    "Search homes near JBLE â Hampton, Newport News, Yorktown, and Williamsburg. Filter by VA loan eligibility, BAH, and commute to Langley AFB or Fort Eustis.",
  alternates: { canonical: "https://vahome.com/military/homes-near/joint-base-langley-eustis/" },
  openGraph: { title: "Homes Near JBLE", description: "VA-loan-eligible homes on the Virginia Peninsula matched to JBLE commute and BAH.", url: "https://vahome.com/military/homes-near/joint-base-langley-eustis/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Homes Near Joint Base Langley-Eustis",
  description: "Curated guide to buying near JBLE â neighborhoods, commute math, BAH-matched price points, and VA loan strategy.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/homes-near/joint-base-langley-eustis/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Homes Near", item: "https://vahome.com/military/homes-near/" },
    { "@type": "ListItem", position: 4, name: "JBLE", item: "https://vahome.com/military/homes-near/joint-base-langley-eustis/" },
  ],
};

export default function HomesNearJBLE() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/joint-base-langley-eustis/" className="hover:underline">JBLE</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Homes Near</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Homes Near Joint Base Langley-Eustis</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Whether you're reporting to Langley AFB in Hampton or Fort Eustis in Newport News, the Virginia Peninsula has a different rhythm than South Hampton Roads â quieter, often more affordable, with strong public schools.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Match Homes to Your JBLE Side</h2>
        <p className="mt-3 text-gray-700">Langley and Eustis are about 20 minutes apart by I-64, but daily commute realities differ. Here's how to filter by your reporting installation:</p>

        <div className="mt-6 space-y-5">
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Reporting to Langley AFB</p>
            <p className="text-sm text-gray-700 mt-2">Best fit: Hampton (Riverdale, Wythe, Phoebus, Fox Hill), Poquoson, lower Newport News. Average commute under 20 minutes.</p>
            <Link href="/listings?city=hampton&va_eligible=true" className="text-blue-700 text-sm mt-3 inline-block hover:underline">Browse Hampton listings &rarr;</Link>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Reporting to Fort Eustis</p>
            <p className="text-sm text-gray-700 mt-2">Best fit: Newport News (Hilton Village, Denbigh, Kiln Creek), York County, James City County, southern Williamsburg. Average commute 10-25 minutes.</p>
            <Link href="/listings?city=newport-news&va_eligible=true" className="text-blue-700 text-sm mt-3 inline-block hover:underline">Browse Newport News listings &rarr;</Link>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Dual-military or commuting to South Hampton Roads</p>
            <p className="text-sm text-gray-700 mt-2">If your spouse works in Norfolk/VB, the I-64 HRBT (Hampton Roads Bridge-Tunnel) commute is the limiting factor. Consider neighborhoods near I-664 (Hampton, Suffolk) which use the MMMBT alternate.</p>
            <p className="mt-3 text-xs text-gray-500 italic">Check live HRBT/MMMBT conditions at <a href="https://511virginia.org" target="_blank" rel="noopener noreferrer" className="underline">511virginia.org</a>.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Peninsula vs South Hampton Roads</h2>
          <p className="mt-3 text-gray-700">Same Norfolk MHA BAH applies on both sides â but Peninsula homes generally trade for less per square foot than Virginia Beach or Chesapeake. Your BAH stretches further here.</p>
          <p className="mt-4 text-gray-700">Tradeoffs to know: HRBT congestion can isolate the Peninsula during peak hours; flood-zone exposure varies by waterfront proximity (verify <a href="https://msc.fema.gov" target="_blank" rel="noopener noreferrer" className="underline">FEMA flood maps</a> per address).</p>
          <p className="mt-3 text-xs text-gray-500 italic">Median sale data: <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS market reports</a>.</p>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a curated JBLE home list?</p>
            <p className="text-blue-100 mt-1">Tell me your installation, paygrade, and school priorities â I'll send hand-picked listings.</p>
          </div>
          <Link href="/contact?source=homes-near-jble" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Send my list</Link>
        </div>
      </section>
    </main>
  );
}
