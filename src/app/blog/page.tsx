import Link from "next/link";

const posts = [
  {
    slug: "how-to-give-ai-agent-credit-card",
    title: "How to Give Your AI Agent a Credit Card",
    desc: "A practical guide to enabling autonomous AI purchasing with virtual cards, spending limits, and the API calls that make it work.",
    date: "March 22, 2026",
    readTime: "6 min read",
    tag: "Guide",
  },
  {
    slug: "virtual-cards-autonomous-ai-agents",
    title: "Virtual Cards for Autonomous AI Agents",
    desc: "Why single-use virtual cards are the only safe way to give an AI agent payment capability — and how the infrastructure works under the hood.",
    date: "March 22, 2026",
    readTime: "7 min read",
    tag: "Deep Dive",
  },
  {
    slug: "ai-agent-payment-infrastructure-explained",
    title: "AI Agent Payment Infrastructure Explained",
    desc: "The full stack behind secure AI payments: Stripe Issuing, API key auth, spend controls, and why this problem is harder than it looks.",
    date: "March 22, 2026",
    readTime: "8 min read",
    tag: "Technical",
  },
];

export default function BlogPage() {
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
          <a href="/blog"       className="text-white text-sm">Blog</a>
          <a href="/login"      className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</a>
          <a href="/signup"     className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e] transition-colors">Get API Key</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-gray-400 text-lg">Technical guides and deep dives on AI agent payments.</p>
        </div>
        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={"/blog/" + post.slug}
              className="block bg-[#111827] border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs font-bold px-3 py-1 rounded-full">{post.tag}</span>
                <span className="text-gray-500 text-sm">{post.date}</span>
                <span className="text-gray-600 text-sm">·</span>
                <span className="text-gray-500 text-sm">{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold mb-3 group-hover:text-[#4ade80] transition-colors">{post.title}</h2>
              <p className="text-gray-400 leading-relaxed">{post.desc}</p>
              <div className="mt-4 text-[#4ade80] text-sm font-medium">Read article →</div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="text-center text-gray-600 pb-8 text-sm">
        &copy; 2026 AI Payment Proxy. Built for the agentic era.
      </footer>
    </div>
  );
}