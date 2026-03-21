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

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [view, setView] = useState<"list" | "board">("board");
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [agent, setAgent] = useState("");
  const [limit, setLimit] = useState("50");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
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
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
        body: JSON.stringify({ label: label + (agent ? " (" + agent + ")" : ""), limit_usd: Number(limit) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCards(prev => [data.data, ...prev]);
      setShowForm(false);
      setLabel(""); setAgent(""); setLimit("50"); setApiKey("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    }
    setLoading(false);
  }

  return <div>
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-white text-2xl font-bold">Virtual Cards</h2>
      <div className="flex gap-3">
        <div className="flex bg-[#111827] border border-gray-800 rounded-lg overflow-hidden">
          <button onClick={() => setView("board")} className={`px-4 py-2 text-sm transition ${view === "board" ? "bg-[#4ade80] text-black font-semibold" : "text-gray-400 hover:text-white"}`}>Board</button>
          <button onClick={() => setView("list")} className={`px-4 py-2 text-sm transition ${view === "list" ? "bg-[#4ade80] text-black font-semibold" : "text-gray-400 hover:text-white"}`}>List</button>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e]">+ New Card</button>
      </div>
    </div>

    {showForm && <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">
      <h3 className="text-white font-semibold mb-4">Create Virtual Card</h3>
      <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Card label (e.g. Shopping)" value={label} onChange={e => setLabel(e.target.value)} required className="bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]" />
        <input type="text" placeholder="Agent name (e.g. Shopping Agent)" value={agent} onChange={e => setAgent(e.target.value)} className="bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]" />
        <input type="number" placeholder="Spending limit (USD)" value={limit} onChange={e => setLimit(e.target.value)} min="1" max="50000" required className="bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]" />
        <input type="text" placeholder="Your API key (aipp_live_...)" value={apiKey} onChange={e => setApiKey(e.target.value)} required className="bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]" />
        <div className="col-span-2 flex gap-3 items-center">
          <button type="submit" disabled={loading} className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#22c55e] disabled:opacity-50">{loading ? "Creating..." : "Create Card"}</button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </form>
    </div>}

    {view === "board" ? <div className="grid grid-cols-3 gap-4">
      {cards.length === 0 ? <p className="text-gray-500 col-span-3 text-center py-12">No cards yet. Create your first one!</p> : cards.map(card => <div key={card.id} className="bg-gradient-to-br from-[#1a2235] to-[#0a0f1e] border border-gray-700 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div className="text-[#4ade80] font-bold text-sm">AI Payment Proxy</div>
          <span className={`text-xs px-2 py-1 rounded-full ${card.status === "active" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-gray-800 text-gray-400"}`}>{card.status}</span>
        </div>
        <div className="text-white font-mono text-lg mb-4 tracking-widest">•••• •••• •••• {card.stripe_card_id.slice(-4)}</div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-gray-500 text-xs">LABEL</p>
            <p className="text-white text-sm font-medium">{card.label || "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">LIMIT</p>
            <p className="text-white text-sm font-medium">{`$${card.limit_usd}`}</p>
          </div>
        </div>
      </div>)}
    </div> : <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead><tr className="border-b border-gray-800">
          <th className="text-left text-gray-400 text-sm px-6 py-4">Label</th>
          <th className="text-left text-gray-400 text-sm px-6 py-4">Limit</th>
          <th className="text-left text-gray-400 text-sm px-6 py-4">Card ID</th>
          <th className="text-left text-gray-400 text-sm px-6 py-4">Status</th>
          <th className="text-left text-gray-400 text-sm px-6 py-4">Created</th>
        </tr></thead>
        <tbody>
          {cards.length === 0 ? <tr><td colSpan={5} className="text-gray-500 text-center px-6 py-12">No cards yet</td></tr> : cards.map(card => <tr key={card.id} className="border-b border-gray-800/50 hover:bg-[#1a2235]">
            <td className="px-6 py-4 text-white text-sm">{card.label || "—"}</td>
            <td className="px-6 py-4 text-white text-sm">{`$${card.limit_usd}`}</td>
            <td className="px-6 py-4 text-gray-400 text-xs font-mono">{card.stripe_card_id}</td>
            <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${card.status === "active" ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-gray-800 text-gray-400"}`}>{card.status}</span></td>
            <td className="px-6 py-4 text-gray-400 text-sm">{new Date(card.created_at).toLocaleDateString()}</td>
          </tr>)}
        </tbody>
      </table>
    </div>}
  </div>;
}