import type { Metadata } from "next";
import Link from "next/link";
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: "Schools Near JEB Little Creek-Fort Story | VaHome",
  description:
    "Top public schools near JEB Little Creek-Fort Story in Virginia Beach. Verified GreatSchools.org ratings April 2026 for Sailors and Soldiers stationed at the Joint Expeditionary Base.",
  alternates: { canonical: "https://vahome.com/military/schools-near/jeb-little-creek-fort-story/" },
  openGraph: { title: "Schools Near JEB Little Creek-Fort Story", description: "Verified VB and Norfolk school ratings near JEB.", url: "https://vahome.com/military/schools-near/jeb-little-creek-fort-story/", type: "article" },
};

const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: "Schools Near JEB Little Creek-Fort Story", description: "Verified school ratings near JEB across Virginia Beach and northern Norfolk.", datePublished: "2026-04-29", dateModified: "2026-04-29", author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" }, publisher: { "@type": "Organization", name: "VaHome" }, mainEntityOfPage: "https://vahome.com/military/schools-near/jeb-little-creek-fort-story/" };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
  { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
  { "@type": "ListItem", position: 3, name: "Schools Near", item: "https://vahome.com/military/schools-near/" },
  { "@type": "ListItem", position: 4, name: "JEB Little Creek-Fort Story", item: "https://vahome.com/military/schools-near/jeb-little-creek-fort-story/" },
] };

export default function SchoolsNearJEB() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/jeb-little-creek-fort-story/" className="hover:underline">JEB</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Schools</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Schools Near JEB Little Creek-Fort Story</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            JEB Little Creek sits in northern Virginia Beach right at the Norfolk line. Most JEB families look at Virginia Beach Public Schools (avg 6.4) — broadly the strongest large district in Hampton Roads.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top VB Schools by Level</h2>
        <p className="mt-3 text-gray-700">Highest-rated VB Public Schools per GreatSchools.org (April 2026):</p>

        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-900 text-sm">Top Elementary</p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>Hermitage Elementary <span className="text-blue-700 font-semibold">10/10</span></li>
              <li>Three Oaks Elementary <span className="text-blue-700 font-semibold">10/10</span></li>
              <li>Old Donation School <span className="text-blue-700 font-semibold">10/10</span></li>
              <li>Princess Anne Elementary <span className="text-blue-700 font-semibold">9/10</span></li>
              <li>Kingston Elementary <span className="text-blue-700 font-semibold">9/10</span></li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-900 text-sm">Top Middle</p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>Old Donation School <span className="text-blue-700 font-semibold">10/10</span></li>
              <li>Princess Anne Middle <span className="text-blue-700 font-semibold">8/10</span></li>
              <li>Larkspur Middle <span className="text-blue-700 font-semibold">8/10</span></li>
              <li>Kemps Landing/Old Donation <span className="text-blue-700 font-semibold">8/10</span></li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-900 text-sm">Top High</p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>Ocean Lakes High <span className="text-blue-700 font-semibold">9/10</span></li>
              <li>Cox High <span className="text-blue-700 font-semibold">8/10</span></li>
              <li>Princess Anne High <span className="text-blue-700 font-semibold">7/10</span></li>
              <li>First Colonial High <span className="text-blue-700 font-semibold">7/10</span></li>
              <li>Kellam High <span className="text-blue-700 font-semibold">7/10</span></li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://www.greatschools.org" target="_blank" rel="noopener noreferrer" className="underline">GreatSchools.org</a> April 2026. VB district averages: 6.4 elementary / 6.5 middle / 6.9 high across 82 schools.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">JEB-Friendly Neighborhoods with Strong Schools</h2>
          <p className="mt-3 text-gray-700">Combine quick JEB commute with above-average school zones:</p>
          <div className="mt-4 space-y-3 text-gray-700">
            <p><strong>Bayside / Pleasure House Point:</strong> Closest to JEB main gate. Mix of mid-range homes and waterfront. Verify school zone — boundaries split between several elementary feeders.</p>
            <p><strong>Aragona Village:</strong> Affordable, established neighborhood with reasonable JEB commute. Bayside Elementary and Bayside High.</p>
            <p><strong>Lake Smith / Lake Smith Heights:</strong> Quieter waterfront pockets near JEB Little Creek with mid-priced inventory.</p>
            <p><strong>Princess Anne / Red Mill:</strong> Longer commute (15-20 min) but exceptional schools — Princess Anne, Kellam, Ocean Lakes feeders.</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">School-zoned JEB listings?</p>
            <p className="text-blue-100 mt-1">Tell me which schools matter and I'll match by attendance zone, not just city.</p>
          </div>
          <Link href="/contact?source=schools-jeb" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my list</Link>
        </div>
      </section>
      <HamptonRoadsAreaGuide />
    </main>
  );
}
