"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const DEMO = [{"id":"d1","email":"alex@openai-startup.io","name":"Alex Chen","plan":"growth","balance_usd":2400,"cards_used_this_month":47,"funding_model":"connected","connected_bank_last4":"4821","created_at":"2026-02-14"},{"id":"d2","email":"sarah@autonomousai.dev","name":"Sarah Kim","plan":"developer","balance_usd":850,"cards_used_this_month":23,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-02-21"},{"id":"d3","email":"mike@agentflow.ai","name":"Mike Torres","plan":"growth","balance_usd":5200,"cards_used_this_month":89,"funding_model":"connected","connected_bank_last4":"9034","created_at":"2026-01-30"},{"id":"d4","email":"priya@roboticspay.com","name":"Priya Patel","plan":"enterprise","balance_usd":24000,"cards_used_this_month":312,"funding_model":"connected","connected_bank_last4":"1122","created_at":"2026-01-15"},{"id":"d5","email":"james@aicommerce.io","name":"James Wilson","plan":"growth","balance_usd":1800,"cards_used_this_month":61,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-02-28"},{"id":"d6","email":"lisa@procurebot.ai","name":"Lisa Zhang","plan":"developer","balance_usd":300,"cards_used_this_month":12,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-03-01"},{"id":"d7","email":"david@travelagent.ai","name":"David Park","plan":"growth","balance_usd":8900,"cards_used_this_month":178,"funding_model":"connected","connected_bank_last4":"5567","created_at":"2026-01-22"},{"id":"d8","email":"emma@shopbot.dev","name":"Emma Davis","plan":"enterprise","balance_usd":45000,"cards_used_this_month":521,"funding_model":"connected","connected_bank_last4":"7890","created_at":"2026-01-08"},{"id":"d9","email":"ryan@procureai.io","name":"Ryan Scott","plan":"growth","balance_usd":3200,"cards_used_this_month":94,"funding_model":"connected","connected_bank_last4":"3344","created_at":"2026-02-05"},{"id":"d10","email":"nina@fleetpay.ai","name":"Nina Rossi","plan":"enterprise","balance_usd":38000,"cards_used_this_month":445,"funding_model":"connected","connected_bank_last4":"2211","created_at":"2026-01-20"},{"id":"d11","email":"carlos@buybot.dev","name":"Carlos Mendez","plan":"growth","balance_usd":2100,"cards_used_this_month":67,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-02-10"},{"id":"d12","email":"amy@agentpay.io","name":"Amy Johnson","plan":"developer","balance_usd":500,"cards_used_this_month":18,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-03-05"},{"id":"d13","email":"tom@aitravel.dev","name":"Tom Brady","plan":"growth","balance_usd":4400,"cards_used_this_month":112,"funding_model":"connected","connected_bank_last4":"8877","created_at":"2026-01-25"},{"id":"d14","email":"jen@smartprocure.ai","name":"Jennifer Lee","plan":"enterprise","balance_usd":52000,"cards_used_this_month":634,"funding_model":"connected","connected_bank_last4":"4455","created_at":"2026-01-05"},{"id":"d15","email":"mark@cardagent.io","name":"Mark Stevens","plan":"growth","balance_usd":1600,"cards_used_this_month":43,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-02-18"},{"id":"d16","email":"sofia@payrobot.dev","name":"Sofia Martinez","plan":"developer","balance_usd":750,"cards_used_this_month":31,"funding_model":"connected","connected_bank_last4":"6677","created_at":"2026-02-25"},{"id":"d17","email":"kevin@autonomouspay.ai","name":"Kevin Ng","plan":"growth","balance_usd":3800,"cards_used_this_month":88,"funding_model":"connected","connected_bank_last4":"9988","created_at":"2026-01-28"},{"id":"d18","email":"rachel@aibuy.io","name":"Rachel Green","plan":"developer","balance_usd":425,"cards_used_this_month":14,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-03-08"},{"id":"d19","email":"dan@fleetops.ai","name":"Dan Cooper","plan":"enterprise","balance_usd":61000,"cards_used_this_month":789,"funding_model":"connected","connected_bank_last4":"1234","created_at":"2025-12-20"},{"id":"d20","email":"ashley@smartagent.dev","name":"Ashley Brown","plan":"growth","balance_usd":2900,"cards_used_this_month":76,"funding_model":"connected","connected_bank_last4":"5566","created_at":"2026-02-02"},{"id":"d21","email":"chris@payai.io","name":"Chris Taylor","plan":"developer","balance_usd":600,"cards_used_this_month":22,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-03-10"},{"id":"d22","email":"mia@agentops.ai","name":"Mia White","plan":"growth","balance_usd":4100,"cards_used_this_month":103,"funding_model":"connected","connected_bank_last4":"7788","created_at":"2026-01-18"},{"id":"d23","email":"jake@robotbuy.dev","name":"Jake Miller","plan":"enterprise","balance_usd":29000,"cards_used_this_month":398,"funding_model":"connected","connected_bank_last4":"3322","created_at":"2026-01-12"},{"id":"d24","email":"olivia@autopay.ai","name":"Olivia Harris","plan":"growth","balance_usd":2200,"cards_used_this_month":58,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-02-22"},{"id":"d25","email":"ethan@aipurchase.io","name":"Ethan Clark","plan":"developer","balance_usd":350,"cards_used_this_month":9,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-03-12"},{"id":"d26","email":"zoe@paymentagent.ai","name":"Zoe Lewis","plan":"growth","balance_usd":5500,"cards_used_this_month":134,"funding_model":"connected","connected_bank_last4":"4433","created_at":"2026-01-16"},{"id":"d27","email":"noah@aifinance.dev","name":"Noah Walker","plan":"enterprise","balance_usd":41000,"cards_used_this_month":512,"funding_model":"connected","connected_bank_last4":"8899","created_at":"2025-12-28"},{"id":"d28","email":"chloe@buyagent.io","name":"Chloe Hall","plan":"growth","balance_usd":3300,"cards_used_this_month":82,"funding_model":"connected","connected_bank_last4":"2233","created_at":"2026-02-08"},{"id":"d29","email":"liam@smartcard.ai","name":"Liam Young","plan":"developer","balance_usd":480,"cards_used_this_month":17,"funding_model":"prepaid","connected_bank_last4":"","created_at":"2026-03-06"},{"id":"d30","email":"ella@agentfinance.io","name":"Ella Adams","plan":"growth","balance_usd":6700,"cards_used_this_month":156,"funding_model":"connected","connected_bank_last4":"6655","created_at":"2026-01-10"}];

interface Customer {
  id: string; email: string; name: string; plan: string;
  balance_usd: number; cards_used_this_month: number;
  created_at: string; role: string; funding_model: string;
  connected_bank_last4: string;
}

export default function AdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [showInvestor, setShowInvestor] = useState(false);
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

  const displayData = demoMode ? [...DEMO as any, ...customers] : customers;
  const filtered = displayData.filter((c: any) =>
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = displayData.length;
  const activeUsers = displayData.filter((c: any) => c.cards_used_this_month > 0).length;
  const totalCards = displayData.reduce((a: number, c: any) => a + (c.cards_used_this_month || 0), 0);
  const mrr = displayData.reduce((a: number, c: any) => {
    if (c.plan === "enterprise") return a + 499;
    if (c.plan === "growth") return a + 79;
    return a + 29;
  }, 0);
  const cardRevenue = totalCards * 0.5;
  const grossRevenue = mrr + cardRevenue;
  const infraCost = Math.floor(grossRevenue * 0.08);
  const stripeFees = Math.floor(grossRevenue * 0.10);
  const netProfit = Math.floor(grossRevenue - infraCost - stripeFees);
  const margin = Math.floor((netProfit / grossRevenue) * 100);

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
        <div className="flex items-center gap-3">
          <button onClick={() => setShowInvestor(true)} className="text-xs px-4 py-2 rounded-lg font-semibold border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition">Investor View</button>
          <button onClick={() => setDemoMode(!demoMode)} className={"text-xs px-4 py-2 rounded-lg font-semibold transition " + (demoMode ? "bg-amber-500 text-black" : "bg-[#111827] border border-gray-700 text-gray-400 hover:text-white")}>
            {demoMode ? "Demo Mode ON" : "Enable Demo Mode"}
          </button>
        </div>
      </nav>

      {showInvestor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-[#0a0f1e] border border-gray-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">AI Payment Proxy</h2>
                <p className="text-gray-400 text-sm">Financial Summary — {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
              </div>
              <button onClick={() => setShowInvestor(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="border border-gray-800 rounded-xl overflow-hidden mb-6">
              <div className="bg-[#111827] px-4 py-2 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue Breakdown</p>
              </div>
              {[
                { label: "Subscription Revenue", value: "$" + mrr.toLocaleString() + "/mo", sub: totalUsers + " users × avg plan rate", color: "text-white" },
                { label: "Card Issuance Fees", value: "$" + Math.floor(cardRevenue).toLocaleString() + "/mo", sub: totalCards + " cards × $0.50", color: "text-white" },
                { label: "Gross Revenue", value: "$" + Math.floor(grossRevenue).toLocaleString() + "/mo", sub: "", color: "text-[#4ade80] font-bold border-t border-gray-700" },
                { label: "Infrastructure Costs", value: "-$" + infraCost.toLocaleString() + "/mo", sub: "8% of revenue", color: "text-red-400" },
                { label: "Stripe Fees", value: "-$" + stripeFees.toLocaleString() + "/mo", sub: "10% of revenue", color: "text-red-400" },
                { label: "Net Profit", value: "$" + netProfit.toLocaleString() + "/mo", sub: margin + "% margin", color: "text-[#4ade80] font-bold text-xl border-t border-gray-700" },
              ].map(row => (
                <div key={row.label} className={"flex justify-between items-center px-4 py-3 border-b border-gray-800/50 last:border-0 " + (row.color.includes("border-t") ? "border-t border-gray-700 bg-[#111827]/50" : "")}>
                  <div>
                    <p className="text-white text-sm">{row.label}</p>
                    {row.sub && <p className="text-gray-500 text-xs">{row.sub}</p>}
                  </div>
                  <p className={"font-mono " + row.color}>{row.value}</p>
                </div>
              ))}
            </div>
            <div className="border border-gray-800 rounded-xl overflow-hidden mb-6">
              <div className="bg-[#111827] px-4 py-2 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Growth Projections</p>
              </div>
              {[
                { period: "Month 1", users: totalUsers, mrr: Math.floor(grossRevenue), profit: netProfit },
                { period: "Month 6", users: Math.floor(totalUsers * 2.5), mrr: Math.floor(grossRevenue * 3), profit: Math.floor(netProfit * 3) },
                { period: "Year 1", users: Math.floor(totalUsers * 6), mrr: Math.floor(grossRevenue * 8), profit: Math.floor(netProfit * 8) },
                { period: "Year 2", users: Math.floor(totalUsers * 20), mrr: Math.floor(grossRevenue * 28), profit: Math.floor(netProfit * 28) },
              ].map(row => (
                <div key={row.period} className="flex justify-between items-center px-4 py-3 border-b border-gray-800/50 last:border-0">
                  <p className="text-white text-sm w-24">{row.period}</p>
                  <p className="text-gray-400 text-sm w-24">{row.users} users</p>
                  <p className="text-blue-400 text-sm w-32 font-mono">{"$" + row.mrr.toLocaleString() + "/mo"}</p>
                  <p className="text-[#4ade80] text-sm font-mono font-bold">{"$" + row.profit.toLocaleString() + " profit"}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "LTV per User", value: "$" + Math.floor(netProfit / totalUsers * 24).toLocaleString(), sub: "24mo avg" },
                { label: "CAC Target", value: "$" + Math.floor(netProfit / totalUsers * 3).toLocaleString(), sub: "3mo payback" },
                { label: "Gross Margin", value: margin + "%", sub: "Net profit margin" },
              ].map(s => (
                <div key={s.label} className="bg-[#111827] border border-gray-800 rounded-xl p-4 text-center">
                  <p className="text-[#4ade80] text-2xl font-bold mb-1">{s.value}</p>
                  <p className="text-white text-xs font-semibold">{s.label}</p>
                  <p className="text-gray-500 text-xs">{s.sub}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs text-center">Confidential — AI Payment Proxy © 2026</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-8">
        {demoMode && <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <span className="text-amber-400 text-sm font-semibold">Demo Mode Active</span>
          <span className="text-amber-400/70 text-sm">— Showing sample investor data alongside real users</span>
        </div>}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: "Total Users", value: totalUsers, sub: activeUsers + " active", color: "text-white" },
            { label: "MRR", value: "$" + mrr.toLocaleString(), sub: "Monthly recurring", color: "text-[#4ade80]" },
            { label: "Gross Revenue", value: "$" + Math.floor(grossRevenue).toLocaleString(), sub: "Subs + card fees", color: "text-blue-400" },
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
            { label: "Cards Issued", value: totalCards.toLocaleString(), sub: "This month", color: "text-purple-400" },
            { label: "Card Revenue", value: "$" + Math.floor(cardRevenue).toLocaleString(), sub: "$0.50 per card", color: "text-amber-400" },
            { label: "Net Profit", value: "$" + netProfit.toLocaleString(), sub: margin + "% margin", color: "text-[#4ade80]" },
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
              {filtered.map((cust: any) => (
                <tr key={cust.id} className="border-b border-gray-800/50 hover:bg-[#1a2235] transition">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium">{cust.name || "—"}</p>
                    <p className="text-gray-400 text-xs">{cust.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={"text-xs px-2 py-1 rounded-full font-medium capitalize " + (cust.plan === "growth" ? "bg-purple-500/10 text-purple-400" : cust.plan === "enterprise" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-blue-500/10 text-blue-400")}>{cust.plan}</span>
                  </td>
                  <td className="px-4 py-3 text-white text-sm">{"$" + (cust.balance_usd || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-white text-sm">{cust.cards_used_this_month || 0}</td>
                  <td className="px-4 py-3">
                    <span className={"text-xs px-2 py-1 rounded-full " + (cust.funding_model === "connected" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-gray-800 text-gray-400")}>
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