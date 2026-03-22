import { createClient } from "@/lib/supabase/server";
import BlogDropdown from "../../components/BlogDropdown";
import { notFound } from "next/navigation";

export const revalidate = 3600;

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-white mt-12 mb-4">{line.replace("## ", "")}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.replace("### ", "")}</h3>);
    } else if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-[#0a0f1e] border border-gray-800 rounded-xl p-5 my-6 overflow-x-auto text-sm text-[#4ade80] font-mono leading-relaxed whitespace-pre">
          {codeLines.join("\n")}
        </pre>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace("- ", ""));
        i++;
      }
      elements.push(
        <ul key={i} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-gray-300">
              <span className="text-[#4ade80] mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<p key={i} className="text-white font-semibold mt-6 mb-2">{line.replace(/\*\*/g, "")}</p>);
    } else if (line.trim() === "") {
      // skip
    } else {
      elements.push(<p key={i} className="text-gray-300 leading-relaxed my-4">{line}</p>);
    }
    i++;
  }
  return elements;
}

const IMAGES = [
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
];

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const imgIndex = post.title.length % IMAGES.length;

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
          <a href="/docs"    className="text-gray-400 hover:text-white text-sm transition-colors">Docs</a>
          <a href="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a>
          <a href="/blog"    className="text-white text-sm font-medium">Blog</a>
          <a href="/login"   className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</a>
          <a href="/signup"  className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e] transition-colors">Get API Key</a>
        </div>
      </nav>

      <div className="w-full h-80 overflow-hidden">
        <img src={IMAGES[imgIndex]} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <a href="/blog" className="text-gray-500 hover:text-white text-sm transition-colors mb-8 inline-block">← Back to blog</a>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs font-bold px-3 py-1 rounded-full">{post.tag}</span>
          <span className="text-gray-500 text-sm">
            {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-12 leading-tight">{post.title}</h1>
        <div>{renderContent(post.content)}</div>

        <div className="mt-16 p-8 bg-[#111827] border border-[#4ade80]/20 rounded-2xl text-center">
          <h3 className="text-xl font-bold mb-2">Ready to give your AI agent a card?</h3>
          <p className="text-gray-400 mb-6">Get your API key and make your first card creation call in minutes.</p>
          <a href="/signup" className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#22c55e] transition-colors inline-block">
            Get API Key — Free 14-day trial
          </a>
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
            <BlogDropdown />
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