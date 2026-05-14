import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { generateSummary } from "@/lib/ai-summary";
import { saveAudit } from "@/lib/storage";
import type { AuditInput } from "@/types";

// Simple in-memory rate limit (per IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60 * 1000; // 1 minute
  const limit = 10;

  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + window });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  let body: AuditInput;
  try {
    body = await req.json() as AuditInput;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Basic validation
  if (!body.tools || !Array.isArray(body.tools) || body.tools.length === 0) {
    return NextResponse.json({ error: "No tools provided." }, { status: 400 });
  }

  // Run pure-logic audit
  const auditBase = runAudit(body);

  // Generate AI summary (with fallback)
  const aiSummary = await generateSummary(auditBase);

  const fullResult = { ...auditBase, aiSummary };

  // Persist to Supabase (or memory fallback)
  await saveAudit(fullResult);

 return NextResponse.json(fullResult);
}
