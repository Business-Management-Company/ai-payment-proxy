"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function APIKeysPage() {
  const [apiKeyPrefix, setApiKeyPrefix] = useState("");
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: cust } = await supabase
        .from("customers")
        .select("api_key_prefix")
        .eq("id", user.id)
        .single();
      if (cust) setApiKeyPrefix(cust.api_key_prefix || "");
      setLoading(false);
    }
    load();
  }, []);

  function copyKey() {
    const value = showKey
      ? `${apiKeyPrefix}••••••••••••••••••••••`
      : "••••••••••••••••••••••••••••••••";
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-white text-2xl font-bold mb-2">API Keys</h2>
      <p className="text-gray-400 text-sm mb-8">Use your API key to authenticate requests to the AI Payment Proxy API.</p>

      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-white font-semibold text-sm">Secret API Key</p>
            <p className="text-gray-500 text-xs mt-0.5">Created during onboarding</p>
          </div>
          <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs px-2 py-1 rounded-full border border-[#4ade80]/20">Active</span>
        </div>

        <div className="bg-[#0a0f1e] border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between mb-3 gap-3">
          <span className="font-mono text-[#4ade80] text-sm break-all">
            {loading
              ? "Loading..."
              : showKey
                ? `${apiKeyPrefix}••••••••••••••••••••••`
                : "••••••••••••••••••••••••••••••••"}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors"
            >
              {showKey ? "🙈 Hide" : "👁 Show"}
            </button>
            <button
              type="button"
              onClick={copyKey}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors"
            >
              {copied ? "✅ Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
          <p className="text-amber-400 text-xs">⚠️ For security, your full API key was only shown once during onboarding. To get a new key, rotate it in Settings.</p>
        </div>

        <div className="flex gap-3">
          <a href="/dashboard/settings" className="bg-[#4ade80] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] transition-colors">
            Rotate Key in Settings →
          </a>
          <a href="/docs" className="border border-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm hover:text-white transition-colors">
            API Docs
          </a>
        </div>
      </div>
    </div>
  );
}