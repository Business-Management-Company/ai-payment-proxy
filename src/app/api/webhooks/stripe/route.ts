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

  const supabase = createClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const amount = parseInt(session.metadata?.amount || "0");
    const paymentMethod = session.payment_method_types?.[0];

    if (userId && amount) {
      const { data: customer } = await supabase.from("customers").select("balance_usd, pending_balance_usd").eq("id", userId).single();

      if (paymentMethod === "us_bank_account") {
        const newPending = (customer?.pending_balance_usd || 0) + amount;
        await supabase.from("customers").update({ pending_balance_usd: newPending }).eq("id", userId);
        await supabase.from("balance_transactions").insert({
          customer_id: userId,
          amount_usd: amount,
          type: "deposit",
          description: "ACH deposit - pending 2-3 business days",
        });
      } else {
        const newBalance = (customer?.balance_usd || 0) + amount;
        await supabase.from("customers").update({ balance_usd: newBalance }).eq("id", userId);
        await supabase.from("balance_transactions").insert({
          customer_id: userId,
          amount_usd: amount,
          type: "deposit",
          description: "Instant deposit via " + (paymentMethod || "card"),
        });
      }
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    if (intent.payment_method_types?.includes("us_bank_account") && intent.metadata?.userId) {
      const userId = intent.metadata.userId;
      const amount = intent.amount / 100;
      const { data: customer } = await supabase.from("customers").select("balance_usd, pending_balance_usd").eq("id", userId).single();
      await supabase.from("customers").update({
        balance_usd: (customer?.balance_usd || 0) + amount,
        pending_balance_usd: Math.max(0, (customer?.pending_balance_usd || 0) - amount),
      }).eq("id", userId);
      await supabase.from("balance_transactions").insert({
        customer_id: userId,
        amount_usd: amount,
        type: "deposit",
        description: "ACH deposit cleared",
      });
    }
  }

  return NextResponse.json({ received: true });
}
