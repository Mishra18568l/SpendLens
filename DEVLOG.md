# Dev Log

## Day 1 — 2025-05-09

**Hours worked:** 8

**What I did:**
Scaffolded the entire Next.js 14 project with TypeScript and Tailwind. Built the core audit engine — the most critical piece of the whole product. This is pure TypeScript with no AI, just defensible rule-based logic for each tool: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf. Each tool has its own evaluator function that checks plan-seat fit, use-case fit, and cross-tool overlap. Also built the spend input form with localStorage persistence, the results page UI, the AI summary integration with Anthropic API + template fallback, Supabase storage layer with in-memory fallback, lead capture modal with honeypot spam protection, OG image generation for shareable URLs, and 14 Jest tests covering the audit engine.

Wrote all required documentation: README, ARCHITECTURE (with Mermaid diagram), PRICING_DATA (all 8 tools, sources cited), PROMPTS, TESTS, GTM, ECONOMICS, LANDING_COPY, METRICS.

Set up GitHub Actions CI that runs lint + tests on every push.

**What I learned:**
The audit engine needs cross-tool overlap detection, not just per-tool evaluation. A team paying for both Cursor Pro and GitHub Copilot is almost always wasting one subscription — but neither individual evaluator would catch that. Had to add a second pass over the full recommendations array to detect this. The pattern: sort by per-seat cost, flag the more expensive one as redundant.

Also learned that Next.js App Router requires careful separation of server and client components. The results page needs to be a server component for SSR/OG metadata, but the interactive parts (share button, lead modal) must be client components. Solved with a server page.tsx that fetches data and passes it to a client AuditResultsClient.tsx.

**Blockers / what I'm stuck on:**
The `nanoid` package is ESM-only in v5, which conflicts with Jest's CommonJS environment. Workaround: configure ts-jest with `module: "commonjs"` and import nanoid dynamically in tests. Not blocking but took 45 minutes to debug.

**Plan for tomorrow:**
Set up Supabase project and create the `audits` and `leads` tables. Set up Vercel deployment and get a live URL. Wire up Resend for transactional email. Test the full end-to-end flow with real env vars. Conduct first user interview.

---

## Day 2 — YYYY-MM-DD

**Hours worked:** [X]

**What I did:**
[Fill in after Day 2]

**What I learned:**
[Fill in]

**Blockers / what I'm stuck on:**
[Fill in]

**Plan for tomorrow:**
[Fill in]

---

## Day 3 — YYYY-MM-DD

**Hours worked:** [X]

**What I did:**
[Fill in]

**What I learned:**
[Fill in]

**Blockers / what I'm stuck on:**
[Fill in]

**Plan for tomorrow:**
[Fill in]

---

## Day 4 — YYYY-MM-DD

**Hours worked:** [X]

**What I did:**
[Fill in]

**What I learned:**
[Fill in]

**Blockers / what I'm stuck on:**
[Fill in]

**Plan for tomorrow:**
[Fill in]

---

## Day 5 — YYYY-MM-DD

**Hours worked:** [X]

**What I did:**
[Fill in]

**What I learned:**
[Fill in]

**Blockers / what I'm stuck on:**
[Fill in]

**Plan for tomorrow:**
[Fill in]

---

## Day 6 — YYYY-MM-DD

**Hours worked:** [X]

**What I did:**
[Fill in]

**What I learned:**
[Fill in]

**Blockers / what I'm stuck on:**
[Fill in]

**Plan for tomorrow:**
[Fill in]

---

## Day 7 — YYYY-MM-DD

**Hours worked:** [X]

**What I did:**
[Fill in — final polish, submission prep]

**What I learned:**
[Fill in]

**Blockers / what I'm stuck on:**
[Fill in]

**Plan for tomorrow:**
Submission submitted. Awaiting Round 2 results.
