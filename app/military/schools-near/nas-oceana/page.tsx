import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Schools Near NAS Oceana (2026 Ratings) | VaHome",
  description:
    "Top-rated public schools near Naval Air Station Oceana, Virginia Beach. VB schools rate among the highest in Hampton Roads. Sourced from GreatSchools.org April 2026.",
  alternates: { canonical: "https://www.vahome.com/military/schools-near/nas-oceana/" },
  openGraph: { title: "Schools Near NAS Oceana (2026)", description: "VB schools for active-duty Oceana families.", url: "https://www.vahome.com/military/schools-near/nas-oceana/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Schools Near NAS Oceana (2026 Ratings)",
  description: "Top-rated Virginia Beach public schools for military families stationed at NAS Oceana.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://www.vahome.com/military/schools-near/nas-oceana/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://www.vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Schools Near Bases", item: "https://www.vahome.com/military/schools-near/" },
    { "@type": "ListItem", position: 4, name: "NAS Oceana", item: "https://www.vahome.com/military/schools-near/nas-oceana/" },
  ],
};

const elementaryTop = [
  { name: "Corporate Landing Elementary", rating: 9 },
  { name: "John B. Dey Elementary", rating: 9 },
  { name: "Linkhorn Park Elementary", rating: 9 },
  { name: "Princess Anne Elementary", rating: 9 },
  { name: "Trantwood Elementary", rating: 9 },
];
const middleTop = [
  { name: "Princess Anne Middle School", rating: 9 },
  { name: "Old Donation School", rating: 8 },
  { name: "Great Neck Middle School", rating: 8 },
  { name: "Plaza Middle School", rating: 8 },
  { name: "Landstown Middle School", rating: 7 },
];
const highTop = [
  { name: "Floyd Kellam High School", rating: 9 },
  { name: "Ocean Lakes High School", rating: 8 },
  { name: "Salem High School", rating: 8 },
  { name: "Princess Anne High School", rating: 7 },
  { name: "Tallwood High School", rating: 7 },
];

function SchoolBlock({ title, schools }: { title: string; schools: { name: string; rating: number }[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <div className="mt-3 space-y-2">
        {schools.map((s) => (
          <div key={s.name} className="border border-gray-200 rounded-lg p-3 flex items-center gap-4">
            <div className="bg-blue-700 text-white font-bold text-lg rounded w-10 h-10 flex items-center justify-center shrink-0">{s.rating}</div>
            <p className="font-semibold text-gray-900">{s.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SchoolsNearOceanaPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/nas-oceana/" className="hover:underline">NAS Oceana</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Schools</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Schools Near NAS Oceana</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Virginia Beach Public Schools rate among the highest in Hampton Roads, and most of NAS Oceana&rsquo;s closest residential corridors zone into them. Here are the top-rated VB schools, sourced from GreatSchools.org as of April 2026.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          Virginia Beach City Public Schools is one of the larger and more consistent districts in Hampton Roads. Average GreatSchools ratings in 2026: Elementary 6.4, Middle 6.5, High 6.9 across 82 rated schools. Many of the top-rated schools sit in zones that are also the closest residential areas to NAS Oceana&rsquo;s gates.
        </p>
        <p className="mt-3 text-xs text-gray-500 italic">Source: <a href="https://www.greatschools.org/" target="_blank" rel="noopener noreferrer" className="underline">GreatSchools.org ratings</a>, compiled April 2026. Verify per-address zoning and current ratings on the district&rsquo;s site.</p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top VB Public Schools by Level</h2>
          <p className="mt-3 text-gray-700">Rated 7-9 on GreatSchools (out of 10).</p>
          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            <SchoolBlock title="Elementary" schools={elementaryTop} />
            <SchoolBlock title="Middle" schools={middleTop} />
            <SchoolBlock title="High" schools={highTop} />
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">Verify exact zoning per address on <a href="https://www.vbschools.com/" target="_blank" rel="noopener noreferrer" className="underline">Virginia Beach City Public Schools</a>.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best School Match for Oceana Sailors</h2>
        <ul className="mt-6 space-y-3 text-gray-700 list-disc list-inside">
          <li><strong>Princess Anne corridor</strong> — closest to Oceana&rsquo;s main gate. Princess Anne Elementary, Middle, and High School all rate 7-9.</li>
          <li><strong>Kellam zone (south VB)</strong> — Floyd Kellam High (9), Corporate Landing Elementary (9). 15-20 min commute to Oceana.</li>
          <li><strong>Great Neck / Linkhorn corridor</strong> — Linkhorn Park (9), John B. Dey (9), Great Neck Middle (8). North VB, 20-25 min commute.</li>
          <li><strong>Bayside / Ocean Park area</strong> — Trantwood (9) elementary zone. Closer to Little Creek-Fort Story than Oceana.</li>
        </ul>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want school-first listings emailed?</p>
            <p className="text-blue-100 mt-1">Tell me your kids&rsquo; grade levels and minimum rating threshold.</p>
          </div>
          <Link href="/contact?source=schools-oceana" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my school-priority search</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://www.greatschools.org/" target="_blank" rel="noopener noreferrer" className="underline">GreatSchools.org</a> (ratings, April 2026); <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE state report cards</a>; <a href="https://www.vbschools.com/" target="_blank" rel="noopener noreferrer" className="underline">Virginia Beach City Public Schools</a>; <a href="https://cnrma.cnic.navy.mil/Installations/NAS-Oceana/" target="_blank" rel="noopener noreferrer" className="underline">CNIC NAS Oceana</a>.
        </p>
      </section>
    </main>
  );
}
