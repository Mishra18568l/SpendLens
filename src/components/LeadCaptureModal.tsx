"use client";

import { useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";

interface Props {
  auditId: string;
  totalMonthlySavings: number;
  onClose: () => void;
}

export default function LeadCaptureModal({
  auditId,
  totalMonthlySavings,
  onClose,
}: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [honeypot, setHoneypot] = useState(""); // spam trap
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    // Honeypot check
    if (honeypot) return;

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName: company,
          role,
          teamSize: teamSize ? Number(teamSize) : undefined,
          auditId,
          totalMonthlySavings,
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Submission failed");
      }
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative"
        style={{
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle
              size={48}
              className="mx-auto mb-4"
              style={{ color: "#22c55e" }}
            />
            <h3
              className="text-xl font-700 text-white mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              You&apos;re on the list!
            </h3>
            <p className="text-slate-400 text-sm">
              Check your inbox — your audit report is on its way. If you qualify
              for significant savings, our team will reach out.
            </p>
            <button onClick={onClose} className="btn-primary mt-6 mx-auto">
              Done
            </button>
          </div>
        ) : (
          <>
            <h3
              className="text-lg font-700 text-white mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Get your audit report
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              We&apos;ll email a full PDF with all recommendations.
              {totalMonthlySavings > 500 &&
                " Our team will also reach out about savings opportunities."}
            </p>

            {/* Honeypot - hidden from real users */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
            />

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Work email <span style={{ color: "#22c55e" }}>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input-base"
                  autoComplete="email"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                    className="input-base"
                    autoComplete="organization"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Role (optional)
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Eng Manager"
                    className="input-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Team size (optional)
                </label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="12"
                  className="input-base"
                  min={1}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm mt-3" style={{ color: "#fca5a5" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full justify-center mt-5"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {loading ? "Sending…" : "Send my report"}
            </button>

            <p className="text-center text-xs text-slate-600 mt-3">
              No spam. Unsubscribe anytime. We won&apos;t share your email.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
