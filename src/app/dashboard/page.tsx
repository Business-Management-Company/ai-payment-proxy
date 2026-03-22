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
  const [email, setEmail]       = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [depositing, setDepositing] = useState(false);
  const [amount, setAmount]     = useState("100");
  const [method, setMethod]     = useState<"card"|"ach">("card");
  const pending = customer?.pending_balance_usd || 0;
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        supabase.from("customers").select("*").eq("id", data.user.id).single()
          .then(({ data: cust }) => setCustomer(cust));
      }
    });
  }, []);

  const net   = parseFloat(amount) || 0;
  const cardFee  = +(net * 0.029 + 0.30).toFixed(2);
  const achFee   = +Math.min(net * 0.008, 5).toFixed(2);
  const fee      = method === "card" ? cardFee : 0;
  const youPay   = method === "card" ? +(net + cardFee).toFixed(2) : net;

  async function handleDeposit() {
    if (!net || net < 10) return;
    setDepositing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        amount: net,           // amount to credit to balance
        chargeAmount: youPay,  // amount to charge customer (net + fee for card)
        method,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setDepositing(false);
  }

  const planLimits: Record<string, number> = { developer: 50, growth: 250, enterprise: 999999 };
  const cardsLimit     = planLimits[customer?.plan || "developer"];
  const cardsUsed      = customer?.cards_used_this_month || 0;
  const cardsRemaining = cardsLimit - cardsUsed;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-2xl font-bold">Overview</h2>
        <span className="text-gray-400 text-sm">{email}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">

        {/* ── Balance + Deposit ── */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 col-span-1">
          <p className="text-gray-400 text-sm mb-1">Prepaid Balance</p>
          <p className="text-white text-3xl font-bold">${(customer?.balance_usd || 0).toLocaleString()}</p>
          {pending > 0 && <p className="text-amber-400 text-sm mt-1">${pending} pending (ACH clearing)</p>}

          <div className="mt-5 space-y-3">

            {/* Method toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setMethod("card")}
                className={`flex-1 py-2 text-xs font-semibold transition ${method === "card" ? "bg-[#4ade80] text-black" : "text-gray-400 hover:text-white"}`}
              >
                💳 Card
              </button>
              <button
                onClick={() => setMethod("ach")}
                className={`flex-1 py-2 text-xs font-semibold transition flex items-center justify-center gap-1.5 ${method === "ach" ? "bg-[#4ade80] text-black" : "text-gray-400 hover:text-white"}`}
              >
                🏦 ACH
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${method === "ach" ? "bg-black/20 text-black" : "bg-[#4ade80]/10 text-[#4ade80]"}`}>FREE</span>
              </button>
            </div>

            {/* Amount input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="10"
                  className="w-full bg-[#0a0f1e] border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                />
              </div>
              <button
                onClick={handleDeposit}
                disabled={depositing || net < 10}
                className="bg-[#4ade80] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] disabled:opacity-50 transition-colors"
              >
                {depositing ? "..." : "Add Funds"}
              </button>
            </div>

            {/* Fee breakdown */}
            {net >= 10 && (
              <div className="bg-[#0a0f1e] border border-gray-800 rounded-lg px-3 py-2.5 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Deposit credited</span>
                  <span className="text-white font-mono">${net.toFixed(2)}</span>
                </div>
                {method === "card" ? (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Processing fee (2.9% + $0.30)</span>
                      <span className="text-amber-400 font-mono">+${fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-gray-800 pt-1 mt-1">
                      <span className="text-white font-semibold">You pay</span>
                      <span className="text-white font-mono font-semibold">${youPay.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-xs">Apple Pay & Google Pay accepted ✓</p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Processing fee</span>
                      <span className="text-[#4ade80] font-mono">FREE</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-gray-800 pt-1 mt-1">
                      <span className="text-white font-semibold">You pay</span>
                      <span className="text-white font-mono font-semibold">${youPay.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-xs">Arrives in 2-3 business days</p>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ── Bank Account ── */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Bank Account</p>
          {customer?.connected_bank_last4 ? (
            <div>
              <p className="text-white font-semibold">••••{customer.connected_bank_last4}</p>
              <span className="text-[#4ade80] text-xs font-semibold">CONNECTED</span>
              <p className="text-gray-500 text-xs mt-2">ACH deposits are free with a connected bank.</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 text-sm mb-1">No bank connected</p>
              <p className="text-gray-600 text-xs mb-3">Connect your bank for free ACH deposits.</p>
              <a href="/dashboard" className="text-[#4ade80] text-xs hover:underline">Connect bank →</a>
            </div>
          )}
        </div>

        {/* ── Plan ── */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Plan</p>
          <p className="text-white text-lg font-bold capitalize mb-1">{customer?.plan || "developer"}</p>
          <p className="text-gray-500 text-xs">{cardsUsed} / {cardsLimit === 999999 ? "∞" : cardsLimit} cards used</p>
          <div className="mt-2 bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-[#4ade80] h-1.5 rounded-full transition-all"
              style={{ width: cardsLimit === 999999 ? "0%" : Math.min(100, (cardsUsed / cardsLimit) * 100) + "%" }}
            />
          </div>
          <a href="/pricing" className="text-[#4ade80] text-xs mt-3 inline-block hover:underline">Upgrade plan →</a>
        </div>
      </div>

      {/* ── Stats ── */}
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