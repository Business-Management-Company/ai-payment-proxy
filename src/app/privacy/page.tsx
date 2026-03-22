export default function Privacy() {
  return <div className="min-h-screen bg-[#0a0f1e] text-white py-16 px-8 max-w-3xl mx-auto">
    <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
    <p className="text-gray-400 mb-6">Last updated: March 22, 2026</p>

    <h2 className="text-xl font-bold mb-4 mt-8">1. Information We Collect</h2>
    <p className="text-gray-300 mb-4">We collect information you provide when creating an account, including your name, email address, and payment information. When you connect a bank account via Stripe Financial Connections, we access account and routing numbers, balances, and transaction history solely to process payments on your behalf.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">2. How We Use Your Information</h2>
    <p className="text-gray-300 mb-4">We use your information to provide our virtual card issuance service, process payments, prevent fraud, and communicate with you about your account. We do not sell or share your personal or financial data with third parties.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">3. Financial Data</h2>
    <p className="text-gray-300 mb-4">Financial data accessed through Stripe Financial Connections is stored securely in the United States. We only access the minimum data necessary to process your transactions. We do not share this data with any third parties.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">4. Data Security</h2>
    <p className="text-gray-300 mb-4">We use industry-standard encryption and security practices. Payment processing is handled by Stripe, a PCI-DSS compliant payment processor. We never store raw card numbers on our servers.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">5. Your Rights</h2>
    <p className="text-gray-300 mb-4">You may request deletion of your account and associated data at any time by contacting us at privacy@aipaymentproxy.com. You may also disconnect your bank account at any time through your dashboard.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">6. Contact Us</h2>
    <p className="text-gray-300 mb-4">For privacy questions contact us at privacy@aipaymentproxy.com</p>

    <a href="/" className="text-[#4ade80] hover:underline mt-8 block">← Back to home</a>
  </div>;
}