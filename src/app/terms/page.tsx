export default function Terms() {
  return <div className="min-h-screen bg-[#0a0f1e] text-white py-16 px-8 max-w-3xl mx-auto">
    <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
    <p className="text-gray-400 mb-6">Last updated: March 22, 2026</p>

    <h2 className="text-xl font-bold mb-4 mt-8">1. Acceptance of Terms</h2>
    <p className="text-gray-300 mb-4">By accessing or using AI Payment Proxy, you agree to be bound by these Terms of Service. If you do not agree, do not use our service.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">2. Service Description</h2>
    <p className="text-gray-300 mb-4">AI Payment Proxy provides an API for issuing single-use virtual payment cards for use by AI agents and automated systems. Cards are issued through Stripe Issuing and are subject to Stripe&apos;s terms of service.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">3. Acceptable Use</h2>
    <p className="text-gray-300 mb-4">You may only use our service for lawful purposes. You are responsible for all activity that occurs under your API key. You may not use our service for illegal transactions, money laundering, or any activity that violates applicable law.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">4. Payment Terms</h2>
    <p className="text-gray-300 mb-4">You agree to maintain sufficient funds in your connected account or prepaid balance to cover all transactions initiated by your AI agents. You are responsible for all charges incurred through your API key.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">5. Limitation of Liability</h2>
    <p className="text-gray-300 mb-4">AI Payment Proxy is not liable for any damages arising from unauthorized use of your API key, actions taken by your AI agents, or failed transactions. Our liability is limited to the amount of fees paid in the prior 30 days.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">6. Termination</h2>
    <p className="text-gray-300 mb-4">We reserve the right to suspend or terminate your account for violations of these terms, suspected fraud, or any activity that poses risk to our platform or other users.</p>

    <h2 className="text-xl font-bold mb-4 mt-8">7. Contact</h2>
    <p className="text-gray-300 mb-4">For questions about these terms contact us at legal@aipaymentproxy.com</p>

    <a href="/" className="text-[#4ade80] hover:underline mt-8 block">← Back to home</a>
  </div>;
}