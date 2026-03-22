"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/dashboard"); }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">AI Payment Proxy</h1>
        <p className="text-gray-400 mb-6">Welcome back</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[#4ade80] text-black font-semibold rounded-lg px-4 py-3 hover:bg-[#22c55e] transition">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
          <div className="relative flex justify-center text-xs"><span className="bg-[#111827] px-2 text-gray-500">or continue with</span></div>
        </div>
        <div className="space-y-3">
          <a href="https://loaquqkxszzeymbrayhr.supabase.co/auth/v1/authorize?provider=github&redirect_to=https://aipaymentproxy.com/auth/callback" className="w-full flex items-center justify-center gap-3 border border-gray-700 text-white py-3 rounded-lg hover:border-gray-500 transition text-sm">
            Sign in with GitHub
          </a>
          <a href="https://loaquqkxszzeymbrayhr.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://aipaymentproxy.com/auth/callback" className="w-full flex items-center justify-center gap-3 border border-gray-700 text-white py-3 rounded-lg hover:border-gray-500 transition text-sm">
            Sign in with Google
          </a>
        </div>
        <p className="text-gray-500 text-sm mt-6 text-center">
          No account? <a href="/signup" className="text-[#4ade80]">Sign up</a>
        </p>
      </div>
    </div>
  );
}