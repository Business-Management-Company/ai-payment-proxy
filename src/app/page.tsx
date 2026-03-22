"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done">("idle");

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const supabase = createClient();
    await supabase.from("waitlist").insert({ email });
    setStatus("done");
  }

  const useCases = [
    { emoji: "🍕", title: "Food Delivery Agent", desc: "Tell your AI to order lunch under $20. It creates a card, orders DoorDash, card cancels after." },
    { emoji: "📦", title: "Auto-Restock Bot", desc: "AI monitors inventory, creates a card when supplies run low, orders from your supplier automatically." },
    { emoji: "✈️", title: "Travel Booking Agent", desc: "AI finds flights and hotels within budget. Separate card per booking. Unused cards auto-cancel." },
    { emoji: "📈", title: "Price Drop Buyer", desc: "AI watches a product 24/7. The moment price hits your target, it creates a card and buys it." },
    { emoji: "💳", title: "Trial Subscription Manager", desc: "New card for every free trial signup. You never forget to cancel. Each card has exact limit." },
    { emoji: "🎯", title: "Ad Spend Controller", desc: "Give your AI marketing agent a $500 card for Facebook ads. It literally cannot overspend." },
    { emoji: "💻", title: "API Cost Control", desc: "Card for OpenAI or Anthropic API costs. Hard limit means no runaway bill surprises ever." },
    { emoji: "🖥️", title: "Cloud Infrastructure", desc: "Agent spins up servers, creates a card for exact cost, shuts down and cancels when done." },
    { emoji: "💼", title: "Vendor Payments", desc: "Pay freelancers with single-use cards. Each project gets its own card with an exact limit." },
    { emoji: "🧪", title: "QA Payment Testing", desc: "Test agents run checkout flows with real cards that work but cannot exceed test budgets." },
    { emoji: "🔑", title: "SaaS License Buyer", desc: "AI buys the right software licenses for new employees automatically on their first day." },
    { emoji: "🏠", title: "Property Management", desc: "AI handles maintenance requests, creates cards for contractors with job-specific spending limits." },
  ];

  return (
    <div
      className="min-h-screen bg-[#0a0f1e] text-white"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-5 border-b border-gray-800 bg-[#0a0f1e]/90 backdrop-blur-sm">
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#4ade80] text-xl">⚡</span>
          <span>AI Payment Proxy</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="/docs"        className="text-gray-400 hover:text-white text-sm transition-colors">Docs</a>
          <a href="/pricing"     className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a>
          <a href="/blog"        className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a>
          <a href="/integrations" className="text-gray-400 hover:text-white text-sm transition-colors">Integrations</a>
          <a href="/#use-cases" className="text-gray-400 hover:text-white text-sm transition-colors">Use Cases</a>
          <a href="/login"       className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</a>
          <a href="/signup"      className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e] transition-colors">Get API Key</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-8 py-28 text-center">
        <div className="inline-block bg-[#4ade80]/10 text-[#4ade80] text-sm px-3 py-1 rounded-full mb-6 border border-[#4ade80]/20">
          Now in Private Beta
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Give your AI agent a credit card.{" "}
          <span className="text-[#4ade80]">Safely.</span>
        </h1>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
          Single-use virtual Visa cards, created on demand via API. Hard spending limits.
          Auto-cancels after use. Built for autonomous AI workflows.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/signup" className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#22c55e] transition-colors">
            Get API Access
          </a>
          <a href="#how" className="border border-gray-700 text-white px-6 py-3 rounded-lg hover:border-gray-500 transition-colors">
            How it works ↓
          </a>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div id="how" className="max-w-5xl mx-auto px-8 pb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
          <p className="text-gray-400">Four steps from API call to completed purchase</p>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[
            { step: "01", icon: "🤖", text: "Your AI calls our API" },
            { step: "02", icon: "💳", text: "We issue a virtual Visa with your spending limit" },
            { step: "03", icon: "🛒", text: "AI completes the purchase" },
            { step: "04", icon: "✅", text: "Card auto-cancels instantly" },
          ].map((item) => (
            <div key={item.step} className="bg-[#111827] border border-gray-800 rounded-xl p-6 text-left hover:border-gray-600 transition-colors">
              <div className="text-[#4ade80] font-bold text-sm mb-2">{item.step}</div>
              <div className="text-2xl mb-3">{item.icon}</div>
              <p className="text-gray-300">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Integrations ── */}
      <div id="integrations" className="max-w-5xl mx-auto px-8 pb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Works with your favorite tools</h2>
          <p className="text-gray-400">Connect in 60 seconds — no code required for most integrations</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "✈️", name: "Telegram", desc: "Create cards via chat", badge: "Live Now", badgeColor: "text-[#4ade80]", href: "https://t.me/AIpaymentproxybot" },
            { icon: "🤖", name: "Claude", desc: "Native tool use", badge: "Available", badgeColor: "text-blue-400", href: "/integrations" },
            { icon: "💬", name: "ChatGPT", desc: "GPT Actions", badge: "Available", badgeColor: "text-blue-400", href: "/integrations" },
            { icon: "🔄", name: "n8n", desc: "Workflow automation", badge: "Available", badgeColor: "text-blue-400", href: "/integrations" },
            { icon: "⚡", name: "Zapier", desc: "No-code automation", badge: "Coming Soon", badgeColor: "text-gray-500", href: "/integrations" },
            { icon: "💬", name: "WhatsApp", desc: "Message to pay", badge: "Coming Soon", badgeColor: "text-gray-500", href: "/integrations" },
          ].map((integ) => (
            <a
              key={integ.name}
              href={integ.href}
              target={integ.href.startsWith("http") ? "_blank" : undefined}
              rel={integ.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="bg-[#111827] border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors flex items-center gap-4 group"
            >
              <span className="text-3xl">{integ.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm">{integ.name}</h3>
                  <span className={"text-xs font-medium " + integ.badgeColor}>{integ.badge}</span>
                </div>
                <p className="text-gray-400 text-xs">{integ.desc}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/integrations" className="text-[#4ade80] text-sm hover:underline">View all integrations and setup guides →</a>
        </div>
      </div>

      {/* ── Use Cases ── */}
      <div id="use-cases" className="max-w-6xl mx-auto px-8 pb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What will your AI agent buy?</h2>
          <p className="text-gray-400 text-lg">Real use cases from developers building with AI Payment Proxy</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {useCases.map((uc) => (
            <div key={uc.title} className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
              <div className="text-2xl mb-3">{uc.emoji}</div>
              <h3 className="text-white font-semibold mb-2">{uc.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Waitlist ── */}
      <div className="max-w-4xl mx-auto px-8 pb-28">
        <div id="waitlist" className="bg-[#111827] border border-gray-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Join the waitlist</h2>
          <p className="text-gray-400 mb-6">Be first to get API access when we launch.</p>
          {status === "done" ? (
            <p className="text-[#4ade80] font-semibold">You&apos;re on the list! ✅</p>
          ) : (
            <form onSubmit={handleWaitlist} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#22c55e] transition-colors"
              >
                {status === "loading" ? "..." : "Join"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 bg-[#0a0f1e]">
        <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-4 gap-12">
          <div className="col-span-1">
            <a href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <span className="text-[#4ade80]">⚡</span>
              <span>AI Payment Proxy</span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed">
              Single-use virtual Visa cards for autonomous AI agents. Built for the agentic era.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <div className="space-y-3">
              <a href="/docs"     className="block text-gray-500 hover:text-white text-sm transition-colors">Docs</a>
              <a href="/pricing"  className="block text-gray-500 hover:text-white text-sm transition-colors">Pricing</a>
              <a href="/#use-cases" className="block text-gray-500 hover:text-white text-sm transition-colors">Use Cases</a>
              <a href="/signup"   className="block text-gray-500 hover:text-white text-sm transition-colors">Get API Key</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <div className="space-y-3">
              <a href="/blog"     className="block text-gray-500 hover:text-white text-sm transition-colors">Blog</a>
              <a href="/blog/how-to-give-ai-agent-credit-card" className="block text-gray-500 hover:text-white text-sm transition-colors">AI Agent Guide</a>
              <a href="/blog/virtual-cards-autonomous-ai-agents" className="block text-gray-500 hover:text-white text-sm transition-colors">Virtual Cards Deep Dive</a>
              <a href="/blog/ai-agent-payment-infrastructure-explained" className="block text-gray-500 hover:text-white text-sm transition-colors">Infrastructure Explained</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
            <div className="space-y-3">
              <a href="/login"    className="block text-gray-500 hover:text-white text-sm transition-colors">Sign In</a>
              <a href="/signup"   className="block text-gray-500 hover:text-white text-sm transition-colors">Sign Up</a>
              <a href="/privacy"  className="block text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="/terms"    className="block text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
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