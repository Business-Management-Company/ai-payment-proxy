"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Customer = {
  name: string;
  email: string;
  plan: string;
  api_key_prefix: string | null;
};

export default function Page() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [rotateError, setRotateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from("customers")
          .select("*")
          .eq("id", data.user.id)
          .single()
          .then(({ data: d }) => setCustomer(d as Customer));
      }
    });
  }, []);

  async function confirmRotate() {
    setShowConfirm(false);
    setRotateError(null);
    setRotating(true);
    try {
      const res = await fetch("/api/rotate-key", { method: "POST" });
      const body = await res.json();
      if (!res.ok) {
        setRotateError(body.error || "Rotation failed");
        return;
      }
      setNewKey(body.apiKey);
      if (body.prefix) {
        setCustomer((c) => (c ? { ...c, api_key_prefix: body.prefix } : c));
      }
    } catch {
      setRotateError("Network error");
    } finally {
      setRotating(false);
    }
  }

  function copyKey() {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-8">Settings</h2>

      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 max-w-md mb-6">
        <p className="text-gray-400 text-sm">Email</p>
        <p className="text-white mb-4">{customer?.email}</p>
        <p className="text-gray-400 text-sm">Plan</p>
        <p className="text-white capitalize">{customer?.plan}</p>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 max-w-lg">
        <h3 className="text-white font-semibold mb-2">API key</h3>
        <p className="text-gray-400 text-sm mb-4">
          Your API key prefix (the full secret is only shown when you create or rotate the key):
        </p>
        <div className="font-mono text-[#4ade80] bg-[#0a0f1e] rounded-lg px-3 py-2 text-sm mb-6 border border-gray-800">
          {customer?.api_key_prefix ? `${customer.api_key_prefix}••••••••••••••••••••` : "Loading..."}
        </div>

        <p className="text-amber-400/90 text-xs mb-3">
          This will invalidate your current key immediately. Any clients using the old key will stop working until you update them.
        </p>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={rotating || !customer}
          className="bg-amber-500/15 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-500/25 disabled:opacity-50 transition-colors"
        >
          {rotating ? "Rotating…" : "Rotate API Key"}
        </button>
        {rotateError && <p className="text-red-400 text-sm mt-3">{rotateError}</p>}
      </div>

      {newKey && (
        <div className="mt-6 bg-[#111827] border border-[#4ade80]/30 rounded-xl p-6 max-w-lg">
          <p className="text-amber-400 text-sm font-semibold mb-2">Save this key now — it will never be shown again</p>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="flex-1 font-mono text-sm text-white bg-[#0a0f1e] border border-[#4ade80]/20 rounded-lg px-3 py-2 break-all">
              {newKey}
            </div>
            <button
              type="button"
              onClick={copyKey}
              className="shrink-0 bg-[#4ade80] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h4 className="text-white font-semibold text-lg mb-2">Rotate API key?</h4>
            <p className="text-gray-400 text-sm mb-6">
              This will invalidate your current key immediately. You must update any integrations, agents, or scripts to use the new key.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-white text-sm px-4 py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRotate}
                className="bg-amber-500/20 border border-amber-500/50 text-amber-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-500/30 transition-colors"
              >
                Yes, rotate key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
