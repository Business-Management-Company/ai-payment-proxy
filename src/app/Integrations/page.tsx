import Link from "next/link";

const integrations = [
  {
    id: "claude",
    name: "Claude (Anthropic)",
    logo: "🤖",
    badge: "Recommended",
    badgeColor: "bg-[#4ade80]/10 text-[#4ade80]",
    desc: "Use Claude's native tool calling to give your AI agent full payment capability. Works with Claude 3.5 Sonnet, Opus, and any model that supports tools.",
    steps: [
      "Get your API key from aipaymentproxy.com/dashboard/api-keys",
      "Define the three payment tools in your Claude API call",
      "Add the system prompt telling Claude when to use them",
      "Claude handles create → reveal → purchase → cancel autonomously",
    ],
    code: `import anthropic

client = anthropic.Anthropic()

tools = [
  {
    "name": "create_payment_card",
    "description": "Create a single-use virtual Visa card with a spending limit",
    "input_schema": {
      "type": "object",
      "properties": {
        "label": {"type": "string", "description": "What the card is for"},
        "limit_usd": {"type": "number", "description": "Spending limit in USD"}
      },
      "required": ["limit_usd"]
    }
  },
  {
    "name": "reveal_card",
    "description": "Get card number, CVV and expiry to use at checkout ($0.50 fee)",
    "input_schema": {
      "type": "object",
      "properties": {
        "card_id": {"type": "string", "description": "Card ID from create_payment_card"}
      },
      "required": ["card_id"]
    }
  },
  {
    "name": "cancel_card",
    "description": "Cancel the card after purchase is complete",
    "input_schema": {
      "type": "object",
      "properties": {
        "card_id": {"type": "string", "description": "Card ID to cancel"}
      },
      "required": ["card_id"]
    }
  }
]

AIPP_API_KEY = "aipp_live_YOUR_KEY_HERE"

import requests

def handle_tool(name, inputs):
  headers = {"Authorization": f"Bearer {AIPP_API_KEY}", "Content-Type": "application/json"}
  if name == "create_payment_card":
    r = requests.post("https://aipaymentproxy.com/api/v1/cards", headers=headers, json=inputs)
    return r.json()
  if name == "reveal_card":
    r = requests.get(f"https://aipaymentproxy.com/api/v1/cards/{inputs['card_id']}", headers=headers)
    return r.json()
  if name == "cancel_card":
    r = requests.delete(f"https://aipaymentproxy.com/api/v1/cards/{inputs['card_id']}", headers=headers)
    return r.json()

response = client.messages.create(
  model="claude-opus-4-5",
  max_tokens=1024,
  tools=tools,
  system="You are a purchasing agent. When asked to buy something, use create_payment_card with the exact amount, then reveal_card to get credentials, complete the purchase, then cancel_card.",
  messages=[{"role": "user", "content": "Order me a burrito on DoorDash, keep it under $20"}]
)`,
  },
  {
    id: "chatgpt",
    name: "ChatGPT / OpenAI",
    logo: "💬",
    badge: "GPT Actions",
    badgeColor: "bg-blue-500/10 text-blue-400",
    desc: "Add AI Payment Proxy as a GPT Action in minutes. Paste the OpenAPI spec into the GPT builder and your custom GPT can issue cards instantly.",
    steps: [
      "Go to chat.openai.com → Explore GPTs → Create",
      "Click Configure → Add actions",
      "Paste the OpenAPI schema below",
      "Add your API key as a Bearer token in authentication",
    ],
    code: `openapi: 3.0.0
info:
  title: AI Payment Proxy
  version: 1.0.0
  description: Issue single-use virtual Visa cards for AI agent purchases
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
                  description: Human-readable label
                limit_usd:
                  type: integer
                  description: Spending limit in USD
      responses:
        '200':
          description: Card created successfully
    get:
      operationId: listCards
      summary: List all cards
      responses:
        '200':
          description: List of cards
  /api/v1/cards/{id}:
    get:
      operationId: revealCard
      summary: Reveal card number and CVV
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
          description: Card canceled`,
  },
  {
    id: "n8n",
    name: "n8n",
    logo: "🔄",
    badge: "No-code",
    badgeColor: "bg-purple-500/10 text-purple-400",
    desc: "Wire AI Payment Proxy into any n8n workflow using HTTP Request nodes. Trigger card creation from webhooks, schedules, Gmail, Slack, or any of n8n's 400+ integrations.",
    steps: [
      "Add an HTTP Request node to your workflow",
      "Set method to POST, URL to https://aipaymentproxy.com/api/v1/cards",
      "Add header: Authorization: Bearer YOUR_API_KEY",
      "Set body to JSON with label and limit_usd",
    ],
    code: `// n8n HTTP Request node settings
{
  "method": "POST",
  "url": "https://aipaymentproxy.com/api/v1/cards",
  "headers": {
    "Authorization": "Bearer aipp_live_YOUR_KEY_HERE",
    "Content-Type": "application/json"
  },
  "body": {
    "label": "{{ $json.purchase_description }}",
    "limit_usd": "{{ $json.amount }}"
  }
}

// Then chain a second HTTP Request node to reveal the card:
{
  "method": "GET",
  "url": "https://aipaymentproxy.com/api/v1/cards/{{ $json.data.id }}",
  "headers": {
    "Authorization": "Bearer aipp_live_YOUR_KEY_HERE"
  }
}

// Use the card credentials in downstream nodes (checkout automation, etc.)
// Finally cancel the card:
{
  "method": "DELETE",
  "url": "https://aipaymentproxy.com/api/v1/cards/{{ $json.data.id }}",
  "headers": {
    "Authorization": "Bearer aipp_live_YOUR_KEY_HERE"
  }
}`,
  },
  {
    id: "langchain",
    name: "LangChain",
    logo: "⛓️",
    badge: "Developer",
    badgeColor: "bg-amber-500/10 text-amber-400",
    desc: "Wrap the AI Payment Proxy API as a LangChain Tool and drop it into any agent executor, ReAct chain, or LangGraph workflow.",
    steps: [
      "Install the requests library if not already installed",
      "Define the three tools as LangChain Tool objects",
      "Pass them to your AgentExecutor",
      "The agent decides when to create, reveal, and cancel cards",
    ],
    code: `from langchain.tools import Tool
from langchain.agents import AgentExecutor, create_react_agent
from langchain_anthropic import ChatAnthropic
import requests

AIPP_KEY = "aipp_live_YOUR_KEY_HERE"
HEADERS = {"Authorization": f"Bearer {AIPP_KEY}", "Content-Type": "application/json"}

def create_card(input: str) -> str:
    """Input format: 'label,amount' e.g. 'Amazon order,50'"""
    parts = input.split(",")
    label = parts[0].strip()
    amount = int(parts[1].strip())
    r = requests.post("https://aipaymentproxy.com/api/v1/cards",
                      headers=HEADERS,
                      json={"label": label, "limit_usd": amount})
    return str(r.json())

def reveal_card(card_id: str) -> str:
    r = requests.get(f"https://aipaymentproxy.com/api/v1/cards/{card_id.strip()}",
                     headers=HEADERS)
    return str(r.json())

def cancel_card(card_id: str) -> str:
    r = requests.delete(f"https://aipaymentproxy.com/api/v1/cards/{card_id.strip()}",
                        headers=HEADERS)
    return str(r.json())

tools = [
    Tool(name="create_payment_card",
         func=create_card,
         description="Create a virtual card. Input: 'label,amount_usd'"),
    Tool(name="reveal_card",
         func=reveal_card,
         description="Get card number and CVV. Input: card_id string"),
    Tool(name="cancel_card",
         func=cancel_card,
         description="Cancel a card after use. Input: card_id string"),
]

llm = ChatAnthropic(model="claude-opus-4-5")
agent = create_react_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

executor.invoke({"input": "Buy the cheapest USB-C cable on Amazon under $15"})`,
  },
];

export default function IntegrationsPage() {
  return (
    <div
      className="min-h-screen bg-[#0a0f1e] text-white"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 px-8 py-5 flex justify-between items-center bg-[#0a0f1e]/90 backdrop-blur-sm">
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#4ade80] text-xl">⚡</span>
          <span>AI Payment Proxy</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="/docs"           className="text-gray-400 hover:text-white text-sm transition-colors">Docs</a>
          <a href="/pricing"        className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a>
          <a href="/integrations"   className="text-white text-sm font-medium">Integrations</a>
          <a href="/blog"           className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a>
          <a href="/login"          className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</a>
          <a href="/signup"         className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#22c55e] transition-colors">Get API Key</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#4ade80]/10 text-[#4ade80] text-sm px-3 py-1 rounded-full mb-6 border border-[#4ade80]/20">
            Plug in anywhere
          </div>
          <h1 className="text-4xl font-bold mb-4">Integrations</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            AI Payment Proxy is a standard REST API. If your agent platform supports HTTP calls or tool use, you can integrate in minutes.
          </p>
        </div>

        {/* Integration cards */}
        <div className="space-y-12">
          {integrations.map(integ => (
            <div key={integ.id} className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">

              {/* Header */}
              <div className="p-8 border-b border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{integ.logo}</span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold">{integ.name}</h2>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${integ.badgeColor}`}>{integ.badge}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{integ.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-4 gap-3 mt-6">
                  {integ.steps.map((step, i) => (
                    <div key={i} className="bg-[#0a0f1e] rounded-xl p-4">
                      <div className="text-[#4ade80] font-bold text-sm mb-2">0{i + 1}</div>
                      <p className="text-gray-300 text-xs leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code block */}
              <div>
                <div className="flex items-center justify-between px-6 py-3 bg-[#0a0f1e] border-b border-gray-800">
                  <span className="text-gray-400 text-xs font-mono">
                    {integ.id === "chatgpt" ? "openapi.yaml" : integ.id === "n8n" ? "workflow.json" : "agent.py"}
                  </span>
                  <span className="text-gray-600 text-xs">Copy to use</span>
                </div>
                <pre className="p-6 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed whitespace-pre bg-[#0a0f1e]">
                  {integ.code}
                </pre>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-[#111827] border border-[#4ade80]/20 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Don&apos;t see your platform?</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            If it can make an HTTP request with a Bearer token, it works with AI Payment Proxy.
            Check the API docs or email us.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/docs" className="bg-[#4ade80] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#22c55e] transition-colors">
              View API Docs
            </a>
            <a href="mailto:hello@aipaymentproxy.com" className="border border-gray-700 text-white px-6 py-3 rounded-lg hover:border-gray-500 transition-colors">
              Contact Us
            </a>
          </div>
        </div>

      </div>

      {/* Footer */}
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
              <a href="/docs"          className="block text-gray-500 hover:text-white text-sm transition-colors">Docs</a>
              <a href="/pricing"       className="block text-gray-500 hover:text-white text-sm transition-colors">Pricing</a>
              <a href="/integrations"  className="block text-gray-500 hover:text-white text-sm transition-colors">Integrations</a>
              <a href="/signup"        className="block text-gray-500 hover:text-white text-sm transition-colors">Get API Key</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <div className="space-y-3">
              <a href="/blog"                                            className="block text-gray-500 hover:text-white text-sm transition-colors">Blog</a>
              <a href="/blog/how-to-give-ai-agent-credit-card"          className="block text-gray-500 hover:text-white text-sm transition-colors">AI Agent Guide</a>
              <a href="/blog/virtual-cards-autonomous-ai-agents"        className="block text-gray-500 hover:text-white text-sm transition-colors">Virtual Cards Deep Dive</a>
              <a href="/blog/ai-agent-payment-infrastructure-explained" className="block text-gray-500 hover:text-white text-sm transition-colors">Infrastructure Explained</a>
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