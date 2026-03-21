"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/onboarding");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">AI Payment Proxy</h1>
        <p className="text-gray-400 mb-6">Create your account</p>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#4ade80]"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4ade80] text-black font-semibold rounded-lg px-4 py-3 hover:bg-[#22c55e] transition"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-gray-500 text-sm mt-4 text-center">
          Already have access? <a href="/login" className="text-[#4ade80]">Sign in</a>
        </p>
      </div>
    </div>
  );
}
