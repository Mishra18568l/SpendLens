# Metrics

## North Star Metric

**Qualified leads generated per week** — defined as: users who completed an audit, have >$200/month in identified savings, and submitted their email.

**Why this and not others:**
- "Audits completed" doesn't capture value delivered (a $0-savings audit is noise)
- "Page visits" is vanity at this stage
- "Consultations booked" is too far down the funnel to optimize early
- "DAU" is wrong for a tool people use once a quarter when their team changes
- Qualified leads directly predicts Credex revenue, which is the actual goal

The North Star is where product quality (good audit logic), growth (traffic), and business value (Credex pipeline) all intersect.

---

## 3 Input Metrics That Drive the North Star

### 1. Audit completion rate
**Definition:** % of users who land on `/audit` and submit the form
**Target:** >65%
**Why it matters:** If people start and abandon, either the form is too long, too confusing, or the value prop isn't landing. Every 10% improvement in completion rate directly multiplies qualified leads.
**How to improve:** Reduce form fields, add progress indicator, surface "most teams take 90 seconds" copy.

### 2. Savings discovery rate
**Definition:** % of completed audits that identify >$200/month in savings
**Target:** >40%
**Why it matters:** This is a product quality metric. If the audit engine is good, it should find real savings for a meaningful portion of users. If this is low, the audit logic is too conservative or the wrong users are arriving.
**How to improve:** Tune audit engine thresholds; improve overlap detection; add more tools.

### 3. Email capture rate (post-audit)
**Definition:** % of users who see results and submit their email
**Target:** >18%
**Why it matters:** This is where the lead funnel begins. If users see results but don't email, either they don't trust the tool, the savings aren't compelling, or the CTA is weak.
**How to improve:** Show the CTA after the hero savings number, not buried below; A/B test copy ("get PDF report" vs "save my results").

---

## What to instrument first

In order of priority:

1. **Funnel drop-off:** `/` → `/audit` → form submit → results page → email submit. Track each step. The biggest drop-off point is the first optimization target.
2. **Audit result distribution:** histogram of `totalMonthlySavings` across all audits. Tells you if the engine is too aggressive or too conservative.
3. **Share link clicks:** how many people click the share button, and of those, how many result in a new unique visitor. This measures the viral loop.
4. **Time to complete audit:** if median is >3 minutes, the form is too long.
5. **High-savings Credex CTA click rate:** of users shown the Credex block (>$500/mo savings), what % click through. This is the direct revenue conversion rate.

Stack: Vercel Analytics (free, already integrated) for page views; PostHog (free tier) for funnel events; no need for anything heavier at MVP.

---

## Pivot trigger

**If after 4 weeks:** fewer than 15% of audits identify >$100/month in savings, the audit engine is either wrong (wrong rules) or the wrong users are arriving (wrong channels). At that point, reassess either the audit logic or the GTM targeting before investing further in growth.

A pivot doesn't mean killing the product — it might mean narrowing to just API-spend users (higher spend, clearer savings), or adjusting the audit engine to be more aggressive on overlap detection.
