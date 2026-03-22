"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Customer {
  id: string;
  email: string;
  name: string;
  plan: string;
  balance_usd: number;
  cards_used_this_month: number;
  created_at: string;
  role: string;
  funding_model: string;
  connected_bank_last4: string;
}

const DEMO_CUSTOMERS = [
  { id: "d1", email: "alex@openai-startup.io", name: "Alex Chen", plan: "growth", balance_usd: 2400, cards_used_this_month: 47, funding_model: "connected", connected_bank_last4: "4821", created_at: "2026-02-14" },
  { id: "d2", email: "sarah@autonomousai.dev", name: "Sarah Kim", plan: "developer", balance_usd: 850, cards_used_this_month: 23, funding_model: "prepaid", connected_bank_last4: "", created_at: "2026-02-21" },
  { id: "d3", email: "mike@agentflow.ai", name: "Mike Torres", plan: "growth", balance_usd: 5200, cards_used_this_month: 89, funding_model: "connected", connected_bank_last4: "9034", created_at: "2026-01-30" },
  { id: "d4", email: "priya@roboticspay.com", name: "Priya Patel", plan: "enterprise", balance_usd: 24000, cards_used_this_month: 312, funding_model: "connected", connected_bank_last4: "1122", created_at: "2026-01-15" },
  { id: "d5", email: "james@aicommerce.io", name: "James Wilson", plan: "growth", balance_usd: 1800, cards_used_this_month: 61, funding_model: "prepaid", connected_bank_last4: "", created_at: "2026-02-28" },
  { id: "d6", email: "lisa@procurebot.ai", name: "Lisa Zhang", plan: "developer", balance_usd: 300, cards_used_this_month: 12, funding_model: "prepaid", connected_bank_last4: "", created_at: "2026-03-01" },
  { id: "d7", email: "david@travelagent.ai", name: "David Park", plan: "growth", balance_usd: 8900, cards_used_this_month: 178, funding_model: "connected", connected_bank_last4: "5567", created_at: "2026-01-22" },
  { id: "d8", email: "emma@shopbot.dev", name: "Emma Davis", plan: "enterprise", balance_usd: 45000, cards_used_this_month: 521, funding_model: "connected", connected_bank_last4: "7890", created_at: "2026-01-08" },
];

export default function AdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: me } = await supabase.from("customers").select("role").eq("id", user.id).single();
      if (!me || me.role !== "super_admin") { router.push("/dashboard"); return; }
      const { data: custs } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (custs) setCustomers(custs);
      setLoading(false);
    }
    load();
  }, []);

  const displayData = demoMode ? [...DEMO_CUSTOMERS as any, ...customers] : customers;
  const filtered = displayData.filter(c =>
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = displayData.length;
  const activeUsers = displayData.filter(c => c.cards_used_this_month > 0).length;
  const totalCards = displayData.reduce((a, c) => a + (c.cards_used_this_month || 0), 0);
  const mrr = displayData.reduce((a, c) => {
    if (c.plan === "enterprise") return a + 499;
    if (c.plan === "growth") return a + 79;
    return a + 29;
  }, 0);
  const totalRevenue = mrr * 3;
  const cardRevenue = totalCards * 0.5;
  const totalProfit = Math.floor((mrr + cardRevenue) * 0.72);

  if (loading) return <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center"><p className="text-white">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</a>
          <span className="text-gray-600">/</span>
          <h1 className="text-white font-bold">Super Admin</h1>
          <span className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded-full font-semibold">ADMIN</span>
        </div>
        <button onClick={() => setDemoMode(!demoMode)} className={`text-xs px-4 py-2 rounded-lg font-semibold transition ${demoMode ? "bg-amber-500 text-black" : "bg-[#111827] border border-gray-700 text-gray-400 hover:text-white"}`}>
          {demoMode ? "Demo Mode ON" : "Enable Demo Mode"}
        </button>
      </nav>
      <div className="max-w-7xl mx-auto px-8 py-8">
        {demoMode && <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <span className="text-amber-400 text-sm font-semibold">Demo Mode Active</span>
          <span className="text-amber-400/70 text-sm">— Showing sample investor data alongside real users</span>
        </div>}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: "Total Users", value: totalUsers, sub: activeUsers + " active", color: "text-white" },
            { label: "MRR", value: "$" + mrr.toLocaleString(), sub: "Monthly recurring", color: "text-[#4ade80]" },
            { label: "Total Revenue (est.)", value: "$" + totalRevenue.toLocaleString(), sub: "Last 3 months", color: "text-blue-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#111827] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">{s.label}</p>
              <p className={"text-3xl font-bold mb-1 " + s.color}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Cards Issued", value: totalCards, sub: "This month", color: "text-purple-400" },
            { label: "Card Revenue", value: "$" + Math.floor(cardRevenue).toLocaleString(), sub: "$0.50 per card", color: "text-amber-400" },
            { label: "Est. Profit", value: "$" + totalProfit.toLocaleString(), sub: "72% margin", color: "text-[#4ade80]" },
          ].map(s => (
            <div key={s.label} className="bg-[#111827] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">{s.label}</p>
              <p className={"text-3xl font-bold mb-1 " + s.color}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="font-semibold">All Users</h2>
            <input type="text" placeholder="Search by email or name..." value={search} onChange={e => setSearch(e.target.value)} className="bg-[#0a0f1e] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm w-64 focus:outline-none focus:border-[#4ade80]" />
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">User</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Plan</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Balance</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Cards/mo</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Funding</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(cust => (
                <tr key={cust.id} className="border-b border-gray-800/50 hover:bg-[#1a2235] transition">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium">{cust.name || "—"}</p>
                    <p className="text-gray-400 text-xs">{cust.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${cust.plan === "growth" ? "bg-purple-500/10 text-purple-400" : cust.plan === "enterprise" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-blue-500/10 text-blue-400"}`}>{cust.plan}</span>
                  </td>
                  <td className="px-4 py-3 text-white text-sm">{"$" + (cust.balance_usd || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-white text-sm">{cust.cards_used_this_month || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${cust.funding_model === "connected" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-gray-800 text-gray-400"}`}>
                      {cust.funding_model === "connected" ? "Bank ••••" + cust.connected_bank_last4 : "Prepaid"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(cust.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}