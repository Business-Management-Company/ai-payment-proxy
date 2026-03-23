import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_PRICE_IDS: Record<string, string> = {
  developer: "price_1TDoxHACuqYQOhbFKETxJsgg",
  growth: "price_1TDoxYACuqYQOhbFMgVhegti",
  enterprise: "price_1TDoxmACuqYQOhbFZPmsIzwT",
};

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name, plan = "developer", telegram = "" } = await request.json();
    const supabase = createClient();

    const { data: existing } = await supabase
      .from("customers")
      .select("api_key_prefix")
      .eq("id", userId)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Already onboarded" }, { status: 400 });
    }

    // 1. Create Stripe Customer (for billing)
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    });

    // 2. Create subscription with 14-day free trial
    const priceId = PLAN_PRICE_IDS[plan] || PLAN_PRICE_IDS.developer;
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      trial_period_days: 14,
      metadata: { userId },
    });

    const trialEnd = subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;

    // 3. Generate API key
    const rawKey = "aipp_live_" + crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const prefix = rawKey.substring(0, 16);

    // 4. Save everything to Supabase
    await supabase.from("customers").insert({
      id: userId,
      email,
      name,
      telegram_handle: telegram,
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      trial_ends_at: trialEnd,
      api_key_hash: hash,
      api_key_prefix: prefix,
      plan: plan,
    });

    try {
      const { sendWelcomeEmail } = await import("@/lib/emails");
      await sendWelcomeEmail(
        email,
        name,
        rawKey,
        trialEnd || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      );
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json({
      apiKey: rawKey,
      prefix,
      stripeCustomerId: customer.id,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      trialEndsAt: trialEnd,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
