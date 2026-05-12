import type { AuditResult, LeadData } from "@/types";

// ─── In-memory fallback store ─────────────────────────────────────────────────
// Used when Supabase env vars aren't set (local dev without DB)
const memoryStore = new Map<string, AuditResult>();

// ─── Supabase client (lazy init) ──────────────────────────────────────────────
let supabase: ReturnType<typeof createSupabase> | null = null;

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  // Dynamic import to avoid crashing when package missing
  try {
    const { createClient } = require("@supabase/supabase-js");
    return createClient(url, key);
  } catch {
    return null;
  }
}

function getSupabase() {
  if (!supabase) supabase = createSupabase();
  return supabase;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function saveAudit(result: AuditResult): Promise<void> {
  const db = getSupabase();
  if (!db) {
    memoryStore.set(result.id, result);
    return;
  }

  const { error } = await db.from("audits").insert({
    id: result.id,
    created_at: result.createdAt,
    input: result.input,
    recommendations: result.recommendations,
    total_monthly_savings: result.totalMonthlySavings,
    total_annual_savings: result.totalAnnualSavings,
    total_current_spend: result.totalCurrentSpend,
    ai_summary: result.aiSummary,
    is_already_optimal: result.isAlreadyOptimal,
    high_savings: result.highSavings,
  });

  if (error) {
    console.error("[Storage] Failed to save audit:", error);
    memoryStore.set(result.id, result); // fallback
  }
}

export async function getAudit(id: string): Promise<AuditResult | null> {
  const db = getSupabase();
  if (!db) {
    return memoryStore.get(id) ?? null;
  }

  const { data, error } = await db
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return memoryStore.get(id) ?? null;
  }

  return {
    id: data.id,
    createdAt: data.created_at,
    input: data.input,
    recommendations: data.recommendations,
    totalMonthlySavings: data.total_monthly_savings,
    totalAnnualSavings: data.total_annual_savings,
    totalCurrentSpend: data.total_current_spend,
    aiSummary: data.ai_summary,
    isAlreadyOptimal: data.is_already_optimal,
    highSavings: data.high_savings,
  };
}

export async function saveLead(lead: LeadData): Promise<void> {
  const db = getSupabase();
  if (!db) {
    console.log("[Storage] Lead (no DB):", lead.email);
    return;
  }

  const { error } = await db.from("leads").insert({
    email: lead.email,
    company_name: lead.companyName,
    role: lead.role,
    team_size: lead.teamSize,
    audit_id: lead.auditId,
    total_monthly_savings: lead.totalMonthlySavings,
    created_at: new Date().toISOString(),
  });

  if (error) console.error("[Storage] Failed to save lead:", error);
}
