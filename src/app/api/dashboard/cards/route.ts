import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { label, limit_usd } = await request.json();
    const limitFloat = parseFloat(limit_usd);
    if (!limitFloat || limitFloat < 0.5) {
      return NextResponse.json({ error: "limit_usd must be at least $0.50" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    const warning = (customer.balance_usd || 0) < limitFloat
      ? "Balance is insufficient to fund this card. Add funds to activate it."
      : undefined;

    const stripeCard = await stripe.issuing.cards.create({
      cardholder: customer.stripe_cardholder_id,
      currency: "usd",
      type: "virtual",
      spending_controls: {
        spending_limits: [{ amount: Math.round(limitFloat * 100), interval: "per_authorization" }],
      },
    });

    const { data: card, error: insertError } = await supabase
      .from("virtual_cards")
      .insert({
        customer_id: customer.id,
        stripe_card_id: stripeCard.id,
        label: label || "",
        limit_usd: limitFloat,
        merchant_category: "all",
        status: "active",
      })
      .select()
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

    await supabase
      .from("customers")
      .update({ cards_used_this_month: (customer.cards_used_this_month || 0) + 1 })
      .eq("id", customer.id);

    return NextResponse.json({ success: true, warning, data: card });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
