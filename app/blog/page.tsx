import Link from 'next/link'

export default function BlogPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Real Estate Blog</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Tips, market updates, and insights for Hampton Roads home buyers and sellers.
          </p>
        </div>

        {/* Blog posts placeholder */}
        <div className="bg-gray-50 rounded-2xl p-16 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Blog Posts Coming Soon</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Articles will be migrated from vahome.com and new content will be added here.
          </p>
        </div>
      </div>
    </div>
  )
}
