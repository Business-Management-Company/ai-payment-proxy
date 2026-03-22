import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
];

export const revalidate = 3600;

export default async function BlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, meta_description, tag, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    >
      <nav className="sticky top-0 z-50 border-b border-gray-800 px-8 py-5 flex justify-between items-center bg-[#0a0f1e]/90 backdrop-blur-sm">
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#4ade80] text-xl">⚡</span>
          <span>AI Payment Proxy</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="/docs"       className="text-gray-400 hover:text-white text-sm transition-colors">Docs</a>
          <a href="/pricing"    className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a>
          <a href="/blog"       className="text-white text-sm font-medium">Blog</a>
          <a href="/login"      className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</a>
          <a href="/signup"     className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e] transition-colors">Get API Key</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-gray-400 text-lg">Technical guides and deep dives on AI agent payments.</p>
        </div>
        <div className="space-y-8">
          {(posts || []).map((post, i) => (
            <Link
              key={post.slug}
              href={"/blog/" + post.slug}
              className="block bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-colors group"
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs font-bold px-3 py-1 rounded-full">{post.tag}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-[#4ade80] transition-colors">{post.title}</h2>
                <p className="text-gray-400 leading-relaxed">{post.meta_description}</p>
                <div className="mt-4 text-[#4ade80] text-sm font-medium">Read article →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-gray-800 bg-[#0a0f1e]">
        <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-4 gap-12">
          <div className="col-span-1">
            <a href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <span className="text-[#4ade80]">⚡</span>
              <span>AI Payment Proxy</span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed">Single-use virtual Visa cards for autonomous AI agents.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <div className="space-y-3">
              <a href="/docs"       className="block text-gray-500 hover:text-white text-sm transition-colors">Docs</a>
              <a href="/pricing"    className="block text-gray-500 hover:text-white text-sm transition-colors">Pricing</a>
              <a href="/#use-cases" className="block text-gray-500 hover:text-white text-sm transition-colors">Use Cases</a>
              <a href="/signup"     className="block text-gray-500 hover:text-white text-sm transition-colors">Get API Key</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <div className="space-y-3">
              <a href="/blog"           className="block text-gray-500 hover:text-white text-sm transition-colors">Blog</a>
              <a href="/integrations"   className="block text-gray-500 hover:text-white text-sm transition-colors">Integrations</a>
              <a href="/docs"           className="block text-gray-500 hover:text-white text-sm transition-colors">API Docs</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
            <div className="space-y-3">
              <a href="/login"   className="block text-gray-500 hover:text-white text-sm transition-colors">Sign In</a>
              <a href="/signup"  className="block text-gray-500 hover:text-white text-sm transition-colors">Sign Up</a>
              <a href="/privacy" className="block text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="/terms"   className="block text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
          &copy; 2026 AI Payment Proxy. Built for the agentic era.
        </div>
      </footer>
    </div>
  );
}