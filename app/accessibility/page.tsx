import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility Statement | VaHome.com',
  description: 'VaHome.com is committed to making our website accessible to everyone. Read our accessibility statement and contact us with any concerns.',
  alternates: {
    canonical: 'https://vahome.com/accessibility/',
  },
}

export default function AccessibilityPage() {
  return (
    <main className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-6'>Accessibility Statement</h1>
      <div className='prose prose-lg text-gray-700 space-y-5'>
        <p>VaHome.com is committed to providing a website that is accessible to the widest possible audience, regardless of technology or ability. We aim to comply with all applicable standards, including the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level.</p>

        <h2 className='text-2xl font-semibold mt-8 mb-3 text-gray-900'>What we do</h2>
        <p>We continually work to improve the accessibility of our website by:</p>
        <ul className='list-disc pl-6 space-y-2'>
          <li>Using semantic HTML and proper heading structure so screen readers can navigate content effectively</li>
          <li>Providing alternative text for meaningful images</li>
          <li>Maintaining sufficient color contrast for readability</li>
          <li>Ensuring keyboard navigability across pages, forms, and interactive elements</li>
          <li>Designing forms with clear labels and helpful error messages</li>
        </ul>

        <h2 className='text-2xl font-semibold mt-8 mb-3 text-gray-900'>Property listings and third-party content</h2>
        <p>Some content on this site is delivered from third-party sources, including listing data from REIN MLS and embedded maps. While we work to make these areas accessible, third-party tools may not always meet the same standards. If you have trouble accessing any specific listing or feature, please contact us and we will be happy to assist you directly.</p>

        <h2 className='text-2xl font-semibold mt-8 mb-3 text-gray-900'>Contact us</h2>
        <p>If you have any difficulty accessing the content on this site, or if you have feedback on how we can improve, we want to hear from you. Reach out at <a className='text-red-600 hover:text-red-700 underline' href='mailto:tom@vahomes.com'>tom@vahomes.com</a> or call <a className='text-red-600 hover:text-red-700 underline' href='tel:+17577777577'>(757) 777-7577</a>.</p>
        <p className='text-sm text-gray-500 mt-8'>Last updated: April 2026</p>
      </div>
    </main>
  )
}
