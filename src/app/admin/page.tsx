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

function UnitEconomicsTab() {
  const [method, setMethod] = useState("card");
  const [depositAmt, setDepositAmt] = useState(100);
  const [spendAmt, setSpendAmt] = useState(50);

  const cardDepFee = (a: number) => a * 0.029 + 0.30;
  const achDepFee  = (a: number) => Math.min(a * 0.008, 5);
  const depFee = method === "card" ? cardDepFee(depositAmt) : achDepFee(depositAmt);
  const netDeposit = depositAmt - depFee;

  const plans = [
    { name: "Developer", price: 29,  cards: 50   },
    { name: "Growth",    price: 79,  cards: 250  },
    { name: "Enterprise",price: 499, cards: 1000 },
  ];

  const steps = [
    { num: "1", title: "Customer signs up", detail: "Stripe creates cardholder + 14-day free trial. No charge yet.", stripe: null, note: "Free" },
    { num: "2", title: `Customer deposits $${depositAmt} via ${method === "card" ? "credit card" : "ACH"}`,
      detail: method === "card"
        ? `Stripe charges 2.9% + $0.30. You credit them $${depositAmt} but only receive $${netDeposit.toFixed(2)}.`
        : `Stripe charges 0.8% (capped at $5). Funds arrive in 2-3 business days.`,
      stripe: `-$${depFee.toFixed(2)}`, note: null },
    { num: "3", title: "AI agent creates a virtual card", detail: "Stripe Issuing charges $0.10 per virtual card. Comes out of your balance.", stripe: "-$0.10", note: null },
    { num: "4", title: `AI agent spends $${spendAmt} on the card`, detail: `Free for first $500K in volume. After that: 0.2% + $0.20 per transaction.`, stripe: null, note: "$0 under $500K" },
    { num: "5", title: "Monthly subscription billing", detail: "After trial Stripe charges customer. Stripe takes 2.9% + $0.30 on the subscription.", stripe: "-$1.14 on $29 plan", note: "+$27.86 you keep" },
    { num: "6", title: "Card auto-cancels", detail: "Canceled via API or webhook. No additional fees.", stripe: null, note: "Free" },
  ];

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Deposit method</label>
          <select value={method} onChange={e => setMethod(e.target.value)} className="bg-[#0a0f1e] border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#4ade80]">
            <option value="card">Credit / debit card</option>
            <option value="ach">ACH bank transfer</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Deposit amount</label>
          <select value={depositAmt} onChange={e => setDepositAmt(Number(e.target.value))} className="bg-[#0a0f1e] border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#4ade80]">
            {[50,100,200,500].map(v => <option key={v} value={v}>${v}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Card spend amount</label>
          <select value={spendAmt} onChange={e => setSpendAmt(Number(e.target.value))} className="bg-[#0a0f1e] border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#4ade80]">
            {[25,50,100].map(v => <option key={v} value={v}>${v}</option>)}
          </select>
        </div>
      </div>

      {/* Step by step */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Transaction flow — what Stripe charges at each step</p>
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-800/50 last:border-0 items-start hover:bg-[#1a2235] transition">
              <div className="w-6 h-6 rounded-full bg-[#4ade80]/10 text-[#4ade80] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{s.num}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{s.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{s.detail}</p>
              </div>
              <div className="text-right shrink-0">
                {s.stripe && <p className="text-red-400 text-xs font-mono">{s.stripe}</p>}
                {s.note   && <p className="text-[#4ade80] text-xs font-mono">{s.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning box */}
      {method === "card" ? (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
          <p className="text-amber-400 text-sm">
            ⚠️ <strong>Deposit gap:</strong> You credit customer ${depositAmt} but only receive ${netDeposit.toFixed(2)} — a ${depFee.toFixed(2)} loss per card deposit. Consider charging a processing fee or encouraging ACH.
          </p>
        </div>
      ) : (
        <div className="bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-xl px-4 py-3">
          <p className="text-[#4ade80] text-sm">
            ✅ ACH costs only ${depFee.toFixed(2)} on a ${depositAmt} deposit vs ${cardDepFee(depositAmt).toFixed(2)} for card. Encourage ACH for large deposits.
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Deposit fee",      value: `$${depFee.toFixed(2)}`,  sub: `on $${depositAmt} ${method} deposit`, red: true  },
          { label: "Card issue fee",   value: "$0.10",                  sub: "per virtual card",                    red: true  },
          { label: "Transaction fee",  value: "$0.00",                  sub: "free under $500K",                    red: false },
          { label: "Net on $29 sub",   value: "$27.86",                 sub: "after Stripe billing fee",            red: false },
        ].map(c => (
          <div key={c.label} className="bg-[#0a0f1e] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">{c.label}</p>
            <p className={`text-xl font-bold font-mono ${c.red ? "text-red-400" : "text-[#4ade80]"}`}>{c.value}</p>
            <p className="text-gray-500 text-xs mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Per-plan breakdown */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Monthly unit economics by plan</p>
        <div className="grid grid-cols-3 gap-4">
          {plans.map(plan => {
            const subFee    = plan.price * 0.029 + 0.30;
            const cardFees  = plan.cards * 0.10;
            const avgDep    = plan.price * 2;
            const avgDepFee = method === "card" ? cardDepFee(avgDep) : achDepFee(avgDep);
            const totalCost = subFee + cardFees + avgDepFee;
            const net       = plan.price - totalCost;
            const margin    = Math.round((net / plan.price) * 100);
            return (
              <div key={plan.name} className="bg-[#0a0f1e] border border-gray-800 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-3">{plan.name} — ${plan.price}/mo</p>
                {[
                  { label: "Sub processing fee", val: `-$${subFee.toFixed(2)}`, red: true  },
                  { label: `Card fees (${plan.cards})`, val: `-$${cardFees.toFixed(2)}`, red: true  },
                  { label: "Avg deposit fee",    val: `-$${avgDepFee.toFixed(2)}`, red: true  },
                  { label: "Issuing tx fees",    val: "$0.00",                    red: false },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-xs py-1.5 border-b border-gray-800/50">
                    <span className="text-gray-400">{r.label}</span>
                    <span className={`font-mono ${r.red ? "text-red-400" : "text-gray-400"}`}>{r.val}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm py-2 mt-1">
                  <span className="text-white font-semibold">Net revenue</span>
                  <span className="text-[#4ade80] font-mono font-bold">${net.toFixed(2)}</span>
                </div>
                <div className="bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-[#4ade80] h-1.5 rounded-full" style={{ width: `${margin}%` }} />
                </div>
                <p className="text-gray-500 text-xs text-right mt-1">{margin}% margin</p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-gray-600 text-xs text-center">Stripe fees sourced March 2026 — Issuing: $0.10/card, free transactions under $500K volume</p>
    </div>
  );
}

export default function AdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [showInvestor, setShowInvestor] = useState(false);
  const [investorTab, setInvestorTab] = useState<"financial"|"economics">("financial");
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

  const totalUsers  = displayData.length;
  const activeUsers = displayData.filter((c: any) => c.cards_used_this_month > 0).length;
  const totalCards  = displayData.reduce((a: number, c: any) => a + (c.cards_used_this_month || 0), 0);
  const mrr = displayData.reduce((a: number, c: any) => {
    if (c.plan === "enterprise") return a + 499;
    if (c.plan === "growth")     return a + 79;
    return a + 29;
  }, 0);
  const cardRevenue  = totalCards * 0.5;
  const grossRevenue = mrr + cardRevenue;
  const infraCost    = Math.floor(grossRevenue * 0.08);
  const stripeFees   = Math.floor(grossRevenue * 0.10);
  const netProfit    = Math.floor(grossRevenue - infraCost - stripeFees);
  const margin       = Math.floor((netProfit / grossRevenue) * 100);

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
          <button onClick={() => { setShowInvestor(true); setInvestorTab("financial"); }} className="text-xs px-4 py-2 rounded-lg font-semibold border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition">Investor View</button>
          <button onClick={() => { setShowInvestor(true); setInvestorTab("economics"); }} className="text-xs px-4 py-2 rounded-lg font-semibold border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition">Unit Economics</button>
          <button onClick={() => setDemoMode(!demoMode)} className={"text-xs px-4 py-2 rounded-lg font-semibold transition " + (demoMode ? "bg-amber-500 text-black" : "bg-[#111827] border border-gray-700 text-gray-400 hover:text-white")}>
            {demoMode ? "Demo Mode ON" : "Enable Demo Mode"}
          </button>
        </div>
      </nav>

      {/* Investor Modal */}
      {showInvestor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-[#0a0f1e] border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* Modal header */}
            <div className="flex justify-between items-center px-8 pt-8 pb-0 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white">AI Payment Proxy</h2>
                <p className="text-gray-400 text-sm">{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
              </div>
              <button onClick={() => setShowInvestor(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-8 pt-6 pb-0 shrink-0">
              {[
                { key: "financial",  label: "Financial Summary" },
                { key: "economics",  label: "Unit Economics" },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setInvestorTab(t.key as any)}
                  className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition border-b-2 ${
                    investorTab === t.key
                      ? "text-[#4ade80] border-[#4ade80] bg-[#4ade80]/5"
                      : "text-gray-400 border-transparent hover:text-white"
                  }`}
                >{t.label}</button>
              ))}
            </div>
            <div className="border-b border-gray-800 mx-8" />

            {/* Tab content */}
            <div className="overflow-y-auto px-8 py-6 flex-1">

              {investorTab === "financial" && (
                <div className="space-y-6">
                  <div className="border border-gray-800 rounded-xl overflow-hidden">
                    <div className="bg-[#111827] px-4 py-2 border-b border-gray-800">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue Breakdown</p>
                    </div>
                    {[
                      { label: "Subscription Revenue", value: "$" + mrr.toLocaleString() + "/mo",             sub: totalUsers + " users × avg plan rate" },
                      { label: "Card Issuance Fees",   value: "$" + Math.floor(cardRevenue).toLocaleString() + "/mo", sub: totalCards + " cards × $0.50" },
                      { label: "Gross Revenue",        value: "$" + Math.floor(grossRevenue).toLocaleString() + "/mo", sub: "", green: true, bold: true },
                      { label: "Infrastructure Costs", value: "-$" + infraCost.toLocaleString() + "/mo",       sub: "8% of revenue", red: true },
                      { label: "Stripe Fees",          value: "-$" + stripeFees.toLocaleString() + "/mo",      sub: "~10% of revenue", red: true },
                      { label: "Net Profit",           value: "$" + netProfit.toLocaleString() + "/mo",        sub: margin + "% margin", green: true, bold: true, big: true },
                    ].map((row, i) => (
                      <div key={i} className={"flex justify-between items-center px-4 py-3 border-b border-gray-800/50 last:border-0 " + ((row.bold && i > 1) ? "bg-[#111827]/50" : "")}>
                        <div>
                          <p className="text-white text-sm">{row.label}</p>
                          {row.sub && <p className="text-gray-500 text-xs">{row.sub}</p>}
                        </div>
                        <p className={`font-mono ${row.big ? "text-xl" : "text-sm"} ${row.green ? "text-[#4ade80] font-bold" : row.red ? "text-red-400" : "text-white"}`}>{row.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border border-gray-800 rounded-xl overflow-hidden">
                    <div className="bg-[#111827] px-4 py-2 border-b border-gray-800">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Growth Projections</p>
                    </div>
                    {[
                      { period: "Month 1", users: totalUsers,                     mrr: Math.floor(grossRevenue),      profit: netProfit },
                      { period: "Month 6", users: Math.floor(totalUsers * 2.5),   mrr: Math.floor(grossRevenue * 3),  profit: Math.floor(netProfit * 3) },
                      { period: "Year 1",  users: Math.floor(totalUsers * 6),     mrr: Math.floor(grossRevenue * 8),  profit: Math.floor(netProfit * 8) },
                      { period: "Year 2",  users: Math.floor(totalUsers * 20),    mrr: Math.floor(grossRevenue * 28), profit: Math.floor(netProfit * 28) },
                    ].map(row => (
                      <div key={row.period} className="flex justify-between items-center px-4 py-3 border-b border-gray-800/50 last:border-0">
                        <p className="text-white text-sm w-24">{row.period}</p>
                        <p className="text-gray-400 text-sm w-24">{row.users} users</p>
                        <p className="text-blue-400 text-sm w-32 font-mono">{"$" + row.mrr.toLocaleString() + "/mo"}</p>
                        <p className="text-[#4ade80] text-sm font-mono font-bold">{"$" + row.profit.toLocaleString() + " profit"}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "LTV per User",  value: "$" + Math.floor(netProfit / totalUsers * 24).toLocaleString(), sub: "24mo avg" },
                      { label: "CAC Target",    value: "$" + Math.floor(netProfit / totalUsers * 3).toLocaleString(),  sub: "3mo payback" },
                      { label: "Gross Margin",  value: margin + "%",                                                   sub: "Net profit margin" },
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
              )}

              {investorTab === "economics" && <UnitEconomicsTab />}

            </div>
          </div>
        </div>
      )}

      {/* Main dashboard */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {demoMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <span className="text-amber-400 text-sm font-semibold">Demo Mode Active</span>
            <span className="text-amber-400/70 text-sm">— Showing sample investor data alongside real users</span>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: "Total Users",    value: totalUsers,                                  sub: activeUsers + " active",     color: "text-white"      },
            { label: "MRR",            value: "$" + mrr.toLocaleString(),                  sub: "Monthly recurring",         color: "text-[#4ade80]"  },
            { label: "Gross Revenue",  value: "$" + Math.floor(grossRevenue).toLocaleString(), sub: "Subs + card fees",      color: "text-blue-400"   },
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
            { label: "Cards Issued",  value: totalCards.toLocaleString(),                  sub: "This month",                color: "text-purple-400" },
            { label: "Card Revenue",  value: "$" + Math.floor(cardRevenue).toLocaleString(), sub: "$0.50 per card",          color: "text-amber-400"  },
            { label: "Net Profit",    value: "$" + netProfit.toLocaleString(),              sub: margin + "% margin",        color: "text-[#4ade80]"  },
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