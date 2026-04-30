export const metadata = {
  alternates: { canonical: "/lenders/" },
  title: 'Hampton Roads Mortgage Lenders | VaHome.com',
  description: 'Vetted mortgage lenders for Virginia Beach, Norfolk, Chesapeake, and the rest of Hampton Roads. VA loan specialists, FHA, USDA, conventional, and refinance options.',
};

export default function LendersPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Hampton Roads Mortgage Lenders</h1>
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          The VaHome team works with a vetted network of mortgage lenders that specialize in Hampton Roads real estate. Our partner lenders are chosen for responsiveness, transparency, and a strong track record of closing on time. Most service members and veterans buying in Virginia Beach, Norfolk, Chesapeake, Suffolk, Hampton, Newport News, or Portsmouth qualify for VA loan programs that require zero down payment, no private mortgage insurance, and competitive interest rates.
        </p>
        <p className="text-gray-700 leading-relaxed text-base mb-6">
          We help match buyers to the right lender for their situation. First-time buyers often benefit from FHA loans with low down payment requirements. Active-duty service members and veterans typically use VA loans for their no-down-payment advantage. Buyers in rural pockets of Suffolk, Chesapeake, or Isle of Wight County may qualify for USDA loans. Higher-priced properties in Virginia Beach, Williamsburg, or York County may need a jumbo loan. Existing homeowners often refinance to lower their rate, shorten their loan term, or pull cash out for renovations.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Loan Types We Help With</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li><strong>VA Loans</strong> — for active-duty military, veterans, and eligible spouses</li>
          <li><strong>FHA Loans</strong> — for first-time buyers and lower down payment scenarios</li>
          <li><strong>USDA Loans</strong> — for eligible rural and suburban Hampton Roads properties</li>
          <li><strong>Conventional Loans</strong> — fixed and adjustable rate options</li>
          <li><strong>Jumbo Loans</strong> — for higher-priced Hampton Roads properties</li>
          <li><strong>Refinances</strong> — rate-and-term, cash-out, and VA IRRRL streamline options</li>
        </ul>
        <p className="text-gray-700 leading-relaxed text-base mb-6">
          You're under no obligation to use any specific lender. We strongly encourage shopping rates and terms across multiple options to ensure you get the best deal. The VaHome team is happy to make introductions to vetted lenders, walk you through pre-approval, or just answer questions about which loan program might fit your situation. Reach out anytime — there's never any pressure to commit.
        </p>
        <div className="mt-8">
          <a href="/contact/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg">Connect with a Lender</a>
        </div>
      </section>
    </main>
  );
}
