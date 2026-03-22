export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white py-16 px-8 max-w-3xl mx-auto">
      <a href="/" className="text-[#4ade80] hover:underline mb-8 block text-sm">← Back to home</a>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-400 mb-8">Last updated: March 22, 2026. This policy describes how AI Payment Proxy collects, uses, and protects your information.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">1. Information We Collect</h2>
      <p className="text-gray-300 mb-2">We collect the following categories of information:</p>
      <p className="text-gray-300 font-medium mb-1">Account Information</p>
      <ul className="text-gray-300 mb-4 space-y-1 ml-4">
        <li>• Name and email address provided at registration</li>
        <li>• Authentication credentials (passwords are hashed and never stored in plain text)</li>
        <li>• OAuth tokens if you sign up via GitHub or Google</li>
      </ul>
      <p className="text-gray-300 font-medium mb-1">Financial Information</p>
      <ul className="text-gray-300 mb-4 space-y-1 ml-4">
        <li>• Prepaid balance and transaction history on our platform</li>
        <li>• Bank account details if you connect via Stripe Financial Connections (stored by Stripe, not us)</li>
        <li>• Virtual card usage records (card IDs, labels, limits, status — never full card numbers)</li>
        <li>• API key prefix for display purposes (full key is stored only as a SHA-256 hash)</li>
      </ul>
      <p className="text-gray-300 font-medium mb-1">Usage Information</p>
      <ul className="text-gray-300 mb-4 space-y-1 ml-4">
        <li>• API call logs including timestamps and response codes</li>
        <li>• Dashboard activity and feature usage</li>
        <li>• IP address and browser information for security purposes</li>
      </ul>

      <h2 className="text-xl font-bold mb-3 mt-8">2. How We Use Your Information</h2>
      <ul className="text-gray-300 mb-4 space-y-1 ml-4">
        <li>• To provide and operate the virtual card issuance service</li>
        <li>• To process payments and manage your prepaid balance</li>
        <li>• To detect and prevent fraud and unauthorized access</li>
        <li>• To communicate with you about your account, transactions, and service updates</li>
        <li>• To comply with legal obligations including anti-money laundering (AML) requirements</li>
        <li>• To improve our Service based on aggregated, anonymized usage patterns</li>
      </ul>
      <p className="text-gray-300 mb-4">We do not sell your personal or financial data to third parties. We do not use your data for advertising purposes.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">3. Third-Party Services</h2>
      <p className="text-gray-300 mb-2">We share data with the following third parties solely to provide our Service:</p>
      <ul className="text-gray-300 mb-4 space-y-2 ml-4">
        <li>• <strong className="text-white">Stripe, Inc.</strong> — payment processing, card issuance, and bank connectivity. Stripe stores your payment method details and bank account information. Stripe's Privacy Policy applies to data they process. Stripe is PCI-DSS Level 1 certified.</li>
        <li>• <strong className="text-white">Supabase</strong> — database and authentication infrastructure hosted in the United States</li>
        <li>• <strong className="text-white">Vercel</strong> — application hosting and content delivery</li>
        <li>• <strong className="text-white">Resend</strong> — transactional email delivery</li>
      </ul>
      <p className="text-gray-300 mb-4">We may disclose your information to law enforcement or regulatory authorities when required by law, valid legal process, or to protect the rights and safety of our users and the public.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">4. Financial Data Security</h2>
      <ul className="text-gray-300 mb-4 space-y-1 ml-4">
        <li>• Full virtual card numbers (PAN) are never stored on our servers — they are retrieved directly from Stripe and passed to you</li>
        <li>• API keys are stored as SHA-256 hashes — we cannot recover your original key</li>
        <li>• All data is encrypted in transit using TLS 1.2 or higher</li>
        <li>• Database access is restricted to authenticated services only</li>
        <li>• We do not store CVV or card PIN numbers</li>
        <li>• Payment processing is handled by Stripe, a PCI-DSS Level 1 certified provider</li>
      </ul>

      <h2 className="text-xl font-bold mb-3 mt-8">5. Data Retention</h2>
      <ul className="text-gray-300 mb-4 space-y-1 ml-4">
        <li>• Account information is retained for the duration of your account plus 7 years for financial compliance purposes</li>
        <li>• Transaction records are retained for 7 years as required by financial regulations</li>
        <li>• API call logs are retained for 90 days</li>
        <li>• Deleted accounts have personal information removed within 30 days, except where retention is required by law</li>
      </ul>

      <h2 className="text-xl font-bold mb-3 mt-8">6. Your Rights and Choices</h2>
      <ul className="text-gray-300 mb-4 space-y-1 ml-4">
        <li>• <strong className="text-white">Access:</strong> Request a copy of the personal data we hold about you</li>
        <li>• <strong className="text-white">Correction:</strong> Request correction of inaccurate personal data</li>
        <li>• <strong className="text-white">Deletion:</strong> Request deletion of your account and personal data, subject to legal retention requirements</li>
        <li>• <strong className="text-white">Portability:</strong> Request an export of your transaction history in CSV format</li>
        <li>• <strong className="text-white">Bank disconnection:</strong> Disconnect your bank account at any time through your dashboard settings</li>
        <li>• <strong className="text-white">API key rotation:</strong> Rotate your API key at any time through your dashboard settings</li>
      </ul>
      <p className="text-gray-300 mb-4">California residents have additional rights under the CCPA including the right to know, delete, and opt-out of sale of personal information. We do not sell personal information. To exercise your rights contact privacy@aipaymentproxy.com.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">7. Cookies and Tracking</h2>
      <p className="text-gray-300 mb-4">We use only essential cookies required for authentication and session management. We do not use advertising cookies, third-party tracking pixels, or behavioral analytics tools. We do not use Google Analytics or similar services.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">8. Children's Privacy</h2>
      <p className="text-gray-300 mb-4">Our Service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected information from a minor, contact us immediately at privacy@aipaymentproxy.com.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">9. International Users</h2>
      <p className="text-gray-300 mb-4">Our Service is operated in the United States. If you access our Service from outside the United States, your information will be transferred to and processed in the United States. By using our Service you consent to this transfer. We do not currently serve users in the European Union or United Kingdom and do not represent compliance with GDPR or UK GDPR.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">10. Changes to This Policy</h2>
      <p className="text-gray-300 mb-4">We may update this Privacy Policy periodically. We will notify you of material changes via email or dashboard notification at least 14 days before they take effect. Continued use of the Service after changes take effect constitutes acceptance of the updated policy.</p>

      <h2 className="text-xl font-bold mb-3 mt-8">11. Contact Us</h2>
      <p className="text-gray-300 mb-4">For privacy questions, data requests, or to report a security concern contact us at privacy@aipaymentproxy.com. We will respond within 30 days.</p>

      <div className="border-t border-gray-800 mt-12 pt-8">
        <p className="text-gray-500 text-xs">AI Payment Proxy — Business Management Company LLC. This privacy policy applies to aipaymentproxy.com and all related services.</p>
      </div>
    </div>
  );
}
