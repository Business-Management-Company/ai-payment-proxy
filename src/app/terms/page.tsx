export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white py-16 px-8 max-w-3xl mx-auto">
      <a href="/" className="text-[#4ade80] hover:underline mb-8 block text-sm">← Back to home</a>
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-400 mb-8">Last updated: March 22, 2026. Please read these terms carefully before creating an account.</p>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8">
        <p className="text-amber-400 text-sm font-semibold mb-1">Important Financial Disclaimer</p>
        <p className="text-amber-300 text-sm">AI Payment Proxy is not a bank. We are not a licensed money transmitter. Virtual cards are issued by Stripe's banking partners (Evolve Bank & Trust, Member FDIC). Prepaid balances held in your AI Payment Proxy account are not FDIC insured and are not bank deposits.</p>
      </div>

      <h2 className="text-xl font-bold mb-3 mt-8">1. Acceptance of Terms</h2>
      <p className="text-gray-300 mb-4">By creating an account or using AI Payment Proxy ("Service," "we," "us," or "our"), you ("User," "you") agree to be bound by these Terms of Service and all applicable laws. If you do not agree, you may not use our Service. You must be at least 18 years old and legally capable of entering binding contracts to use this Service.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">2. Service Description</h2>
      <p className="text-gray-300 mb-4">AI Payment Proxy provides a software platform and API that enables developers to issue single-use virtual payment cards for use by AI agents and automated systems. We are a technology platform, not a financial institution. Card issuance is performed by Stripe, Inc. and its banking partners under Stripe's own licenses and regulatory framework. Your use of virtual cards is subject to Stripe's Terms of Service and Stripe Issuing terms in addition to these terms.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">3. Account Requirements</h2>
      <p className="text-gray-300 mb-2">To use our Service you must:</p>
      <ul className="text-gray-300 mb-4 space-y-1 ml-4">
        <li>• Be at least 18 years of age</li>
        <li>• Be a legal resident or entity in a jurisdiction where our Service is available</li>
        <li>• Provide accurate and complete information during registration</li>
        <li>• Maintain the security of your API key and account credentials</li>
        <li>• Promptly notify us of any unauthorized access to your account</li>
      </ul>
      <p className="text-gray-300 mb-4">You are solely responsible for all activity that occurs under your account and API key, including all actions taken by AI agents operating with your credentials.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">4. Acceptable Use Policy</h2>
      <p className="text-gray-300 mb-2">You may only use our Service for lawful purposes. You expressly agree NOT to use our Service for:</p>
      <ul className="text-gray-300 mb-4 space-y-1 ml-4">
        <li>• Any illegal transaction or activity under applicable federal, state, or local law</li>
        <li>• Money laundering, terrorist financing, or any activity that violates the Bank Secrecy Act</li>
        <li>• Transactions involving sanctioned countries, entities, or individuals (OFAC compliance required)</li>
        <li>• Purchasing illegal goods, substances, or services</li>
        <li>• Gambling or lottery transactions where prohibited by law</li>
        <li>• Circumventing spending limits or controls on other payment platforms</li>
        <li>• Funding other prepaid card programs or payment platforms</li>
        <li>• Any activity that constitutes fraud or misrepresentation</li>
        <li>• Reselling our Service or API access to third parties without written permission</li>
        <li>• Creating multiple accounts to circumvent usage limits or restrictions</li>
      </ul>
      <p className="text-gray-300 mb-4">We reserve the right to monitor transactions for compliance with this policy. Violation may result in immediate account termination, forfeiture of prepaid balance, and reporting to relevant authorities.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">5. Payment Terms and Prepaid Balance</h2>
      <p className="text-gray-300 mb-4">Our Service operates on a prepaid basis. You must maintain sufficient funds in your account to cover all transactions initiated by your AI agents. Prepaid balances are not bank deposits, are not FDIC insured, and do not earn interest. We reserve the right to deduct fees for card issuance, card reveal, and overage usage as described on our Pricing page. Unused prepaid balances may be refunded upon account closure, less any outstanding fees, at our discretion. Subscription fees are non-refundable except as required by law.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">6. Card Reveal Fee and Usage Fees</h2>
      <p className="text-gray-300 mb-4">A fee of $0.50 is charged each time you retrieve card credentials (card number, CVV, expiry) via the API. Additional overage fees of $0.75 per card apply when you exceed your monthly plan limit. Card deposit fees (2.9% + $0.30 for card deposits) are passed through from Stripe at cost. ACH deposits are free. All fees are subject to change with 30 days notice.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">7. AI Agent Responsibility</h2>
      <p className="text-gray-300 mb-4">You are solely responsible for all actions taken by AI agents operating under your API key. AI Payment Proxy does not control, monitor, or assume liability for purchasing decisions made by your AI agents. You are responsible for implementing appropriate safeguards, spending limits, and controls on your AI agents. We strongly recommend setting conservative spending limits on all virtual cards.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">8. Data Security and API Keys</h2>
      <p className="text-gray-300 mb-4">Your API key grants full access to create and use virtual cards charged to your account. You must keep your API key confidential and secure. Do not share your API key publicly, commit it to public code repositories, or expose it in client-side code. If you believe your API key has been compromised, rotate it immediately in your dashboard settings. We are not liable for unauthorized charges resulting from compromised API keys.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">9. Limitation of Liability</h2>
      <p className="text-gray-300 mb-4">To the maximum extent permitted by applicable law, AI Payment Proxy and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or business interruption, arising from your use of the Service. Our total liability for any claim arising from these terms or your use of the Service shall not exceed the greater of (a) the amount of fees you paid us in the 30 days preceding the claim or (b) $100 USD.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">10. Indemnification</h2>
      <p className="text-gray-300 mb-4">You agree to indemnify, defend, and hold harmless AI Payment Proxy and its affiliates from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from your use of the Service, violation of these Terms, actions of your AI agents, or infringement of any third-party rights.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">11. Termination</h2>
      <p className="text-gray-300 mb-4">We reserve the right to suspend or terminate your account immediately and without notice for: violation of these Terms, suspected fraud or illegal activity, activity that poses risk to our platform or other users, or failure to maintain required account information. Upon termination, your API key will be revoked and outstanding card authorizations may be declined. We will attempt to refund any remaining prepaid balance minus outstanding fees within 30 days of termination, unless prohibited by law or applicable regulations.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">12. Disputes and Governing Law</h2>
      <p className="text-gray-300 mb-4">These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles. Any dispute arising from these Terms shall be resolved through binding arbitration administered by the American Arbitration Association under its Commercial Arbitration Rules. You waive any right to a jury trial or class action lawsuit against us.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">13. Changes to Terms</h2>
      <p className="text-gray-300 mb-4">We may update these Terms at any time. We will provide at least 14 days notice of material changes via email or in-app notification. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">14. Contact</h2>
      <p className="text-gray-300 mb-4">For questions about these Terms contact us at legal@aipaymentproxy.com. For urgent account issues contact support@aipaymentproxy.com.</p>

      <div className="border-t border-gray-800 mt-12 pt-8">
        <p className="text-gray-500 text-xs">AI Payment Proxy is a technology platform. Virtual cards are issued by Stripe's banking partners. We are not a bank, credit union, or licensed money transmitter. This document does not constitute legal or financial advice.</p>
      </div>
    </div>
  );
}
