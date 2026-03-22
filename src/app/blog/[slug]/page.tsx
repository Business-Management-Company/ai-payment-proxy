import { notFound } from "next/navigation";

const posts: Record<string, {
  title: string;
  date: string;
  readTime: string;
  tag: string;
  content: string;
}> = {
  "how-to-give-ai-agent-credit-card": {
    title: "How to Give Your AI Agent a Credit Card",
    date: "March 22, 2026",
    readTime: "6 min read",
    tag: "Guide",
    content: `
AI agents are getting remarkably capable. They can browse the web, fill out forms, interact with APIs, and increasingly — make purchases on your behalf. The problem is payment infrastructure hasn't caught up.

If you give an AI agent your real credit card number, you have no spending controls. The card can be used at any merchant, for any amount, at any time. That's not a security model — that's a liability.

## The Right Architecture

The correct approach is to issue a fresh virtual card for every individual purchase your agent needs to make. Each card has:

- A hard spending limit set before the card is created
- An optional merchant category restriction
- Auto-cancellation after use

This means your real payment credentials never leave your control, and every AI purchase is bounded by explicit, pre-approved limits.

## The 3-Step API Flow

Here's exactly how to implement this in your AI agent:

**Step 1: Create a card**

When your agent decides it needs to make a purchase, it calls the AI Payment Proxy API to issue a card:

\`\`\`bash
curl -X POST https://aipaymentproxy.com/api/v1/cards \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"label":"DoorDash order","limit_usd":25}'
\`\`\`

This returns a card ID. The card is immediately active but the number hasn't been revealed yet — it can't be used until your agent explicitly requests the credentials.

**Step 2: Reveal the card number**

\`\`\`bash
curl https://aipaymentproxy.com/api/v1/cards/CARD_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

This returns the full card number, CVV, and expiry. Your agent uses these at checkout exactly as a human would type a credit card.

**Step 3: Cancel after use**

\`\`\`bash
curl -X DELETE https://aipaymentproxy.com/api/v1/cards/CARD_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

Once the purchase is complete, cancel the card. Even if you forget, the card's spending limit means it can't be used for anything beyond what you approved.

## Integrating with Claude or GPT-4

In practice, you give your AI agent access to three tools: \`create_card\`, \`get_card\`, and \`cancel_card\`. Each maps directly to the API calls above. Your agent prompt looks something like this:

> "You have access to a payment tool. When the user asks you to buy something, use create_card with the exact amount, reveal the card credentials, complete the purchase, then cancel the card."

The agent handles the rest autonomously — no human in the loop required.

## What About Funding?

You pre-load funds into your AI Payment Proxy account via bank transfer or card. When your agent creates a virtual card, that amount is reserved from your balance. If the card is never used or canceled, the funds return to your balance automatically.

This prepaid model means there's a hard ceiling on total AI spend — your agents can never spend more than you've deposited.

## Getting Started

Sign up at aipaymentproxy.com, grab your API key from the dashboard, and make your first card creation call. The whole integration takes under an hour for a working prototype.
    `,
  },
  "virtual-cards-autonomous-ai-agents": {
    title: "Virtual Cards for Autonomous AI Agents",
    date: "March 22, 2026",
    readTime: "7 min read",
    tag: "Deep Dive",
    content: `
The rise of autonomous AI agents — systems that take actions in the world on your behalf — creates a new category of infrastructure problem: payments.

A human uses a credit card. An AI agent needs to use one too. But the security model is completely different.

## Why You Can't Just Give an AI Your Credit Card

When a human uses a credit card, there's an implicit risk model: humans understand consequences, have legal liability, and make contextual judgments about spending. A human won't accidentally spend $50,000 because a prompt was ambiguous.

AI agents don't have those properties. They execute instructions literally. An agent told to "buy the best available option" might interpret that as the most expensive one. An agent with a stored card number and no spending limit is a financial liability waiting to happen.

## The Virtual Card Solution

Single-use virtual cards solve this by making every AI purchase explicitly authorized before it happens. The flow works like this:

1. Your agent decides a purchase is needed
2. It calls an API to create a card with a specific dollar limit
3. The card exists only for that transaction
4. After use, the card is canceled and can never be charged again

The key insight is that **authorization happens at card creation, not at purchase time**. By the time the card number reaches the checkout form, the spending limit is already baked in at the infrastructure level. Stripe enforces it — not your application code.

## Merchant Category Controls

Beyond dollar limits, you can restrict cards to specific merchant category codes (MCCs). This means:

- A food delivery agent can only charge food merchants
- A cloud infrastructure agent can only charge cloud providers
- An advertising agent can only charge ad platforms

Even if an agent is compromised or makes an error, it literally cannot use a restricted card outside its approved category.

## The Ephemeral Credentials Pattern

There's an important security pattern in how card numbers should be handled: treat them as ephemeral secrets.

Your agent should:
1. Request the card number immediately before use
2. Use it once at checkout
3. Never store it anywhere
4. Cancel the card immediately after

This is fundamentally different from how humans store credit cards in browsers and apps. Ephemeral credentials mean there's nothing to steal — the card number that existed 60 seconds ago is already canceled.

## Real-World Use Cases

**Autonomous shopping agents** — tell your AI to restock office supplies when inventory drops below a threshold. It monitors, decides, creates a card, orders, and cancels. No human needed.

**API cost management** — give your AI infrastructure agent a $200 card for cloud spend. When it hits the limit, spend stops automatically. No surprise bills.

**Travel booking** — an AI travel agent that books flights and hotels within a per-trip budget. Each booking gets its own card with the exact authorized amount.

**Contractor payments** — automatically pay freelancers upon task completion with single-use cards scoped to the exact invoice amount.

## Infrastructure Requirements

To build this properly you need: a card issuing API (we use Stripe Issuing), a customer authentication layer, per-customer balance management, and webhook handling for spend events.

That's what AI Payment Proxy provides as a managed service — so you can skip building the infrastructure and focus on your agent.
    `,
  },
  "ai-agent-payment-infrastructure-explained": {
    title: "AI Agent Payment Infrastructure Explained",
    date: "March 22, 2026",
    readTime: "8 min read",
    tag: "Technical",
    content: `
Building payment infrastructure for AI agents is harder than it looks. This post covers the full technical stack — from card issuance to spend controls to webhook handling — so you understand what's actually happening when your agent makes a purchase.

## The Core Problem

Standard payment APIs are built for humans. Stripe, Braintree, Adyen — they all assume a human is filling out a checkout form with a stored card. AI agents need the inverse: programmatic card creation, not programmatic card storage.

The right primitive is **card issuance**, not payment processing. You want to create cards on demand, not charge existing ones.

## Stripe Issuing

The infrastructure layer that makes this possible is Stripe Issuing — Stripe's API for creating virtual and physical Visa/Mastercard cards. It's the same infrastructure that powers corporate card programs like Brex and Ramp.

Key concepts:

**Cardholder** — a named entity (person or business) that cards are issued to. You create one cardholder per customer.

**Card** — a virtual card associated with a cardholder. Has a spending limit, optional merchant restrictions, and a status (active/canceled).

**Authorization** — when a card is used, Stripe fires an authorization webhook to your server. You can approve or decline in real time based on your own logic.

**Transaction** — a completed charge against a card. Stored in Stripe and available via API.

## The API Authentication Layer

Stripe Issuing gives you the card infrastructure. You still need to build an authentication layer so your customers' AI agents can access it safely.

The pattern we use:

1. Each customer gets a unique API key (format: \`aipp_live_...\`)
2. API keys are stored as SHA-256 hashes — we never store the raw key
3. Every card API call validates the key hash against the database
4. Cards are scoped to the customer — an agent can only see and use its own cards

This means even if an API key is leaked, it can only access cards for that one customer, and each card already has a hard spending limit.

## Balance Management

There are two funding models for AI agent payments:

**Prepaid** — customers deposit funds upfront. When a card is created, the limit amount is reserved from their balance. If the card is unused and canceled, the reservation releases.

**Connected bank** — customers link a bank account via ACH. When a card is created, an ACH pull fires for the card amount. Funds arrive in 2-3 business days.

The prepaid model is simpler and gives harder guarantees — agents can never spend more than the deposited balance. The connected model is more flexible but introduces settlement delay.

## Webhook Architecture

Payments are inherently async. You need webhooks to handle events:

**checkout.session.completed** — fires when a customer deposits funds. Update their balance.

**payment_intent.succeeded** — fires when ACH clears. Move funds from pending to available balance.

**customer.subscription.created/updated** — fires when subscription status changes. Update plan status.

**invoice.payment_failed** — fires when monthly billing fails. Downgrade or restrict account.

**issuing_authorization.created** — fires in real time when a card is used. You can approve or decline programmatically here.

The last one is powerful — it means you can add custom logic like "decline if merchant name doesn't match the card label" or "decline if spend velocity is too high."

## The Subscription Layer

On top of card infrastructure, a production AI payment service needs a subscription billing layer. Customers pay monthly for access (card quota, API rate limits, support tier) and per-card fees for usage beyond their plan limit.

We use Stripe Billing for this — separate from Stripe Issuing. One Stripe account, two products: Issuing for the virtual cards, Billing for the SaaS subscription.

## What You'd Need to Build This Yourself

- Stripe Issuing account (requires business verification)
- Cardholder creation endpoint
- Card create/reveal/cancel endpoints
- API key generation and hashing system
- Balance management (deposits, reservations, releases)
- Webhook handler for all relevant events
- Subscription billing with Stripe Billing
- Customer dashboard to monitor spend

That's roughly 3-4 weeks of engineering for a solid v1.

AI Payment Proxy provides all of this as a managed API — you get your API key, make card creation calls, and we handle everything underneath.
    `,
  },
};

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-white mt-12 mb-4">{line.replace("## ", "")}</h2>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="text-white font-semibold mt-6 mb-2">{line.replace(/\*\*/g, "")}</p>
      );
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
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} className="text-gray-300 leading-relaxed my-4">{line}</p>
      );
    }
    i++;
  }
  return elements;
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) notFound();

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
          <a href="/blog"    className="text-white text-sm">Blog</a>
          <a href="/login"   className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</a>
          <a href="/signup"  className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e] transition-colors">Get API Key</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-20">
        <a href="/blog" className="text-gray-500 hover:text-white text-sm transition-colors mb-8 inline-block">← Back to blog</a>

        <div className="flex items-center gap-3 mb-6">
          <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs font-bold px-3 py-1 rounded-full">{post.tag}</span>
          <span className="text-gray-500 text-sm">{post.date}</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-500 text-sm">{post.readTime}</span>
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

      <footer className="text-center text-gray-600 pb-8 text-sm">
        &copy; 2026 AI Payment Proxy. Built for the agentic era.
      </footer>
    </div>
  );
}