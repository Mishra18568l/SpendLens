# SETUP GUIDE — Read before pushing to GitHub

This file is for YOU (the submitter). Delete it before final submission.

---

## Step 1 — Install Node.js
Download from nodejs.org, install LTS (v20+). Verify: `node --version`

---

## Step 2 — Initialize and run locally

```bash
cd spendlens
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 — you should see the landing page.

---

## Step 3 — Set up Supabase (free)

1. Go to https://supabase.com → Sign up → New Project
2. Name it "spendlens", set a strong password, pick a region
3. Go to SQL Editor → paste the contents of `supabase-schema.sql` → Run
4. Go to Settings → API → copy:
   - "Project URL" → paste as `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - "service_role" key → paste as `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

---

## Step 4 — Set up Anthropic API (free credits available)

1. Go to https://console.anthropic.com → Sign up
2. Go to API Keys → Create Key
3. Paste as `ANTHROPIC_API_KEY` in `.env.local`
   (The app works without this — uses template fallback — but AI summaries are better)

---

## Step 5 — Set up Resend email (free tier = 100 emails/day)

1. Go to https://resend.com → Sign up
2. Create API Key → paste as `RESEND_API_KEY` in `.env.local`
3. Update the `from` address in `src/app/api/leads/route.ts` to match your verified domain
   (For testing, use `onboarding@resend.dev` which works without domain verification)

---

## Step 6 — Deploy to Vercel (free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, then add env vars:
vercel env add ANTHROPIC_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY

# Redeploy with env vars
vercel --prod
```

Your live URL will be something like `https://spendlens.vercel.app`

---

## Step 7 — Add screenshots to README

Take 3 screenshots:
1. The landing page
2. The audit form filled out
3. The results page with savings shown

Put them in a `/screenshots/` folder and link them in README.md

---

## Step 8 — Fill in the required personal content

These files MUST be filled in by YOU — they can't be generated:

- **DEVLOG.md** — Add real daily entries (Days 2-7) as you work
- **USER_INTERVIEWS.md** — Do 3 real 10-min interviews, replace the template
- **REFLECTION.md** — Answer all 5 questions with real specifics

---

## Step 9 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial project scaffold with full MVP

- Audit engine with 8 AI tools and cross-tool overlap detection
- Spend input form with localStorage persistence
- Results page with per-tool breakdown and hero savings
- AI summary via Anthropic API with template fallback
- Supabase storage layer with in-memory fallback
- Lead capture with honeypot spam protection + Resend email
- Shareable audit URLs with OG image generation
- 14 Jest tests covering audit engine
- GitHub Actions CI (lint + test on every push)
- Full documentation: README, ARCHITECTURE, PRICING_DATA, PROMPTS, TESTS, GTM, ECONOMICS, LANDING_COPY, METRICS"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/spendlens.git
git push -u origin main
```

---

## Step 10 — Verify CI is green

Go to github.com/YOUR_USERNAME/spendlens → Actions tab
Wait 2-3 minutes for the CI run to complete
It must show a green checkmark ✅

---

## Step 11 — For subsequent commits (Days 2-5)

Each day, make real changes (update DEVLOG, fix bugs, add features) and commit:

```bash
git add .
git commit -m "feat: wire up Supabase and deploy to Vercel"
git push
```

The git log must show commits on at least 5 different calendar days.
Use `git log --pretty=format:"%ad" --date=short | sort -u` to verify.

---

Delete this file before final submission!
