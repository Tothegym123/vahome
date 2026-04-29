import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: "/terms/" },
  title: 'Terms of Service | VaHome.com',
  description: 'Terms of Service for VaHome.com - understand your rights and responsibilities when using our services.',
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: February 13, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <p className="text-gray-700 leading-relaxed">
            Welcome and thank you for your interest in this website and any subdomains (collectively, the &ldquo;Website&rdquo;) operated by Vahome Info LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; or the &ldquo;Company&rdquo;). By accessing or using our website, mobile applications, or any related services (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;), which form a legally binding agreement between you and Vahome Info LLC.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Use of Services</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms apply to your access to and use of the Services, including all content, listings, reports, and tools made available through the platform.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We reserve the right to modify, suspend, or discontinue any aspect of the Services at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Eligibility</h2>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years old to use our Services. By using the Services, you represent that you have the legal authority and capacity to enter into this agreement.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We may refuse service to any individual or entity at our discretion. Use of the Services must comply with all applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Accounts &amp; Registration</h2>
            <p className="text-gray-700 leading-relaxed">
              To access certain features, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You are solely responsible for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our <a href="/privacy/" className="text-blue-600 hover:underline">Privacy Policy</a> is incorporated into these Terms by reference and explains how we collect, use, and protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Communications</h2>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Email</h3>
            <p className="text-gray-700 leading-relaxed">
              We may send emails related to saved searches, listings, transactions, and marketing. You may unsubscribe at any time using the link provided in emails.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Calls &amp; Text Messages</h3>
            <p className="text-gray-700 leading-relaxed">
              If you opt in, you agree to receive calls and text messages (including automated messages). Message and data rates may apply. You can opt out at any time by replying STOP.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Your information is only shared with mortgage partners if you explicitly request such services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">License &amp; Use Restrictions</h2>
            <p className="text-gray-700 leading-relaxed">
              We grant you a limited, non-exclusive, non-transferable license to use the Services for personal, non-commercial use only.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">You may NOT:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Copy, scrape, or reproduce content</li>
              <li>Use the platform for commercial purposes without permission</li>
              <li>Reverse engineer or attempt to access source code</li>
              <li>Circumvent platform protections</li>
              <li>Use automated bots or scraping tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Rules of Conduct</h2>
            <p className="text-gray-700 leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Post false, misleading, or unlawful content</li>
              <li>Interfere with other users or listings</li>
              <li>Attempt to bypass fees or platform processes</li>
              <li>Engage in spam or abusive behavior</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              We reserve the right to remove content or restrict access at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">User Content</h2>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for any content you submit. By submitting content, you grant us a worldwide, royalty-free license to use, display, and distribute it in connection with our Services.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">You represent that your content:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Is accurate and lawful</li>
              <li>Does not infringe on third-party rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content, branding, logos, and materials on the platform are owned by Vahome Info LLC or its licensors and are protected by intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              No ownership rights are transferred to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Equal Housing Opportunity</h2>
            <p className="text-gray-700 leading-relaxed">
              We fully support the Fair Housing Act and do not discriminate based on race, color, religion, sex, disability, familial status, or national origin.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Services may include links to third-party websites. We are not responsible for their content, policies, or practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">We do not guarantee:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Accuracy of listings or data</li>
              <li>Availability of properties</li>
              <li>Error-free or uninterrupted service</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You use the Services at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, Vahome Info LLC shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Lost profits or data</li>
              <li>Indirect or consequential damages</li>
              <li>Issues related to property condition, legality, or transactions</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">Maximum liability shall not exceed the greater of:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Fees paid in the last 3 months, or</li>
              <li>$100</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to defend and indemnify Vahome Info LLC from any claims arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Your use of the Services</li>
              <li>Violation of these Terms</li>
              <li>Infringement of third-party rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate your access at any time without notice. You may also terminate your account at any time.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Certain provisions (liability, ownership, indemnification) will survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of the United States and the Commonwealth of Virginia.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Any disputes shall be resolved in courts located in Virginia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">GDPR Notice</h2>
            <p className="text-gray-700 leading-relaxed">
              This Website is intended for users outside the EU/UK. If you access it from those regions, you consent to the collection and processing of your data in the United States.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms at any time. Continued use of the Services constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Hosting Provider</h2>
            <p className="text-gray-700 leading-relaxed">
              This Website may be hosted or supported by third-party providers. Use of such infrastructure does not change your agreement with Vahome Info LLC.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions, please contact:
            </p>
            <div className="mt-3 text-gray-700">
              <p className="font-semibold">Vahome Info LLC</p>
              <p>249 Central Park Ave, Virginia Beach, VA 23462</p>
              <p>+1 (757) 777-7577</p>
              <p><a href="mailto:tom@vahomes.com" className="text-blue-600 hover:underline">tom@vahomes.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
