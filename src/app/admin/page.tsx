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

export default function AdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, revenue: 0, cards: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: me } = await supabase.from("customers").select("role").eq("id", user.id).single();
      if (!me || me.role !== "super_admin") { router.push("/dashboard"); return; }
      const { data: custs } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (custs) {
        setCustomers(custs);
        setStats({
          total: custs.length,
          active: custs.filter(c => c.cards_used_this_month > 0).length,
          revenue: custs.filter(c => c.plan === "growth").length * 79 + custs.filter(c => c.plan === "developer").length * 29,
          cards: custs.reduce((a, c) => a + (c.cards_used_this_month || 0), 0),
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = customers.filter(c => 
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

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
        <span className="text-gray-400 text-sm">aipaymentproxy.com</span>
      </nav>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats.total, color: "text-white" },
            { label: "Active Users", value: stats.active, color: "text-[#4ade80]" },
            { label: "MRR (est.)", value: "$" + stats.revenue, color: "text-blue-400" },
            { label: "Cards Issued", value: stats.cards, color: "text-purple-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#111827] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">{s.label}</p>
              <p className={"text-3xl font-bold " + s.color}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="font-semibold">All Users</h2>
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#0a0f1e] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm w-64 focus:outline-none focus:border-[#4ade80]"
            />
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">User</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Plan</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Balance</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Cards Used</th>
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