import { runAudit } from "@/lib/audit-engine";
import type { AuditInput } from "@/types";

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeInput(overrides: Partial<AuditInput> = {}): AuditInput {
  return {
    teamSize: 5,
    useCase: "coding",
    tools: [],
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Audit Engine — Cursor", () => {
  test("Cursor Business for ≤3 users should recommend downgrade to Pro", () => {
    const result = runAudit(
      makeInput({
        tools: [{ toolId: "cursor", plan: "Business", monthlySpend: 120, seats: 3 }],
      })
    );
    const rec = result.recommendations[0]!;
    expect(rec.recommendedAction).toBe("downgrade_plan");
    expect(rec.recommendedPlan).toBe("Pro");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  test("Cursor Pro for a 10-person coding team should be already optimal", () => {
    const result = runAudit(
      makeInput({
        teamSize: 10,
        tools: [{ toolId: "cursor", plan: "Pro", monthlySpend: 200, seats: 10 }],
      })
    );
    const rec = result.recommendations[0]!;
    expect(rec.recommendedAction).toBe("already_optimal");
    expect(rec.monthlySavings).toBe(0);
  });

  test("Cursor Enterprise for <15 users should downgrade to Business", () => {
    const result = runAudit(
      makeInput({
        tools: [{ toolId: "cursor", plan: "Enterprise", monthlySpend: 600, seats: 10 }],
      })
    );
    const rec = result.recommendations[0]!;
    expect(rec.recommendedAction).toBe("downgrade_plan");
    expect(rec.recommendedPlan).toBe("Business");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  test("Cursor Pro for writing use case should recommend switch to writing tool", () => {
    const result = runAudit(
      makeInput({
        useCase: "writing",
        tools: [{ toolId: "cursor", plan: "Pro", monthlySpend: 100, seats: 5 }],
      })
    );
    const rec = result.recommendations[0]!;
    expect(rec.recommendedAction).toBe("switch_tool");
  });
});

describe("Audit Engine — Claude", () => {
  test("Claude Max for coding use case should downgrade to Pro", () => {
    const result = runAudit(
      makeInput({
        useCase: "coding",
        tools: [{ toolId: "claude", plan: "max_5x", monthlySpend: 300, seats: 3 }],
      })
    );
    const rec = result.recommendations[0]!;
    expect(rec.recommendedAction).toBe("downgrade_plan");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  test("Claude Team for <5 users should recommend individual Pro plans", () => {
    const result = runAudit(
      makeInput({
        tools: [{ toolId: "claude", plan: "team", monthlySpend: 120, seats: 4 }],
      })
    );
    const rec = result.recommendations[0]!;
    expect(rec.recommendedAction).toBe("downgrade_plan");
    expect(rec.recommendedPlan).toBe("Pro");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });
});

describe("Audit Engine — API tools", () => {
  test("Anthropic API spend >$300/mo should recommend Credex credits", () => {
    const result = runAudit(
      makeInput({
        tools: [{ toolId: "anthropic_api", plan: "API Direct", monthlySpend: 500, seats: 1 }],
      })
    );
    const rec = result.recommendations[0]!;
    expect(rec.recommendedAction).toBe("use_credits");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  test("OpenAI API spend ≤$300/mo should be already optimal", () => {
    const result = runAudit(
      makeInput({
        tools: [{ toolId: "openai_api", plan: "API Direct", monthlySpend: 100, seats: 1 }],
      })
    );
    const rec = result.recommendations[0]!;
    expect(rec.recommendedAction).toBe("already_optimal");
  });
});

describe("Audit Engine — Overlap detection", () => {
  test("Two coding assistants for small team should flag one as redundant", () => {
    const result = runAudit(
      makeInput({
        teamSize: 5,
        useCase: "coding",
        tools: [
          { toolId: "cursor", plan: "Pro", monthlySpend: 100, seats: 5 },
          { toolId: "github_copilot", plan: "Individual", monthlySpend: 50, seats: 5 },
        ],
      })
    );
    const savingsTotal = result.totalMonthlySavings;
    expect(savingsTotal).toBeGreaterThan(0);
  });
});

describe("Audit Engine — Aggregate totals", () => {
  test("Total monthly savings equals sum of individual savings", () => {
    const result = runAudit(
      makeInput({
        tools: [
          { toolId: "cursor", plan: "Business", monthlySpend: 120, seats: 3 },
          { toolId: "claude", plan: "team", monthlySpend: 90, seats: 3 },
        ],
      })
    );
    const sumSavings = result.recommendations.reduce(
      (s, r) => s + r.monthlySavings,
      0
    );
    expect(result.totalMonthlySavings).toBe(sumSavings);
  });

  test("Annual savings equals monthly * 12", () => {
    const result = runAudit(
      makeInput({
        tools: [
          { toolId: "anthropic_api", plan: "API Direct", monthlySpend: 600, seats: 1 },
        ],
      })
    );
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  test("highSavings flag is true when savings >$500/mo", () => {
    const result = runAudit(
      makeInput({
        tools: [
          { toolId: "anthropic_api", plan: "API Direct", monthlySpend: 2000, seats: 1 },
        ],
      })
    );
    expect(result.highSavings).toBe(true);
  });

  test("isAlreadyOptimal is true when no savings are found", () => {
    const result = runAudit(
      makeInput({
        useCase: "coding",
        tools: [
          { toolId: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
        ],
      })
    );
    expect(result.isAlreadyOptimal).toBe(true);
  });

  test("Savings are never negative", () => {
    const result = runAudit(
      makeInput({
        tools: [
          { toolId: "cursor", plan: "Hobby", monthlySpend: 0, seats: 1 },
          { toolId: "windsurf", plan: "Free", monthlySpend: 0, seats: 1 },
        ],
      })
    );
    result.recommendations.forEach((r) => {
      expect(r.monthlySavings).toBeGreaterThanOrEqual(0);
      expect(r.annualSavings).toBeGreaterThanOrEqual(0);
    });
  });
});
