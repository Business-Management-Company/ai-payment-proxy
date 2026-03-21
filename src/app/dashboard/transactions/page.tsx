"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Transaction {
  id: string;
  amount: number;
  merchant_name: string;
  created_at: string;
  currency: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("card_transactions").select("*").eq("customer_id", user.id).order("created_at", { ascending: false });
      setTransactions(data || []);
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-8">Transactions</h2>
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm px-6 py-4">Merchant</th>
              <th className="text-left text-gray-400 text-sm px-6 py-4">Amount</th>
              <th className="text-left text-gray-400 text-sm px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={3} className="text-gray-500 text-center px-6 py-12">No transactions yet</td></tr>
            ) : transactions.map(tx => (
              <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-[#1a2235]">
                <td className="px-6 py-4 text-white text-sm">{tx.merchant_name || "—"}</td>
                <td className="px-6 py-4 text-white text-sm">${(tx.amount / 100).toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{new Date(tx.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
