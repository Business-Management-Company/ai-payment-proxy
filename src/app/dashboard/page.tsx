"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Customer {
  balance_usd: number;
  plan: string;
  funding_model: string;
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [depositing, setDepositing] = useState(false);
  const [amount, setAmount] = useState("500");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        supabase.from("customers").select("*").eq("id", data.user.id).single().then(({ data: c }) => setCustomer(c));
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

  return <div>
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-white text-2xl font-bold">Overview</h2>
      <span className="text-gray-400 text-sm">{email}</span>
    </div>
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 col-span-2">
        <p className="text-gray-400 text-sm">Available Balance</p>
        <p className="text-white text-3xl font-bold mt-2">{`$${((customer?.balance_usd || 0)).toLocaleString()}`}</p>
        <div className="flex gap-3 mt-4">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-[#1a2235] border border-gray-700 rounded-lg px-3 py-2 text-white w-32 text-sm"
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
      </div>
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
        <p className="text-gray-400 text-sm">Active Cards</p>
        <p className="text-white text-3xl font-bold mt-2">0</p>
      </div>
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
        <p className="text-gray-400 text-sm">Plan</p>
        <p className="text-white text-lg font-bold mt-2 capitalize">{customer?.plan || "developer"}</p>
      </div>
    </div>
  </div>;
}