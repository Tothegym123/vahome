import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dam Neck Annex: Living, Housing & PCS Guide | VaHome",
  description: "PCS guide for Dam Neck Annex in Virginia Beach, VA. Top neighborhoods, BAH (Norfolk MHA), schools, commute, and VA-loan home search for Hampton Roads military families.",
  alternates: { canonical: "https://vahome.com/military/bases/dam-neck-annex/" },
  openGraph: { title: "Dam Neck PCS Guide", description: "Hampton Roads housing, BAH, and neighborhoods for Dam Neck families.", url: "https://vahome.com/military/bases/dam-neck-annex/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Dam Neck Annex: Living, Housing & PCS Guide",
  description: "Comprehensive PCS guide for Dam Neck Annex covering housing, BAH, neighborhoods, schools, and commute strategy in Hampton Roads.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/bases/dam-neck-annex/",
};

const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "Dam Neck Annex",
  description: "U.S. Navy installation in Virginia Beach, VA.",
  address: { "@type": "PostalAddress", addressLocality: "Virginia Beach", addressRegion: "VA", addressCountry: "US" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Bases", item: "https://vahome.com/military/bases/" },
    { "@type": "ListItem", position: 4, name: "Dam Neck", item: "https://vahome.com/military/bases/dam-neck-annex/" },
  ],
};

export default function DamNeckAnnexPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/" className="hover:underline">Bases</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Dam Neck</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Dam Neck Annex</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Naval support installation in southern Virginia Beach hosting NSWC Dam Neck, Naval Special Warfare Development Group (DEVGRU / SEAL Team Six), and several training commands. Sister installation to NAS Oceana with shared services. Beachfront restricted facility on the Atlantic.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase">Branch</p>
            <p className="mt-1 text-xl font-bold text-blue-700">Navy</p>
            <p className="text-xs text-gray-600">Virginia Beach, VA</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">BAH MHA</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">IZ325 (Norfolk)</p>
            <p className="text-xs text-gray-600">Same as NSN, Oceana, JBLE</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Best for</p>
            <p className="mt-1 text-xs text-gray-700">Naval Special Warfare operators and support, training command staff, NSWC engineers</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best Neighborhoods for Dam Neck Families</h2>
        <p className="mt-3 text-gray-700">Sandbridge (oceanfront, flood-zone caveats), Red Mill, Strawbridge, Salem, Ocean Lakes â all southern VB.</p>
        <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
          <Link href="/military/military-friendly-neighborhoods/virginia-beach/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Virginia Beach neighborhood guide</p>
            <p className="text-gray-600 mt-1">Top neighborhoods for military families in Virginia Beach.</p>
          </Link>
          <Link href="/military/military-friendly-neighborhoods/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">All Hampton Roads cities</p>
            <p className="text-gray-600 mt-1">Compare every Hampton Roads city for military fit.</p>
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">BAH at Dam Neck</h2>
          <p className="mt-3 text-gray-700">
            Dam Neck falls inside the Norfolk Military Housing Area (MHA IZ325). BAH is identical to all other Hampton Roads installations including Naval Station Norfolk, NAS Oceana, JEB Little Creek-Fort Story, and Joint Base Langley-Eustis.
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
            <Link href="/military/bah/e-5/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">E-5: $2,430/mo</Link>
            <Link href="/military/bah/e-6/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">E-6: $2,559/mo</Link>
            <Link href="/military/bah/o-3/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">O-3: $2,694/mo</Link>
            <Link href="/military/bah/o-4/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">O-4: $3,054/mo</Link>
            <Link href="/military/bah/o-5/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">O-5: $3,318/mo</Link>
            <Link href="/military/bah-calculator/hampton-roads/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">Full table</Link>
          </div>
          <p className="mt-3 text-xs text-gray-500 italic">
            Source: <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH Calculator</a>.
          </p>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">PCS-ing to Dam Neck?</p>
            <p className="text-blue-100 mt-1">I'll send a curated home list matched to your duty station, BAH, and school priorities.</p>
          </div>
          <Link href="/contact?source=dam-neck-annex" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my list</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://cnrma.cnic.navy.mil/Installations/NAS-Oceana/About/Installation-Guide/Dam-Neck-Annex/" target="_blank" rel="noopener noreferrer" className="underline">CNIC â Dam Neck Annex</a>; <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>.
        </p>
      </section>
    </main>
  );
}
