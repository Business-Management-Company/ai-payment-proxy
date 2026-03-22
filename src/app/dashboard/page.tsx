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
  auto_reload_enabled: boolean;
  auto_reload_threshold: number;
  auto_reload_amount: number;
}

export default function Page() {
  const [email, setEmail]       = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [depositing, setDepositing] = useState(false);
  const [amount, setAmount]     = useState("100");
  const [method, setMethod]     = useState<"card"|"ach">("card");
  const [showReload, setShowReload] = useState(false);
  const [reloadEnabled,   setReloadEnabled]   = useState(false);
  const [reloadThreshold, setReloadThreshold] = useState(50);
  const [reloadAmount,    setReloadAmount]     = useState(200);
  const [savingReload,    setSavingReload]     = useState(false);
  const [reloadSaved,     setReloadSaved]      = useState(false);
  const pending = customer?.pending_balance_usd || 0;
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        supabase.from("customers").select("*").eq("id", data.user.id).single()
          .then(({ data: cust }) => {
            if (cust) {
              setCustomer(cust);
              setReloadEnabled(cust.auto_reload_enabled || false);
              setReloadThreshold(cust.auto_reload_threshold || 50);
              setReloadAmount(cust.auto_reload_amount || 200);
            }
          });
      }
    });
  }, []);

  const net     = parseFloat(amount) || 0;
  const cardFee = +(net * 0.029 + 0.30).toFixed(2);
  const fee     = method === "card" ? cardFee : 0;
  const youPay  = method === "card" ? +(net + cardFee).toFixed(2) : net;

  async function handleDeposit() {
    if (!net || net < 10) return;
    setDepositing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: net, chargeAmount: youPay, method }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setDepositing(false);
  }

  async function saveAutoReload() {
    setSavingReload(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("customers").update({
      auto_reload_enabled:   reloadEnabled,
      auto_reload_threshold: reloadThreshold,
      auto_reload_amount:    reloadAmount,
    }).eq("id", user.id);
    setSavingReload(false);
    setReloadSaved(true);
    setTimeout(() => setReloadSaved(false), 2000);
  }

  const planLimits: Record<string, number> = { developer: 50, growth: 250, enterprise: 999999 };
  const cardsLimit     = planLimits[customer?.plan || "developer"];
  const cardsUsed      = customer?.cards_used_this_month || 0;
  const cardsRemaining = cardsLimit - cardsUsed;
  const hasBank        = !!customer?.connected_bank_last4;
  const lowBalance     = (customer?.balance_usd || 0) < reloadThreshold;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-2xl font-bold">Overview</h2>
        <span className="text-gray-400 text-sm">{email}</span>
      </div>

      {/* Low balance warning */}
      {lowBalance && (customer?.balance_usd || 0) > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-amber-400">⚠️</span>
            <span className="text-amber-400 text-sm">
              Low balance — ${customer?.balance_usd} remaining. Your AI agents may fail to create cards.
            </span>
          </div>
          <button
            onClick={() => setShowReload(true)}
            className="text-amber-400 text-xs font-semibold border border-amber-500/30 px-3 py-1 rounded-lg hover:bg-amber-500/10 transition-colors"
          >
            Add funds →
          </button>
        </div>
      )}

      {(customer?.balance_usd || 0) === 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-red-400">🚫</span>
            <span className="text-red-400 text-sm">
              Balance is $0 — card creation is blocked until you add funds.
            </span>
          </div>
          <button
            onClick={() => setShowReload(false)}
            className="text-red-400 text-xs font-semibold border border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            Add funds →
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">

        {/* Balance + Deposit */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 col-span-1">
          <div className="flex justify-between items-start mb-1">
            <p className="text-gray-400 text-sm">Prepaid Balance</p>
            <button
              onClick={() => setShowReload(!showReload)}
              className="text-gray-500 hover:text-[#4ade80] text-xs transition-colors"
              title="Auto-reload settings"
            >
              ⚙️ Auto-reload
            </button>
          </div>
          <p className="text-white text-3xl font-bold">${(customer?.balance_usd || 0).toLocaleString()}</p>
          {pending > 0 && <p className="text-amber-400 text-sm mt-1">${pending} pending (ACH clearing)</p>}
          {reloadEnabled && hasBank && (
            <p className="text-[#4ade80] text-xs mt-1">
              ✅ Auto-reload on — refills ${reloadAmount} when below ${reloadThreshold}
            </p>
          )}

          <div className="mt-5 space-y-3">
            {/* Method toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setMethod("card")}
                className={`flex-1 py-2 text-xs font-semibold transition ${method === "card" ? "bg-[#4ade80] text-black" : "text-gray-400 hover:text-white"}`}
              >💳 Card</button>
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

        {/* Bank Account */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Bank Account</p>
          {hasBank ? (
            <div>
              <p className="text-white font-semibold">••••{customer?.connected_bank_last4}</p>
              <span className="text-[#4ade80] text-xs font-semibold">CONNECTED</span>
              <p className="text-gray-500 text-xs mt-2">ACH deposits are free with a connected bank.</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 text-sm mb-1">No bank connected</p>
              <p className="text-gray-600 text-xs mb-3">Connect your bank for free ACH deposits and auto-reload.</p>
              <a href="/dashboard" className="text-[#4ade80] text-xs hover:underline">Connect bank →</a>
            </div>
          )}
        </div>

        {/* Plan */}
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

      {/* Auto-reload panel */}
      {showReload && (
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-white font-semibold">Auto-reload</h3>
              <p className="text-gray-400 text-xs mt-0.5">
                Automatically add funds when your balance runs low so your AI agents never stop.
              </p>
            </div>
            <button onClick={() => setShowReload(false)} className="text-gray-500 hover:text-white text-lg leading-none">×</button>
          </div>

          {!hasBank ? (
            <div className="bg-[#0a0f1e] border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-3">
                Auto-reload requires a connected bank account for free ACH pulls.
              </p>
              <a href="/dashboard" className="text-[#4ade80] text-sm font-semibold hover:underline">
                Connect your bank →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Toggle */}
              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <div>
                  <p className="text-white text-sm font-medium">Enable auto-reload</p>
                  <p className="text-gray-500 text-xs">Pulls from your connected bank ••••{customer?.connected_bank_last4}</p>
                </div>
                <button
                  onClick={() => setReloadEnabled(!reloadEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${reloadEnabled ? "bg-[#4ade80]" : "bg-gray-700"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${reloadEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>

              {reloadEnabled && (
                <>
                  {/* Threshold */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs mb-2 block">
                        Reload when balance drops below
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          value={reloadThreshold}
                          onChange={e => setReloadThreshold(Number(e.target.value))}
                          min="10"
                          className="w-full bg-[#0a0f1e] border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                        />
                      </div>
                      <p className="text-gray-600 text-xs mt-1">Recommended: $50</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-2 block">
                        Reload amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          value={reloadAmount}
                          onChange={e => setReloadAmount(Number(e.target.value))}
                          min="50"
                          className="w-full bg-[#0a0f1e] border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                        />
                      </div>
                      <p className="text-gray-600 text-xs mt-1">Min $50 — ACH pull, free</p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-[#0a0f1e] border border-[#4ade80]/20 rounded-xl px-4 py-3">
                    <p className="text-[#4ade80] text-xs font-semibold mb-1">How this works</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      When your balance drops below <strong className="text-white">${reloadThreshold}</strong>, we automatically pull <strong className="text-white">${reloadAmount}</strong> from your bank ••••{customer?.connected_bank_last4} via ACH (free). Funds arrive in 2-3 business days and show as pending until cleared.
                    </p>
                  </div>
                </>
              )}

              {/* Save button */}
              <button
                onClick={saveAutoReload}
                disabled={savingReload}
                className="bg-[#4ade80] text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] disabled:opacity-50 transition-colors"
              >
                {savingReload ? "Saving..." : reloadSaved ? "✅ Saved!" : "Save settings"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
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