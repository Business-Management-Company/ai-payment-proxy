import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendFirstCardEmail, sendUseCasesEmail, sendCheckInEmail, sendTrialEndingEmail } from "@/lib/emails";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-vercel-cron");
  if (!cronHeader && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();
  const now = new Date();
  const results: { email: string; emailNum: number; status: string; error?: string }[] = [];
  const sendAndLog = async (
    customer: any,
    emailNum: number,
    fn: () => Promise<any>
  ) => {
    const { data: sentEmails } = await supabase
      .from("email_sequence_log")
      .select("email_number")
      .eq("customer_id", customer.id);
    const sent = new Set((sentEmails || []).map((e: any) => e.email_number));
    if (sent.has(emailNum)) return;
    try {
      await fn();
      await supabase.from("email_sequence_log").insert({
        customer_id: customer.id,
        email_number: emailNum,
        email: customer.email,
      });
      results.push({ email: customer.email, emailNum, status: "sent" });
    } catch (err) {
      results.push({ email: customer.email, emailNum, status: "failed", error: String(err) });
    }
  };

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("subscription_status", "trialing");

  for (const customer of customers || []) {
    const signupDate = new Date(customer.created_at);
    const hoursSinceSignup = (now.getTime() - signupDate.getTime()) / (1000 * 60 * 60);
    const daysSinceSignup = hoursSinceSignup / 24;

    if (hoursSinceSignup >= 2 && hoursSinceSignup < 26) {
      await sendAndLog(customer, 2, () => sendFirstCardEmail(customer.email, customer.name));
    }
    if (daysSinceSignup >= 2 && daysSinceSignup < 3) {
      await sendAndLog(customer, 3, () => sendUseCasesEmail(customer.email, customer.name));
    }
    if (daysSinceSignup >= 5 && daysSinceSignup < 6) {
      await sendAndLog(customer, 4, () => sendCheckInEmail(customer.email, customer.name));
    }
    if (customer.trial_ends_at) {
      const daysUntilTrialEnd = (new Date(customer.trial_ends_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (daysUntilTrialEnd <= 2 && daysUntilTrialEnd > 0) {
        await sendAndLog(customer, 5, () => sendTrialEndingEmail(customer.email, customer.name, customer.trial_ends_at, customer.plan));
      }
    }
  }

  return NextResponse.json({ success: true, processed: customers?.length || 0, results });
}
