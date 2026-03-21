"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function setup() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email
        })
      });
      const data = await res.json();
      if (data.apiKey) setApiKey(data.apiKey);
      setLoading(false);
    }
    setup();
  }, []);

  function copyKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <p className="text-white">Setting up your account...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-2">Your API Key</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
          <p className="text-amber-400 font-semibold text-sm">Save this key now. It will never be shown again.</p>
        </div>
        <div className="bg-[#0a0f1e] border border-gray-700 rounded-lg p-4 mb-4 font-mono text-[#4ade80] text-sm break-all">
          {apiKey}
        </div>
        <button
          onClick={copyKey}
          className="w-full border border-gray-700 text-white rounded-lg px-4 py-3 hover:border-gray-500 mb-6 transition"
        >
          {copied ? "✓ Copied!" : "Copy to Clipboard"}
        </button>
        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            className="w-4 h-4 accent-[#4ade80]"
          />
          <span className="text-gray-400 text-sm">I have saved my API key</span>
        </label>
        <button
          onClick={() => router.push("/dashboard")}
          disabled={!confirmed}
          className="w-full bg-[#4ade80] text-black font-semibold rounded-lg px-4 py-3 hover:bg-[#22c55e] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
