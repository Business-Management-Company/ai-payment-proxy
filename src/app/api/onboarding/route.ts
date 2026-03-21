import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name } = await request.json();
    const supabase = createClient();

    const { data: existing } = await supabase
      .from("customers")
      .select("api_key_prefix")
      .eq("id", userId)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Already onboarded" }, { status: 400 });
    }

    const cardholder = await stripe.issuing.cardholders.create({
      name,
      email,
      type: "individual",
      billing: {
        address: {
          line1: "123 Main St",
          city: "San Francisco",
          state: "CA",
          postal_code: "94105",
          country: "US",
        },
      },
    });

    const rawKey = "aipp_live_" + crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const prefix = rawKey.substring(0, 16);

    await supabase.from("customers").insert({
      id: userId,
      email,
      name,
      stripe_cardholder_id: cardholder.id,
      api_key_hash: hash,
      api_key_prefix: prefix,
      plan: "developer",
    });

    return NextResponse.json({
      apiKey: rawKey,
      prefix,
      stripeCardholderId: cardholder.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
