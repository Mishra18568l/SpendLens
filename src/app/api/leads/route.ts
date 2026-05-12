import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/storage";
import type { LeadData } from "@/types";

const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60 * 60 * 1000; // 1 hour
  const limit = 5;
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + window });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

async function sendConfirmationEmail(lead: LeadData): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log("[Email] No RESEND_API_KEY — skipping email to:", lead.email);
    return;
  }

  const isHighSavings = lead.totalMonthlySavings > 500;
  const subject = isHighSavings
    ? `Your SpendLens audit: $${lead.totalMonthlySavings}/mo savings identified`
    : "Your SpendLens AI spend audit";

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
      <div style="margin-bottom: 24px;">
        <span style="font-weight: 700; font-size: 20px; color: #22c55e;">SpendLens</span>
      </div>

      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">
        ${isHighSavings
          ? `We found $${lead.totalMonthlySavings}/month in savings`
          : "Your AI spend audit is ready"}
      </h1>

      <p style="color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
        ${isHighSavings
          ? `Your audit identified <strong style="color: #4ade80;">$${lead.totalMonthlySavings}/month ($${lead.totalMonthlySavings * 12}/year)</strong> in potential savings. Our team will reach out within 1 business day to discuss how Credex discounted credits can help you capture this.`
          : `Your audit is complete. Based on your current stack, your spending looks well-optimized. We'll notify you when new optimization opportunities apply.`}
      </p>

      <a href="https://spendlens.vercel.app/audit/${lead.auditId}"
        style="display: inline-block; padding: 12px 24px; background: #22c55e; color: #0a1a0a; border-radius: 8px; text-decoration: none; font-weight: 700; margin-bottom: 32px;">
        View your full audit →
      </a>

      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; color: #475569; font-size: 13px;">
        <p>SpendLens is a free tool by <a href="https://credex.rocks" style="color: #22c55e;">Credex</a> — discounted AI infrastructure credits for startups.</p>
        <p style="margin-top: 8px;">You're receiving this because you submitted your audit. No further emails unless you opt in.</p>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SpendLens <hello@spendlens.co>",
        to: lead.email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[Email] Resend error:", err);
    }
  } catch (err) {
    console.error("[Email] Failed to send:", err);
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait an hour." },
      { status: 429 }
    );
  }

  let body: LeadData;
  try {
    body = await req.json() as LeadData;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.email || !body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  if (!body.auditId) {
    return NextResponse.json({ error: "auditId required." }, { status: 400 });
  }

  await saveLead(body);
  await sendConfirmationEmail(body);

  return NextResponse.json({ ok: true });
}
