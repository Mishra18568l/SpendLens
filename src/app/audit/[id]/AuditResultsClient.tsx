"use client";

import { useState } from "react";
import {
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Mail,
} from "lucide-react";
import type { AuditResult, ToolRecommendation } from "@/types";
import LeadCaptureModal from "@/components/LeadCaptureModal";

const ACTION_LABELS: Record<string, string> = {
  downgrade_plan: "Downgrade plan",
  switch_tool: "Switch tool",
  use_credits: "Buy discounted credits",
  already_optimal: "Already optimal ✓",
  reduce_seats: "Reduce seats",
};

const CONFIDENCE_COLORS: Record<string, string> = {
  high: "#22c55e",
  medium: "#f59e0b",
  low: "#64748b",
};

function RecommendationCard({ rec }: { rec: ToolRecommendation }) {
  const [expanded, setExpanded] = useState(false);
  const isOptimal = rec.recommendedAction === "already_optimal";

  return (
    <div
      className="rounded-xl p-5 transition-all"
      style={{
        background: isOptimal
          ? "rgba(34,197,94,0.04)"
          : "rgba(15,23,42,0.7)",
        border: `1px solid ${isOptimal ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="font-600 text-white"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600 }}
            >
              {rec.toolName}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full text-slate-400"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              {rec.currentPlan}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-500"
              style={{
                background: isOptimal ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                color: isOptimal ? "#4ade80" : "#fbbf24",
              }}
            >
              {ACTION_LABELS[rec.recommendedAction]}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>${rec.currentMonthlySpend}/mo current</span>
            {rec.monthlySavings > 0 && (
              <>
                <span>→</span>
                <span style={{ color: "#4ade80" }}>
                  Save ${rec.monthlySavings}/mo
                </span>
              </>
            )}
          </div>
        </div>

        {rec.monthlySavings > 0 && (
          <div className="text-right shrink-0">
            <div
              className="text-2xl font-700"
              style={{ fontFamily: "'Syne', sans-serif", color: "#4ade80" }}
            >
              −${rec.monthlySavings}
            </div>
            <div className="text-xs text-slate-500">/month</div>
          </div>
        )}
      </div>

      {/* Expandable reason */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mt-3"
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? "Hide" : "See"} reasoning
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: CONFIDENCE_COLORS[rec.confidence] }}
        />
        <span style={{ color: CONFIDENCE_COLORS[rec.confidence] }}>
          {rec.confidence} confidence
        </span>
      </button>

      {expanded && (
        <p className="mt-3 text-sm text-slate-300 leading-relaxed border-t pt-3"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {rec.reason}
        </p>
      )}
    </div>
  );
}

export default function AuditResultsClient({ audit }: { audit: AuditResult }) {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://spendlens.vercel.app/audit/${audit.id}`;

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const sortedRecs = [...audit.recommendations].sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  );

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-10">
      {/* Nav */}
      <div className="flex items-center justify-between mb-10">
        <a href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
          ← SpendLens
        </a>
        <button
          onClick={handleCopy}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Share2 size={14} />
          {copied ? "Copied!" : "Share audit"}
        </button>
      </div>

      {/* Hero savings */}
      <div
        className="rounded-2xl p-8 mb-8 text-center relative overflow-hidden"
        style={{
          background: audit.isAlreadyOptimal
            ? "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.03))"
            : "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,163,74,0.06))",
          border: "1px solid rgba(34,197,94,0.2)",
        }}
      >
        {/* Glow */}
        <div
          aria-hidden
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{ background: "rgba(34,197,94,0.08)" }}
        />

        {audit.isAlreadyOptimal ? (
          <>
            <CheckCircle
              size={40}
              className="mx-auto mb-4"
              style={{ color: "#22c55e" }}
            />
            <h1
              className="text-3xl font-800 mb-2"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              You&apos;re spending well 👏
            </h1>
            <p className="text-slate-400">
              No significant optimizations found for your current stack.
            </p>
          </>
        ) : (
          <>
            <TrendingDown
              size={40}
              className="mx-auto mb-4"
              style={{ color: "#22c55e" }}
            />
            <p className="text-sm text-slate-400 mb-2 uppercase tracking-widest">
              Potential savings
            </p>
            <div
              className="text-6xl sm:text-7xl font-800 gradient-text mb-1"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              ${audit.totalMonthlySavings.toLocaleString()}
            </div>
            <div className="text-slate-400 mb-4">per month</div>
            <div className="text-xl font-600 text-white">
              = <span className="gradient-text">${audit.totalAnnualSavings.toLocaleString()}/year</span>
            </div>
            <p className="text-sm text-slate-500 mt-3">
              vs. current spend of ${audit.totalCurrentSpend}/mo
            </p>
          </>
        )}
      </div>

      {/* Credex CTA for high savings */}
      {audit.highSavings && (
        <div
          className="rounded-xl p-5 mb-8 flex items-start gap-4"
          style={{
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <AlertCircle size={20} style={{ color: "#22c55e", marginTop: 2, shrink: 0 }} />
          <div>
            <p className="font-600 text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              You qualify for discounted AI credits via Credex
            </p>
            <p className="text-sm text-slate-400 mb-3">
              At ${audit.totalMonthlySavings}/mo in savings, you're a strong candidate
              for Credex's discounted credit program — same API, same SLA, 20–35% lower cost.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-4 py-2.5 inline-flex"
            >
              Book a Credex consultation <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}

      {/* AI Summary */}
      <div className="glass p-6 mb-8">
        <h2
          className="text-sm uppercase tracking-widest text-slate-500 mb-3"
        >
          Personalized analysis
        </h2>
        <p className="text-slate-300 leading-relaxed">{audit.aiSummary}</p>
      </div>

      {/* Per-tool breakdown */}
      <div className="mb-8">
        <h2
          className="text-xl font-700 mb-5"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
        >
          Tool-by-tool breakdown
        </h2>
        <div className="space-y-3">
          {sortedRecs.map((rec) => (
            <RecommendationCard key={rec.toolId} rec={rec} />
          ))}
        </div>
      </div>

      {/* Lead capture */}
      <div
        className="rounded-xl p-6 text-center"
        style={{
          background: "rgba(30,41,59,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {audit.isAlreadyOptimal ? (
          <>
            <h3
              className="font-700 text-white mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Stay ahead of pricing changes
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              AI tool pricing shifts fast. Get notified when new optimizations apply to your stack.
            </p>
          </>
        ) : (
          <>
            <h3
              className="font-700 text-white mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Get your full report by email
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              We'll send a PDF version with all recommendations and implementation steps.
            </p>
          </>
        )}
        <button
          onClick={() => setShowLeadModal(true)}
          className="btn-primary mx-auto"
        >
          <Mail size={16} />
          {audit.isAlreadyOptimal ? "Notify me" : "Email my report"}
        </button>
      </div>

      {/* Share */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 mb-3">
          Know someone who could save on AI tools?
        </p>
        <button onClick={handleCopy} className="btn-secondary mx-auto">
          <Share2 size={14} />
          {copied ? "Link copied!" : "Share this audit"}
        </button>
        <p className="text-xs text-slate-600 mt-3">
          Public link strips your email and company name — only tools and savings are shown.
        </p>
      </div>

      {showLeadModal && (
        <LeadCaptureModal
          auditId={audit.id}
          totalMonthlySavings={audit.totalMonthlySavings}
          onClose={() => setShowLeadModal(false)}
        />
      )}
    </main>
  );
}
