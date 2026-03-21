
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId, amount } = await request.json();
    const supabase = createClient();
    const { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("id", userId)
      .single();

    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    let stripeCustomerId = customer.stripe_customer_id;
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: customer.email,
        name: customer.name,
      });
      stripeCustomerId = stripeCustomer.id;
      await supabase.from("customers").update({ stripe_customer_id: stripeCustomerId }).eq("id", userId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "AI Payment Proxy Balance Top-up" },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: process.env.NEXT_PUBLIC_APP_URL + "/dashboard?deposit=success",
      cancel_url: process.env.NEXT_PUBLIC_APP_URL + "/dashboard?deposit=cancelled",
      metadata: { userId, amount: amount.toString() },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
