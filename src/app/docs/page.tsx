"use client";
import { useState } from "react";

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/cards",
    title: "Create a virtual card",
    description: "Issues a single-use virtual Visa card scoped to your AI agent. The card is immediately active with a hard spending limit — your agent cannot overspend. Ideal for autonomous purchasing workflows where a human is not in the loop. In test mode, use Stripe test card numbers.",
    body: JSON.stringify({ label: "Amazon purchase", limit_usd: 50, merchant_category: "general_merchandise" }, null, 2),
    response: JSON.stringify({ success: true, data: { id: "6d910c90-4639-43e8-9411-22acf35f6644", stripe_card_id: "ic_1TDm4AACuqYQOhbF", label: "Amazon purchase", limit_usd: 50, status: "active", created_at: "2026-03-22T13:29:18Z" } }, null, 2),
    params: [
      { name: "label", type: "string", required: false, desc: "Human-readable label for the card (e.g. agent name or purpose)" },
      { name: "limit_usd", type: "integer", required: true, desc: "Spending limit in USD. Must be between 1 and 50000." },
      { name: "merchant_category", type: "string", required: false, desc: "Restrict card to a specific Stripe merchant category code" },
    ]
  },
  {
    method: "GET",
    path: "/api/v1/cards",
    title: "List virtual cards",
    description: "Returns all virtual cards for the authenticated customer, ordered by creation date descending.",
    body: null,
    response: JSON.stringify({ success: true, data: [{ id: "6d910c90-4639-43e8-9411-22acf35f6644", label: "Amazon purchase", limit_usd: 50, status: "active" }] }, null, 2),
    params: [
      { name: "status", type: "string", required: false, desc: "Filter by status: active or canceled" },
    ]
  },
  {
    method: "GET",
    path: "/api/v1/cards/:id",
    title: "Reveal card details",
    description: "Returns the full card number, CVV, and expiry for an AI agent to use at checkout. Only call this immediately before making a purchase — treat card credentials like secrets. In test mode, card numbers are Stripe test values (e.g. 4000009990000021) and only work in test environments.",
    body: null,
    response: JSON.stringify({ success: true, data: { id: "6d910c90-4639-43e8-9411-22acf35f6644", number: "4000009990000021", cvc: "123", exp_month: 12, exp_year: 2028, limit_usd: 50, status: "active" } }, null, 2),
    params: []
  },
  {
    method: "DELETE",
    path: "/api/v1/cards/:id",
    title: "Cancel a card",
    description: "Immediately cancels a virtual card. Once canceled, the card cannot be used for any further purchases.",
    body: null,
    response: JSON.stringify({ success: true, message: "Card canceled" }, null, 2),
    params: []
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  POST: "bg-green-500/10 text-green-400 border border-green-500/20",
  DELETE: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function DocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [lang, setLang] = useState("curl");
  const [copied, setCopied] = useState(false);
  const ep = endpoints[activeEndpoint];

  function getCode() {
    if (lang === "curl") {
      let cmd = `curl -X ${ep.method} https://aipaymentproxy.com${ep.path.replace(":id", "CARD_ID")} \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;
      if (ep.body) cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${ep.body.replace(/\n/g, "").replace(/  /g, "")}'`;
      return cmd;
    }
    if (lang === "python") {
      let code = `import requests\n\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY"\n}\n\n`;
      if (ep.method === "GET") code += `response = requests.get("https://aipaymentproxy.com${ep.path.replace(":id", "CARD_ID")}", headers=headers)`;
      else if (ep.method === "DELETE") code += `response = requests.delete("https://aipaymentproxy.com${ep.path.replace(":id", "CARD_ID")}", headers=headers)`;
      else code += `payload = ${ep.body || "{}"}\nresponse = requests.post("https://aipaymentproxy.com${ep.path}", headers=headers, json=payload)`;
      code += `\nprint(response.json())`;
      return code;
    }
    if (lang === "node") {
      let code = `const response = await fetch("https://aipaymentproxy.com${ep.path.replace(":id", "CARD_ID")}", {\n  method: "${ep.method}",\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",`;
      if (ep.body) code += `\n    "Content-Type": "application/json"`;
      code += `\n  }`;
      if (ep.body) code += `,\n  body: JSON.stringify(${ep.body.replace(/\n/g, "").replace(/  /g, "")})`;
      code += `\n});\nconst data = await response.json();\nconsole.log(data);`;
      return code;
    }
    return "";
  }

  function copyCode() {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <a href="/" className="font-bold text-lg">AI Payment Proxy</a>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="/docs" className="text-white">Docs</a>
          <a href="/pricing" className="hover:text-white">Pricing</a>
          <a href="/signup" className="bg-[#4ade80] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#22c55e]">Get API Key</a>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-8 py-12 flex gap-8">
    <div className="bg-[#111827] border border-[#4ade80]/20 rounded-2xl p-8 mb-12">
    <div className="flex items-center gap-3 mb-6">
      <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs font-bold px-3 py-1 rounded-full">QUICKSTART</span>
      <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">TEST MODE</span>
    </div>
    <h2 className="text-2xl font-bold mb-2">Give your AI agent a credit card in 3 API calls</h2>
    <p className="text-gray-400 mb-8">AI Payment Proxy issues single-use virtual Visa cards for autonomous AI agents. Your agent creates a card with a hard spending limit, reveals the card number, makes a purchase, and the card auto-cancels. No human in the loop.</p>
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[
        { step: "01", title: "Create a card", desc: "Your AI calls our API with a spending limit. A real Visa card is issued instantly.", color: "text-[#4ade80]" },
        { step: "02", title: "Reveal credentials", desc: "Get the card number, CVV, and expiry. Use these at any online checkout.", color: "text-blue-400" },
        { step: "03", title: "Card auto-cancels", desc: "After the purchase, cancel the card via API. Limit reached = auto-canceled.", color: "text-purple-400" },
      ].map(s => (
        <div key={s.step} className="bg-[#0a0f1e] rounded-xl p-4">
          <div className={"text-2xl font-bold mb-2 " + s.color}>{s.step}</div>
          <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
          <p className="text-gray-500 text-xs">{s.desc}</p>
        </div>
      ))}
    </div>
    <pre className="bg-[#0a0f1e] rounded-xl p-4 text-sm font-mono text-gray-300 overflow-x-auto">
      {`# Step 1: Create a card for your AI agent\ncurl -X POST https://aipaymentproxy.com/api/v1/cards \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '{"label":"Shopping Agent","limit_usd":50}'\n\n# Step 2: Reveal card number + CVV\ncurl https://aipaymentproxy.com/api/v1/cards/CARD_ID \\\n  -H "Authorization: Bearer YOUR_API_KEY"\n\n# Step 3: Cancel after use\ncurl -X DELETE https://aipaymentproxy.com/api/v1/cards/CARD_ID \\\n  -H "Authorization: Bearer YOUR_API_KEY"`}
    </pre>
  </div>
      <div className="w-64 shrink-0">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Endpoints</h3>
          <div className="space-y-1">
            {endpoints.map((e, i) => (
              <button key={i} onClick={() => setActiveEndpoint(i)} className={"w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 " + (activeEndpoint === i ? "bg-[#4ade80]/10 text-white" : "text-gray-400 hover:text-white")}>
                <span className={"text-xs font-mono px-1.5 py-0.5 rounded " + methodColors[e.method]}>{e.method}</span>
                <span className="truncate">{e.title}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 p-4 bg-[#111827] border border-gray-800 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Authentication</p>
            <p className="text-xs text-gray-400 mb-2">All requests require an API key in the Authorization header:</p>
            <code className="text-xs text-[#4ade80] block bg-[#0a0f1e] p-2 rounded">Authorization: Bearer aipp_live_...</code>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <span className={"text-sm font-mono px-2 py-1 rounded font-bold " + methodColors[ep.method]}>{ep.method}</span>
            <code className="text-lg font-mono text-white">{ep.path}</code>
          </div>
          <h2 className="text-2xl font-bold mb-3">{ep.title}</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">{ep.description}</p>
          {ep.params.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Parameters</h3>
              <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                {ep.params.map(p => (
                  <div key={p.name} className="flex gap-4 px-4 py-3 border-b border-gray-800/50 last:border-0">
                    <div className="w-40 shrink-0">
                      <code className="text-sm text-[#4ade80]">{p.name}</code>
                      <span className={"ml-2 text-xs px-1.5 py-0.5 rounded " + (p.required ? "bg-red-500/10 text-red-400" : "bg-gray-800 text-gray-500")}>{p.required ? "required" : "optional"}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{p.type}</p>
                      <p className="text-sm text-gray-300">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Request</h3>
              <div className="flex items-center gap-2">
                {["curl", "python", "node"].map(l => (
                  <button key={l} onClick={() => setLang(l)} className={"text-xs px-3 py-1 rounded-lg transition " + (lang === l ? "bg-[#4ade80] text-black font-semibold" : "text-gray-400 hover:text-white border border-gray-700")}>
                    {l}
                  </button>
                ))}
                <button onClick={copyCode} className="text-xs px-3 py-1 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <pre className="bg-[#111827] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
              {getCode()}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Response</h3>
            <pre className="bg-[#111827] border border-gray-800 rounded-xl p-4 text-sm text-[#4ade80] overflow-x-auto font-mono leading-relaxed">
              {ep.response}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}