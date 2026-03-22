import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    const body = new URLSearchParams();
    body.append("secret", process.env.TURNSTILE_SECRET_KEY ?? "");
    body.append("response", token);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json({ error: "Bot verification failed. Please try again." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Verification error" }, { status: 500 });
  }
}
