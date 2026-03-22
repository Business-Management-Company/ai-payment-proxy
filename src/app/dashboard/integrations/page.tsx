"use client";
import { useState } from "react";

const integrations = [
  {
    id: "telegram",
    name: "Telegram Bot",
    icon: "✈️",
    status: "live",
    desc: "Create virtual cards instantly via Telegram. No code required.",
    action: "Open Bot",
    actionUrl: "https://t.me/AIpaymentproxybot",
    instructions: [
      "Open @AIpaymentproxybot on Telegram",
      "Type /start",
      "Paste your API key when prompted",
      "Type /newcard to create your first card",
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT / GPT Actions",
    icon: "💬",
    status: "available",
    desc: "Add AI Payment Proxy as a GPT Action in any custom GPT.",
    action: "Copy Schema",
    actionUrl: null,
    instructions: [
      "Go to chat.openai.com and create a custom GPT",
      "Click Configure → Add actions",
      "Paste the OpenAPI schema below",
      "Add your API key as Bearer token in authentication",
    ],
    code: `openapi: 3.0.0
info:
  title: AI Payment Proxy
  version: 1.0.0
servers:
  - url: https://aipaymentproxy.com
paths:
  /api/v1/cards:
    post:
      operationId: createCard
      summary: Create a virtual card
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [limit_usd]
              properties:
                label:
                  type: string
                limit_usd:
                  type: number
      responses:
        '200':
          description: Card created
    get:
      operationId: listCards
      summary: List all cards
      responses:
        '200':
          description: List of cards
  /api/v1/cards/{id}:
    get:
      operationId: revealCard
      summary: Reveal card credentials
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Card credentials
    delete:
      operationId: cancelCard
      summary: Cancel a card
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Canceled`,
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    icon: "🤖",
    status: "available",
    desc: "Give Claude tool use access to create and manage virtual cards.",
    action: "Copy Prompt",
    actionUrl: null,
    instructions: [
      "Copy the system prompt below",
      "Add it to your Claude API call or Project",
      "Claude will use create_card, reveal_card, and cancel_card tools automatically",
    ],
    code: `You have access to AI Payment Proxy — a virtual card API.
Use these tools when the user asks to buy something:

1. create_card(label, limit_usd) — POST https://aipaymentproxy.com/api/v1/cards
2. reveal_card(card_id) — GET https://aipaymentproxy.com/api/v1/cards/{id}  
3. cancel_card(card_id) — DELETE https://aipaymentproxy.com/api/v1/cards/{id}

Auth header: Authorization: Bearer YOUR_API_KEY

Flow: create card → reveal credentials → complete purchase → cancel card.
Always cancel after use. Never store card numbers.`,
  },
  {
    id: "n8n",
    name: "n8n",
    icon: "🔄",
    status: "available",
    desc: "Wire card creation into any n8n workflow with HTTP Request nodes.",
    action: "View Docs",
    actionUrl: "/integrations",
    instructions: [
      "Add an HTTP Request node to your workflow",
      "Method: POST, URL: https://aipaymentproxy.com/api/v1/cards",
      "Header: Authorization: Bearer YOUR_API_KEY",
      "Body: { label: '...', limit_usd: 50 }",
    ],
  },
  {
    id: "zapier",
    name: "Zapier",
    icon: "⚡",
    status: "coming_soon",
    desc: "Connect AI Payment Proxy to 7,000+ apps via Zapier.",
    action: null,
    actionUrl: null,
    instructions: [],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: "💬",
    status: "coming_soon",
    desc: "Create cards via WhatsApp messages — coming soon.",
    action: null,
    actionUrl: null,
    instructions: [],
  },
];

const statusStyles: Record<string, string> = {
  live:        "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20",
  available:   "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  coming_soon: "bg-gray-800 text-gray-500 border border-gray-700",
};

const statusLabels: Record<string, string> = {
  live:        "Live",
  available:   "Available",
  coming_soon: "Coming Soon",
};

export default function DashboardIntegrationsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>("telegram");

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-white text-2xl font-bold">Integrations</h2>
          <p className="text-gray-400 text-sm mt-1">Connect AI Payment Proxy to your favorite tools and AI workflows.</p>
        </div>
      </div>

      <div className="space-y-4">
        {integrations.map((integ) => (
          <div
            key={integ.id}
            className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpanded(expanded === integ.id ? null : integ.id)}
              className="w-full p-6 flex items-start gap-4 text-left hover:bg-[#1a2235]/40 transition-colors"
            >
              <span className="text-3xl shrink-0">{integ.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">{integ.name}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusStyles[integ.status] || statusStyles.available}`}>
                    {statusLabels[integ.status] || integ.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{integ.desc}</p>
              </div>
              <span className="text-gray-500 text-sm shrink-0">{expanded === integ.id ? "▲" : "▼"}</span>
            </button>

            {expanded === integ.id && (
              <div className="px-6 pb-6 pt-0 border-t border-gray-800 space-y-4">
                {integ.instructions.length > 0 && (
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                    {integ.instructions.map((step, i) => (
                      <li key={i} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                )}

                {integ.status === "coming_soon" && integ.instructions.length === 0 && (
                  <p className="text-gray-500 text-sm">We&apos;ll announce when this integration is ready.</p>
                )}

                {"code" in integ && integ.code && (
                  <pre className="bg-[#0a0f1e] border border-gray-800 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {integ.code}
                  </pre>
                )}

                <div className="flex flex-wrap gap-2">
                  {integ.action && integ.actionUrl?.startsWith("http") && (
                    <a
                      href={integ.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-[#4ade80] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] transition-colors"
                    >
                      {integ.action}
                    </a>
                  )}
                  {integ.action && integ.actionUrl && integ.actionUrl.startsWith("/") && (
                    <a
                      href={integ.actionUrl}
                      className="inline-flex items-center justify-center bg-[#4ade80] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] transition-colors"
                    >
                      {integ.action}
                    </a>
                  )}
                  {integ.action && !integ.actionUrl && "code" in integ && integ.code && (
                    <button
                      type="button"
                      onClick={() => copy(integ.code!, integ.id)}
                      className="inline-flex items-center justify-center bg-[#4ade80] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] transition-colors"
                    >
                      {copied === integ.id ? "Copied!" : integ.action}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
