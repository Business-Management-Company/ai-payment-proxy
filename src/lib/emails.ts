import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "AI Payment Proxy <hello@aipaymentproxy.com>";

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

export async function sendWelcomeEmail(email: string, name: string, rawKey: string, trialEndsAt: string) {
  const firstName = capitalize(name.split(" ")[0] || "there");
  const trialDate = new Date(trialEndsAt).toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your API key is ready ⚡",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="margin-bottom:32px;">
    <span style="color:#4ade80;font-size:24px;font-weight:700;">⚡ AI Payment Proxy</span>
  </div>
  <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 16px;">Welcome, ${firstName}! Your API key is ready.</h1>
  <p style="color:#9ca3af;font-size:16px;line-height:1.6;margin:0 0 32px;">You're on a 14-day free trial — no credit card required until ${trialDate}. Here's everything you need to get started.</p>

  <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:24px;margin-bottom:32px;">
    <p style="color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Your API Key</p>
    <p style="color:#4ade80;font-family:monospace;font-size:14px;word-break:break-all;margin:0 0 16px;background:#0a0f1e;padding:12px;border-radius:8px;">${rawKey}</p>
    <p style="color:#6b7280;font-size:12px;margin:0;">⚠️ Save this key — it won't be shown again. Store it as an environment variable.</p>
  </div>

  <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:24px;margin-bottom:32px;">
    <p style="color:#ffffff;font-size:16px;font-weight:600;margin:0 0 16px;">Create your first card in 30 seconds:</p>
    <pre style="color:#4ade80;font-family:monospace;font-size:13px;background:#0a0f1e;padding:16px;border-radius:8px;overflow-x:auto;margin:0;">curl -X POST https://aipaymentproxy.com/api/v1/cards \
  -H "Authorization: Bearer ${rawKey}" \
  -H "Content-Type: application/json" \
  -d '{"label":"My first card","limit_usd":10}'</pre>
  </div>

  <div style="display:flex;gap:12px;margin-bottom:32px;">
    <a href="https://aipaymentproxy.com/dashboard" style="background:#4ade80;color:#000000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">Go to Dashboard</a>
    <a href="https://aipaymentproxy.com/docs" style="background:transparent;color:#4ade80;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;border:1px solid #4ade80;display:inline-block;">API Docs</a>
  </div>

  <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:20px;margin-bottom:32px;">
    <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 8px;">💬 Prefer Telegram?</p>
    <p style="color:#9ca3af;font-size:14px;margin:0 0 12px;">Create cards directly from Telegram — no code required.</p>
    <a href="https://t.me/AIpaymentproxybot" style="color:#4ade80;font-size:14px;">Open @AIpaymentproxybot →</a>
  </div>

  <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:0;">Questions? Reply to this email or visit our <a href="https://aipaymentproxy.com/kb" style="color:#4ade80;">Help Center</a>. Your trial ends ${trialDate} — you won't be charged until then.<br><br>AI Payment Proxy · hello@aipaymentproxy.com · <a href="https://aipaymentproxy.com/terms" style="color:#4ade80;">Terms</a> · <a href="https://aipaymentproxy.com/privacy" style="color:#4ade80;">Privacy</a></p>
</div>
</body>
</html>`,
  });
}

export async function sendFirstCardEmail(email: string, name: string) {
  const firstName = capitalize(name.split(" ")[0] || "there");
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Make your first virtual card in 60 seconds",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="margin-bottom:32px;"><span style="color:#4ade80;font-size:24px;font-weight:700;">⚡ AI Payment Proxy</span></div>
  <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 16px;">Hey ${firstName} — ready to make your first card?</h1>
  <p style="color:#9ca3af;font-size:16px;line-height:1.6;margin:0 0 32px;">Here's the complete flow your AI agent will use — create, reveal, use, cancel.</p>

  <div style="margin-bottom:24px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="background:#4ade80;color:#000;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;">1</div>
      <p style="color:#ffffff;font-weight:600;margin:0;">Create a card with a spending limit</p>
    </div>
    <pre style="color:#4ade80;font-family:monospace;font-size:12px;background:#111827;padding:16px;border-radius:8px;overflow-x:auto;margin:0 0 20px;">curl -X POST https://aipaymentproxy.com/api/v1/cards \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"label":"DoorDash order","limit_usd":25}'</pre>

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="background:#4ade80;color:#000;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;">2</div>
      <p style="color:#ffffff;font-weight:600;margin:0;">Reveal the card number and CVV</p>
    </div>
    <pre style="color:#4ade80;font-family:monospace;font-size:12px;background:#111827;padding:16px;border-radius:8px;overflow-x:auto;margin:0 0 20px;">curl https://aipaymentproxy.com/api/v1/cards/CARD_ID \
  -H "Authorization: Bearer YOUR_API_KEY"</pre>

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="background:#4ade80;color:#000;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;">3</div>
      <p style="color:#ffffff;font-weight:600;margin:0;">Cancel after use</p>
    </div>
    <pre style="color:#4ade80;font-family:monospace;font-size:12px;background:#111827;padding:16px;border-radius:8px;overflow-x:auto;margin:0 0 20px;">curl -X DELETE https://aipaymentproxy.com/api/v1/cards/CARD_ID \
  -H "Authorization: Bearer YOUR_API_KEY"</pre>
  </div>

  <a href="https://aipaymentproxy.com/dashboard/cards" style="background:#4ade80;color:#000000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;margin-bottom:32px;">Create a card now →</a>

  <div style="border-top:1px solid #374151;padding-top:24px;">
    <p style="color:#9ca3af;font-size:14px;margin:0 0 12px;">Want to integrate with Claude, ChatGPT, or n8n?</p>
    <a href="https://aipaymentproxy.com/integrations" style="color:#4ade80;font-size:14px;">View integration guides →</a>
  </div>

  <p style="color:#6b7280;font-size:12px;margin-top:32px;">AI Payment Proxy · <a href="https://aipaymentproxy.com/kb" style="color:#4ade80;">Help Center</a> · <a href="mailto:hello@aipaymentproxy.com" style="color:#4ade80;">hello@aipaymentproxy.com</a></p>
</div>
</body>
</html>`,
  });
}

export async function sendUseCasesEmail(email: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "3 things developers are building with AI Payment Proxy",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="margin-bottom:32px;"><span style="color:#4ade80;font-size:24px;font-weight:700;">⚡ AI Payment Proxy</span></div>
  <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 16px;">What are developers building with AIPP?</h1>
  <p style="color:#9ca3af;font-size:16px;line-height:1.6;margin:0 0 32px;">Here are 3 real use cases from developers using virtual cards in production.</p>

  ${[
    { emoji: "🍕", title: "Food delivery agents", desc: "Tell your AI to order lunch under $20. It creates a card, places the order on DoorDash, card cancels after. No human touches a credit card.", link: "https://aipaymentproxy.com/blog/how-to-give-ai-agent-credit-card" },
    { emoji: "💻", title: "API cost control", desc: "Give your AI agent a $200 card for OpenAI or cloud spend. Hard limit means no surprise bills — ever. Card cancels when the limit is hit.", link: "https://aipaymentproxy.com/blog/virtual-cards-autonomous-ai-agents" },
    { emoji: "📦", title: "Auto-restock bots", desc: "AI monitors inventory, creates a card when supplies run low, orders from your supplier automatically. Every purchase has its own card.", link: "https://aipaymentproxy.com/blog/ai-agent-payment-infrastructure-explained" },
  ].map(uc => `
    <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:20px;margin-bottom:16px;">
      <p style="font-size:24px;margin:0 0 8px;">${uc.emoji}</p>
      <p style="color:#ffffff;font-weight:600;font-size:16px;margin:0 0 8px;">${uc.title}</p>
      <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 12px;">${uc.desc}</p>
      <a href="${uc.link}" style="color:#4ade80;font-size:14px;text-decoration:none;">Read the guide →</a>
    </div>`).join("")}

  <div style="background:#111827;border:1px solid #4ade80;border-radius:12px;padding:20px;margin-top:32px;">
    <p style="color:#ffffff;font-weight:600;margin:0 0 8px;">💡 Pro tip: connect your bank for free deposits</p>
    <p style="color:#9ca3af;font-size:14px;margin:0 0 12px;">ACH deposits are always free. Card deposits cost 2.9% + $0.30. Save money by connecting your bank account in your dashboard.</p>
    <a href="https://aipaymentproxy.com/dashboard" style="color:#4ade80;font-size:14px;">Connect bank →</a>
  </div>

  <p style="color:#6b7280;font-size:12px;margin-top:32px;">AI Payment Proxy · <a href="https://aipaymentproxy.com/kb" style="color:#4ade80;">Help Center</a> · <a href="mailto:hello@aipaymentproxy.com" style="color:#4ade80;">hello@aipaymentproxy.com</a></p>
</div>
</body>
</html>`,
  });
}

export async function sendCheckInEmail(email: string, name: string) {
  const firstName = capitalize(name.split(" ")[0] || "there");
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "How is your AIPP integration going?",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="margin-bottom:32px;"><span style="color:#4ade80;font-size:24px;font-weight:700;">⚡ AI Payment Proxy</span></div>
  <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 16px;">Hey ${firstName} — how is your integration going?</h1>
  <p style="color:#9ca3af;font-size:16px;line-height:1.6;margin:0 0 24px;">You are on day 5 of your free trial. Here are the most common questions we get at this stage.</p>

  ${[
    { q: "My agent keeps getting insufficient balance errors", a: "Add funds via ACH (free) in your dashboard, or enable auto-reload so your balance refills automatically.", link: "https://aipaymentproxy.com/kb/insufficient-balance-error" },
    { q: "How do I integrate with Claude or ChatGPT?", a: "Check our integration guides — Claude uses native tool calls, ChatGPT uses GPT Actions. Both take under 10 minutes.", link: "https://aipaymentproxy.com/dashboard/integrations" },
    { q: "What happens when a card hits its limit?", a: "The card is automatically declined at the merchant level. The agent gets a declined response. You can cancel the card via API.", link: "https://aipaymentproxy.com/kb/how-virtual-cards-work" },
  ].map(faq => `
    <div style="border-left:3px solid #4ade80;padding-left:16px;margin-bottom:20px;">
      <p style="color:#ffffff;font-weight:600;font-size:14px;margin:0 0 4px;">${faq.q}</p>
      <p style="color:#9ca3af;font-size:14px;line-height:1.5;margin:0 0 8px;">${faq.a}</p>
      <a href="${faq.link}" style="color:#4ade80;font-size:13px;">Learn more →</a>
    </div>`).join("")}

  <div style="margin-top:32px;">
    <p style="color:#9ca3af;font-size:14px;margin:0 0 16px;">Need hands-on help? Reply to this email — we respond within 24 hours.</p>
    <a href="https://aipaymentproxy.com/dashboard" style="background:#4ade80;color:#000000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">View your dashboard →</a>
  </div>

  <p style="color:#6b7280;font-size:12px;margin-top:32px;">AI Payment Proxy · <a href="https://aipaymentproxy.com/kb" style="color:#4ade80;">Help Center</a> · <a href="mailto:hello@aipaymentproxy.com" style="color:#4ade80;">hello@aipaymentproxy.com</a></p>
</div>
</body>
</html>`,
  });
}

export async function sendTrialEndingEmail(email: string, name: string, trialEndsAt: string, plan: string) {
  const trialDate = new Date(trialEndsAt).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const prices: Record<string, string> = { developer: "$29", growth: "$79", enterprise: "$499" };
  const price = prices[plan] || "$29";
  const limits: Record<string, string> = { developer: "50", growth: "250", enterprise: "unlimited" };
  const cardLimit = limits[plan] || "50";

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your free trial ends ${trialDate} — 2 days left`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="margin-bottom:32px;"><span style="color:#4ade80;font-size:24px;font-weight:700;">⚡ AI Payment Proxy</span></div>
  <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 16px;">Your trial ends in 2 days</h1>
  <p style="color:#9ca3af;font-size:16px;line-height:1.6;margin:0 0 24px;">Your free trial ends on ${trialDate}. Here is what happens next.</p>

  <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:24px;margin-bottom:24px;">
    <p style="color:#ffffff;font-weight:600;font-size:16px;margin:0 0 16px;">Your current plan: ${plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
    <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #374151;">
      <span style="color:#9ca3af;font-size:14px;">Monthly price after trial</span>
      <span style="color:#ffffff;font-size:14px;font-weight:600;">${price}/mo</span>
    </div>
    <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #374151;">
      <span style="color:#9ca3af;font-size:14px;">Virtual cards per month</span>
      <span style="color:#ffffff;font-size:14px;font-weight:600;">${cardLimit} cards</span>
    </div>
    <div style="display:flex;justify-content:space-between;padding:10px 0;">
      <span style="color:#9ca3af;font-size:14px;">Card reveal fee</span>
      <span style="color:#ffffff;font-size:14px;font-weight:600;">$0.50 per reveal</span>
    </div>
  </div>

  <div style="display:flex;gap:12px;margin-bottom:32px;">
    <a href="https://aipaymentproxy.com/dashboard" style="background:#4ade80;color:#000000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">Continue with ${plan} plan</a>
    <a href="https://aipaymentproxy.com/pricing" style="background:transparent;color:#4ade80;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;border:1px solid #4ade80;display:inline-block;">View all plans</a>
  </div>

  <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:20px;margin-bottom:24px;">
    <p style="color:#ffffff;font-weight:600;margin:0 0 8px;">What if I do nothing?</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.5;margin:0;">Your subscription will automatically activate on ${trialDate} and you will be charged ${price}. You can cancel anytime from your dashboard settings — no questions asked.</p>
  </div>

  <p style="color:#6b7280;font-size:12px;margin-top:32px;">Questions about billing? Reply to this email or visit our <a href="https://aipaymentproxy.com/kb/billing-and-fees" style="color:#4ade80;">billing guide</a>.<br><br>AI Payment Proxy · <a href="https://aipaymentproxy.com/terms" style="color:#4ade80;">Terms</a> · <a href="https://aipaymentproxy.com/privacy" style="color:#4ade80;">Privacy</a></p>
</div>
</body>
</html>`,
  });
}
