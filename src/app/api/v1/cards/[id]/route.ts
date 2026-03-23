import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { lithic } from "@/lib/lithic";
import crypto from "crypto";

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await authenticateApiKey(request);
    const supabase = createClient();
    const { data: card } = await supabase.from("virtual_cards").select("*").eq("id", params.id).eq("customer_id", customer.id).single();
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    const cardToken = card.stripe_card_id;
    const lithicCard = await lithic.cards.retrieve(cardToken);
    return NextResponse.json({
      success: true,
      data: {
        id: card.id,
        number: (lithicCard as any).pan,
        cvc: (lithicCard as any).cvv,
        exp_month: (lithicCard as any).exp_month,
        exp_year: (lithicCard as any).exp_year,
        expiry: `${(lithicCard as any).exp_month}/${(lithicCard as any).exp_year}`,
        limit_usd: card.limit_usd,
        label: card.label,
        status: card.status,
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await authenticateApiKey(request);
    const supabase = createClient();
    const { data: card } = await supabase.from("virtual_cards").select("*").eq("id", params.id).eq("customer_id", customer.id).single();
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    await lithic.cards.update(card.stripe_card_id, { state: "CLOSED" });
    await supabase.from("virtual_cards").update({ status: "canceled", canceled_at: new Date().toISOString() }).eq("id", params.id);
    return NextResponse.json({ success: true, message: "Card canceled" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
