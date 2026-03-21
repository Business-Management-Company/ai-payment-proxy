"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
      else setEmail(session.user.email ?? "");
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      <div className="w-64 bg-[#111827] border-r border-gray-800 p-6">
        <h1 className="text-white font-bold text-lg mb-8">AI Payment Proxy</h1>
        <nav className="space-y-2">
          {["Overview", "Cards", "Transactions", "API Keys", "Settings"].map(item => (
            <div key={item} className="text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-[#1a2235] cursor-pointer">
              {item}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-2xl font-bold">Overview</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{email}</span>
            <button onClick={handleSignOut} className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
              Sign Out
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Cards Created", value: "0" },
            { label: "Active Cards", value: "0" },
            { label: "Total Spend", value: "$0" },
            { label: "API Calls", value: "0" },
          ].map(stat => (
            <div key={stat.label} className="bg-[#111827] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-white text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}