"use client";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const nav: { label: string; href: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/cards", label: "Cards" },
  { href: "/dashboard/transactions", label: "Transactions" },
  { href: "/dashboard/api-keys", label: "API Keys" },
  { href: "/dashboard/integrations", label: "Integrations" },
  { href: "/kb", label: "Help" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/admin", label: "Admin" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);
  const [role, setRole] = useState<string>("");
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) { setOk(true); setReady(true); }
      else if (event === "SIGNED_OUT") { setOk(false); setReady(true); router.replace("/login"); }
    });
    setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) { setOk(true); setReady(true); }
        else { setReady(true); router.replace("/login"); }
      });
    }, 800);
  }, []);

  useEffect(() => {
    async function loadRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("customers")
        .select("role")
        .eq("id", user.id)
        .single();
      setRole(data?.role || "");
    }
    void loadRole();
  }, []);

  useEffect(() => {
    setContentVisible(false);
    const id = requestAnimationFrame(() => setContentVisible(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (!ready) return <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center"><p className="text-white">Loading...</p></div>;
  if (!ok) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      <div className="w-64 bg-[#111827] border-r border-gray-800 p-6 flex flex-col">
        <div className="text-white font-bold text-lg mb-8">AI Payment Proxy</div>
        <nav className="space-y-1 flex-1">
          {nav
            .filter((item) => item.href !== "/admin" || role === "super_admin")
            .map(item => (
            <a
              key={item.href}
              href={item.href}
              target={item.href === "/kb" ? "_blank" : undefined}
              rel={item.href === "/kb" ? "noopener noreferrer" : undefined}
              className={"block px-3 py-2 rounded-lg text-sm transition " + (pathname === item.href ? "text-[#4ade80] bg-[#4ade80]/10 font-medium" : "text-gray-400 hover:text-white hover:bg-[#1a2235]")}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button onClick={signOut} className="text-gray-500 hover:text-white text-sm px-3 py-2 text-left transition">
          Sign Out
        </button>
      </div>
      <div className="flex-1 p-8">
        <div
          key={pathname}
          className={`transition-all duration-200 ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}