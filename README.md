# SpendLens — AI Tool Spend Audit

SpendLens is a free web app that audits what startups and engineering teams pay for AI tools (Cursor, Claude, ChatGPT, GitHub Copilot, and more) and surfaces exact, finance-grade savings recommendations with one-click sharing. Built as a lead-generation tool for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

**Live:** [https://spendlens.vercel.app](https://spendlens.vercel.app)

---

## Screenshots

> _Add 3+ screenshots or a Loom/YouTube screen recording link here before submission._

---

## Quick start

### Prerequisites
- Node.js 20+
- npm 9+

### Local development

```bash
git clone https://github.com/YOUR_USERNAME/spendlens.git
cd spendlens
npm install
cp .env.example .env.local
# Fill in .env.local (see Environment variables below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```env
# Required for AI summary (free tier available)
ANTHROPIC_API_KEY=sk-ant-...

# Required for lead persistence
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Required for transactional email
RESEND_API_KEY=re_...
```

All features work without these keys — the app uses in-memory storage and template summaries as fallbacks.

### Deploy to Vercel

```bash
npx vercel
# Set env vars in Vercel dashboard or via: vercel env add
```

### Run tests

```bash
npm test           # run all tests once
npm run test:watch # watch mode
```

---

## Decisions

1. **Next.js App Router over a SPA** — Server-side rendering lets each audit result URL have a unique `<meta>` OG tag without client-side hacks. The trade-off: slightly more complex routing and the need to split server/client components explicitly.

2. **Pure rule-based audit engine, no AI for the math** — The audit logic is deterministic TypeScript. Using an LLM for the savings calculations would introduce hallucinated numbers that a CFO would reject. AI is used only for the narrative summary, where it adds value and errors are low-stakes.

3. **Supabase with in-memory fallback** — Lets the app run fully locally without any external service, while shipping production-grade persistence. The fallback degrades gracefully (audits reset on server restart) without crashing.

4. **nanoid for audit IDs** — Short (10 chars), URL-safe, and collision-resistant at the scale this will operate at. UUIDs would work but are ugly in share URLs.

5. **Honeypot over CAPTCHA for spam protection** — hCaptcha adds friction for real users on the lead form. A hidden field catches bots with zero UX cost. Rate limiting (5 submissions/IP/hour) handles anything more sophisticated.

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system diagram and data flow.
