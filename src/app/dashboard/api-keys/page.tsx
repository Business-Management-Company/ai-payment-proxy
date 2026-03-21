"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ApiKeysPage() {
  const [prefix, setPrefix] = useState("");
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("customers").select("api_key_prefix").eq("id", user.id).single();
      if (data) setPrefix(data.api_key_prefix);
    }
    load();
  }, []);

  function copy() {
    navigator.clipboard.writeText(prefix + "...");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-8">API Keys</h2>
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Your API Key</h3>
        <div className="flex items-center gap-3 bg-[#0a0f1e] border border-gray-700 rounded-lg px-4 py-3 mb-4">
          <code className="text-[#4ade80] font-mono text-sm flex-1">{prefix}••••••••••••••••••••</code>
          <button onClick={copy} className="text-gray-400 hover:text-white text-sm transition">
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <button disabled className="border border-gray-700 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed">
          Regenerate Key
        </button>
      </div>
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">How to use your key</h3>
        <div className="bg-[#0a0f1e] rounded-lg p-4 font-mono text-sm text-gray-300">
          <p className="text-gray-500 mb-2"># Add to every API request</p>
          <p>Authorization: Bearer {prefix}...</p>
          <p className="mt-4 text-gray-500"># Example: Create a virtual card</p>
          <p>curl -X POST https://aipaymentproxy.com/api/v1/cards \</p>
          <p className="ml-4">-H &quot;Authorization: Bearer {prefix}...&quot; \</p>
          <p className="ml-4">-d &apos;{'{"label":"test","limit_usd":100}'}&apos;</p>
        </div>
      </div>
    </div>
  );
}
