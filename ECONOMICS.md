# Economics

## What is a converted lead worth to Credex?

Credex sells discounted AI infrastructure credits. A typical deal:

- **Average contract value (ACV):** $8,000/year (estimate: a 15-person startup spending $2,500/mo on AI API, switching 40% of that spend through Credex at ~20% margin)
- **Gross margin per deal:** ~25% → **$2,000 gross profit per customer/year**
- **Retention:** SaaS-style recurring; assume 70% annual retention → **LTV = $2,000 / (1 - 0.7) = ~$6,667 per customer**

Reasoning: Credex is a marketplace/broker model. The discount they offer users (20-35%) comes from buying surplus credits at 40-55% off retail from companies that over-forecasted. So on a $1,000 credit bundle, Credex pays ~$600, sells at ~$750 (25% off retail for buyer), captures $150 margin. At volume, margin is in the 20-30% range on GMV.

---

## CAC at each GTM channel

| Channel | Estimated CAC | Basis |
|---|---|---|
| HN Show HN | $0 (time only) | ~500 visits, 5% book consultation = 25 leads, 15% close = ~4 customers |
| Reddit organic | $0 (time only) | ~300 visits, 3% → consultation, 15% close |
| Twitter thread | $0 (time only) | ~2,000 impressions, 1% click, 5% consultation, 20% close |
| YC direct outreach | $0 | Warm relationship; 30 DMs → 10 try → 2 consult → 0.5 close |
| Newsletter placement | ~$500/placement | 500 clicks, 4% consult, 15% close = 3 customers → CAC $167 |
| Paid (future) | ~$800-1,200 | B2B SaaS benchmark; not recommended at MVP stage |

**Blended CAC at early stage (organic only): ~$50-150** (mostly founder time, some tooling)

---

## Conversion funnel math

```
Landing page visit
    ↓  35% start audit
Audit form started
    ↓  70% complete and submit
Audit result viewed
    ↓  20% open lead capture modal
Email submitted
    ↓  40% qualify (>$200/mo savings)
Qualified lead
    ↓  25% book Credex consultation
Consultation booked
    ↓  20% purchase credits
Customer acquired
```

**End-to-end: 100 visitors → 35 start → 24 complete → 5 email → 2 qualify → 0.5 book → 0.1 purchase**

So roughly: **1 customer per 1,000 visitors at current funnel**

At $6,667 LTV and $150 CAC (blended), that's **44x LTV:CAC** — strong if the funnel holds.

---

## What has to be true for $1M ARR in 18 months

**$1M ARR = ~125 customers at $8,000 ACV**

Working backwards from the funnel above:
- Need ~125,000 audit completions in 18 months → ~7,000/month by month 18
- To get 7,000 audits/month: need ~10,000 monthly visitors by month 18
- Month 1 target: 500 visitors, 150 audits
- Month 6 target: 2,500 visitors, 750 audits
- Month 12 target: 5,000 visitors, 1,500 audits

**What has to be true:**
1. **Viral loop works** — the shareable result URL generates organic shares. Target: 15% of users share their result. If each share reaches 200 people and 5% try the tool, that's a k-factor of 0.15 × 200 × 0.05 = 1.5 — which would be explosive. More realistic: k-factor of 0.3-0.5, supplemented by content.
2. **Credex consultation close rate holds at 20%+** — requires the sales motion to be warm and consultative, not pushy.
3. **Average deal size reaches $8k** — requires landing at least some 50+ seat companies where AI spend is $5k+/month.
4. **Retention at 70%+** — requires the credits program to actually save money vs retail, consistently.

**The single biggest risk:** the funnel from "audit completed" → "Credex consultation booked" is currently estimated at 25% for high-savings users. If it's actually 5%, the whole model requires 5x the traffic. Instrument this first.

---

## Spreadsheet summary

| Metric | Month 1 | Month 6 | Month 12 | Month 18 |
|---|---|---|---|---|
| Monthly visitors | 500 | 2,500 | 5,000 | 10,000 |
| Audits completed | 150 | 750 | 1,500 | 3,000 |
| Emails captured | 30 | 150 | 300 | 600 |
| Consultations booked | 7 | 37 | 75 | 150 |
| New customers | 1 | 7 | 15 | 30 |
| Cumulative customers | 1 | 30 | 90 | 125+ |
| ARR | $8k | $240k | $720k | $1M+ |

These are rough — inputs are estimated — but the structure is sound and the model becomes profitable well before month 18 given near-zero CAC.
