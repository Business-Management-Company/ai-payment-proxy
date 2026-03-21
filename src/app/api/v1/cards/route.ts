
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function authenticateApiKey(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) throw new Error("Missing API key");
  const rawKey = auth.replace("Bearer ", "").trim();
  const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const supabase = createClient();
  const { data: customer } = await supabase.from("customers").select("*").eq("api_key_hash", hash).single();
  if (!customer) throw new Error("Invalid API key");
  return customer;
}

export async function POST(request: NextRequest) {
  try {
    const customer = await authenticateApiKey(request);
    const { label, limit_usd, merchant_category } = await request.json();
    if (!limit_usd || limit_usd < 1 || limit_usd > 50000) {
      return NextResponse.json({ error: "limit_usd must be between 1 and 50000" }, { status: 400 });
    }
    const cardParams: Stripe.Issuing.CardCreateParams = {
      cardholder: customer.stripe_cardholder_id,
      currency: "usd",
      type: "virtual",
      spending_controls: {
        spending_limits: [{ amount: limit_usd * 100, interval: "per_authorization" }],
      },
    };
    if (merchant_category) {
      cardParams.spending_controls!.allowed_categories = [merchant_category as Stripe.Issuing.CardCreateParams.SpendingControls.AllowedCategory];
    }
    const card = await stripe.issuing.cards.create(cardParams);
    const supabase = createClient();
    const { data: newCard } = await supabase.from("virtual_cards").insert({
      customer_id: customer.id,
      stripe_card_id: card.id,
      label: label || null,
      limit_usd,
      merchant_category: merchant_category || null,
      status: "active",
    }).select().single();
    await supabase.from("customers").update({ cards_used_this_month: (customer.cards_used_this_month || 0) + 1 }).eq("id", customer.id);
    return NextResponse.json({ success: true, data: newCard });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const customer = await authenticateApiKey(request);
    const supabase = createClient();
    const { data: cards } = await supabase.from("virtual_cards").select("*").eq("customer_id", customer.id).order("created_at", { ascending: false });
    return NextResponse.json({ success: true, data: cards || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
