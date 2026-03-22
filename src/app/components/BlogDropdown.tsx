"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Post {
  slug: string;
  title: string;
  created_at: string;
}

export default function BlogDropdown() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("blog_posts")
      .select("slug, title, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setPosts(data || []));
  }, []);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-white font-semibold text-sm mb-4 hover:text-[#4ade80] transition-colors"
      >
        Resources
        <span className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {!open && (
        <div className="space-y-3">
          <a href="/blog" className="block text-gray-500 hover:text-white text-sm transition-colors">Blog</a>
          <a href="/integrations" className="block text-gray-500 hover:text-white text-sm transition-colors">Integrations</a>
          <a href="/docs" className="block text-gray-500 hover:text-white text-sm transition-colors">API Docs</a>
        </div>
      )}

      {open && (
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          <a href="/blog" className="block text-[#4ade80] text-xs font-semibold mb-2 hover:underline">← All posts</a>
          {posts.map(post => (
            <a key={post.slug} href={"/blog/" + post.slug} className="block py-2 border-b border-gray-800/50 last:border-0 hover:bg-[#1a2235] rounded px-2 transition-colors group">
              <p className="text-gray-300 text-xs leading-snug group-hover:text-white transition-colors line-clamp-2">{post.title}</p>
              <p className="text-gray-600 text-xs mt-0.5">{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            </a>
          ))}
          {posts.length === 0 && <p className="text-gray-600 text-xs">Loading posts...</p>}
        </div>
      )}
    </div>
  );
}
