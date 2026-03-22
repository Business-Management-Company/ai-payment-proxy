"use client";
import { useState } from "react";

const plans = [
  { id: "developer", name: "Developer", price: 29, features: ["50 virtual cards/mo", "1 cardholder", "API access", "Prepaid or bank connect", "Email support"], cta: "Get Started", highlight: false },
  { id: "growth", name: "Growth", price: 79, features: ["250 virtual cards/mo", "5 cardholders", "API access", "Priority support", "Usage analytics"], cta: "Get Started", highlight: true },
  { id: "enterprise", name: "Enterprise", price: 0, features: ["Unlimited cards", "Unlimited cardholders", "Stripe Connect", "Dedicated support", "SLA guarantee"], cta: "Contact Us", highlight: false },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  return <div className="min-h-screen bg-[#0a0f1e] text-white py-24 px-8">
    <div className="max-w-5xl mx-auto text-center mb-16">
      <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
      <p className="text-gray-400 text-xl">Start free. Scale as your AI agents grow.</p>
    </div>
    <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
      {plans.map(plan => <div key={plan.id} className={`relative rounded-2xl p-8 border ${plan.highlight ? "border-[#4ade80] bg-[#4ade80]/5" : "border-gray-800 bg-[#111827]"}`}>
        {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4ade80] text-black text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>}
        <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
        <p className="text-4xl font-bold mb-6">{plan.price === 0 ? "Custom" : `$${annual ? Math.floor(plan.price * 0.8) : plan.price}/mo`}</p>
        <ul className="space-y-3 mb-8">
          {plan.features.map(f => <li key={f} className="flex items-center gap-3 text-sm text-gray-300"><span className="text-[#4ade80]">✓</span>{f}</li>)}
        </ul>
        <a href={plan.price === 0 ? "mailto:hello@aipaymentproxy.com" : "/signup?plan=" + plan.id} className={`block text-center py-3 rounded-lg font-semibold transition ${plan.highlight ? "bg-[#4ade80] text-black hover:bg-[#22c55e]" : "border border-gray-700 text-white hover:border-gray-500"}`}>{plan.cta}</a>
      </div>)}
    </div>
  </div>;
}