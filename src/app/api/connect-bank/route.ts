
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    const session = await stripe.financialConnections.sessions.create({
      account_holder: {
        type: "customer",
        customer: customerId,
      },
      permissions: ["payment_method", "balances"],
      filters: { countries: ["US"] },
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
