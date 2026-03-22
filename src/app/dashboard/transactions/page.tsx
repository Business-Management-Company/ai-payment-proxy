"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Transaction {
  id: string;
  amount_usd: number;
  type: string;
  description: string;
  created_at: string;
}

const typeStyles: Record<string, string> = {
  deposit:    "bg-green-500/10 text-green-400",
  spend:      "bg-red-500/10 text-red-400",
  refund:     "bg-blue-500/10 text-blue-400",
  card_spend: "bg-purple-500/10 text-purple-400",
};

const typeIcons: Record<string, string> = {
  deposit:    "↓",
  spend:      "↑",
  refund:     "↩",
  card_spend: "💳",
};

export default function TransactionsPage() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: balTxns }, { data: cardTxns }] = await Promise.all([
        supabase.from("balance_transactions").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }),
        supabase.from("card_transactions").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }),
      ]);

      const bal = (balTxns || []).map((t: any) => ({
        id: t.id,
        amount_usd: t.amount_usd,
        type: t.type,
        description: t.description,
        created_at: t.created_at,
      }));

      const card = (cardTxns || []).map((t: any) => ({
        id: t.id,
        amount_usd: t.amount / 100,
        type: "card_spend",
        description: t.merchant_name || "Card transaction",
        created_at: t.created_at,
      }));

      const all = [...bal, ...card].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setTxns(all);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-2xl font-bold">Transactions</h2>
        <span className="text-gray-500 text-sm">{txns.length} record{txns.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-20">Loading...</div>
      ) : txns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🧾</div>
          <h3 className="text-white text-xl font-bold mb-2">No transactions yet</h3>
          <p className="text-gray-400 text-sm max-w-sm">
            Transactions appear here when you deposit funds or your AI agent uses a virtual card.
          </p>
        </div>
      ) : (
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 text-xs uppercase tracking-wider px-6 py-4">Type</th>
                <th className="text-left text-gray-400 text-xs uppercase tracking-wider px-6 py-4">Description</th>
                <th className="text-left text-gray-400 text-xs uppercase tracking-wider px-6 py-4">Amount</th>
                <th className="text-left text-gray-400 text-xs uppercase tracking-wider px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {txns.map(tx => (
                <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-[#1a2235] transition-colors">
                  <td className="px-6 py-4">
                    <span className={"inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium " + (typeStyles[tx.type] || "bg-gray-800 text-gray-400")}>
                      <span>{typeIcons[tx.type] || "•"}</span>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span className={tx.type === "spend" || tx.type === "card_spend" ? "text-red-400 font-mono text-sm" : "text-green-400 font-mono text-sm"}>
                      {tx.type === "spend" || tx.type === "card_spend" ? "-" : "+"}${tx.amount_usd.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(tx.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                    <span className="text-gray-600 ml-2 text-xs">
                      {new Date(tx.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
