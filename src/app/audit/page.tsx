"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowRight, Info } from "lucide-react";
import type { AuditInput, ToolEntry, ToolId, UseCase } from "@/types";

const STORAGE_KEY = "spendlens_form_state";

const TOOLS: { id: ToolId; label: string; plans: string[] }[] = [
  {
    id: "cursor",
    label: "Cursor",
    plans: ["Hobby", "Pro", "Business", "Enterprise"],
  },
  {
    id: "github_copilot",
    label: "GitHub Copilot",
    plans: ["Individual", "Business", "Enterprise"],
  },
  {
    id: "claude",
    label: "Claude (Anthropic)",
    plans: ["Free", "Pro", "Max (5x)", "Max (20x)", "Team", "Enterprise"],
  },
  {
    id: "chatgpt",
    label: "ChatGPT (OpenAI)",
    plans: ["Plus", "Team", "Enterprise", "API Direct"],
  },
  {
    id: "anthropic_api",
    label: "Anthropic API",
    plans: ["API Direct"],
  },
  {
    id: "openai_api",
    label: "OpenAI API",
    plans: ["API Direct"],
  },
  {
    id: "gemini",
    label: "Gemini (Google)",
    plans: ["Pro (Advanced)", "Workspace Add-on", "API Direct"],
  },
  {
    id: "windsurf",
    label: "Windsurf",
    plans: ["Free", "Pro", "Teams"],
  },
];

const USE_CASES: { id: UseCase; label: string; description: string }[] = [
  { id: "coding", label: "Coding", description: "Writing & reviewing code" },
  { id: "writing", label: "Writing", description: "Docs, emails, content" },
  { id: "data", label: "Data / Analytics", description: "Analysis, SQL, reports" },
  { id: "research", label: "Research", description: "Summarizing, synthesis" },
  { id: "mixed", label: "Mixed", description: "A bit of everything" },
];

const defaultEntry = (toolId: ToolId): ToolEntry => ({
  toolId,
  plan: TOOLS.find((t) => t.id === toolId)?.plans[0] ?? "",
  monthlySpend: 0,
  seats: 1,
});

export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState<UseCase>("mixed");
  const [entries, setEntries] = useState<ToolEntry[]>([defaultEntry("cursor")]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Persist form state to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          teamSize?: number;
          useCase?: UseCase;
          entries?: ToolEntry[];
        };
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
        if (parsed.entries?.length) setEntries(parsed.entries);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ teamSize, useCase, entries })
    );
  }, [teamSize, useCase, entries]);

  function addTool(toolId: ToolId) {
    if (entries.some((e) => e.toolId === toolId)) return;
    setEntries((prev) => [...prev, defaultEntry(toolId)]);
  }

  function removeTool(toolId: ToolId) {
    setEntries((prev) => prev.filter((e) => e.toolId !== toolId));
  }

  function updateEntry(toolId: ToolId, field: keyof ToolEntry, value: string | number) {
    setEntries((prev) =>
      prev.map((e) => (e.toolId === toolId ? { ...e, [field]: value } : e))
    );
  }

  function validate(): boolean {
    const errs: string[] = [];
    if (entries.length === 0) errs.push("Add at least one AI tool.");
    entries.forEach((e) => {
      const label = TOOLS.find((t) => t.id === e.toolId)?.label ?? e.toolId;
      if (e.monthlySpend < 0) errs.push(`${label}: monthly spend can't be negative.`);
      if (e.seats < 1) errs.push(`${label}: seats must be at least 1.`);
    });
    setErrors(errs);
    return errs.length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    const payload: AuditInput = { tools: entries, teamSize, useCase };
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Audit failed");
      const data = (await res.json()) as { id: string };
      router.push(`/audit/${data.id}`);
    } catch {
      setErrors(["Something went wrong. Please try again."]);
      setLoading(false);
    }
  }

  const activeTool = entries.map((e) => e.toolId);

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <a href="/" className="text-sm text-slate-500 hover:text-white transition-colors mb-6 inline-block">
          ← SpendLens
        </a>
        <h1
          className="text-3xl sm:text-4xl font-800 mb-2"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          Audit your AI spend
        </h1>
        <p className="text-slate-400">
          Takes 2 minutes. No login required.
        </p>
      </div>

      {/* Step 1 — Context */}
      <div className="glass p-6 mb-6">
        <h2
          className="text-lg font-600 mb-5 flex items-center gap-2"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600 }}
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-700"
            style={{ background: "#22c55e", color: "#0a1a0a" }}
          >
            1
          </span>
          Your team context
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Team size (total headcount)
            </label>
            <input
              type="number"
              min={1}
              max={10000}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="input-base"
              aria-label="Team size"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Primary AI use case
            </label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value as UseCase)}
              className="input-base"
              aria-label="Primary use case"
            >
              {USE_CASES.map((uc) => (
                <option key={uc.id} value={uc.id}>
                  {uc.label} — {uc.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Step 2 — Tools */}
      <div className="glass p-6 mb-6">
        <h2
          className="text-lg font-600 mb-1 flex items-center gap-2"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600 }}
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-700"
            style={{ background: "#22c55e", color: "#0a1a0a" }}
          >
            2
          </span>
          Your AI tools
        </h2>
        <p className="text-sm text-slate-500 mb-5 ml-9">
          Add every tool your team pays for, even if some people use it free.
        </p>

        {/* Tool entries */}
        <div className="space-y-4">
          {entries.map((entry) => {
            const toolDef = TOOLS.find((t) => t.id === entry.toolId)!;
            return (
              <div
                key={entry.toolId}
                className="rounded-lg p-4"
                style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-500 text-white text-sm">
                    {toolDef.label}
                  </span>
                  <button
                    onClick={() => removeTool(entry.toolId)}
                    className="text-slate-600 hover:text-red-400 transition-colors p-1"
                    aria-label={`Remove ${toolDef.label}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Plan</label>
                    <select
                      value={entry.plan}
                      onChange={(e) => updateEntry(entry.toolId, "plan", e.target.value)}
                      className="input-base text-sm"
                      aria-label={`${toolDef.label} plan`}
                    >
                      {toolDef.plans.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Monthly spend ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={entry.monthlySpend}
                      onChange={(e) =>
                        updateEntry(entry.toolId, "monthlySpend", Number(e.target.value))
                      }
                      className="input-base text-sm"
                      placeholder="0"
                      aria-label={`${toolDef.label} monthly spend`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Seats</label>
                    <input
                      type="number"
                      min={1}
                      value={entry.seats}
                      onChange={(e) =>
                        updateEntry(entry.toolId, "seats", Number(e.target.value))
                      }
                      className="input-base text-sm"
                      aria-label={`${toolDef.label} seats`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add tool */}
        <div className="mt-5">
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
            <Info size={12} />
            Add another tool:
          </p>
          <div className="flex flex-wrap gap-2">
            {TOOLS.filter((t) => !activeTool.includes(t.id)).map((t) => (
              <button
                key={t.id}
                onClick={() => addTool(t.id)}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition-all"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: "#4ade80",
                }}
              >
                <Plus size={12} /> {t.label}
              </button>
            ))}
            {TOOLS.every((t) => activeTool.includes(t.id)) && (
              <span className="text-xs text-slate-600 italic">
                All supported tools added.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div
          className="rounded-lg p-4 mb-6 text-sm"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#fca5a5",
          }}
        >
          {errors.map((e) => (
            <p key={e}>• {e}</p>
          ))}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full justify-center text-base py-4"
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#0a1a0a", borderTopColor: "transparent" }} />
            Analyzing your spend…
          </>
        ) : (
          <>
            Run my free audit <ArrowRight size={18} />
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-600 mt-4">
        Your data is used only to generate your audit. We never sell it.
      </p>
    </main>
  );
}
