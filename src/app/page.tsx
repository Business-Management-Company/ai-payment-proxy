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

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <span className="font-bold text-lg">AI Payment Proxy</span>
        <a href="/login" className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e]">
          Get API Access
        </a>
      </nav>
      <div className="max-w-4xl mx-auto px-8 py-24 text-center">
        <div className="inline-block bg-[#4ade80]/10 text-[#4ade80] text-sm px-3 py-1 rounded-full mb-6">
          Now in Private Beta
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Give your AI agent a credit card. Safely.
        </h1>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
          Single-use virtual Visa cards, created on demand via API. Hard spending limits. Auto-cancels after use. Built for autonomous AI workflows.
        </p>
        <div className="flex gap-4 justify-center mb-24">
          <a href="/login" className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#22c55e]">
            Get API Access
          </a>
          <a href="#how" className="border border-gray-700 text-white px-6 py-3 rounded-lg hover:border-gray-500">
            How it works
          </a>
        </div>
        <div id="how" className="grid grid-cols-4 gap-6 mb-24">
          {[
            { step: "01", text: "Your AI calls our API" },
            { step: "02", text: "We issue a virtual Visa with your spending limit" },
            { step: "03", text: "AI completes the purchase" },
            { step: "04", text: "Card auto-cancels instantly" },
          ].map(item => (
            <div key={item.step} className="bg-[#111827] border border-gray-800 rounded-xl p-6 text-left">
              <div className="text-[#4ade80] font-bold text-sm mb-3">{item.step}</div>
              <p className="text-gray-300">{item.text}</p>
            </div>
          ))}
        </div>
        <div id="waitlist" className="bg-[#111827] border border-gray-800 rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-2">Join the waitlist</h2>
          <p className="text-gray-400 mb-6">Be first to get API access when we launch.</p>
          {status === "done" ? (
            <p className="text-[#4ade80] font-semibold">You're on the list! 🎉</p>
          ) : (
            <form onSubmit={handleWaitlist} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#22c55e]"
              >
                {status === "loading" ? "..." : "Join"}
              </button>
            </form>
          )}
        </div>
      </div>
      <footer className="text-center text-gray-600 pb-8 text-sm">
        © 2026 AI Payment Proxy. Built for the agentic era.
      </footer>
    </div>
  );
}