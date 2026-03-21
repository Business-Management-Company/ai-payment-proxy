"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Customer {
  name: string;
  email: string;
  plan: string;
}

export default function SettingsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("customers").select("*").eq("id", user.id).single();
      setCustomer(data);
    }
    load();
  }, []);

  const planColors: Record<string, string> = {
    developer: "bg-blue-500/10 text-blue-400",
    growth: "bg-purple-500/10 text-purple-400",
    enterprise: "bg-[#4ade80]/10 text-[#4ade80]",
  };

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-8">Settings</h2>
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 max-w-lg">
        <h3 className="text-white font-semibold mb-6">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Name</label>
            <p className="text-white mt-1">{customer?.name || "—"}</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <p className="text-white mt-1">{customer?.email || "—"}</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Plan</label>
            <div className="mt-1">
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${planColors[customer?.plan || "developer"]}`}>
                {customer?.plan || "developer"}
              </span>
            </div>
          </div>
        </div>
        <button disabled className="mt-6 border border-gray-700 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
