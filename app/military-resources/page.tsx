import Link from 'next/link'

export const metadata = {
  title: 'Military Resources | VaHome.com',
  description: 'Military home buying resources for Hampton Roads service members. VA loans, PCS relocation guides, base housing info, and more from the VaHome Team.',
}

export default function MilitaryResourcesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Military Resources</span>
          </nav>

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 sm:p-12 mb-12 text-white">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <span>Proudly Serving Those Who Serve</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Military Resources
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Hampton Roads is home to the largest concentration of military bases in the world.
                The VaHome Team is here to help service members, veterans, and military families
                find their perfect home.
              </p>
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Resources Coming Soon
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
              We are building a comprehensive resource hub for military home buyers in Hampton Roads.
              Check back soon for VA loan guides, PCS relocation tips, base housing information,
              and military-friendly neighborhood guides.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Contact the VaHome Team
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="tel:+17577777577"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Call (757) 777-7577
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
