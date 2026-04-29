import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "8 Best Neighborhoods Near Naval Station Norfolk (2026 Ranked) | VaHome",
  description:
    "The 8 best neighborhoods for sailors stationed at Naval Station Norfolk, ranked by commute, BAH match, school quality, and resale strength. Updated for 2026.",
  alternates: { canonical: "https://vahome.com/military/best-neighborhoods-near/naval-station-norfolk/" },
  openGraph: {
    title: "8 Best Neighborhoods Near Naval Station Norfolk",
    description: "Ranked for NSN sailors: commute, BAH, schools, resale. Updated 2026.",
    url: "https://vahome.com/military/best-neighborhoods-near/naval-station-norfolk/",
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "8 Best Neighborhoods Near Naval Station Norfolk (2026 Ranked)",
  description:
    "Ranked guide to the 8 best Hampton Roads neighborhoods for sailors stationed at Naval Station Norfolk, scored on commute, BAH alignment, schools, and resale.",
  datePublished: "2026-04-28",
  dateModified: "2026-04-28",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor", url: "https://vahome.com/about/" },
  publisher: { "@type": "Organization", name: "VaHome", url: "https://vahome.com/" },
  mainEntityOfPage: "https://vahome.com/military/best-neighborhoods-near/naval-station-norfolk/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Best Neighborhoods", item: "https://vahome.com/military/best-neighborhoods-near/" },
    { "@type": "ListItem", position: 4, name: "Naval Station Norfolk", item: "https://vahome.com/military/best-neighborhoods-near/naval-station-norfolk/" },
  ],
};

const neighborhoods = [
  {
    rank: 1, name: "East Beach", city: "Norfolk", commute: "10 min", median: "$675K", schools: "B+", flood: "AE/X mix",
    bestFor: "O-3+ and senior enlisted who want walkable, beach-adjacent, new construction",
    pros: ["Newest housing stock in Norfolk", "Direct Chesapeake Bay access", "Tight HOA, well-kept"],
    cons: ["Highest price point on this list", "Some homes in AE flood zone"],
  },
  {
    rank: 2, name: "Larchmont", city: "Norfolk", commute: "8 min", median: "$485K", schools: "B+", flood: "X (mostly)",
    bestFor: "Families wanting historic charm, ODU adjacency, classic tree-lined streets",
    pros: ["Walkable to ODU and Lafayette River", "Strong resale, never goes soft", "X zone keeps insurance reasonable"],
    cons: ["1920s-1950s housing stock needs inspection", "Limited new construction"],
  },
  {
    rank: 3, name: "Greenbrier", city: "Chesapeake", commute: "25 min", median: "$385K", schools: "A", flood: "X",
    bestFor: "Families with school-age kids who want top-rated public schools and newer homes",
    pros: ["Chesapeake Public Schools = highest rated in 757", "Mostly X flood zone", "Plenty of inventory under $400K"],
    cons: ["Tunnel-dependent commute (Downtown/MMMBT)", "Suburban sprawl feel"],
  },
  {
    rank: 4, name: "Thalia", city: "Virginia Beach", commute: "20 min", median: "$425K", schools: "A-", flood: "X",
    bestFor: "Beach lifestyle without paying oceanfront prices, strong VB schools",
    pros: ["VB schools rated A-", "Easy I-264 access", "Mature neighborhood, stable values"],
    cons: ["Inventory often tight", "Some 1970s-era homes need updating"],
  },
  {
    rank: 5, name: "Ghent", city: "Norfolk", commute: "10 min", median: "$405K", schools: "B-", flood: "X",
    bestFor: "Single sailors and DINKs who want walkable urban Norfolk with restaurants and bars",
    pros: ["Most walkable neighborhood in Norfolk", "Historic homes with character", "Quick to NSN via Hampton Blvd"],
    cons: ["Older schools, families often relocate at school age", "Parking can be tight"],
  },
  {
    rank: 6, name: "Churchland", city: "Portsmouth", commute: "20 min", median: "$285K", schools: "B-", flood: "X",
    bestFor: "E-4 to E-6 who want BAH to actually cover the mortgage, not stretch it",
    pros: ["Most affordable corridor for NSN", "X zone", "Solid 1990s-2000s homes under $300K"],
    cons: ["Portsmouth schools rated lower than Chesapeake/VB", "Resale slower than Norfolk"],
  },
  {
    rank: 7, name: "Harbour View", city: "Suffolk", commute: "30 min", median: "$465K", schools: "A-", flood: "X",
    bestFor: "Families wanting brand-new construction, big lots, and top schools in Suffolk",
    pros: ["Newest construction in 757", "Big lots", "Excellent Suffolk schools at this end"],
    cons: ["30-min commute, MMMBT-dependent", "Some HOAs are strict"],
  },
  {
    rank: 8, name: "Aragona Village", city: "Virginia Beach", commute: "22 min", median: "$345K", schools: "B+", flood: "X",
    bestFor: "Mid-grade enlisted/officer who want VB without paying VB-oceanfront prices",
    pros: ["Solid VB schools at moderate price", "Established neighborhood, steady values", "Quick to I-264"],
    cons: ["1960s ranch-style needs updating in many homes", "Less curb appeal than newer subdivisions"],
  },
];

export default function BestNeighborhoodsPage() {
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
            <span className="text-white">Best Neighborhoods</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            8 Best Neighborhoods Near Naval Station Norfolk
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Ranked for active-duty sailors stationed at NSN. Scored on commute, 2026 BAH match, school quality, flood zone, and resale strength.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full">Updated April 2026</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Source: REIN MLS + local realtor data</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          I have closed deals for sailors in every one of these neighborhoods. This is the ranking I would give my own brother if he checked into NSN tomorrow. The order is based on what most NSN sailors actually need: a reasonable commute, a price that fits 2026 BAH, schools that do not make you wince, and a neighborhood that will resell quickly when orders drop.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          The methodology: each neighborhood scored against four weighted criteria. Commute (35%), BAH alignment by paygrade (30%), school quality if you have kids (20%), and flood zone + resale strength (15%). Final scores below 6.5 did not make this list.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The Ranking</h2>
          <div className="mt-8 space-y-6">
            {neighborhoods.map((n) => (
              <article key={n.name} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-700 text-white font-bold text-xl rounded-lg w-12 h-12 flex items-center justify-center shrink-0">
                    {n.rank}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{n.name} <span className="text-gray-500 font-normal">- {n.city}</span></h3>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div><p className="text-gray-500 text-xs uppercase">Commute</p><p className="font-semibold text-gray-900">{n.commute}</p></div>
                      <div><p className="text-gray-500 text-xs uppercase">Median</p><p className="font-semibold text-gray-900">{n.median}</p></div>
                      <div><p className="text-gray-500 text-xs uppercase">Schools</p><p className="font-semibold text-gray-900">{n.schools}</p></div>
                      <div><p className="text-gray-500 text-xs uppercase">Flood Zone</p><p className="font-semibold text-gray-900">{n.flood}</p></div>
                    </div>
                    <p className="mt-4 text-gray-700"><span className="font-semibold">Best for:</span> {n.bestFor}</p>
                    <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-green-700 mb-1">Pros</p>
                        <ul className="space-y-1 text-gray-700 list-disc list-inside">
                          {n.pros.map((p) => <li key={p}>{p}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-orange-700 mb-1">Cons</p>
                        <ul className="space-y-1 text-gray-700 list-disc list-inside">
                          {n.cons.map((c) => <li key={c}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a custom neighborhood match?</p>
            <p className="text-blue-100 mt-1">Tell me your paygrade, family size, and what matters most. I will rank the top 3 for you.</p>
          </div>
          <Link href="/contact?source=nsn-neighborhoods" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">
            Get my custom match
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-gray-900">Related</h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          <Link href="/military/bases/naval-station-norfolk/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Naval Station Norfolk hub</p>
            <p className="text-gray-600 mt-1">BAH, schools, base overview.</p>
          </Link>
          <Link href="/military/homes-near/naval-station-norfolk/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Live listings near NSN</p>
            <p className="text-gray-600 mt-1">Filtered for VA + commute.</p>
          </Link>
          <Link href="/military/pcs-to/hampton-roads/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">PCS to Hampton Roads</p>
            <p className="text-gray-600 mt-1">Full PCS playbook.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
