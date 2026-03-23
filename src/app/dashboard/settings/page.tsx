"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [slack, setSlack] = useState("");
  const [apiKeyPrefix, setApiKeyPrefix] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [confirmRotate, setConfirmRotate] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email || "");
      const { data: cust } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)
        .single();
      if (cust) {
        setName(cust.name || "");
        setCompany(cust.company_name || "");
        setTelegram(cust.telegram_handle || "");
        setWhatsapp(cust.whatsapp_number || "");
        setSlack(cust.slack_handle || "");
        setApiKeyPrefix(cust.api_key_prefix || "");
      }
    }
    load();
  }, []);

  async function saveProfile() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { error } = await supabase.from("customers").update({
      name,
      company_name: company,
      telegram_handle: telegram,
      whatsapp_number: whatsapp,
      slack_handle: slack,
    }).eq("id", user.id);

    if (error) {
      console.error("Save error:", error);
      alert("Save failed: " + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  async function rotateKey() {
    setRotating(true);
    const res = await fetch("/api/rotate-key", { method: "POST" });
    const data = await res.json();
    if (data.apiKey) {
      setNewKey(data.apiKey);
      setApiKeyPrefix(data.prefix);
    }
    setRotating(false);
    setConfirmRotate(false);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-white text-2xl font-bold mb-8">Settings</h2>
      <div className="space-y-6">

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Email</label>
              <input value={email} disabled className="w-full bg-[#0a0f1e] border border-gray-800 rounded-lg px-4 py-3 text-gray-500 text-sm cursor-not-allowed" />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0a0f1e] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4ade80]" />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Company Name</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company or project name" className="w-full bg-[#0a0f1e] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4ade80] placeholder-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">Messaging & Notifications</h3>
          <p className="text-gray-500 text-xs mb-4">Connect your messaging accounts to receive card alerts and updates</p>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Telegram Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                <input value={telegram} onChange={e => setTelegram(e.target.value.replace("@", ""))} placeholder="yourusername" className="w-full bg-[#0a0f1e] border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#4ade80] placeholder-gray-600" />
              </div>
              <p className="text-gray-600 text-xs mt-1">Get card alerts via @AIpaymentproxybot</p>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">WhatsApp Number</label>
              <div className="relative">
                <input
                  value={whatsapp}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    let formatted = digits;
                    if (digits.length >= 6) {
                      formatted = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
                    } else if (digits.length >= 3) {
                      formatted = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
                    } else if (digits.length > 0) {
                      formatted = `(${digits}`;
                    }
                    setWhatsapp(formatted);
                  }}
                  placeholder="(555) 000-0000"
                  maxLength={14}
                  className="w-full bg-[#0a0f1e] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4ade80] placeholder-gray-600"
                />
              </div>
              <p className="text-gray-600 text-xs mt-1">WhatsApp integration coming soon</p>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Slack Handle</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                <input value={slack} onChange={e => setSlack(e.target.value.replace("@", ""))} placeholder="yourslackhandle" className="w-full bg-[#0a0f1e] border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#4ade80] placeholder-gray-600" />
              </div>
              <p className="text-gray-600 text-xs mt-1">Slack integration coming soon</p>
            </div>
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#22c55e] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Changes"}
        </button>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">API Key</h3>
          <p className="text-gray-500 text-xs mb-4">Your API key prefix — the full key is only shown when created or rotated</p>
          <div className="bg-[#0a0f1e] border border-gray-800 rounded-lg px-4 py-3 font-mono text-[#4ade80] text-sm mb-4">
            {apiKeyPrefix}••••••••••••••••••••••
          </div>

          {newKey && (
            <div className="bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-xl p-4 mb-4">
              <p className="text-[#4ade80] text-xs font-semibold mb-2">⚠️ New API key — save this now, it will never be shown again:</p>
              <div className="bg-[#0a0f1e] rounded-lg px-4 py-3 font-mono text-[#4ade80] text-xs break-all">{newKey}</div>
              <button onClick={() => navigator.clipboard.writeText(newKey)} className="mt-2 text-xs text-[#4ade80] hover:underline">Copy to clipboard</button>
            </div>
          )}

          {!confirmRotate ? (
            <button onClick={() => setConfirmRotate(true)} className="border border-amber-500/30 text-amber-400 px-4 py-2 rounded-lg text-sm hover:bg-amber-500/10 transition-colors">
              Rotate API Key
            </button>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-amber-400 text-sm mb-3">This will invalidate your current key immediately. Any agents using the old key will stop working.</p>
              <div className="flex gap-3">
                <button onClick={rotateKey} disabled={rotating} className="bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50">
                  {rotating ? "Rotating..." : "Yes, rotate key"}
                </button>
                <button onClick={() => setConfirmRotate(false)} className="border border-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm hover:text-white">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
