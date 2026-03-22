import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_LIMITS: Record<string, number> = {
  developer:  50,
  growth:     250,
  enterprise: 999999,
};

const PLAN_PRICES: Record<string, number> = {
  developer:  29,
  growth:     79,
  enterprise: 499,
};

async function authenticateApiKey(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) throw new Error("Missing API key");
  const rawKey = auth.replace("Bearer ", "").trim();
  const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const supabase = createClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("api_key_hash", hash)
    .single();
  if (!customer) throw new Error("Invalid API key");
  return customer;
}

export async function POST(request: NextRequest) {
  try {
    const customer = await authenticateApiKey(request);
    const { label, limit_usd, merchant_category } = await request.json();
    const limitFloat = parseFloat(limit_usd);

    if (!limitFloat || limitFloat < 0.50) {
      return NextResponse.json({ error: "limit_usd is required and must be at least 0.50" }, { status: 400 });
    }

    const supabase = createClient();
    const currentBalance = customer.balance_usd || 0;

    // Check sufficient balance
    if (currentBalance < limitFloat) {
      return NextResponse.json({
        error: "Insufficient balance",
        code: "insufficient_balance",
        balance_usd: currentBalance,
        required_usd: limitFloat,
        shortfall_usd: +(limitFloat - currentBalance).toFixed(2),
        action: "Add funds at https://aipaymentproxy.com/dashboard",
        add_funds_url: "https://aipaymentproxy.com/dashboard",
        tip: currentBalance > 0
          ? `You have $${currentBalance} available. Deposit at least $${+(limitFloat - currentBalance).toFixed(2)} more to create this card.`
          : "Your balance is $0. Add funds via ACH (free) or card at aipaymentproxy.com/dashboard",
      }, { status: 402 });
    }

    // Check plan limits — allow overage, just flag it
    const planLimit = PLAN_LIMITS[customer.plan] || 50;
    const cardsUsed = customer.cards_used_this_month || 0;
    const isOverage = cardsUsed >= planLimit;

    if (isOverage && customer.plan !== "enterprise") {
      // Still allow — overage fee applied at reveal time
      // But warn the agent
    }

    // Create Stripe Issuing card
    const cardParams: Stripe.Issuing.CardCreateParams = {
      cardholder: customer.stripe_cardholder_id,
      currency:   "usd",
      type:       "virtual",
      spending_controls: {
        spending_limits: [{ amount: limitFloat * 100, interval: "per_authorization" }],
        ...(merchant_category ? { allowed_categories: [merchant_category] } : {}),
      },
    };

    const stripeCard = await stripe.issuing.cards.create(cardParams);

    // Save to Supabase
    const { data: card, error: insertError } = await supabase
      .from("virtual_cards")
      .insert({
        customer_id:       customer.id,
        stripe_card_id:    stripeCard.id,
        label:             label || "",
        limit_usd: limitFloat,
        merchant_category: merchant_category || "all",
        status:            "active",
      })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

    // Increment cards_used_this_month
    await supabase
      .from("customers")
      .update({ cards_used_this_month: cardsUsed + 1 })
      .eq("id", customer.id);

    return NextResponse.json({
      success: true,
      data: {
        id:            card.id,
        stripe_card_id: stripeCard.id,
        label:         card.label,
        limit_usd:     card.limit_usd,
        status:        card.status,
        created_at:    card.created_at,
        overage:       isOverage,
        overage_note:  isOverage ? "This card is over your plan limit. A $0.75 overage fee applies at reveal time." : null,
        balance_remaining: currentBalance,
        next_step:     `Reveal card credentials: GET /api/v1/cards/${card.id}`,
      },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const customer = await authenticateApiKey(request);
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("virtual_cards")
      .select("*")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);

    const { data: cards } = await query;

    return NextResponse.json({
      success: true,
      data: cards || [],
      meta: {
        total:             cards?.length || 0,
        balance_usd:       customer.balance_usd,
        cards_used:        customer.cards_used_this_month,
        plan_limit:        PLAN_LIMITS[customer.plan] || 50,
        plan:              customer.plan,
      },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}