import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the VaHome Team | Hampton Roads Real Estate Experts",
  description:
    "Meet the VaHome Team — your trusted real estate experts in Hampton Roads, Virginia. Serving Virginia Beach, Norfolk, Chesapeake, Suffolk, and surrounding areas.",
  openGraph: {
    title: "About the VaHome Team | Hampton Roads Real Estate Experts",
    description:
      "Meet the VaHome Team — your trusted real estate experts in Hampton Roads, Virginia.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About VaHome</h1>
          <section className="max-w-4xl mx-auto px-6 py-8">
            <p className="text-gray-700 leading-relaxed text-base">{`The VaHome team is a Hampton Roads-based real estate group serving Virginia Beach, Norfolk, Chesapeake, Suffolk, Hampton, Newport News, and Portsmouth. We specialize in helping military families, first-time buyers, and longtime Virginia residents navigate the Hampton Roads market. Our agents combine deep local knowledge with technology-forward tools — interactive maps, mortgage calculators with VA loan support, BAH-aware home search, and detailed neighborhood data for every part of the region. Whether you're buying your first home, relocating from another state, PCS'ing to a military base, or selling a property after years in the area, we focus on making the process clear, honest, and tailored to your specific situation. Real estate is one of the largest financial decisions most people make, and we treat it that way.`}</p>
          </section>
          <p className="text-gray-500 text-lg">
            Your trusted real estate team in Hampton Roads, Virginia.
          </p>
        </div>

        {/* Photo + Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="aspect-[4/5] bg-gray-100 rounded-2xl flex items-center justify-center">
            <span className="text-gray-400 text-sm">Team Photo</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                VaHome is a dedicated real estate team based in Virginia Beach.
                With over a decade of experience in the Hampton Roads market, we&apos;ve helped families find
                their perfect homes across Virginia Beach, Norfolk, Chesapeake, Suffolk, and beyond.
              </p>
              <p>
                As active real estate investors ourselves, we bring a unique perspective to every transaction.
                We don&apos;t just find houses &mdash; we identify value, spot potential issues, and negotiate the best
                deals for our clients.
              </p>
              <p>
                Whether you&apos;re a first-time buyer, military family relocating to Hampton Roads, or looking
                for your dream luxury home, we&apos;re here to guide you every step of the way.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { number: '10+', label: 'Years Experience' },
            { number: '11', label: '5-Star Reviews' },
            { number: '100+', label: 'Homes Sold' },
            { number: '#1', label: 'Client Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-black text-primary-500 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  )
}
