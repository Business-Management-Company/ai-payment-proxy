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

  // ── Deposit: checkout completed ───────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const amount = parseInt(session.metadata?.amount || "0");
    const paymentMethod = session.payment_method_types?.[0];

    if (userId && amount) {
      const { data: customer } = await supabase
        .from("customers")
        .select("balance_usd, pending_balance_usd")
        .eq("id", userId)
        .single();

      if (paymentMethod === "us_bank_account") {
        await supabase.from("customers").update({
          pending_balance_usd: (customer?.pending_balance_usd || 0) + amount,
        }).eq("id", userId);
        await supabase.from("balance_transactions").insert({
          customer_id: userId, amount_usd: amount, type: "deposit",
          description: "ACH deposit - pending 2-3 business days",
        });
      } else {
        await supabase.from("customers").update({
          balance_usd: (customer?.balance_usd || 0) + amount,
        }).eq("id", userId);
        await supabase.from("balance_transactions").insert({
          customer_id: userId, amount_usd: amount, type: "deposit",
          description: "Instant deposit via " + (paymentMethod || "card"),
        });
      }
    }
  }

  // ── Deposit: ACH cleared ──────────────────────────────────────────────
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    if (intent.payment_method_types?.includes("us_bank_account") && intent.metadata?.userId) {
      const userId = intent.metadata.userId;
      const amount = intent.amount / 100;
      const { data: customer } = await supabase
        .from("customers")
        .select("balance_usd, pending_balance_usd")
        .eq("id", userId)
        .single();
      await supabase.from("customers").update({
        balance_usd: (customer?.balance_usd || 0) + amount,
        pending_balance_usd: Math.max(0, (customer?.pending_balance_usd || 0) - amount),
      }).eq("id", userId);
      await supabase.from("balance_transactions").insert({
        customer_id: userId, amount_usd: amount, type: "deposit",
        description: "ACH deposit cleared",
      });
    }
  }

  // ── Subscription: created or updated ─────────────────────────────────
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.userId;
    if (userId) {
      await supabase.from("customers").update({
        stripe_subscription_id: sub.id,
        subscription_status: sub.status,
        trial_ends_at: sub.trial_end
          ? new Date(sub.trial_end * 1000).toISOString()
          : null,
      }).eq("id", userId);
    }
  }

  // ── Subscription: canceled ────────────────────────────────────────────
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.userId;
    if (userId) {
      await supabase.from("customers").update({
        subscription_status: "canceled",
      }).eq("id", userId);
    }
  }

  // ── Invoice: payment failed ───────────────────────────────────────────
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;
    if (customerId) {
      await supabase.from("customers").update({
        subscription_status: "past_due",
      }).eq("stripe_customer_id", customerId);
    }
  }

  // ── Invoice: payment succeeded (monthly renewal) ──────────────────────
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;
    if (customerId) {
      await supabase.from("customers").update({
        subscription_status: "active",
      }).eq("stripe_customer_id", customerId);
    }
  }

  return NextResponse.json({ received: true });
}
