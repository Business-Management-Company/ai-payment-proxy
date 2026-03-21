"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email ?? "");
    }
    load();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-2xl font-bold">Overview</h2>
        <span className="text-gray-400 text-sm">{email}</span>
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
  );
}
