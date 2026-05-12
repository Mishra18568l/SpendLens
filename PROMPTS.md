# Prompts

## AI Summary Prompt

Used in: `src/lib/ai-summary.ts` → `generateSummary()`
Model: `claude-sonnet-4-20250514`

### Full prompt (as sent to the API)

```
You are a senior financial analyst reviewing an AI tool spend audit for a {teamSize}-person team whose primary use case is {useCase}.

Their current AI tool stack:
{toolList — one line per tool: name, plan, current spend, recommended action, savings}

Total current spend: ${totalCurrentSpend}/month
Total potential savings: ${totalMonthlySavings}/month (${totalAnnualSavings}/year)

Write a concise, personalized audit summary of EXACTLY 80-110 words. Requirements:
- Address the team's specific situation (size, use case, tools)
- Lead with the most impactful finding
- Use plain, direct language — no fluff, no buzzwords
- Be honest: if they're already spending well, say so
- End with a single concrete next step
- Do NOT use bullet points — prose only
- Do NOT mention "SpendLens" or "Credex" by name

Output only the summary paragraph, nothing else.
```

### Why this prompt was written this way

**"Senior financial analyst" persona** — The tool needs to feel authoritative, not like a chatbot. This framing consistently produces tighter, less hedged language than a neutral persona.

**"EXACTLY 80-110 words"** — A hard word count forces the model to be selective. Without it, the output routinely runs 200+ words and starts with generic preamble. The specific range (not "about 100 words") is deliberate — vague counts produce vague compliance.

**"Do NOT mention SpendLens or Credex by name"** — Keeps the summary shareable and avoids it reading like a marketing blurb. The brand appears elsewhere on the page.

**"Prose only, no bullets"** — Early versions used bullets, which looked redundant alongside the per-tool breakdown cards. Prose reads more like a human advisor and differentiates the AI output from the structured data.

**"Be honest: if they're already spending well, say so"** — Without this, the model would manufacture concerns to seem useful. Honest output builds trust; manufactured concerns destroy it.

### What was tried and didn't work

1. **Asking for a "recommendation paragraph"** — The model defaulted to restating the recommendations already shown in the table. Reframing as "audit summary" shifted the output toward synthesis.

2. **Including all recommendation details in the prompt** — When given the full `reason` text for each tool, the model would just stitch those reasons together verbatim. Giving only the high-level numbers forces it to synthesize.

3. **No word count constraint** — Outputs ranged from 60 to 300 words with wildly inconsistent quality. The hard count stabilized the distribution.

4. **"Write like a consultant"** — Produced jargon-heavy outputs ("leverage," "synergies," "actionable insights"). "Senior financial analyst" produced cleaner language.

---

## Template Fallback

When the Anthropic API is unavailable (no key, timeout, 429), `templateFallback()` generates a summary using string interpolation on the audit data. The template covers two branches:
- Already optimal: affirm the team's spending and close with a monitoring nudge
- Savings found: state the total, name the biggest opportunity, end with a concrete first step

The template is deliberately similar in structure to what the AI produces, so the experience degrades gracefully rather than obviously breaking.
