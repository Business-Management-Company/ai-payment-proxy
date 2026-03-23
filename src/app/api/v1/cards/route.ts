import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { issueHighnoteCard, applyForHighnoteCardProduct, createHighnoteAccountHolder } from "@/lib/highnote";
import crypto from "crypto";

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
    const { label, limit_usd } = await request.json();
    const limitFloat = parseFloat(limit_usd);

    if (!limitFloat || limitFloat < 0.50) {
      return NextResponse.json({ error: "limit_usd must be at least $0.50" }, { status: 400 });
    }

    const supabase = createClient();
    const currentBalance = customer.balance_usd || 0;
    const warning = currentBalance < limitFloat
      ? "Balance is insufficient to fund this card. Add funds to activate it."
      : undefined;

    // Check plan limits — allow overage, just flag it
    const planLimit = PLAN_LIMITS[customer.plan] || 50;
    const cardsUsed = customer.cards_used_this_month || 0;
    const isOverage = cardsUsed >= planLimit;

    if (isOverage && customer.plan !== "enterprise") {
      // Still allow — overage fee applied at reveal time
      // But warn the agent
    }

    // Get or create Highnote accountHolderId + applicationId for this customer
    let { highnote_account_holder_id, highnote_application_id } = customer;

    if (!highnote_account_holder_id) {
      // Create AccountHolder — use placeholder KYC data for sandbox
      // In production, collect real KYC during onboarding
      highnote_account_holder_id = await createHighnoteAccountHolder({
        givenName: (customer.name || 'AI').split(' ')[0],
        familyName: (customer.name || 'Agent').split(' ')[1] || 'User',
        email: customer.email,
        phone: '2025550000',
        streetAddress: '413 Independence Ave SE',
        city: 'Washington',
        state: 'DC',
        postalCode: '20003',
        dateOfBirth: '1990-01-01',
        ssn: '111111111', // sandbox test SSN
        ipAddress: '127.0.0.1',
      });
      await supabase.from('customers').update({ highnote_account_holder_id }).eq('id', customer.id);
    }

    if (!highnote_application_id) {
      highnote_application_id = await applyForHighnoteCardProduct(highnote_account_holder_id, '127.0.0.1');
      await supabase.from('customers').update({ highnote_application_id }).eq('id', customer.id);
    }

    // Issue the virtual card
    const highnoteCard = await issueHighnoteCard({
      applicationId: highnote_application_id,
      externalId: `aipp-${customer.id}-${Date.now()}`,
      memo: label?.slice(0, 50) || 'AI Agent Card',
    });

    // Save to Supabase
    const { data: card, error: insertError } = await supabase
      .from("virtual_cards")
      .insert({
        id: crypto.randomUUID(),
        customer_id:       customer.id,
        stripe_card_id:    highnoteCard.id,
        label:             label || "",
        limit_usd: limitFloat,
        merchant_category: "all",
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
      warning,
      data: {
        id:            card.id,
        stripe_card_id: highnoteCard.id,
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