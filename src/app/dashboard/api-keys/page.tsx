"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Page() {
  const [prefix, setPrefix] = useState("");
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) supabase.from("customers").select("api_key_prefix").eq("id", data.user.id).single().then(({ data: d }) => { if (d) setPrefix(d.api_key_prefix); });
    });
  }, []);
  return <div><h2 className="text-white text-2xl font-bold mb-8">API Keys</h2><div className="bg-[#111827] border border-gray-800 rounded-xl p-6"><p className="text-gray-400 text-sm mb-2">Your API Key</p><div className="font-mono text-[#4ade80] bg-[#0a0f1e] rounded p-3">{prefix ? prefix + "••••••••••••••••••••" : "Loading..."}</div></div></div>;
}