import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, system } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system,
        messages: messages.slice(-10),
      }),
    });

    const data = await response.json();
    const content = data.content?.[0]?.text || "Sorry, I could not process that request.";
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: "Something went wrong. Please try again." }, { status: 500 });
  }
}
