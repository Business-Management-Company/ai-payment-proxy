import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const BLOG_PROMPT = `You are a technical content writer for AI Payment Proxy (aipaymentproxy.com) — a SaaS platform that gives AI agents single-use virtual Visa cards with hard spending limits via a simple REST API. Developers use it to give Claude, ChatGPT, n8n, LangChain and other AI agents the ability to make real purchases safely.

Write 2 SEO-optimized blog posts for developers building AI agents. Each post should be 600-900 words.

Today's topic angles to choose from (pick the 2 most timely):
- How to give Claude/ChatGPT/any AI agent a credit card safely
- Virtual cards vs giving an AI your real credit card number
- How to set hard spending limits on AI agent purchases
- n8n + virtual cards: automate purchases without exposing your card
- LangChain payment tools: wiring up card creation in an agent
- Why your AI agent keeps failing at checkout (the payment problem)
- Agentic commerce is a $1 trillion market — here is the missing piece
- How to build a food delivery AI agent that actually pays for orders
- AI agents and cloud costs: using virtual cards to cap API spend
- The DoorDash problem: how AI agents overspend without spending limits
- 5 things you can automate today with an AI agent and a virtual card
- OpenAI Operator vs building your own agent: the payment gap
- How Visa and Mastercard agentic commerce compares to virtual cards
- Why enterprise AI agents cannot make purchases yet (and what developers can do now)

ALWAYS include at least one real code example using our API:
POST https://aipaymentproxy.com/api/v1/cards
Header: Authorization: Bearer YOUR_API_KEY
Body: {"label":"Shopping Agent","limit_usd":50}

GET https://aipaymentproxy.com/api/v1/cards/CARD_ID
DELETE https://aipaymentproxy.com/api/v1/cards/CARD_ID

TONE: Technical but accessible. Written by a developer for developers. No fluff. Honest. Real code. Real numbers.

Return your response as a valid JSON array with exactly 2 objects. No markdown, no backticks, just raw JSON:
[
  {
    "slug": "url-friendly-slug-here",
    "title": "Full SEO Title Here",
    "meta_description": "Under 155 characters",
    "tag": "Guide",
    "source_inspiration": "What real developer pain point inspired this",
    "content": "Full article content here, 600-900 words, with code examples using backtick code blocks"
  },
  {
    "slug": "second-post-slug",
    "title": "Second Post Title",
    "meta_description": "Under 155 characters",
    "tag": "Tutorial",
    "source_inspiration": "Pain point",
    "content": "Full article content here"
  }
]`;

export async function GET(request: NextRequest) {
  try {
    // Verify this is called by Vercel cron or by you manually
    const authHeader = request.headers.get("authorization");
    const cronHeader = request.headers.get("x-vercel-cron");
    if (!cronHeader && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: BLOG_PROMPT }],
      }),
    });

    const aiData = await response.json();
    const rawText = aiData.content?.[0]?.text || "";

    // Parse the JSON response
    let posts: any[] = [];
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      posts = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: rawText.slice(0, 500) },
        { status: 500 }
      );
    }

    // Save to Supabase
    const supabase = createClient();
    const results = [];

    for (const post of posts) {
      // Make slug unique if it already exists
      const slug = post.slug + "-" + new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          slug,
          title:              post.title,
          meta_description:   post.meta_description,
          tag:                post.tag || "Guide",
          content:            post.content,
          source_inspiration: post.source_inspiration,
          published:          true,
        })
        .select()
        .single();

      if (error) {
        results.push({ slug, error: error.message });
      } else {
        results.push({ slug, title: post.title, status: "published" });
      }
    }

    return NextResponse.json({
      success: true,
      generated: results.length,
      posts: results,
      timestamp: new Date().toISOString(),
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}