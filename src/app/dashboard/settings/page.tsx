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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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

      </div>
    </div>
  );
}
