import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const revalidate = 3600;

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{line.replace("## ", "")}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-bold text-white mt-6 mb-3">{line.replace("### ", "")}</h3>);
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace("- ", ""));
        i++;
      }
      elements.push(
        <ul key={i} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-gray-300 text-sm">
              <span className="text-[#4ade80] mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="my-4 space-y-2 list-none">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 text-gray-300 text-sm">
              <span className="text-[#4ade80] font-bold shrink-0 w-5">{j + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (line.trim().startsWith("curl") || line.trim().startsWith("{") || line.trim().startsWith("Authorization")) {
      const codeLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "") {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-[#0a0f1e] border border-gray-800 rounded-xl p-5 my-6 overflow-x-auto text-sm text-[#4ade80] font-mono leading-relaxed whitespace-pre">
          {codeLines.join("\n")}
        </pre>
      );
      continue;
    } else if (line.trim() === "") {
      // skip
    } else {
      elements.push(<p key={i} className="text-gray-300 leading-relaxed my-3 text-sm">{line}</p>);
    }
    i++;
  }
  return elements;
}

export default async function KBArticle({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: article } = await supabase
    .from("kb_articles")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!article) notFound();

  const { data: related } = await supabase
    .from("kb_articles")
    .select("slug, title, category")
    .eq("category", article.category)
    .eq("published", true)
    .neq("slug", params.slug)
    .limit(3);

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
          <a href="/blog"         className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a>
          <a href="/kb"           className="text-white text-sm font-medium">Help</a>
          <a href="/login"        className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</a>
          <a href="/signup"       className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e] transition-colors">Get API Key</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16 flex gap-12">
        <div className="flex-1 min-w-0">
          <a href="/kb" className="text-gray-500 hover:text-white text-sm transition-colors mb-6 inline-block">← Back to Help Center</a>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs font-bold px-3 py-1 rounded-full">{article.category}</span>
            <span className="text-gray-500 text-xs">
              Updated {new Date(article.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-8">{article.title}</h1>
          <div>{renderContent(article.content as string)}</div>

          <div className="mt-12 p-6 bg-[#111827] border border-gray-800 rounded-xl">
            <p className="text-white font-semibold mb-2">Was this article helpful?</p>
            <div className="flex gap-3">
              <button type="button" className="bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20 px-4 py-2 rounded-lg text-sm hover:bg-[#4ade80]/20 transition-colors">
                👍 Yes, helpful
              </button>
              <button type="button" className="bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                👎 Not helpful
              </button>
            </div>
          </div>
        </div>

        <div className="w-56 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Related Articles</p>
            <div className="space-y-3">
              {(related || []).map((r) => (
                <a key={r.slug} href={"/kb/" + r.slug} className="block text-gray-400 hover:text-white text-sm transition-colors leading-snug">
                  {r.title}
                </a>
              ))}
            </div>
            <div className="mt-8 p-4 bg-[#111827] border border-gray-800 rounded-xl">
              <p className="text-xs font-semibold text-gray-400 mb-2">Need more help?</p>
              <a href="mailto:support@aipaymentproxy.com" className="text-[#4ade80] text-xs hover:underline block mb-2">Email support →</a>
              <a href="/docs" className="text-[#4ade80] text-xs hover:underline block">API docs →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
