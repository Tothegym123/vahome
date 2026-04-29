import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Joint Base Langley-Eustis (JBLE): Living, Housing & PCS Guide | VaHome",
  description:
    "Complete relocation guide for Joint Base Langley-Eustis. F-22 Raptors at Langley AFB, U.S. Army Transportation Corps at Fort Eustis. Best Hampton & Newport News neighborhoods, BAH, schools, commute math.",
  alternates: { canonical: "https://vahome.com/military/bases/joint-base-langley-eustis/" },
  openGraph: { title: "Joint Base Langley-Eustis (JBLE) PCS Guide", description: "Hampton + Newport News housing, BAH, schools, and commute for Air Force and Army families.", url: "https://vahome.com/military/bases/joint-base-langley-eustis/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Joint Base Langley-Eustis: Living, Housing & PCS Guide",
  description: "Comprehensive PCS guide for Joint Base Langley-Eustis covering housing, BAH, neighborhoods, schools, and commute strategy on the Virginia Peninsula.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/bases/joint-base-langley-eustis/",
};

const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "Joint Base Langley-Eustis",
  description: "U.S. military installation combining Langley Air Force Base (Hampton, VA) and Fort Eustis (Newport News, VA), formed under 2010 BRAC.",
  address: { "@type": "PostalAddress", addressLocality: "Hampton", addressRegion: "VA", addressCountry: "US" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Bases", item: "https://vahome.com/military/bases/" },
    { "@type": "ListItem", position: 4, name: "Joint Base Langley-Eustis", item: "https://vahome.com/military/bases/joint-base-langley-eustis/" },
  ],
};

export default function JBLEBasePage() {
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
            <span className="text-white">Joint Base Langley-Eustis</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Joint Base Langley-Eustis (JBLE)</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            The Virginia Peninsula's anchor military installation, joining Langley Air Force Base in Hampton and Fort Eustis in Newport News under one Joint Base. F-22 Raptors, Air Combat Command HQ, and the U.S. Army Transportation Corps all call JBLE home.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase">Two installations</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">Langley AFB + Fort Eustis</p>
            <p className="text-xs text-gray-600">Hampton + Newport News, VA</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">BAH MHA</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">IZ325 (Norfolk)</p>
            <p className="text-xs text-gray-600">Same rates as NSN, NAS Oceana</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Joined under</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">2010 BRAC</p>
            <p className="text-xs text-gray-600">Air Force lead component</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Two Bases, One Installation</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          JBLE was formed in 2010 under the Base Realignment and Closure (BRAC) process, with the Air Force as lead component. The 633rd Air Base Wing provides installation support to both halves.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-5 bg-white">
            <h3 className="font-bold text-gray-900">Langley AFB (Hampton)</h3>
            <p className="mt-2 text-sm text-gray-700">
              Home of Air Combat Command (ACC) Headquarters and the 1st Fighter Wing flying F-22 Raptors. Located on the lower Peninsula directly north of Hampton city center, with quick access to I-64 and I-664.
            </p>
            <p className="mt-3 text-xs text-gray-500 italic">
              Source: <a href="https://www.jble.af.mil" target="_blank" rel="noopener noreferrer" className="underline">jble.af.mil</a>; <a href="https://www.acc.af.mil" target="_blank" rel="noopener noreferrer" className="underline">Air Combat Command</a>.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 bg-white">
            <h3 className="font-bold text-gray-900">Fort Eustis (Newport News)</h3>
            <p className="mt-2 text-sm text-gray-700">
              Headquarters of the U.S. Army Transportation Corps, U.S. Army Aviation Logistics School, and TRADOC's Combined Arms Support Command training mission. Located in Newport News with direct I-64 access.
            </p>
            <p className="mt-3 text-xs text-gray-500 italic">
              Source: <a href="https://home.army.mil/jble/" target="_blank" rel="noopener noreferrer" className="underline">home.army.mil/jble</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best Neighborhoods for JBLE Families</h2>
          <p className="mt-3 text-gray-700">
            The Peninsula offers a different cost-of-living profile than South Hampton Roads ÃÂ¢ÃÂÃÂ generally lower median prices with strong public schools. Top-fit areas:
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="font-semibold text-gray-900">Hampton ÃÂ¢ÃÂÃÂ Riverdale, Wythe, Fox Hill</p>
              <p className="text-sm text-gray-600 mt-1">Closest to Langley AFB. 10-15 min commute. Mix of starter homes and waterfront.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="font-semibold text-gray-900">Newport News ÃÂ¢ÃÂÃÂ Hilton Village, Riverside, City Center</p>
              <p className="text-sm text-gray-600 mt-1">Closest to Fort Eustis. Hilton Village is a historic walkable district.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="font-semibold text-gray-900">Yorktown / York County</p>
              <p className="text-sm text-gray-600 mt-1">Top-rated public schools. Roughly midway between Langley and Eustis.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="font-semibold text-gray-900">Williamsburg / James City County</p>
              <p className="text-sm text-gray-600 mt-1">Longer commute but highly-rated schools and historic charm.</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Verify school ratings at <a href="https://schoolquality.virginia.gov" target="_blank" rel="noopener noreferrer" className="underline">schoolquality.virginia.gov</a>. Active listings via <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">BAH at JBLE</h2>
        <p className="mt-3 text-gray-700">
          JBLE falls inside the Norfolk Military Housing Area (MHA IZ325), so BAH is identical to NAS Oceana, Naval Station Norfolk, and the rest of Hampton Roads. See the per-paygrade pages:
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
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">PCS-ing to JBLE?</p>
            <p className="text-blue-100 mt-1">I'll send a curated home list matched to your duty station, BAH, and school priorities.</p>
          </div>
          <Link href="/contact?source=jble" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my Peninsula list</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://www.jble.af.mil" target="_blank" rel="noopener noreferrer" className="underline">JBLE Official Site</a>; <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>; <a href="https://schoolquality.virginia.gov" target="_blank" rel="noopener noreferrer" className="underline">VA DOE</a>.
        </p>
      </section>
    </main>
  );
}
