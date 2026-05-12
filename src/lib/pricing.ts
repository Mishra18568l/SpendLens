import type { ToolPricing } from "@/types";

/**
 * All prices verified from official vendor pricing pages.
 * Sources documented in PRICING_DATA.md at repo root.
 * Last verified: 2025-05-09
 */
export const PRICING_DATA: ToolPricing[] = [
  {
    toolId: "cursor",
    toolName: "Cursor",
    plans: [
      {
        planId: "hobby",
        planName: "Hobby",
        pricePerSeatPerMonth: 0,
        bestFor: ["coding"],
        notes: "Free tier, limited completions",
      },
      {
        planId: "pro",
        planName: "Pro",
        pricePerSeatPerMonth: 20,
        bestFor: ["coding"],
        notes: "500 fast requests/mo, unlimited slow",
      },
      {
        planId: "business",
        planName: "Business",
        pricePerSeatPerMonth: 40,
        minSeats: 1,
        bestFor: ["coding"],
        notes: "Team features, SSO, admin controls",
      },
      {
        planId: "enterprise",
        planName: "Enterprise",
        pricePerSeatPerMonth: 60,
        minSeats: 20,
        bestFor: ["coding"],
        notes: "Custom deployment, SLA",
      },
    ],
  },
  {
    toolId: "github_copilot",
    toolName: "GitHub Copilot",
    plans: [
      {
        planId: "individual",
        planName: "Individual",
        pricePerSeatPerMonth: 10,
        bestFor: ["coding"],
        notes: "Basic completions, chat",
      },
      {
        planId: "business",
        planName: "Business",
        pricePerSeatPerMonth: 19,
        bestFor: ["coding"],
        notes: "Organization management, policy controls",
      },
      {
        planId: "enterprise",
        planName: "Enterprise",
        pricePerSeatPerMonth: 39,
        bestFor: ["coding"],
        notes: "Custom models, fine-tuning, security",
      },
    ],
  },
  {
    toolId: "claude",
    toolName: "Claude (Anthropic)",
    plans: [
      {
        planId: "free",
        planName: "Free",
        pricePerSeatPerMonth: 0,
        bestFor: ["writing", "research", "mixed"],
        notes: "Limited messages",
      },
      {
        planId: "pro",
        planName: "Pro",
        pricePerSeatPerMonth: 20,
        bestFor: ["writing", "research", "mixed"],
        notes: "5x more usage, priority access",
      },
      {
        planId: "max_5x",
        planName: "Max (5x)",
        pricePerSeatPerMonth: 100,
        bestFor: ["writing", "research", "mixed"],
        notes: "5x Pro usage limits",
      },
      {
        planId: "max_20x",
        planName: "Max (20x)",
        pricePerSeatPerMonth: 200,
        bestFor: ["writing", "research", "data"],
        notes: "20x Pro usage limits",
      },
      {
        planId: "team",
        planName: "Team",
        pricePerSeatPerMonth: 30,
        minSeats: 5,
        bestFor: ["writing", "research", "mixed"],
        notes: "Collaboration features, longer context",
      },
      {
        planId: "enterprise",
        planName: "Enterprise",
        pricePerSeatPerMonth: 60,
        minSeats: 10,
        bestFor: ["writing", "data", "research"],
        notes: "SSO, audit logs, custom deployment",
      },
    ],
  },
  {
    toolId: "chatgpt",
    toolName: "ChatGPT (OpenAI)",
    plans: [
      {
        planId: "plus",
        planName: "Plus",
        pricePerSeatPerMonth: 20,
        bestFor: ["writing", "research", "mixed"],
        notes: "GPT-4o access, DALL-E, plugins",
      },
      {
        planId: "team",
        planName: "Team",
        pricePerSeatPerMonth: 30,
        minSeats: 2,
        bestFor: ["writing", "research", "mixed"],
        notes: "Higher caps, workspace features",
      },
      {
        planId: "enterprise",
        planName: "Enterprise",
        pricePerSeatPerMonth: 60,
        minSeats: 10,
        bestFor: ["writing", "data", "research"],
        notes: "SOC2, SSO, unlimited GPT-4",
      },
      {
        planId: "api",
        planName: "API Direct",
        pricePerSeatPerMonth: 0,
        bestFor: ["coding", "data", "mixed"],
        notes: "Pay per token — highly variable",
      },
    ],
  },
  {
    toolId: "anthropic_api",
    toolName: "Anthropic API",
    plans: [
      {
        planId: "api",
        planName: "API Direct",
        pricePerSeatPerMonth: 0,
        bestFor: ["coding", "data", "mixed"],
        notes:
          "Pay per token: Sonnet ~$3/MTok in, $15/MTok out. Highly variable.",
      },
    ],
  },
  {
    toolId: "openai_api",
    toolName: "OpenAI API",
    plans: [
      {
        planId: "api",
        planName: "API Direct",
        pricePerSeatPerMonth: 0,
        bestFor: ["coding", "data", "mixed"],
        notes:
          "Pay per token: GPT-4o ~$2.50/MTok in, $10/MTok out. Highly variable.",
      },
    ],
  },
  {
    toolId: "gemini",
    toolName: "Gemini (Google)",
    plans: [
      {
        planId: "pro",
        planName: "Gemini Advanced (Pro)",
        pricePerSeatPerMonth: 20,
        bestFor: ["writing", "research", "mixed"],
        notes: "1.5 Pro access, 1M context",
      },
      {
        planId: "workspace",
        planName: "Workspace Add-on",
        pricePerSeatPerMonth: 30,
        bestFor: ["writing", "research", "mixed"],
        notes: "Integrated with Google Workspace",
      },
      {
        planId: "api",
        planName: "API Direct",
        pricePerSeatPerMonth: 0,
        bestFor: ["coding", "data", "mixed"],
        notes: "Pay per token — see ai.google.dev/pricing",
      },
    ],
  },
  {
    toolId: "windsurf",
    toolName: "Windsurf (Codeium)",
    plans: [
      {
        planId: "free",
        planName: "Free",
        pricePerSeatPerMonth: 0,
        bestFor: ["coding"],
        notes: "Limited AI flows",
      },
      {
        planId: "pro",
        planName: "Pro",
        pricePerSeatPerMonth: 15,
        bestFor: ["coding"],
        notes: "Unlimited completions, priority",
      },
      {
        planId: "teams",
        planName: "Teams",
        pricePerSeatPerMonth: 35,
        minSeats: 2,
        bestFor: ["coding"],
        notes: "Admin dashboard, team analytics",
      },
    ],
  },
];

export function getPricing(toolId: string): ToolPricing | undefined {
  return PRICING_DATA.find((t) => t.toolId === toolId);
}

export function getPlan(toolId: string, planId: string) {
  return getPricing(toolId)?.plans.find((p) => p.planId === planId);
}

export const TOOL_NAMES: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};
