# Tests

All tests live in `src/__tests__/` and run with Jest + ts-jest.

## How to run

```bash
npm test              # run all tests once
npm run test:watch    # watch mode for development
```

CI runs `npm test` on every push to `main` via `.github/workflows/ci.yml`.

---

## Test inventory

### `src/__tests__/audit-engine.test.ts`

**File covers:** The core audit engine (`src/lib/audit-engine.ts`) — the most critical business logic in the project.

| Test name | What it covers |
|---|---|
| Cursor Business for ≤3 users → downgrade to Pro | Verifies the per-seat cost logic: Business at $40/seat is flagged when Pro at $20 suffices |
| Cursor Pro for 10-person coding team → already optimal | Confirms the engine doesn't over-flag legitimate plans |
| Cursor Enterprise for <15 users → downgrade to Business | Enterprise threshold validation |
| Cursor Pro for writing use case → switch tool | Cross-use-case misfit detection |
| Claude Max for coding → downgrade to Pro | Max plan overkill detection for coding teams |
| Claude Team for <5 users → individual Pro plans | Minimum seat threshold validation |
| Anthropic API >$300/mo → recommend Credex credits | High-spend API credit recommendation |
| OpenAI API ≤$300/mo → already optimal | Low-spend API threshold check |
| Two coding assistants for small team → flag overlap | Cross-tool overlap detection logic |
| Total monthly savings = sum of individual savings | Aggregate math correctness |
| Annual savings = monthly × 12 | Basic arithmetic integrity |
| `highSavings` flag is true when savings >$500/mo | Hero CTA trigger condition |
| `isAlreadyOptimal` is true when no savings found | Optimal-state detection |
| Savings are never negative | Edge case: spending exactly at plan price |

**Run these specifically:**
```bash
npm test -- --testPathPattern=audit-engine
```
