"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Page() {
  const [customer, setCustomer] = useState<{name:string,email:string,plan:string}|null>(null);
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) supabase.from("customers").select("*").eq("id", data.user.id).single().then(({ data: d }) => setCustomer(d));
    });
  }, []);
  return <div><h2 className="text-white text-2xl font-bold mb-8">Settings</h2><div className="bg-[#111827] border border-gray-800 rounded-xl p-6 max-w-md"><p className="text-gray-400 text-sm">Email</p><p className="text-white mb-4">{customer?.email}</p><p className="text-gray-400 text-sm">Plan</p><p className="text-white capitalize">{customer?.plan}</p></div></div>;
}