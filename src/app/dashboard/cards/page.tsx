"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Card {
  id: string;
  label: string;
  limit_usd: number;
  merchant_category: string;
  status: string;
  created_at: string;
  stripe_card_id: string;
}

interface Customer {
  api_key_prefix: string;
  api_key_hash: string;
  balance_usd: number;
}

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [limit, setLimit] = useState("50");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: cust } = await supabase.from("customers").select("*").eq("id", user.id).single();
      setCustomer(cust);
      const { data: cardData } = await supabase.from("virtual_cards").select("*").eq("customer_id", user.id).order("created_at", { ascending: false });
      setCards(cardData || []);
    }
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey) { setError("Enter your API key"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey,
        },
        body: JSON.stringify({ label, limit_usd: Number(limit) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCards(prev => [data.data, ...prev]);
      setShowForm(false);
      setLabel(""); setLimit("50"); setApiKey("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create card");
    }
    setLoading(false);
  }

  return <div>
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-white text-2xl font-bold">Virtual Cards</h2>
      <button onClick={() => setShowForm(!showForm)} className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e]">
        + Create New Card
      </button>
    </div>
    {showForm && <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">
      <h3 className="text-white font-semibold mb-4">New Virtual Card</h3>
      <form onSubmit={handleCreate} className="space-y-4">
        <input type="text" placeholder="Label (e.g. Amazon purchase)" value={label} onChange={e => setLabel(e.target.value)} required className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]" />
        <input type="number" placeholder="Spending limit (USD)" value={limit} onChange={e => setLimit(e.target.value)} min="1" max="50000" required className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]" />
        <input type="text" placeholder="Your API key (aipp_live_...)" value={apiKey} onChange={e => setApiKey(e.target.value)} required className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]" />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#22c55e] disabled:opacity-50">
          {loading ? "Creating..." : "Create Card"}
        </button>
      </form>
    </div>}
    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left text-gray-400 text-sm px-6 py-4">Label</th>
            <th className="text-left text-gray-400 text-sm px-6 py-4">Limit</th>
            <th className="text-left text-gray-400 text-sm px-6 py-4">Stripe Card ID</th>
            <th className="text-left text-gray-400 text-sm px-6 py-4">Status</th>
            <th className="text-left text-gray-400 text-sm px-6 py-4">Created</th>
          </tr>
        </thead>
        <tbody>
          {cards.length === 0 ? <tr><td colSpan={5} className="text-gray-500 text-center px-6 py-12">No cards yet. Create your first one!</td></tr> : cards.map(card => <tr key={card.id} className="border-b border-gray-800/50 hover:bg-[#1a2235]">
            <td className="px-6 py-4 text-white text-sm">{card.label || "—"}</td>
            <td className="px-6 py-4 text-white text-sm">{`$${card.limit_usd}`}</td>
            <td className="px-6 py-4 text-gray-400 text-xs font-mono">{card.stripe_card_id}</td>
            <td className="px-6 py-4">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${card.status === "active" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-gray-800 text-gray-400"}`}>
                {card.status}
              </span>
            </td>
            <td className="px-6 py-4 text-gray-400 text-sm">{new Date(card.created_at).toLocaleDateString()}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>;
}