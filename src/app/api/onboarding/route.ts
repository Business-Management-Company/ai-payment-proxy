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
    const { userId, email, name, plan = "developer" } = await request.json();
    const supabase = createClient();

    const { data: existing } = await supabase
      .from("customers")
      .select("api_key_prefix")
      .eq("id", userId)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Already onboarded" }, { status: 400 });
    }

    // 1. Create Stripe Issuing cardholder (for virtual cards)
    const cardholder = await stripe.issuing.cardholders.create({
      name,
      email,
      type: "individual",
      billing: {
        address: {
          line1: "123 Main St",
          city: "San Francisco",
          state: "CA",
          postal_code: "94105",
          country: "US",
        },
      },
    });

    // 2. Create Stripe Customer (for billing)
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    });

    // 3. Create subscription with 14-day free trial
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

    // 4. Generate API key
    const rawKey = "aipp_live_" + crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const prefix = rawKey.substring(0, 16);

    // 5. Save everything to Supabase
    await supabase.from("customers").insert({
      id: userId,
      email,
      name,
      stripe_cardholder_id: cardholder.id,
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      trial_ends_at: trialEnd,
      api_key_hash: hash,
      api_key_prefix: prefix,
      plan: plan,
    });

    return NextResponse.json({
      apiKey: rawKey,
      prefix,
      stripeCardholderId: cardholder.id,
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
