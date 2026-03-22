"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Customer {
  balance_usd: number;
  plan: string;
  funding_model: string;
  stripe_customer_id: string;
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [depositing, setDepositing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [amount, setAmount] = useState("500");
  const [fundingMode, setFundingMode] = useState<"prepaid" | "bank">("prepaid");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        supabase.from("customers").select("*").eq("id", data.user.id).single().then(({ data: c }) => {
          setCustomer(c);
          if (c?.funding_model === "connected") setFundingMode("bank");
        });
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

  async function handleConnectBank() {
    setConnecting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !customer?.stripe_customer_id) {
        alert("Account setup incomplete. Please contact support.");
        setConnecting(false);
        return;
      }
      const res = await fetch("/api/connect-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.stripe_customer_id }),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); setConnecting(false); return; }
      const stripe = (window as any).Stripe("undefined");
      const result = await stripe.financialConnections.collectBankAccountToken({
        clientSecret: data.clientSecret,
      });
      if (result.error) { alert(result.error.message); }
      else { alert("Bank connected! Account: " + result.financialConnectionsSession.accounts[0].last4); window.location.reload(); }
    } catch(e: unknown) { 
      const msg = e instanceof Error ? e.message : "Failed to connect bank";
      alert(msg); 
    }
    setConnecting(false);
  }

  return <div>
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-white text-2xl font-bold">Overview</h2>
      <span className="text-gray-400 text-sm">{email}</span>
    </div>

    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFundingMode("prepaid")}
          className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${fundingMode === "prepaid" ? "bg-[#4ade80] text-black" : "bg-[#1a2235] text-gray-400 hover:text-white"}`}
        >
          Prepaid Balance
        </button>
        <button
          onClick={() => setFundingMode("bank")}
          className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${fundingMode === "bank" ? "bg-[#4ade80] text-black" : "bg-[#1a2235] text-gray-400 hover:text-white"}`}
        >
          Connect Bank
        </button>
      </div>

      {fundingMode === "prepaid" ? <div>
        <p className="text-gray-400 text-sm mb-2">Available Balance</p>
        <p className="text-white text-3xl font-bold mb-4">{`$${(customer?.balance_usd || 0).toLocaleString()}`}</p>
        <div className="flex gap-3">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-[#0a0f1e] border border-gray-700 rounded-lg px-3 py-2 text-white w-32 text-sm"
            min="100"
            placeholder="Amount"
          />
          <button
            onClick={handleDeposit}
            disabled={depositing}
            className="bg-[#4ade80] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] disabled:opacity-50"
          >
            {depositing ? "Redirecting..." : "Add Funds"}
          </button>
        </div>
      </div> : <div>
        <p className="text-gray-400 text-sm mb-4">Connect your bank account. We only pull funds when your AI agents spend — no prepay required.</p>
        <div className="flex items-center gap-3 bg-[#0a0f1e] border border-gray-700 rounded-lg p-4 mb-4">
          <div className="w-3 h-3 rounded-full bg-gray-600"></div>
          <p className="text-gray-400 text-sm">No bank connected yet</p>
        </div>
        <button
          onClick={handleConnectBank}
          disabled={connecting}
          className="bg-[#4ade80] text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#22c55e] disabled:opacity-50"
        >
          {connecting ? "Connecting..." : "Connect Bank Account"}
        </button>
      </div>}
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
        <p className="text-gray-400 text-sm">Plan</p>
        <p className="text-white text-lg font-bold mt-2 capitalize">{customer?.plan || "developer"}</p>
      </div>
    </div>
  </div>;
}
