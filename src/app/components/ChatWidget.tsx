"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are the AI Payment Proxy support assistant. You help developers integrate virtual card payments into their AI agents.

Key facts about AI Payment Proxy:
- REST API for creating single-use virtual Visa cards for AI agents
- Cards have hard spending limits set at creation time
- Three main API calls: POST /api/v1/cards (create), GET /api/v1/cards/:id (reveal credentials, $0.50 fee), DELETE /api/v1/cards/:id (cancel)
- Auth: Authorization: Bearer aipp_live_YOUR_KEY
- Plans: Developer $29/mo (50 cards), Growth $79/mo (250 cards), Enterprise $499/mo (unlimited)
- Card reveal fee: $0.50 per reveal
- Overage fee: $0.75 per card over plan limit
- ACH deposits free, card deposits 2.9% + $0.30
- 14-day free trial on all plans
- Telegram bot: @AIpaymentproxybot
- Integrations: Claude, ChatGPT Actions, n8n, Zapier (coming soon)
- Cards issued via Stripe Issuing — not a bank, not FDIC insured
- Support: support@aipaymentproxy.com

Be helpful, concise, and technical. Always include code examples when relevant. If asked about pricing, be specific. If asked about a feature that does not exist, say so honestly.`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm the AI Payment Proxy assistant. Ask me anything about virtual cards, API integration, pricing, or getting started. 🚀" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMsg }],
          system: SYSTEM_PROMPT,
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content || "Sorry, I had trouble with that. Try again or email support@aipaymentproxy.com" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again or email support@aipaymentproxy.com" }]);
    }
    setLoading(false);
  }

  function renderMessage(content: string) {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#4ade80] text-black rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-[#22c55e] transition-all hover:scale-110"
        title="Chat with AI assistant"
      >
        {open ? "×" : "⚡"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-[#111827] border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: "500px" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-[#0a0f1e] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4ade80] rounded-full flex items-center justify-center text-black font-bold text-sm">⚡</div>
              <div>
                <p className="text-white font-semibold text-sm">AIPP Assistant</p>
                <p className="text-gray-500 text-xs">Powered by Claude</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#4ade80] text-black rounded-br-sm"
                    : "bg-[#1a2235] text-gray-300 rounded-bl-sm"
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{renderMessage(msg.content)}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1a2235] rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-gray-800 p-3 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 bg-[#0a0f1e] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#4ade80] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={loading || !input.trim()}
                className="bg-[#4ade80] text-black w-10 h-10 rounded-xl flex items-center justify-center font-bold hover:bg-[#22c55e] disabled:opacity-40 transition-colors shrink-0"
              >
                ↑
              </button>
            </div>
            <p className="text-gray-600 text-xs text-center mt-2">Powered by Claude · Not a substitute for legal/financial advice</p>
          </div>
        </div>
      )}
    </>
  );
}
