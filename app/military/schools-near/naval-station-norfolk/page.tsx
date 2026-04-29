import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Schools Near Naval Station Norfolk (2026 Ratings) | VaHome",
  description:
    "Top-rated public schools near Naval Station Norfolk for military families. Norfolk magnets and Chesapeake/VB commute alternatives, sourced from GreatSchools.org April 2026.",
  alternates: { canonical: "https://www.vahome.com/military/schools-near/naval-station-norfolk/" },
  openGraph: { title: "Schools Near Naval Station Norfolk (2026)", description: "Top-rated public schools for NSN families.", url: "https://www.vahome.com/military/schools-near/naval-station-norfolk/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Schools Near Naval Station Norfolk (2026 Ratings)",
  description: "Top-rated public schools near Naval Station Norfolk, sourced from GreatSchools.org as of April 2026.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://www.vahome.com/military/schools-near/naval-station-norfolk/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://www.vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Schools Near Bases", item: "https://www.vahome.com/military/schools-near/" },
    { "@type": "ListItem", position: 4, name: "Naval Station Norfolk", item: "https://www.vahome.com/military/schools-near/naval-station-norfolk/" },
  ],
};

const norfolkTop = [
  { name: "Ghent School", level: "K-8", rating: 9, note: "Magnet/special program; one of two highest-rated public schools in Norfolk." },
  { name: "Academy for Discovery at Lakewood", level: "K-8", rating: 9, note: "Magnet program; consistently top-rated." },
  { name: "Ingleside Elementary", level: "Elementary", rating: 8, note: "Traditional Norfolk elementary, well-regarded." },
  { name: "W.H. Taylor Elementary", level: "Elementary", rating: 8, note: "Strong neighborhood elementary." },
  { name: "Willard Model Elementary", level: "Elementary", rating: 7, note: "Magnet model school." },
];

const cityAverages = [
  { city: "Norfolk", elem: 5.0, mid: 4.6, high: 2.2, total: 45 },
  { city: "Chesapeake", elem: 6.0, mid: 6.4, high: 5.9, total: 38 },
  { city: "Virginia Beach", elem: 6.4, mid: 6.5, high: 6.9, total: 82 },
];

export default function SchoolsNearNSNPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/naval-station-norfolk/" className="hover:underline">Naval Station Norfolk</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Schools</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Schools Near Naval Station Norfolk</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Top-rated public schools for military families stationed at NSN. Direct guide to Norfolk&rsquo;s magnet/charter options plus the commute alternatives in Chesapeake and Virginia Beach where school ratings are higher.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          Norfolk Public Schools are the closest district to NSN, but average ratings are lower than neighboring Chesapeake and Virginia Beach. Many NSN military families navigate this by either pursuing Norfolk magnet programs (Ghent School, Academy for Discovery at Lakewood) or living in Chesapeake or Virginia Beach and absorbing a longer commute.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          The data below is from GreatSchools.org (April 2026). For your specific address, always verify on Virginia&rsquo;s state report card and confirm school zoning with the district.
        </p>
      </section>

      {/* City averages */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">City-Level School Ratings (Norfolk vs. Alternatives)</h2>
          <p className="mt-3 text-gray-700">Average GreatSchools rating by city and level. Total schools is the count rated.</p>
          <div className="mt-6 overflow-x-auto bg-white border border-gray-200 rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-gray-900">City</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-900">Elementary avg</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-900">Middle avg</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-900">High avg</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-900">Total schools</th>
                </tr>
              </thead>
              <tbody>
                {cityAverages.map((c, i) => (
                  <tr key={c.city} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2 font-medium text-gray-900">{c.city}</td>
                    <td className="px-3 py-2 text-right text-gray-800">{c.elem.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right text-gray-800">{c.mid.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right text-gray-800">{c.high.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right text-gray-800">{c.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500 italic">Source: GreatSchools.org ratings, compiled April 2026. Verify per-school ratings at <a href="https://www.greatschools.org/" target="_blank" rel="noopener noreferrer" className="underline">GreatSchools.org</a> and <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>.</p>
        </div>
      </section>

      {/* Norfolk top schools */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top-Rated Norfolk Schools</h2>
        <p className="mt-3 text-gray-700">If you live in Norfolk near NSN, these are the strongest public school options. Note: Norfolk&rsquo;s top schools are predominantly magnet/specialty programs that require application or zoning consideration.</p>
        <div className="mt-6 space-y-3">
          {norfolkTop.map((s) => (
            <div key={s.name} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
              <div className="bg-blue-700 text-white font-bold text-lg rounded-lg w-12 h-12 flex items-center justify-center shrink-0">{s.rating}</div>
              <div>
                <p className="font-semibold text-gray-900">{s.name} <span className="text-sm text-gray-500 font-normal">— {s.level}</span></p>
                <p className="text-sm text-gray-600 mt-1">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500 italic">Source: GreatSchools.org, April 2026. Application/zoning rules vary; verify with Norfolk Public Schools.</p>
      </section>

      {/* Commute alternatives */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Commute Alternatives for Better Schools</h2>
          <p className="mt-3 text-gray-700">If school quality is a priority, these neighboring options have higher average ratings:</p>
          <div className="mt-6 space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">Chesapeake (Greenbrier, Great Bridge, Western Branch)</h3>
              <p>Top-rated district at this side of the harbor. Notable schools: Hickory High School (rated 9), Grassfield High School (8), G.A. Treakle Elementary (8). 20-30 min commute to NSN via I-264 / Downtown Tunnel.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Virginia Beach</h3>
              <p>Highest average across all levels. 11 high schools; top-rated include Floyd Kellam (9), Ocean Lakes (8), Salem (8). Longer commute (25-35 min) but no tunnel needed.</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 italic">Verify exact school zoning per address on each city&rsquo;s public schools website.</p>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a school-first home search?</p>
            <p className="text-blue-100 mt-1">Tell me your kids&rsquo; ages and minimum school rating. I will route the search.</p>
          </div>
          <Link href="/contact?source=schools-nsn" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my school-priority search</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://www.greatschools.org/" target="_blank" rel="noopener noreferrer" className="underline">GreatSchools.org</a> (ratings, April 2026); <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE state report cards</a>; <a href="https://www.npsk12.com/" target="_blank" rel="noopener noreferrer" className="underline">Norfolk Public Schools</a>; <a href="https://cpschools.com/" target="_blank" rel="noopener noreferrer" className="underline">Chesapeake Public Schools</a>; <a href="https://www.vbschools.com/" target="_blank" rel="noopener noreferrer" className="underline">Virginia Beach City Public Schools</a>.
        </p>
      </section>
    </main>
  );
}
