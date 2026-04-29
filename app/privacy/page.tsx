import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: "/privacy/" },
  title: 'Privacy Policy | VaHome.com',
  description: 'Privacy Policy for VaHome.com - learn how we collect, use, and protect your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <section className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-gray-700 leading-relaxed text-base">{`VaHome.com is committed to protecting the privacy and security of every visitor. This privacy policy describes the information we collect, how we use it, and the choices you have. We collect basic site analytics (page views, device type, referral source), information you voluntarily provide through forms (name, email, phone, search preferences), and minimal cookie data necessary to operate site features like saved searches and military profile preferences. We never sell your information to third parties. We share information only with the agents and lenders you specifically request to be connected with. You can request deletion of your data at any time by contacting us. For property listing data, we operate within REIN MLS's terms of use and rules for member sites.`}</p>
        </section>
        <p className="text-sm text-gray-500 mb-10">Last Updated: 4/1/2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <p className="text-gray-700 leading-relaxed">
            When you use Services (including our website and mobile apps) on this website and any subdomains of this website (collectively, the &ldquo;Website&rdquo;) to find, buy, rent, or sell real estate or connect with mortgage lenders or other real estate professionals, you are providing us with your data. This policy explains what information we collect, how we use it, and who we share it with, along with the rights and choices you may have with respect to your information. This policy applies to any of our websites or apps that link to this Privacy Policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Read the United States Regional Privacy Notice for more details about how we handle Personal Information and how to exercise your rights.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Terms of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy is governed by the Terms of Service, which includes all disclaimers of warranties and limitations of liabilities. All terms not defined separately in this Privacy Policy shall maintain the definition given to them in the Terms of Service.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              To review other applicable terms and conditions that apply to this Privacy Policy, including, without limitation, intellectual property rights, representations and warranties, disclaimer of warranties, limitation of liability, and resolving disputes, please review the Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information Collected</h2>
            <p className="text-gray-700 leading-relaxed">
              When you use our Services, we collect a variety of information from and about you and your device(s). Some of this information identifies you directly (such as your name or email address), while some of it is associated with you through your account, profile, or device (like the homes you choose to save or your location data).
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              When you use aspects of our Services (such as creating an account), we may ask you for information about yourself, such as your name, email address, and phone number. If you use any mortgage tools included on our websites or apps, we might ask you for more sensitive information, such as your income and credit score. Additionally, if you voluntarily contribute any information, such as agent reviews or comments you provide on a &ldquo;request information&rdquo; form, we&rsquo;ll store that data as well.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              You may also provide information about other people through our Services. For example, if you share a home listing with someone, we may collect that person&rsquo;s email address as part of your account information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information You Provide</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Home Search:</strong> We provide tools to help you find a home to buy or rent. If you provide search criteria (such as home type or number of bedrooms), we save that information to tailor your results.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We also help connect you with real estate agents, property managers, mortgage loan officers, and other professionals. If you choose to contact them through our platform, we may collect your name, email, and phone number.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information We Collect Automatically</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Activity Information:</strong> We collect how you use our site (search history, clicks, time spent, etc.).
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Device Information:</strong> Includes browser, device type, OS, and identifiers.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Location Information:</strong> Used to provide local listings and services (can be disabled in settings).
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Cookies &amp; Tracking Technologies:</strong> Used to improve experience, personalize content, and analyze usage.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Ads &amp; Remarketing:</strong> We may use services like Google and Facebook to show ads based on prior visits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Permitted Use of Personal Information</h2>
            <p className="text-gray-700 leading-relaxed">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Fulfill requests and provide services</li>
              <li>Improve marketing and customer experience</li>
              <li>Protect security and prevent fraud</li>
              <li>Comply with legal requirements</li>
              <li>Send promotional content (with consent)</li>
              <li>Connect you with real estate professionals</li>
              <li>Personalize your experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Sharing Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Mobile Information:</strong> We do NOT sell or share mobile numbers or SMS consent data for marketing.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>When You Request It:</strong> We share your info when you choose to connect with professionals.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Service Providers:</strong> We share only what is necessary with trusted vendors.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Legal Requirements:</strong> We may share data to comply with law or protect rights.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Business Transfers:</strong> Data may transfer in mergers or acquisitions.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>AI Tools:</strong> We may use AI tools (including OpenAI, Google Cloud, etc.) to improve services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Sub-Processors (Examples)</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Amazon Web Services (AWS)</li>
              <li>Google Cloud Platform</li>
              <li>OpenAI</li>
              <li>Twilio / Vonage / Bandwidth</li>
              <li>Home Junction / ATTOM Data</li>
              <li>GitHub</li>
              <li>Vercel</li>
              <li>Supabase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Choices</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Opt out of emails via unsubscribe links</li>
              <li>Opt out of texts by replying &ldquo;STOP&rdquo;</li>
              <li>Request data removal via: <a href="mailto:tom@vahomes.com" className="text-blue-600 hover:underline">tom@vahomes.com</a></li>
              <li>Opt out of AI data usage via request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We use reasonable safeguards including SSL encryption. However, no system is 100% secure. You are responsible for protecting your login credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">U.S. Data Processing</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data is processed in the United States and governed by U.S. law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Children&rsquo;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not collect data from anyone under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">CAN-SPAM Compliance</h2>
            <p className="text-gray-700 leading-relaxed">
              You can opt out of emails anytime by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions, contact:
            </p>
            <div className="mt-3 text-gray-700">
              <p className="font-semibold">Vahome Info LLC</p>
              <p><a href="mailto:tom@vahomes.com" className="text-blue-600 hover:underline">tom@vahomes.com</a></p>
              <p>249 Central Parkway Ste 300, Va Beach, VA 23462</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
