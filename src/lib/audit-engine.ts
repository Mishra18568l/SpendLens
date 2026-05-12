import { nanoid } from "nanoid";
import type {
  AuditInput,
  AuditResult,
  ToolEntry,
  ToolRecommendation,
  UseCase,
} from "@/types";
import { TOOL_NAMES } from "./pricing";

// ─── Individual tool evaluators ───────────────────────────────────────────────

function evaluateCursor(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    toolId: "cursor",
    toolName: "Cursor",
    currentPlan: entry.plan,
    currentMonthlySpend: entry.monthlySpend,
  };

  // Business plan for ≤3 users: Copilot Individual is $10/seat vs $40
  if (entry.plan === "business" && entry.seats <= 3) {
    const recommended = entry.seats * 20; // Pro plan
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Business plan costs $40/seat but Pro is $20/seat and covers all core features for teams under 5. The SSO and audit-log features in Business add value only at >10 seats.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  // Enterprise for < 20 users is almost always overkill
  if (entry.plan === "enterprise" && entry.seats < 15) {
    const recommended = entry.seats * 40; // Business plan
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Business",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Enterprise tier is designed for 20+ seat deployments needing custom SLAs. Your team size doesn't justify the premium. Business ($40/seat) covers SSO and admin controls.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  // Non-coding use cases: Cursor Pro is wasteful
  if (useCase !== "coding" && entry.plan !== "hobby") {
    const recommended = 0;
    const savings = entry.monthlySpend;
    return {
      ...base,
      recommendedAction: "switch_tool",
      recommendedTool: useCase === "writing" ? "Claude Pro" : "ChatGPT Plus",
      recommendedMonthlySpend: entry.seats * 20,
      monthlySavings: Math.max(0, savings - entry.seats * 20),
      annualSavings: Math.max(0, savings - entry.seats * 20) * 12,
      reason: `Cursor is purpose-built for coding. For ${useCase} use cases, Claude Pro or ChatGPT Plus offer superior capabilities at the same or lower cost per seat.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  // Windsurf as cheaper alternative for coding (same quality, $15 vs $20)
  if (entry.plan === "pro" && entry.seats >= 5 && useCase === "coding") {
    const recommended = entry.seats * 15;
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "switch_tool",
      recommendedTool: "Windsurf Pro",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Windsurf Pro at $15/seat delivers comparable AI code completion and chat to Cursor Pro at $20/seat. For a team of ${entry.seats}, that's $${savings}/month saved with minimal migration cost.`,
      confidence: "medium",
    } as ToolRecommendation;
  }

  // Already optimal
  return {
    ...base,
    recommendedAction: "already_optimal",
    recommendedPlan: entry.plan,
    recommendedMonthlySpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `Your Cursor ${entry.plan} plan is appropriately matched to your team size of ${entry.seats} and coding use case.`,
    confidence: "high",
  } as ToolRecommendation;
}

function evaluateGithubCopilot(entry: ToolEntry, _useCase: UseCase): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    toolId: "github_copilot",
    toolName: "GitHub Copilot",
    currentPlan: entry.plan,
    currentMonthlySpend: entry.monthlySpend,
  };

  // Enterprise for < 10 users is overkill
  if (entry.plan === "enterprise" && entry.seats < 10) {
    const recommended = entry.seats * 19;
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Business",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `GitHub Copilot Enterprise ($39/seat) adds custom models and fine-tuning — valuable at 10+ seats. Business ($19/seat) covers policy controls and org management for smaller teams.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  // Paying more than $19/seat for Individual plan? Something's wrong
  if (entry.plan === "individual" && entry.monthlySpend / entry.seats > 12) {
    const recommended = entry.seats * 10;
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Individual",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Your per-seat cost is above the standard Individual plan rate of $10/seat. You may be paying annual billing incorrectly or have duplicate seats.`,
      confidence: "medium",
    } as ToolRecommendation;
  }

  return {
    ...base,
    recommendedAction: "already_optimal",
    recommendedPlan: entry.plan,
    recommendedMonthlySpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `GitHub Copilot ${entry.plan} is well-matched to your team size. GitHub's ecosystem integration justifies the cost if your team is GitHub-native.`,
    confidence: "high",
  } as ToolRecommendation;
}

function evaluateClaude(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    toolId: "claude",
    toolName: "Claude",
    currentPlan: entry.plan,
    currentMonthlySpend: entry.monthlySpend,
  };

  // Max plan for coding: wasteful, API direct is better
  if ((entry.plan === "max_5x" || entry.plan === "max_20x") && useCase === "coding") {
    const recommended = entry.seats * 20; // Pro is enough for most
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Claude Max ($100–$200/seat) is designed for power users doing intensive research and writing. For coding workflows, Claude Pro at $20/seat or API access is more economical and equally capable.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  // Team plan for < 5 people: use Pro instead
  if (entry.plan === "team" && entry.seats < 5) {
    const recommended = entry.seats * 20;
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Claude Team ($30/seat, min 5 seats) is designed for collaborative workflows. With fewer than 5 users, individual Pro plans at $20/seat are cheaper and functionally equivalent.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  // Enterprise for < 10 users
  if (entry.plan === "enterprise" && entry.seats < 10) {
    const recommended = entry.seats * 30;
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Team",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Claude Enterprise ($60/seat) is cost-justified at 10+ seats needing SOC2, SSO, and audit logs. The Team plan covers collaboration needs for smaller groups.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  return {
    ...base,
    recommendedAction: "already_optimal",
    recommendedPlan: entry.plan,
    recommendedMonthlySpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `Claude ${entry.plan} is well-suited to your ${useCase} use case and team size.`,
    confidence: "high",
  } as ToolRecommendation;
}

function evaluateChatGPT(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    toolId: "chatgpt",
    toolName: "ChatGPT",
    currentPlan: entry.plan,
    currentMonthlySpend: entry.monthlySpend,
  };

  // Team for < 3 people: use Plus
  if (entry.plan === "team" && entry.seats < 3) {
    const recommended = entry.seats * 20;
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Plus",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `ChatGPT Team ($30/seat) adds shared workspaces and higher rate limits — beneficial for 3+ users. With ${entry.seats} user(s), Plus at $20/seat is sufficient and cheaper.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  // Both ChatGPT Plus AND Claude Pro: likely overlap for non-coding
  if (entry.plan === "plus" && (useCase === "writing" || useCase === "research")) {
    return {
      ...base,
      recommendedAction: "switch_tool",
      recommendedTool: "Claude Pro",
      recommendedMonthlySpend: entry.seats * 20,
      monthlySavings: 0, // Same price — recommendation is qualitative
      annualSavings: 0,
      reason: `For ${useCase} tasks, Claude consistently scores higher on long-form coherence and instruction-following. If you're only using one general assistant, Claude Pro offers better ROI for this use case at the same $20/seat.`,
      confidence: "medium",
    } as ToolRecommendation;
  }

  return {
    ...base,
    recommendedAction: "already_optimal",
    recommendedPlan: entry.plan,
    recommendedMonthlySpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `ChatGPT ${entry.plan} is well-matched. GPT-4o is particularly strong for multimodal and plugin-heavy workflows.`,
    confidence: "high",
  } as ToolRecommendation;
}

function evaluateAPITool(entry: ToolEntry, label: "anthropic_api" | "openai_api"): ToolRecommendation {
  const toolName = label === "anthropic_api" ? "Anthropic API" : "OpenAI API";
  const base: Partial<ToolRecommendation> = {
    toolId: label,
    toolName,
    currentPlan: "API Direct",
    currentMonthlySpend: entry.monthlySpend,
  };

  // High API spend: Credex credits can reduce this significantly
  if (entry.monthlySpend > 300) {
    return {
      ...base,
      recommendedAction: "use_credits",
      recommendedMonthlySpend: entry.monthlySpend * 0.7, // ~30% discount via credits
      monthlySavings: entry.monthlySpend * 0.3,
      annualSavings: entry.monthlySpend * 0.3 * 12,
      reason: `At $${entry.monthlySpend}/mo on ${toolName}, you qualify for discounted API credits through Credex. Companies that over-forecasted usage sell surplus credits at 20–35% below retail — same API, same SLA, lower cost.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  return {
    ...base,
    recommendedAction: "already_optimal",
    recommendedMonthlySpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `Your ${toolName} spend is within a range where retail pricing is appropriate. At >$300/mo, discounted credit programs become cost-effective.`,
    confidence: "medium",
  } as ToolRecommendation;
}

function evaluateGemini(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    toolId: "gemini",
    toolName: "Gemini",
    currentPlan: entry.plan,
    currentMonthlySpend: entry.monthlySpend,
  };

  // Workspace add-on for teams not on Google Workspace: wasteful
  if (entry.plan === "workspace" && useCase === "coding") {
    const recommended = entry.seats * 20;
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "switch_tool",
      recommendedTool: "Cursor Pro or Claude Pro",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Gemini's Google Workspace integration provides most of its value for Docs/Sheets/Gmail workflows. For coding, purpose-built tools like Cursor or GitHub Copilot offer superior completions at equal or lower cost.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  return {
    ...base,
    recommendedAction: "already_optimal",
    recommendedPlan: entry.plan,
    recommendedMonthlySpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `Gemini ${entry.plan} is a reasonable choice, especially if your team is embedded in the Google ecosystem.`,
    confidence: "medium",
  } as ToolRecommendation;
}

function evaluateWindsurf(entry: ToolEntry, _useCase: UseCase): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    toolId: "windsurf",
    toolName: "Windsurf",
    currentPlan: entry.plan,
    currentMonthlySpend: entry.monthlySpend,
  };

  if (entry.plan === "teams" && entry.seats < 3) {
    const recommended = entry.seats * 15;
    const savings = entry.monthlySpend - recommended;
    return {
      ...base,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      recommendedMonthlySpend: recommended,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Windsurf Teams ($35/seat) adds admin dashboards and team analytics. For fewer than 3 developers, individual Pro plans at $15/seat provide the same coding capabilities.`,
      confidence: "high",
    } as ToolRecommendation;
  }

  return {
    ...base,
    recommendedAction: "already_optimal",
    recommendedPlan: entry.plan,
    recommendedMonthlySpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `Windsurf ${entry.plan} is priced competitively for coding use cases.`,
    confidence: "high",
  } as ToolRecommendation;
}

// ─── Duplicate tool detection ─────────────────────────────────────────────────

function detectOverlaps(
  entries: ToolEntry[],
  useCase: UseCase,
  recommendations: ToolRecommendation[]
): void {
  const codingTools = entries.filter((e) =>
    ["cursor", "github_copilot", "windsurf"].includes(e.toolId)
  );
  const assistantTools = entries.filter((e) =>
    ["claude", "chatgpt", "gemini"].includes(e.toolId)
  );

  // Two coding assistants for a small team: probably overlap
  if (codingTools.length >= 2 && entries[0]) {
    const teamSize =
      codingTools.reduce((s, e) => s + e.seats, 0) / codingTools.length;
    if (teamSize < 10) {
      // Find the cheaper option recommendation
      const cheapestCodingTool = codingTools.sort(
        (a, b) => a.monthlySpend / a.seats - b.monthlySpend / b.seats
      )[0];
      const expensiveTool = codingTools.find(
        (t) => t.toolId !== cheapestCodingTool?.toolId
      );
      if (expensiveTool) {
        const idx = recommendations.findIndex(
          (r) => r.toolId === expensiveTool.toolId
        );
        if (idx >= 0) {
          const savings = expensiveTool.monthlySpend;
          recommendations[idx] = {
            ...recommendations[idx],
            recommendedAction: "switch_tool",
            recommendedTool: TOOL_NAMES[cheapestCodingTool?.toolId ?? ""] ?? "cheaper alternative",
            recommendedMonthlySpend: 0,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reason: `You're paying for two AI coding assistants simultaneously (${TOOL_NAMES[expensiveTool.toolId]} + ${TOOL_NAMES[cheapestCodingTool?.toolId ?? ""]}). Developers rarely use more than one effectively. Consolidating saves $${savings}/mo with no productivity loss.`,
            confidence: "high",
          };
        }
      }
    }
  }

  // Two general assistants: likely overlap
  if (assistantTools.length >= 2 && useCase !== "coding") {
    const sorted = [...assistantTools].sort(
      (a, b) => b.monthlySpend - a.monthlySpend
    );
    const expensive = sorted[0];
    if (expensive) {
      const idx = recommendations.findIndex((r) => r.toolId === expensive.toolId);
      if (idx >= 0 && recommendations[idx].monthlySavings === 0) {
        const savings = expensive.monthlySpend;
        recommendations[idx] = {
          ...recommendations[idx],
          recommendedAction: "switch_tool",
          recommendedMonthlySpend: 0,
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: `You're subscribing to multiple general-purpose AI assistants (${assistantTools.map((t) => TOOL_NAMES[t.toolId]).join(", ")}). In practice, teams converge on one. Cutting ${TOOL_NAMES[expensive.toolId]} saves $${savings}/mo — run a 2-week trial on just one before committing.`,
          confidence: "medium",
        };
      }
    }
  }
}

// ─── Main audit function ──────────────────────────────────────────────────────

export function runAudit(input: AuditInput): Omit<AuditResult, "aiSummary"> {
  const { tools, teamSize, useCase } = input;

  const recommendations: ToolRecommendation[] = tools.map((entry) => {
    switch (entry.toolId) {
      case "cursor":
        return evaluateCursor(entry, useCase);
      case "github_copilot":
        return evaluateGithubCopilot(entry, useCase);
      case "claude":
        return evaluateClaude(entry, useCase);
      case "chatgpt":
        return evaluateChatGPT(entry, useCase);
      case "anthropic_api":
        return evaluateAPITool(entry, "anthropic_api");
      case "openai_api":
        return evaluateAPITool(entry, "openai_api");
      case "gemini":
        return evaluateGemini(entry, useCase);
      case "windsurf":
        return evaluateWindsurf(entry, useCase);
      default:
        return {
          toolId: entry.toolId,
          toolName: entry.toolId,
          currentPlan: entry.plan,
          currentMonthlySpend: entry.monthlySpend,
          recommendedAction: "already_optimal",
          recommendedMonthlySpend: entry.monthlySpend,
          monthlySavings: 0,
          annualSavings: 0,
          reason: "No specific optimization data available for this tool.",
          confidence: "low",
        } as ToolRecommendation;
    }
  });

  // Cross-tool overlap detection
  detectOverlaps(tools, useCase, recommendations);

  const totalCurrentSpend = tools.reduce((s, t) => s + t.monthlySpend, 0);
  const totalMonthlySavings = recommendations.reduce(
    (s, r) => s + r.monthlySavings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    input: { ...input, teamSize },
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    totalCurrentSpend,
    isAlreadyOptimal: totalMonthlySavings === 0,
    highSavings: totalMonthlySavings > 500,
  };
}
