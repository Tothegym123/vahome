import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NAS Oceana Housing & Relocation Guide (2026) | VaHome",
  description:
    "Complete 2026 relocation guide for sailors stationed at Naval Air Station Oceana, Virginia Beach. Best neighborhoods, BAH, VA loans, and a local Realtor's tips.",
  alternates: { canonical: "https://vahome.com/military/bases/nas-oceana/" },
  openGraph: {
    title: "NAS Oceana Housing & Relocation Guide (2026)",
    description: "Best neighborhoods, BAH, VA loan tips for NAS Oceana sailors.",
    url: "https://vahome.com/military/bases/nas-oceana/",
    type: "article",
  },
};

const placeSchema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: "Naval Air Station Oceana",
  description: "Master Jet Base for the U.S. Navy Atlantic Fleet, home to F/A-18 Super Hornet and F-35C Lightning II squadrons.",
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
    { "@type": "ListItem", position: 4, name: "NAS Oceana", item: "https://vahome.com/military/bases/nas-oceana/" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Where is NAS Oceana located?",
      acceptedAnswer: { "@type": "Answer", text: "Naval Air Station Oceana is in Virginia Beach, Virginia, in the southeastern corner of Hampton Roads. The base sits between the Princess Anne and Kempsville sections of Virginia Beach and includes the Dam Neck Annex on the Atlantic coast." } },
    { "@type": "Question", name: "What is NAS Oceana's primary mission?",
      acceptedAnswer: { "@type": "Answer", text: "NAS Oceana is the Atlantic Fleet's Master Jet Base. It is home to the East Coast's F/A-18 Super Hornet squadrons and F-35C Lightning II squadrons, along with significant aviation training operations." } },
    { "@type": "Question", name: "What BAH applies to NAS Oceana?",
      acceptedAnswer: { "@type": "Answer", text: "NAS Oceana falls within the Norfolk Military Housing Area (MHA Code IZ325). Sailors stationed at Oceana receive the same BAH rates as those at Naval Station Norfolk and other Hampton Roads installations. Verify your specific paygrade rate at the DTMO BAH Calculator." } },
    { "@type": "Question", name: "Which Virginia Beach neighborhoods are closest to NAS Oceana?",
      acceptedAnswer: { "@type": "Answer", text: "Princess Anne, Kempsville, and Aragona Village are all within a short commute. Pungo to the south is more rural with larger lots. The Lynnhaven and Thalia areas to the north are slightly farther but offer beach access. Specific commute times depend on which gate you use and time of day." } },
  ],
};

export default function NASOceanaPage() {
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
            <span className="text-white">NAS Oceana</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            Naval Air Station Oceana Housing & Relocation Guide
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Master Jet Base of the U.S. Navy Atlantic Fleet, located in Virginia Beach. Here is the local Realtor&rsquo;s guide to housing, BAH, neighborhoods, and the commute to the gate.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/military/homes-near/nas-oceana/" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50">Homes near Oceana</Link>
            <Link href="/military/best-neighborhoods-near/nas-oceana/" className="border border-white/40 text-white px-5 py-3 rounded-lg hover:bg-white/10">Best neighborhoods</Link>
            <Link href="/military/commute-to/nas-oceana/" className="border border-white/40 text-white px-5 py-3 rounded-lg hover:bg-white/10">Commute info</Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">About NAS Oceana</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Naval Air Station Oceana is the U.S. Navy&rsquo;s Master Jet Base on the Atlantic Coast, home to all East Coast F/A-18 Super Hornet squadrons and F-35C Lightning II squadrons. The base is located in Virginia Beach, in the south-central section of the city, and includes the Dam Neck Annex on the Atlantic shoreline. Sailors stationed at Oceana benefit from being on the southside of Hampton Roads, which means no harbor-tunnel commute and direct access to Virginia Beach&rsquo;s beach corridor.
        </p>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://cnrma.cnic.navy.mil/Installations/NAS-Oceana/" target="_blank" rel="noopener noreferrer" className="underline">Commander, Navy Region Mid-Atlantic (CNIC) â NAS Oceana</a>.
        </p>
      </section>

      {/* Where Oceana sailors live */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Where NAS Oceana Sailors Live</h2>
          <p className="mt-3 text-gray-700">Most Oceana sailors live in Virginia Beach. The base is fully south of the Hampton Roads tunnels, so commute times are typically faster than for sailors stationed at NSN or in Newport News.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { city: "Virginia Beach (Princess Anne)", note: "Closest to Oceana&rsquo;s main gate. Suburban, family-oriented, strong VB schools." },
              { city: "Virginia Beach (Kempsville)", note: "Mature neighborhoods, established schools, a short commute via Princess Anne Rd." },
              { city: "Virginia Beach (Bayside / Pembroke)", note: "Town Center walkability. Slightly longer commute, more amenities." },
              { city: "Chesapeake (Greenbrier)", note: "Top-rated public schools (Chesapeake Public Schools). 20-30 min commute via I-264." },
              { city: "Norfolk (Larchmont / East Beach)", note: "Historic neighborhoods. Longer commute but no tunnel needed." },
              { city: "Pungo (rural VB)", note: "Larger lots, agricultural setting, 15-20 min south of base. Less inventory." },
            ].map((c) => (
              <div key={c.city} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900">{c.city}</h3>
                <p className="text-sm text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: c.note }} />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Specific home values, school grades, and flood-zone designations vary by address. Verify on <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>, <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia Department of Education</a>, and <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA Flood Map Service Center</a> before writing an offer.
          </p>
        </div>
      </section>

      {/* BAH */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">2026 BAH for NAS Oceana</h2>
        <p className="mt-3 text-gray-700">
          NAS Oceana falls within the Norfolk MHA (Military Housing Area code IZ325), the same as Naval Station Norfolk and the rest of the Hampton Roads installations. 2026 BAH rates apply uniformly across the MHA regardless of which base you are stationed at.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link href="/military/bah-calculator/hampton-roads/" className="border border-gray-200 rounded-lg p-5 hover:border-blue-600">
            <p className="font-semibold text-gray-900">2026 BAH Calculator</p>
            <p className="text-sm text-gray-600 mt-1">Verified paygrade rates with citation links to DTMO.</p>
          </Link>
          <Link href="/military/va-loan-homes/hampton-roads/" className="border border-gray-200 rounded-lg p-5 hover:border-blue-600">
            <p className="font-semibold text-gray-900">VA Loan Homes Guide</p>
            <p className="text-sm text-gray-600 mt-1">Eligibility, funding fee, max loan amount.</p>
          </Link>
        </div>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">Defense Travel Management Office BAH Calculator</a> (Norfolk MHA, ZIP 23460 for NAS Oceana).
        </p>
      </section>

      {/* FAQ */}
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

      {/* CTA */}
      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">PCSing to NAS Oceana?</p>
            <p className="text-blue-100 mt-1">Tell me your paygrade, family size, and report date. I will send a custom Oceana plan inside 24 hours.</p>
          </div>
          <Link href="/contact?source=oceana-hub" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Build my Oceana plan</Link>
        </div>
      </section>

      {/* Sources */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://cnrma.cnic.navy.mil/Installations/NAS-Oceana/" target="_blank" rel="noopener noreferrer" className="underline">CNIC NAS Oceana</a>; <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH Calculator</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>; <a href="https://www.hrmffa.org/about-us" target="_blank" rel="noopener noreferrer" className="underline">HRMFFA</a>; <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>; <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA Flood Map Service Center</a>.
        </p>
      </section>
    </main>
  );
}
