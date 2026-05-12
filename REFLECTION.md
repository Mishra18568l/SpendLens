# Reflection

> **Fill each section with 150–400 words. Be specific. Vague answers score poorly.**

---

## 1. The hardest bug you hit this week

**[Write this yourself — it must be a real bug you actually debugged. Here's an example of the level of specificity they want:]**

Example format: "On Day 2, the audit results page was returning a 404 for every audit ID. I assumed the issue was the Supabase query. I added console logs to `getAudit()` and saw the function was being called with the right ID but returning null. My hypothesis was that the row wasn't being inserted. I checked the Supabase dashboard — the insert was succeeding. Then I noticed the column name: my TypeScript code was writing to `audit_id` but the table schema had `id`. The ORM wasn't throwing an error, just silently ignoring the mismatched column. Fixed by aligning the column name. Took 2 hours because I was looking at the wrong layer."

---

## 2. A decision you reversed mid-week

**[Write this yourself. Real example of what this looks like:]**

Example: "I originally planned to use the Anthropic API to generate the savings recommendations themselves — not just the summary. By Day 3 I reversed this after writing the audit engine rules manually. The reversal happened when I realized: if Claude generates the numbers, a user can't trust them. There's no source to cite. A CFO reading '$340/month savings' needs to know where that came from. Hardcoded rules with cited pricing pages are auditable. AI-generated numbers aren't. The assignment actually hinted at this ('knowing when not to use AI is part of the test') but I didn't fully internalize it until I'd written half the LLM-based version."

---

## 3. What you would build in week 2

[150–400 words on what week 2 looks like — be specific about features, not vague about "improvements"]

Suggested direction: PDF export of the full audit report, a benchmark mode ("your AI spend per developer is $X, companies your size average $Y"), and a referral system where sharing your audit URL gets both parties a Credex credit discount. The shareable URL is the viral loop — the referral mechanic would accelerate it.

Also: better pricing data. The current engine uses fixed per-seat prices but most API tools are consumption-based. Week 2 would add an "API spend estimator" that takes your approximate monthly token usage and models actual cost vs alternatives.

---

## 4. How you used AI tools

[150–400 words — be honest about which tools, what tasks, what you didn't trust them with, and one specific time the AI was wrong]

Required content:
- Which tool(s): e.g., Claude, Cursor, ChatGPT
- What you used them for: e.g., "boilerplate React components, CSS debugging, first drafts of the GTM and ECONOMICS docs"
- What you didn't trust them with: e.g., "the audit engine business logic — I wrote every rule by hand and verified against pricing pages. The AI would confidently generate rules that sounded right but didn't match actual vendor pricing."
- One specific time it was wrong: e.g., "Claude told me Windsurf Teams was $25/seat. The actual price is $35/seat. I caught it because I always verify against the vendor page before adding any number to PRICING_DATA.md."

---

## 5. Self-ratings

| Dimension | Rating (1–10) | Reason |
|---|---|---|
| Discipline | [X] | [One sentence] |
| Code quality | [X] | [One sentence] |
| Design sense | [X] | [One sentence] |
| Problem-solving | [X] | [One sentence] |
| Entrepreneurial thinking | [X] | [One sentence] |
