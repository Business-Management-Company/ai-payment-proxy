import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { KBSearchInput } from "./KBSearchInput";

export const revalidate = 3600;

const categoryIcons: Record<string, string> = {
  "Getting Started": "🚀",
  "API Reference": "📡",
  "Troubleshooting": "🔧",
  "Billing": "💳",
  "Security": "🔒",
  "Integrations": "🔌",
};

type KBArticleRow = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  updated_at: string;
};

export default async function KBPage() {
  const supabase = createClient();
  const { data: articles } = await supabase
    .from("kb_articles")
    .select("slug, title, category, excerpt, updated_at")
    .eq("published", true)
    .order("category")
    .order("created_at");

  const grouped = (articles || []).reduce((acc: Record<string, KBArticleRow[]>, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white"
      style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "40px 40px" }}
    >
      <nav className="sticky top-0 z-50 border-b border-gray-800 px-8 py-5 flex justify-between items-center bg-[#0a0f1e]/90 backdrop-blur-sm">
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#4ade80] text-xl">⚡</span>
          <span>AI Payment Proxy</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="/docs"         className="text-gray-400 hover:text-white text-sm transition-colors">Docs</a>
          <a href="/pricing"      className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a>
          <a href="/integrations" className="text-gray-400 hover:text-white text-sm transition-colors">Integrations</a>
          <a href="/blog"         className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a>
          <a href="/kb"           className="text-white text-sm font-medium">Help</a>
          <a href="/login"        className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</a>
          <a href="/signup"       className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e] transition-colors">Get API Key</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-gray-400 text-lg">Everything you need to get started and succeed with AI Payment Proxy</p>
        </div>

        <KBSearchInput />

        <div className="space-y-12">
          {Object.entries(grouped).map(([category, arts]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{categoryIcons[category] || "📄"}</span>
                <h2 className="text-xl font-bold text-white">{category}</h2>
                <span className="text-gray-500 text-sm">{arts.length} article{arts.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {arts.map((article) => (
                  <Link
                    key={article.slug}
                    href={"/kb/" + article.slug}
                    data-article=""
                    className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors group"
                  >
                    <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-[#4ade80] transition-colors">{article.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{article.excerpt}</p>
                    <p className="text-[#4ade80] text-xs mt-3">Read article →</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Still need help?</h3>
          <p className="text-gray-400 mb-6">Our AI assistant can answer questions instantly, or email us directly.</p>
          <div className="flex gap-4 justify-center">
            <a href="mailto:support@aipaymentproxy.com" className="border border-gray-700 text-white px-6 py-3 rounded-lg hover:border-gray-500 transition-colors text-sm">
              Email Support
            </a>
            <a href="/docs" className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#22c55e] transition-colors text-sm">
              API Documentation
            </a>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
        &copy; 2026 AI Payment Proxy. Built for the agentic era.
      </footer>
    </div>
  );
}
