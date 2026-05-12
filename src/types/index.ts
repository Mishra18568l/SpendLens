// ─── Tool definitions ────────────────────────────────────────────────────────

export type ToolId =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolEntry {
  toolId: ToolId;
  plan: string;
  monthlySpend: number; // USD
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

// ─── Audit results ────────────────────────────────────────────────────────────

export type RecommendationType =
  | "downgrade_plan"
  | "switch_tool"
  | "use_credits"
  | "already_optimal"
  | "reduce_seats";

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendedAction: RecommendationType;
  recommendedPlan?: string;
  recommendedTool?: string;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  confidence: "high" | "medium" | "low";
}

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  aiSummary: string;
  isAlreadyOptimal: boolean;
  highSavings: boolean; // > $500/mo
}

// ─── Lead capture ─────────────────────────────────────────────────────────────

export interface LeadData {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  totalMonthlySavings: number;
}

// ─── Pricing data ─────────────────────────────────────────────────────────────

export interface PlanPricing {
  planId: string;
  planName: string;
  pricePerSeatPerMonth: number;
  minSeats?: number;
  maxSeats?: number;
  bestFor: UseCase[];
  notes?: string;
}

export interface ToolPricing {
  toolId: ToolId;
  toolName: string;
  plans: PlanPricing[];
}
