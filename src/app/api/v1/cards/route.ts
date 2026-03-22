import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const REVEAL_FEE = 0.50;
const OVERAGE_FEE = 0.75;

const PLAN_LIMITS: Record<string, number> = {
  developer:  50,
  growth:     250,
  enterprise: 999999,
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await authenticateApiKey(request);
    const supabase = createClient();

    // 1. Find the card
    const { data: card } = await supabase
      .from("virtual_cards")
      .select("*")
      .eq("id", params.id)
      .eq("customer_id", customer.id)
      .single();
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    if (card.status === "canceled") return NextResponse.json({ error: "Card is canceled" }, { status: 400 });

    // 2. Check balance covers reveal fee
    const currentBalance = customer.balance_usd || 0;
    if (currentBalance < REVEAL_FEE) {
      return NextResponse.json(
        { error: `Insufficient balance. Card reveal costs $${REVEAL_FEE}. Current balance: $${currentBalance}` },
        { status: 402 }
      );
    }

    // 3. Check overage — is this card creation over their plan limit?
    const planLimit = PLAN_LIMITS[customer.plan] || 50;
    const cardsUsed = customer.cards_used_this_month || 0;
    const isOverage = cardsUsed > planLimit;
    const totalFee  = isOverage ? REVEAL_FEE + OVERAGE_FEE : REVEAL_FEE;

    if (currentBalance < totalFee) {
      return NextResponse.json(
        { error: `Insufficient balance. Fee: $${totalFee} (reveal $${REVEAL_FEE}${isOverage ? ` + overage $${OVERAGE_FEE}` : ""}). Balance: $${currentBalance}` },
        { status: 402 }
      );
    }

    // 4. Deduct fee from balance
    const newBalance = +(currentBalance - totalFee).toFixed(2);
    await supabase
      .from("customers")
      .update({ balance_usd: newBalance })
      .eq("id", customer.id);

    // 5. Log the fee as a balance transaction
    await supabase.from("balance_transactions").insert({
      customer_id: customer.id,
      amount_usd:  totalFee,
      type:        "spend",
      description: isOverage
        ? `Card reveal fee $${REVEAL_FEE} + overage fee $${OVERAGE_FEE} — card ${params.id.slice(0, 8)}`
        : `Card reveal fee $${REVEAL_FEE} — card ${params.id.slice(0, 8)}`,
    });

    // 6. Reveal card from Stripe
    const stripeCard = await stripe.issuing.cards.retrieve(
      card.stripe_card_id,
      { expand: ["number", "cvc"] }
    );

    return NextResponse.json({
      success: true,
      data: {
        id:         card.id,
        label:      card.label,
        number:     (stripeCard as any).number,
        cvc:        (stripeCard as any).cvc,
        exp_month:  stripeCard.exp_month,
        exp_year:   stripeCard.exp_year,
        limit_usd:  card.limit_usd,
        status:     card.status,
        fee_charged: totalFee,
        balance_remaining: newBalance,
      }
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await authenticateApiKey(request);
    const supabase = createClient();
    const { data: card } = await supabase
      .from("virtual_cards")
      .select("*")
      .eq("id", params.id)
      .eq("customer_id", customer.id)
      .single();
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    await stripe.issuing.cards.update(card.stripe_card_id, { status: "canceled" });
    await supabase
      .from("virtual_cards")
      .update({ status: "canceled", canceled_at: new Date().toISOString() })
      .eq("id", params.id);
    return NextResponse.json({ success: true, message: "Card canceled" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}