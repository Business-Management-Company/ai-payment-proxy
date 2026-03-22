"use client";
import { useState } from "react";

const plans = [
  {
    id: "developer",
    name: "Developer",
    price: 29,
    cards: 50,
    highlight: false,
    cta: "Get Started",
    features: [
      "50 virtual cards/month",
      "1 cardholder",
      "Full API access",
      "Prepaid or bank connect",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    cards: 250,
    highlight: true,
    cta: "Get Started",
    features: [
      "250 virtual cards/month",
      "5 cardholders",
      "Full API access",
      "Priority support",
      "Usage analytics",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 499,
    cards: null,
    highlight: false,
    cta: "Contact Us",
    features: [
      "Unlimited virtual cards",
      "Unlimited cardholders",
      "Stripe Connect",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
];

const feeRows = [
  { label: "Card deposit (credit/debit)",  fee: "2.9% + $0.30", note: "Passed through from Stripe", bad: true  },
  { label: "ACH bank deposit",             fee: "Free",          note: "Always free",                bad: false },
  { label: "Virtual card creation",        fee: "Included",      note: "Within plan limit",          bad: false },
  { label: "Card reveal (number + CVV)",   fee: "$0.50",         note: "Per API call",               bad: true  },
  { label: "Overage cards",               fee: "$0.75/card",    note: "Over plan monthly limit",     bad: true  },
  { label: "Card transaction processing",  fee: "Free",          note: "Under $500K volume",         bad: false },
  { label: "Card cancellation",           fee: "Free",          note: "Always free",                bad: false },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 px-8 py-5 flex justify-between items-center bg-[#0a0f1e]/90 backdrop-blur-sm">
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#4ade80] text-xl">⚡</span>
          <span>AI Payment Proxy</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="/docs"    className="text-gray-400 hover:text-white text-sm transition-colors">Docs</a>
          <a href="/pricing" className="text-white text-sm font-medium">Pricing</a>
          <a href="/integrations" className="text-gray-400 hover:text-white text-sm transition-colors">Integrations</a>
          <a href="/blog"    className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a>
          <a href="/login"   className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</a>
          <a href="/signup"  className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e] transition-colors">Get API Key</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-24">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-400 text-xl mb-8">Start free. Scale as your AI agents grow.</p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 bg-[#111827] border border-gray-800 rounded-xl px-4 py-2">
            <button
              onClick={() => setAnnual(false)}
              className={`text-sm px-3 py-1 rounded-lg transition-colors ${!annual ? "bg-[#4ade80] text-black font-semibold" : "text-gray-400 hover:text-white"}`}
            >Monthly</button>
            <button
              onClick={() => setAnnual(true)}
              className={`text-sm px-3 py-1 rounded-lg transition-colors flex items-center gap-2 ${annual ? "bg-[#4ade80] text-black font-semibold" : "text-gray-400 hover:text-white"}`}
            >
              Annual
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${annual ? "bg-black/20 text-black" : "bg-[#4ade80]/10 text-[#4ade80]"}`}>20% off</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 border flex flex-col ${
                plan.highlight
                  ? "border-[#4ade80] bg-[#4ade80]/5"
                  : "border-gray-800 bg-[#111827]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4ade80] text-black text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {plan.price === 499 && !plan.highlight
                      ? "$499"
                      : `$${annual ? Math.floor(plan.price * 0.8) : plan.price}`}
                  </span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
                {annual && (
                  <p className="text-[#4ade80] text-xs mt-1">
                    ${Math.floor(plan.price * 0.8 * 12)}/yr — save ${Math.floor(plan.price * 0.2 * 12)}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  {plan.cards ? `${plan.cards} cards included/mo` : "Unlimited cards"}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-[#4ade80] shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="text-[#4ade80] shrink-0">✓</span>
                  14-day free trial
                </li>
              </ul>

              <a
                href={plan.id === "enterprise" ? "mailto:hello@aipaymentproxy.com" : "/signup?plan=" + plan.id}
                className={`block text-center py-3 rounded-lg font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-[#4ade80] text-black hover:bg-[#22c55e]"
                    : "border border-gray-700 text-white hover:border-gray-500"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Fee table */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">All fees, no surprises</h2>
            <p className="text-gray-400">Every charge explained. ACH deposits are always free.</p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-3 border-b border-gray-800 bg-[#0a0f1e]">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Fee type</span>
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Amount</span>
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Notes</span>
            </div>
            {feeRows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 px-6 py-4 border-b border-gray-800/50 last:border-0 hover:bg-[#1a2235] transition-colors"
              >
                <span className="text-white text-sm">{row.label}</span>
                <span className={`text-sm font-mono font-semibold ${row.bad ? "text-amber-400" : "text-[#4ade80]"}`}>{row.fee}</span>
                <span className="text-gray-400 text-sm">{row.note}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs text-center mt-4">
            Card transaction processing is free for the first $500K in total volume — powered by Stripe Issuing.
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Common questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What is the card reveal fee?",
                a: "Every time your AI agent calls GET /api/v1/cards/:id to retrieve the card number and CVV, we charge $0.50. This is how agents actually use a card at checkout. It keeps the service sustainable while staying well below the value of any real transaction.",
              },
              {
                q: "What happens when I exceed my card limit?",
                a: "You can keep creating cards — we charge $0.75 per card over your monthly limit. This is deducted from your prepaid balance automatically. No service interruption.",
              },
              {
                q: "Why is ACH free but card deposits cost money?",
                a: "Stripe charges us 2.9% + $0.30 on card deposits — we pass that through at cost with zero markup. ACH costs us $0.80 max and we absorb that as a benefit for connecting your bank.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel your subscription at any time — you keep access until the end of your billing period. Your prepaid balance is available for refund minus any outstanding fees.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes — all plans include a 14-day free trial. No credit card required to start. Your trial includes full API access and your plan's card quota.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#111827] border border-gray-800 rounded-xl p-6">
                <p className="text-white font-semibold mb-2">{item.q}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#111827] border border-[#4ade80]/20 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to give your AI agents a card?</h2>
          <p className="text-gray-400 mb-6">14-day free trial. No credit card required.</p>
          <a href="/signup" className="bg-[#4ade80] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#22c55e] transition-colors inline-block">
            Start Free Trial →
          </a>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0a0f1e]">
        <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-4 gap-12">
          <div className="col-span-1">
            <a href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <span className="text-[#4ade80]">⚡</span>
              <span>AI Payment Proxy</span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed">Single-use virtual Visa cards for autonomous AI agents.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <div className="space-y-3">
              <a href="/docs"       className="block text-gray-500 hover:text-white text-sm transition-colors">Docs</a>
              <a href="/pricing"    className="block text-gray-500 hover:text-white text-sm transition-colors">Pricing</a>
              <a href="/#use-cases" className="block text-gray-500 hover:text-white text-sm transition-colors">Use Cases</a>
              <a href="/signup"     className="block text-gray-500 hover:text-white text-sm transition-colors">Get API Key</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <div className="space-y-3">
              <a href="/blog"                                          className="block text-gray-500 hover:text-white text-sm transition-colors">Blog</a>
              <a href="/blog/how-to-give-ai-agent-credit-card"        className="block text-gray-500 hover:text-white text-sm transition-colors">AI Agent Guide</a>
              <a href="/blog/virtual-cards-autonomous-ai-agents"      className="block text-gray-500 hover:text-white text-sm transition-colors">Virtual Cards Deep Dive</a>
              <a href="/blog/ai-agent-payment-infrastructure-explained" className="block text-gray-500 hover:text-white text-sm transition-colors">Infrastructure Explained</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
            <div className="space-y-3">
              <a href="/login"   className="block text-gray-500 hover:text-white text-sm transition-colors">Sign In</a>
              <a href="/signup"  className="block text-gray-500 hover:text-white text-sm transition-colors">Sign Up</a>
              <a href="/privacy" className="block text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="/terms"   className="block text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
          &copy; 2026 AI Payment Proxy. Built for the agentic era.
        </div>
      </footer>
    </div>
  );
}