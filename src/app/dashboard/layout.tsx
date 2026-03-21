"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Cards", href: "/dashboard/cards" },
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "API Keys", href: "/dashboard/api-keys" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      <div className="w-64 bg-[#111827] border-r border-gray-800 p-6 flex flex-col">
        <h1 className="text-white font-bold text-lg mb-8">AI Payment Proxy</h1>
        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm transition ${
                pathname === item.href
                  ? "bg-[#4ade80]/10 text-[#4ade80] font-medium"
                  : "text-gray-400 hover:text-white hover:bg-[#1a2235]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleSignOut}
          className="text-gray-500 hover:text-white text-sm px-3 py-2 text-left transition"
        >
          Sign Out
        </button>
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
