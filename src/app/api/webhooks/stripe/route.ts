
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const amount = parseInt(session.metadata?.amount || "0");

    if (userId && amount) {
      const supabase = createClient();
      const { data: customer } = await supabase.from("customers").select("balance_usd").eq("id", userId).single();
      const newBalance = (customer?.balance_usd || 0) + amount;
      await supabase.from("customers").update({ balance_usd: newBalance }).eq("id", userId);
      await supabase.from("balance_transactions").insert({
        customer_id: userId,
        amount_usd: amount,
        type: "deposit",
        description: "Balance top-up via Stripe",
      });
    }
  }

  return NextResponse.json({ received: true });
}
