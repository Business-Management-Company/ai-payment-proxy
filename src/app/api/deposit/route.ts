import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId, email, amount } = await request.json();

    const session = await stripe.checkout.sessions.create({
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
      success_url: "https://aipaymentproxy.com/dashboard?deposit=success",
      cancel_url: "https://aipaymentproxy.com/dashboard?deposit=cancelled",
      metadata: { userId, amount: amount.toString() },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
