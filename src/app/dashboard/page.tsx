"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Customer {
  balance_usd: number;
  plan: string;
  funding_model: string;
  stripe_customer_id: string;
  connected_bank_last4: string;
  connected_bank_account_id: string;
  cards_used_this_month: number;
  pending_balance_usd: number;
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [depositing, setDepositing] = useState(false);
  const [amount, setAmount] = useState("500");
  const pending = customer?.pending_balance_usd || 0;
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        supabase.from("customers").select("*").eq("id", data.user.id).single().then(({ data: cust }) => setCustomer(cust));
      }
    });
  }, []);

  async function handleDeposit() {
    setDepositing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setDepositing(false);
  }

  const planLimits: Record<string, number> = { developer: 50, growth: 250, enterprise: 999999 };
  const cardsLimit = planLimits[customer?.plan || "developer"];
  const cardsUsed = customer?.cards_used_this_month || 0;
  const cardsRemaining = cardsLimit - cardsUsed;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-2xl font-bold">Overview</h2>
        <span className="text-gray-400 text-sm">{email}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 col-span-1">
          <p className="text-gray-400 text-sm mb-1">Prepaid Balance</p>
          <p className="text-white text-3xl font-bold">${(customer?.balance_usd || 0).toLocaleString()}</p>
          {pending > 0 && <p className="text-amber-400 text-sm mt-1">${pending} pending (ACH clearing)</p>}
          <div className="flex gap-2 mt-4">
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="bg-[#0a0f1e] border border-gray-700 rounded-lg px-3 py-2 text-white w-24 text-sm" min="100" />
            <button onClick={handleDeposit} disabled={depositing} className="bg-[#4ade80] text-black px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] disabled:opacity-50">
              {depositing ? "..." : "Add Funds"}
            </button>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Bank Account</p>
          {customer?.connected_bank_last4 ? (
            <div>
              <p className="text-white font-semibold">••••{customer.connected_bank_last4}</p>
              <span className="text-[#4ade80] text-xs font-semibold">CONNECTED</span>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 text-sm mb-3">No bank connected</p>
              <a href="/dashboard" className="text-[#4ade80] text-xs hover:underline">Connect bank →</a>
            </div>
          )}
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Plan</p>
          <p className="text-white text-lg font-bold capitalize mb-1">{customer?.plan || "developer"}</p>
          <p className="text-gray-500 text-xs">{cardsUsed}/{cardsLimit === 999999 ? "∞" : cardsLimit} cards used</p>
          <div className="mt-2 bg-gray-800 rounded-full h-1.5">
            <div className="bg-[#4ade80] h-1.5 rounded-full" style={{ width: cardsLimit === 999999 ? "0%" : Math.min(100, (cardsUsed/cardsLimit)*100) + "%" }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Active Cards</p>
          <p className="text-white text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Spend</p>
          <p className="text-white text-3xl font-bold mt-2">$0</p>
        </div>
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Cards Remaining</p>
          <p className="text-white text-3xl font-bold mt-2">{cardsRemaining}</p>
        </div>
      </div>
    </div>
  );
}