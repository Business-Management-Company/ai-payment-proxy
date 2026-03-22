"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsScrolled, setTermsScrolled] = useState(false);
  const [privacyScrolled, setPrivacyScrolled] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [activeModal, setActiveModal] = useState<"terms"|"privacy"|null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (window as Window & { onTurnstileSuccess?: (token: string) => void }).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };
  }, []);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    if (atBottom) {
      if (activeModal === "terms") setTermsScrolled(true);
      if (activeModal === "privacy") setPrivacyScrolled(true);
    }
  }

  function openModal(type: "terms"|"privacy") {
    setActiveModal(type);
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, 50);
  }

  const canSubmit = termsChecked && privacyChecked && name && email && password.length >= 8 && turnstileToken !== "";

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    const verifyRes = await fetch("/api/verify-turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: turnstileToken }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      setError("Bot verification failed. Please refresh and try again.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/onboarding");
    }
  }

  const termsContent = `TERMS OF SERVICE SUMMARY

AI Payment Proxy is NOT a bank. Virtual cards are issued by Stripe's banking partners. Prepaid balances are NOT FDIC insured.

1. ACCEPTANCE
By creating an account you agree to these terms. You must be 18 or older.

2. SERVICE
We provide an API for issuing single-use virtual payment cards. Card issuance is performed by Stripe, Inc. and its banking partners.

3. YOUR RESPONSIBILITIES
You are solely responsible for all activity under your API key, including all actions taken by AI agents using your credentials.

4. ACCEPTABLE USE — YOU MAY NOT USE OUR SERVICE FOR:
- Illegal transactions of any kind
- Money laundering or terrorist financing
- Sanctioned countries, entities, or individuals
- Purchasing illegal goods or services
- Circumventing spending limits on other platforms
- Reselling API access without written permission
- Creating multiple accounts to bypass limits

5. FEES
- $0.50 per card reveal (retrieving card number + CVV)
- $0.75 per card over your monthly plan limit
- 2.9% + $0.30 for card deposits (passed through from Stripe)
- ACH deposits are free

6. PREPAID BALANCE
Balances are not bank deposits, not FDIC insured, and do not earn interest.

7. AI AGENT LIABILITY
You are solely responsible for all purchases made by AI agents under your API key.

8. TERMINATION
We may suspend or terminate accounts for violations, suspected fraud, or risk to our platform. Outstanding prepaid balances will be refunded less fees within 30 days.

9. LIMITATION OF LIABILITY
Our liability is limited to fees paid in the prior 30 days or $100, whichever is greater.

10. GOVERNING LAW
These terms are governed by Delaware law. Disputes resolved by binding arbitration.

By checking the box below you confirm you have read, understood, and agree to these Terms of Service in full. Full terms available at aipaymentproxy.com/terms`;

  const privacyContent = `PRIVACY POLICY SUMMARY

1. WHAT WE COLLECT
- Name and email at registration
- Transaction history and prepaid balance
- API key (stored as SHA-256 hash only — we cannot recover your original key)
- Bank account details via Stripe (stored by Stripe, not us)
- Usage logs for security and fraud prevention

2. WHAT WE DON'T DO
- We do not sell your data
- We do not store full card numbers (PAN)
- We do not store CVV numbers
- We do not use advertising cookies or tracking pixels

3. WHO WE SHARE WITH
- Stripe — payment processing and card issuance
- Supabase — database hosting (US)
- Vercel — application hosting
- Resend — transactional email
- Law enforcement when required by law

4. FINANCIAL DATA SECURITY
- Card numbers never stored on our servers
- All data encrypted in transit (TLS 1.2+)
- Stripe is PCI-DSS Level 1 certified

5. DATA RETENTION
- Account data: duration of account + 7 years (financial compliance)
- Transaction records: 7 years
- API logs: 90 days

6. YOUR RIGHTS
- Access your data
- Correct inaccurate data
- Delete your account
- Export your transaction history
- Disconnect your bank account anytime
- Rotate your API key anytime

7. CALIFORNIA RESIDENTS
You have additional rights under CCPA. We do not sell personal information.

Contact: privacy@aipaymentproxy.com

By checking the box below you confirm you have read and agree to our Privacy Policy. Full policy at aipaymentproxy.com/privacy`;

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      {activeModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 shrink-0">
              <h3 className="text-white font-semibold">
                {activeModal === "terms" ? "Terms of Service" : "Privacy Policy"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
            </div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-6 py-4"
            >
              <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {activeModal === "terms" ? termsContent : privacyContent}
              </pre>
              <div className="h-8" />
            </div>
            <div className="px-6 py-4 border-t border-gray-800 shrink-0">
              {(activeModal === "terms" ? termsScrolled : privacyScrolled) ? (
                <button
                  onClick={() => {
                    if (activeModal === "terms") setTermsChecked(true);
                    if (activeModal === "privacy") setPrivacyChecked(true);
                    setActiveModal(null);
                  }}
                  className="w-full bg-[#4ade80] text-black font-semibold py-3 rounded-lg hover:bg-[#22c55e] transition-colors"
                >
                  I have read and agree ✓
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">↓ Please scroll to the bottom to continue</p>
                  <div className="w-full bg-gray-800 rounded-full h-1">
                    <div className="bg-[#4ade80] h-1 rounded-full w-0 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 w-full max-w-md">
        <a href="/" className="flex items-center gap-2 font-bold text-lg text-white mb-6">
          <span className="text-[#4ade80]">⚡</span>
          <span>AI Payment Proxy</span>
        </a>
        <p className="text-gray-400 mb-6">Create your account — 14-day free trial</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]"
          />

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {termsChecked ? (
                  <div className="w-5 h-5 bg-[#4ade80] rounded flex items-center justify-center shrink-0">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openModal("terms")}
                    className="w-5 h-5 border-2 border-gray-600 rounded hover:border-[#4ade80] transition-colors shrink-0"
                  />
                )}
              </div>
              <p className="text-gray-400 text-sm">
                I agree to the{" "}
                <button type="button" onClick={() => openModal("terms")} className="text-[#4ade80] hover:underline">
                  Terms of Service
                </button>
                {!termsChecked && <span className="text-gray-600"> — click to read and accept</span>}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {privacyChecked ? (
                  <div className="w-5 h-5 bg-[#4ade80] rounded flex items-center justify-center shrink-0">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openModal("privacy")}
                    className="w-5 h-5 border-2 border-gray-600 rounded hover:border-[#4ade80] transition-colors shrink-0"
                  />
                )}
              </div>
              <p className="text-gray-400 text-sm">
                I agree to the{" "}
                <button type="button" onClick={() => openModal("privacy")} className="text-[#4ade80] hover:underline">
                  Privacy Policy
                </button>
                {!privacyChecked && <span className="text-gray-600"> — click to read and accept</span>}
              </p>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {!canSubmit && (termsChecked || privacyChecked || name || email) && (
            <p className="text-gray-500 text-xs whitespace-pre-line">
              {!termsChecked && "• Read and accept Terms of Service\n"}
              {!privacyChecked && "• Read and accept Privacy Policy\n"}
              {password.length > 0 && password.length < 8 && "• Password must be at least 8 characters"}
              {!turnstileToken && termsChecked && privacyChecked && name && email && password.length >= 8 && "• Complete human verification below"}
            </p>
          )}

          <div
            className="cf-turnstile"
            data-sitekey="0x4AAAAAACumghLSlzYNDXae"
            data-callback="onTurnstileSuccess"
            data-theme="dark"
          />

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full bg-[#4ade80] text-black font-semibold rounded-lg px-4 py-3 hover:bg-[#22c55e] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
          <div className="relative flex justify-center text-xs"><span className="bg-[#111827] px-2 text-gray-500">or continue with</span></div>
        </div>

        <a href="https://loaquqkxszzeymbrayhr.supabase.co/auth/v1/authorize?provider=github&redirect_to=https://aipaymentproxy.com/auth/callback"
          className="w-full flex items-center justify-center gap-3 border border-gray-700 text-white py-3 rounded-lg hover:border-gray-500 transition text-sm mb-3">
          Sign up with GitHub
        </a>
        <a href="https://loaquqkxszzeymbrayhr.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://aipaymentproxy.com/auth/callback"
          className="w-full flex items-center justify-center gap-3 border border-gray-700 text-white py-3 rounded-lg hover:border-gray-500 transition text-sm mb-3">
          Sign up with Google
        </a>

        <p className="text-gray-500 text-sm mt-4 text-center">
          Already have an account? <a href="/login" className="text-[#4ade80]">Sign in</a>
        </p>

        <p className="text-gray-600 text-xs mt-4 text-center">
          AI Payment Proxy is not a bank. Cards issued by Stripe&apos;s banking partners.
        </p>
      </div>
    </div>
  );
}
