"use client";
import { useState } from "react";

const integrations = [
  {
    id: "telegram",
    bg: "bg-[#229ED9]",
    letter: "T",
    name: "Telegram Bot",
    badge: "Live Now",
    badgeColor: "bg-[#4ade80]/10 text-[#4ade80]",
    desc: "No code required. Connect your API key and create cards via chat.",
    steps: [
      "Open Telegram and search @AIpaymentproxybot",
      "Type /start",
      "Paste your API key when prompted",
      "Type /newcard to create your first card",
    ],
    action: { label: "Open Bot", href: "https://t.me/AIpaymentproxybot" },
    code: null as string | null,
  },
  {
    id: "claude",
    bg: "bg-[#CC785C]",
    letter: "C",
    name: "Claude (Anthropic)",
    badge: "Available",
    badgeColor: "bg-blue-500/10 text-blue-400",
    desc: "Give Claude tool use access to create and manage virtual cards autonomously.",
    steps: [
      "Copy your API key from the API Keys page",
      "Add the system prompt below to your Claude Project or API call",
      "Claude will automatically use create_card, reveal_card, and cancel_card tools",
      "Test by asking Claude to buy something",
    ],
    action: null,
    code: `You have access to AI Payment Proxy for making purchases.

Tools:
- create_card(label, limit_usd) → POST https://aipaymentproxy.com/api/v1/cards
- reveal_card(card_id) → GET https://aipaymentproxy.com/api/v1/cards/{id}
- cancel_card(card_id) → DELETE https://aipaymentproxy.com/api/v1/cards/{id}

Auth: Authorization: Bearer YOUR_API_KEY

Always: create → reveal → purchase → cancel. Never store card numbers.`,
  },
  {
    id: "chatgpt",
    bg: "bg-[#10a37f]",
    letter: "G",
    name: "ChatGPT / GPT Actions",
    badge: "Available",
    badgeColor: "bg-blue-500/10 text-blue-400",
    desc: "Add AI Payment Proxy as a GPT Action in any custom GPT.",
    steps: [
      "Go to chat.openai.com → Explore GPTs → Create",
      "Click Configure → Add actions",
      "Paste the OpenAPI schema below",
      "Set authentication to Bearer token and paste your API key",
    ],
    action: null,
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
  /api/v1/cards/{id}:
    get:
      operationId: revealCard
      summary: Get card credentials
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
    id: "n8n",
    bg: "bg-[#EA4B71]",
    letter: "n",
    name: "n8n",
    badge: "Available",
    badgeColor: "bg-blue-500/10 text-blue-400",
    desc: "Wire card creation into any n8n workflow using HTTP Request nodes.",
    steps: [
      "Add an HTTP Request node to your workflow",
      "Set Method: POST, URL: https://aipaymentproxy.com/api/v1/cards",
      "Add header: Authorization: Bearer YOUR_API_KEY",
      "Set body to JSON: { label: '...', limit_usd: 50 }",
    ],
    action: null,
    code: `// HTTP Request node — Create card
Method: POST
URL: https://aipaymentproxy.com/api/v1/cards
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json
Body:
  { "label": "{{ $json.label }}", "limit_usd": {{ $json.amount }} }`,
  },
  {
    id: "zapier",
    bg: "bg-[#FF4A00]",
    letter: "Z",
    name: "Zapier",
    badge: "Coming Soon",
    badgeColor: "bg-gray-800 text-gray-500",
    desc: "Connect AI Payment Proxy to 7,000+ apps. Notify us to get early access.",
    steps: [
      "Coming soon — native Zapier integration in development",
      "In the meantime use Zapier's Webhooks by Zapier action",
      "Point it to https://aipaymentproxy.com/api/v1/cards",
      "Add your API key as a Bearer token header",
    ],
    action: { label: "Get Notified", href: "mailto:hello@aipaymentproxy.com?subject=Zapier Integration" },
    code: null as string | null,
  },
  {
    id: "whatsapp",
    bg: "bg-[#25D366]",
    letter: "W",
    name: "WhatsApp Business",
    badge: "Coming Soon",
    badgeColor: "bg-gray-800 text-gray-500",
    desc: "Create cards via WhatsApp messages. Coming soon.",
    steps: [
      "Coming soon — WhatsApp Business API integration in development",
      "Will support the same flow as the Telegram bot",
      "Contact us to get on the early access list",
    ],
    action: { label: "Get Early Access", href: "mailto:hello@aipaymentproxy.com?subject=WhatsApp Integration" },
    code: null as string | null,
  },
];

export default function DashboardIntegrationsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white text-2xl font-bold">Integrations</h2>
        <p className="text-gray-400 text-sm mt-1">Connect AI Payment Proxy to your favorite tools</p>
      </div>

      <div className="space-y-3">
        {integrations.map((integ) => (
          <div key={integ.id} className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(expanded === integ.id ? null : integ.id)}
              className="w-full flex items-center justify-between gap-4 p-5 hover:bg-[#1a2235] transition-colors text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={"w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0 " + integ.bg}>
                  {integ.letter}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-white font-semibold">{integ.name}</span>
                    <span className={"text-xs font-bold px-2 py-0.5 rounded-full " + integ.badgeColor}>{integ.badge}</span>
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-2">{integ.desc}</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm shrink-0">{expanded === integ.id ? "▲" : "▼"}</span>
            </button>

            {expanded === integ.id && (
              <div className="px-5 pb-5 pt-0 border-t border-gray-800 space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                  {integ.steps.map((step, i) => (
                    <li key={i} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>

                {integ.code && (
                  <div>
                    <pre className="bg-[#0a0f1e] border border-gray-800 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap">
                      {integ.code}
                    </pre>
                    <button
                      type="button"
                      onClick={() => copy(integ.code!, integ.id)}
                      className="mt-2 text-xs bg-[#4ade80] text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-[#22c55e] transition-colors"
                    >
                      {copied === integ.id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}

                {integ.action && (
                  <a
                    href={integ.action.href}
                    {...(integ.action.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-block bg-[#4ade80] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#22c55e] transition-colors"
                  >
                    {integ.action.label}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
