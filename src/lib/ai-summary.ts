import Anthropic from "@anthropic-ai/sdk";
import type { AuditResult } from "@/types";
import { TOOL_NAMES } from "./pricing";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

/**
 * Builds the prompt for the AI summary.
 * Full prompt documented in PROMPTS.md
 */
function buildPrompt(audit: Omit<AuditResult, "aiSummary">): string {
  const toolList = audit.recommendations
    .map(
      (r) =>
        `- ${r.toolName} (${r.currentPlan}): $${r.currentMonthlySpend}/mo, ${r.recommendedAction}, saves $${r.monthlySavings}/mo`
    )
    .join("\n");

  return `You are a senior financial analyst reviewing an AI tool spend audit for a ${audit.input.teamSize}-person team whose primary use case is ${audit.input.useCase}.

Their current AI tool stack:
${toolList}

Total current spend: $${audit.totalCurrentSpend}/month
Total potential savings: $${audit.totalMonthlySavings}/month ($${audit.totalAnnualSavings}/year)

Write a concise, personalized audit summary of EXACTLY 80-110 words. Requirements:
- Address the team's specific situation (size, use case, tools)
- Lead with the most impactful finding
- Use plain, direct language — no fluff, no buzzwords
- Be honest: if they're already spending well, say so
- End with a single concrete next step
- Do NOT use bullet points — prose only
- Do NOT mention "SpendLens" or "Credex" by name

Output only the summary paragraph, nothing else.`;
}

/**
 * Generates a templated summary when AI is unavailable.
 */
function templateFallback(audit: Omit<AuditResult, "aiSummary">): string {
  if (audit.isAlreadyOptimal) {
    return `Your ${audit.input.teamSize}-person team is spending $${audit.totalCurrentSpend}/month on AI tools, and the analysis shows you're already making good choices. Your ${audit.input.useCase} use case is well-matched to your current stack. No major optimizations are flagged — continue monitoring as your team grows and vendor pricing evolves. Well done on thoughtful tool selection.`;
  }

  const topSaving = [...audit.recommendations].sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  )[0];

  return `Your ${audit.input.teamSize}-person team is spending $${audit.totalCurrentSpend}/month on AI tools, but could reduce that by $${audit.totalMonthlySavings}/month — $${audit.totalAnnualSavings}/year — without losing meaningful capability. ${topSaving ? `The biggest opportunity is ${topSaving.toolName}: ${topSaving.reason}` : ""} For a ${audit.input.useCase}-focused team, these optimizations require minimal transition effort. Start with the highest-savings change first, validate over two weeks, then proceed.`;
}

export async function generateSummary(
  audit: Omit<AuditResult, "aiSummary">
): Promise<string> {
  // No API key configured → use template
  if (!process.env.ANTHROPIC_API_KEY) {
    return templateFallback(audit);
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      messages: [{ role: "user", content: buildPrompt(audit) }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    if (!text.trim()) throw new Error("Empty response");
    return text.trim();
  } catch (err) {
    console.error("[AI Summary] API call failed, using template fallback:", err);
    return templateFallback(audit);
  }
}
