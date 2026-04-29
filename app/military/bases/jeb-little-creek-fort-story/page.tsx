import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JEB Little Creek-Fort Story Housing & Relocation Guide (2026) | VaHome",
  description:
    "Complete 2026 relocation guide for sailors and soldiers stationed at Joint Expeditionary Base Little Creek-Fort Story. Best neighborhoods, BAH, VA loans, commute.",
  alternates: { canonical: "https://vahome.com/military/bases/jeb-little-creek-fort-story/" },
  openGraph: {
    title: "JEB Little Creek-Fort Story Housing & Relocation Guide",
    description: "Best neighborhoods, BAH, VA loan tips for JEB Little Creek-Fort Story.",
    url: "https://vahome.com/military/bases/jeb-little-creek-fort-story/",
    type: "article",
  },
};

const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "Joint Expeditionary Base Little Creek-Fort Story",
  description: "U.S. Navy joint expeditionary base supporting expeditionary, amphibious, and special warfare training operations on the Chesapeake Bay.",
  address: { "@type": "PostalAddress", addressLocality: "Virginia Beach", addressRegion: "VA", addressCountry: "US" },
  containedInPlace: { "@type": "Place", name: "Hampton Roads, Virginia" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Bases", item: "https://vahome.com/military/bases/" },
    { "@type": "ListItem", position: 4, name: "JEB Little Creek-Fort Story", item: "https://vahome.com/military/bases/jeb-little-creek-fort-story/" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Where is JEB Little Creek-Fort Story?",
      acceptedAnswer: { "@type": "Answer", text: "JEB Little Creek-Fort Story is split across two installations on the Chesapeake Bay: Naval Amphibious Base Little Creek in Virginia Beach (north of Shore Drive) and Fort Story at Cape Henry on the Atlantic coast. The two were merged in 2009 under the Base Realignment and Closure plan." } },
    { "@type": "Question", name: "What units are stationed at JEB Little Creek-Fort Story?",
      acceptedAnswer: { "@type": "Answer", text: "Little Creek hosts U.S. Navy expeditionary, amphibious, and special warfare units, including Naval Special Warfare Group 2, SEAL Teams, and EOD groups. Fort Story supports U.S. Army Transportation operations and joint training. The combined installation supports more than 50 commands." } },
    { "@type": "Question", name: "What BAH applies to JEB Little Creek-Fort Story?",
      acceptedAnswer: { "@type": "Answer", text: "JEB Little Creek-Fort Story falls within the Norfolk Military Housing Area (MHA Code IZ325). 2026 BAH rates apply uniformly across all Hampton Roads installations. Verify your specific paygrade rate at the DTMO BAH Calculator." } },
    { "@type": "Question", name: "Which neighborhoods are closest to Little Creek?",
      acceptedAnswer: { "@type": "Answer", text: "Norfolk neighborhoods on the east side (East Beach, Larchmont, Bayview) are minutes from Little Creek&rsquo;s gate. Northern Virginia Beach (Ocean Park, Cape Story, Birdneck) is also close. Fort Story sits at Cape Henry; the Atlantic Avenue and First Landing State Park areas are immediately adjacent." } },
  ],
};

export default function JEBLittleCreekPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">JEB Little Creek-Fort Story</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">JEB Little Creek-Fort Story Housing & Relocation Guide</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Joint Expeditionary Base on the Chesapeake Bay. Home to Naval Special Warfare, amphibious, and expeditionary commands. Here is the local guide to housing, BAH, neighborhoods, and the commute.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/military/homes-near/jeb-little-creek-fort-story/" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50">Homes near Little Creek</Link>
            <Link href="/military/commute-to/jeb-little-creek-fort-story/" className="border border-white/40 text-white px-5 py-3 rounded-lg hover:bg-white/10">Commute info</Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">About JEB Little Creek-Fort Story</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Joint Expeditionary Base Little Creek-Fort Story is a merged Navy installation created in 2009 under the Base Realignment and Closure (BRAC) plan. Naval Amphibious Base Little Creek and the historic Fort Story were combined to streamline expeditionary, amphibious, and special warfare training operations under a single base command. Little Creek sits along the Chesapeake Bay in Virginia Beach (north of Shore Drive); Fort Story occupies Cape Henry, the entrance to the Chesapeake Bay.
        </p>
        <p className="mt-4 text-gray-700 leading-relaxed">
          The base hosts more than 50 tenant commands including Naval Special Warfare Group 2, multiple SEAL Teams, EOD groups, and Army Transportation units. Sailors and soldiers stationed here benefit from Hampton Roads&rsquo; northeast geography: short commutes from northern Norfolk and northern Virginia Beach, no harbor-tunnel needed.
        </p>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://cnrma.cnic.navy.mil/Installations/JEB-Little-Creek-Fort-Story/" target="_blank" rel="noopener noreferrer" className="underline">CNIC JEB Little Creek-Fort Story</a>.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Where JEB Sailors and Soldiers Live</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { city: "Norfolk (East Beach, Bayview)", note: "Direct, short commute. Beach-adjacent. Some homes in AE flood zone â verify per-address." },
              { city: "Norfolk (Larchmont, Ghent)", note: "Historic Norfolk neighborhoods, walkable, ~15 min commute." },
              { city: "Virginia Beach (Ocean Park, Cape Story)", note: "North VB, beach-adjacent, established homes. Direct to Little Creek." },
              { city: "Virginia Beach (Birdneck, Lynnhaven)", note: "Inland VB, mostly X flood zone, longer commute via Shore Dr." },
              { city: "Virginia Beach (Sandbridge / First Landing)", note: "Closest to Fort Story. Coastal lots, higher flood-risk overall." },
              { city: "Chesapeake (Greenbrier)", note: "30+ min commute, top-rated schools. Tunnel-free via I-64 east." },
            ].map((c) => (
              <div key={c.city} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900">{c.city}</h3>
                <p className="text-sm text-gray-700 mt-2">{c.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Specific home values, school zoning, and FEMA flood designations vary by address. Verify on <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>, <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">VDOE</a>, and <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">2026 BAH for JEB Little Creek-Fort Story</h2>
        <p className="mt-3 text-gray-700">
          Same Norfolk MHA (IZ325) as all Hampton Roads installations. 2026 rates apply uniformly. Verify your paygrade rate at DTMO and use our calculator for the max-purchase-price math.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link href="/military/bah-calculator/hampton-roads/" className="border border-gray-200 rounded-lg p-5 hover:border-blue-600">
            <p className="font-semibold text-gray-900">2026 BAH Calculator</p>
            <p className="text-sm text-gray-600 mt-1">Verified paygrade rates with citation links.</p>
          </Link>
          <Link href="/military/va-loan-homes/hampton-roads/" className="border border-gray-200 rounded-lg p-5 hover:border-blue-600">
            <p className="font-semibold text-gray-900">VA Loan Homes Guide</p>
            <p className="text-sm text-gray-600 mt-1">Eligibility, funding fee, max loan.</p>
          </Link>
        </div>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH Calculator</a>.
        </p>
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
            <p className="text-2xl font-bold">PCSing to JEB Little Creek-Fort Story?</p>
            <p className="text-blue-100 mt-1">Tell me your command and report date. I will send a tailored housing plan inside 24 hours.</p>
          </div>
          <Link href="/contact?source=jeb-hub" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Build my plan</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://cnrma.cnic.navy.mil/Installations/JEB-Little-Creek-Fort-Story/" target="_blank" rel="noopener noreferrer" className="underline">CNIC JEB Little Creek-Fort Story</a>; <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>; <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>; <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>.
        </p>
      </section>
    </main>
  );
}
