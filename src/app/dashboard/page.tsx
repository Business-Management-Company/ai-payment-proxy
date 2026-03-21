"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const [email, setEmail] = useState("");
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? "");
    });
  }, []);
  return <div>
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-white text-2xl font-bold">Overview</h2>
      <span className="text-gray-400 text-sm">{email}</span>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {[{label:"Cards Created",value:"0"},{label:"Active Cards",value:"0"},{label:"Total Spend",value:"$0"},{label:"API Calls",value:"0"}].map(s => <div key={s.label} className="bg-[#111827] border border-gray-800 rounded-xl p-6"><p className="text-gray-400 text-sm">{s.label}</p><p className="text-white text-3xl font-bold mt-2">{s.value}</p></div>)}
    </div>
  </div>;
}