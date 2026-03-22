"use client";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const nav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Cards", href: "/dashboard/cards" },
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "API Keys", href: "/dashboard/api-keys" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setTimeout(() => { supabase.auth.getSession().then(({ data }) => {
      if (data.session) setOk(true);
      else router.replace("/login");
      setReady(true);
    });
  }, []);

  if (!ready) return <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center"><p className="text-white">Loading...</p></div>;
  if (!ok) return null;

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return <div className="min-h-screen bg-[#0a0f1e] flex">
    <div className="w-64 bg-[#111827] border-r border-gray-800 p-6 flex flex-col">
      <div className="text-white font-bold text-lg mb-8">AI Payment Proxy</div>
      <nav className="space-y-1 flex-1">
        {nav.map(item => <a key={item.href} href={item.href} className={"block px-3 py-2 rounded-lg text-sm " + (pathname === item.href ? "text-[#4ade80] bg-[#4ade80]/10" : "text-gray-400 hover:text-white")}>{item.label}</a>)}
      </nav>
      <button onClick={signOut} className="text-gray-500 hover:text-white text-sm px-3 py-2 text-left">Sign Out</button>
    </div>
    <div className="flex-1 p-8">{children}</div>
  </div>;
}