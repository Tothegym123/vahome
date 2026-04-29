import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hampton Roads Flood Zones: Buyer's Guide for Military Families | VaHome",
  description:
    "How FEMA flood zones (AE, X, VE, AO) work in Hampton Roads, what they mean for VA-loan flood insurance, and how to verify a specific address before writing an offer.",
  alternates: { canonical: "https://www.vahome.com/military/flood-zones/hampton-roads/" },
  openGraph: { title: "Hampton Roads Flood Zones Guide", description: "Decode FEMA flood zones before buying near Hampton Roads water.", url: "https://www.vahome.com/military/flood-zones/hampton-roads/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hampton Roads Flood Zones: A Practical Buyer's Guide",
  description: "Plain-English explanation of FEMA flood zone designations as they apply to Hampton Roads home purchases, with VA-loan flood insurance implications.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://www.vahome.com/military/flood-zones/hampton-roads/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://www.vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Flood Zones", item: "https://www.vahome.com/military/flood-zones/" },
    { "@type": "ListItem", position: 4, name: "Hampton Roads", item: "https://www.vahome.com/military/flood-zones/hampton-roads/" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Does VA loan require flood insurance?", acceptedAnswer: { "@type": "Answer", text: "If your home is in a Special Flood Hazard Area (SFHA, Zones A or V), federally-backed loans including VA require flood insurance for the life of the loan. Outside SFHAs (Zone X), it is optional but often still recommended in coastal areas." } },
    { "@type": "Question", name: "What is the difference between Zone AE and Zone X?", acceptedAnswer: { "@type": "Answer", text: "Zone AE is a Special Flood Hazard Area with a 1% annual chance of flooding (the '100-year floodplain'). Zone X is outside the SFHA but may still have flood risk; insurance is not federally mandated but rates are lower." } },
    { "@type": "Question", name: "How do I check the flood zone of a specific Hampton Roads address?", acceptedAnswer: { "@type": "Answer", text: "Use FEMA's Flood Map Service Center (msc.fema.gov) to look up the official flood map for any address in the U.S. Always verify before writing an offer." } },
  ],
};

export default function FloodZonesHamptonRoads() {
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
            <span className="text-white">Flood Zones</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Hampton Roads Flood Zones: A Buyer's Guide</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Hampton Roads is one of the most flood-prone metros on the East Coast. Whether you're VA-financing a coastal home or weighing a deal in Olde Towne Portsmouth, understanding flood zones is non-negotiable.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">FEMA Flood Zone Designations</h2>
        <p className="mt-3 text-gray-700">
          Every parcel in the U.S. has a designated flood zone on the official FEMA Flood Insurance Rate Map (FIRM). Hampton Roads sees these most often:
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Zone X (or Zone X shaded)</p>
            <p className="text-sm text-gray-700 mt-2">Outside the Special Flood Hazard Area. Lower-risk. Flood insurance is <strong>optional</strong> for federally-backed loans like VA. Shaded X means moderate risk; unshaded X means minimal.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Zone AE</p>
            <p className="text-sm text-gray-700 mt-2">Special Flood Hazard Area (SFHA) with 1% annual chance of flooding. Base Flood Elevation (BFE) is shown on the map. Flood insurance is <strong>required</strong> with a VA loan. Common in low-lying Norfolk, Portsmouth, and inner-bay shorelines.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Zone VE</p>
            <p className="text-sm text-gray-700 mt-2">Coastal high-hazard area subject to wave action. Higher premiums and stricter construction standards. Common in Sandbridge, Buckroe, and parts of the bay-front.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Zone AO</p>
            <p className="text-sm text-gray-700 mt-2">Sheet-flow flooding, typically 1-3 feet deep. Less common in HR than AE/VE. Insurance required with federally-backed loans.</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://www.fema.gov/glossary/flood-zones" target="_blank" rel="noopener noreferrer" className="underline">FEMA — Flood Zones</a>.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">VA Loan Flood Insurance Rules</h2>
          <p className="mt-3 text-gray-700">
            If the property is in an SFHA (Zones A* or V*), federally-backed lenders — including VA — must require flood insurance for the life of the loan. The premium is escrowed with your monthly mortgage payment. Outside SFHAs, flood insurance is optional but commonly recommended.
          </p>
          <p className="mt-3 text-gray-700">
            FEMA's Risk Rating 2.0 (effective 2021-2023) replaced the legacy zone-based premium structure with a per-property model. Two homes on the same street can now have very different premiums based on elevation, distance to water, and rebuild cost.
          </p>
          <p className="mt-3 text-xs text-gray-500 italic">
            Source: <a href="https://www.fema.gov/flood-insurance/risk-rating" target="_blank" rel="noopener noreferrer" className="underline">FEMA — Risk Rating 2.0</a>; <a href="https://www.va.gov/housing-assistance/home-loans/" target="_blank" rel="noopener noreferrer" className="underline">VA Home Loans</a>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Higher-Risk Hampton Roads Areas to Verify Carefully</h2>
        <p className="mt-3 text-gray-700">These neighborhoods commonly include parcels in AE or VE — never assume from address alone, always check the specific lot:</p>
        <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
          <li>Norfolk: Hague, Larchmont, Ocean View, Willoughby Spit, Riverview, parts of Ghent</li>
          <li>Portsmouth: Olde Towne, Port Norfolk, Park View riverfront</li>
          <li>Virginia Beach: Sandbridge, North End oceanfront, Lynnhaven Colony, Croatan</li>
          <li>Hampton: Buckroe Beach, Phoebus waterfront, Salt Ponds</li>
          <li>Newport News: Hilton Village riverfront lots</li>
          <li>Chesapeake: Deep Creek-area properties along waterways</li>
        </ul>
        <p className="mt-4 text-gray-700">Higher-elevation alternatives — typically Zone X — include Greenbrier (Chesapeake), Princess Anne (VB), Riverdale (Hampton), and Kiln Creek (Newport News).</p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Check Any Address (3 minutes)</h2>
          <ol className="mt-4 list-decimal list-inside space-y-2 text-gray-700">
            <li>Go to <a href="https://msc.fema.gov" target="_blank" rel="noopener noreferrer" className="underline">FEMA Flood Map Service Center</a>.</li>
            <li>Enter the property address; the system zooms to the parcel and shows the FIRM panel.</li>
            <li>Note the zone designation (X, AE, VE, etc.) and any Base Flood Elevation.</li>
            <li>For AE/VE properties, request the seller's <strong>Elevation Certificate</strong> — it materially affects insurance pricing under Risk Rating 2.0.</li>
            <li>Get a flood insurance quote before removing the financing contingency.</li>
          </ol>
          <p className="mt-3 text-xs text-gray-500 italic">
            For sea-level rise projections specific to Hampton Roads, see <a href="https://www.vims.edu" target="_blank" rel="noopener noreferrer" className="underline">VIMS</a> (Virginia Institute of Marine Science).
          </p>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Need flood-zone-cleared listings?</p>
            <p className="text-blue-100 mt-1">I pre-screen listings against FEMA maps and exclude flood-required properties unless you've asked for them.</p>
          </div>
          <Link href="/contact?source=flood-zones" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Send my filtered list</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://msc.fema.gov" target="_blank" rel="noopener noreferrer" className="underline">FEMA Flood Map Service Center</a>; <a href="https://www.fema.gov/flood-insurance/risk-rating" target="_blank" rel="noopener noreferrer" className="underline">FEMA Risk Rating 2.0</a>; <a href="https://www.va.gov/housing-assistance/home-loans/" target="_blank" rel="noopener noreferrer" className="underline">VA Home Loans</a>; <a href="https://www.vims.edu" target="_blank" rel="noopener noreferrer" className="underline">VIMS</a>.
        </p>
      </section>
    </main>
  );
}
