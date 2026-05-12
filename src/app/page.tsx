"use client";

import Link from "next/link";
import { ArrowRight, Zap, Shield, TrendingDown } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background mesh */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(34,197,94,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span
          className="font-display text-xl font-700 gradient-text"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
        >
          SpendLens
        </span>
        <a
          href="https://credex.rocks"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          By Credex →
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <div
          className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            color: "#4ade80",
          }}
        >
          <Zap size={14} />
          <span>Free • No login • Instant results</span>
        </div>

        <h1
          className="animate-fade-up delay-100 text-5xl sm:text-6xl md:text-7xl font-800 leading-tight mb-6"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          Stop overpaying for{" "}
          <span className="gradient-text">AI tools.</span>
        </h1>

        <p className="animate-fade-up delay-200 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Most startups are burning 30–50% more than they need to on Cursor,
          Claude, ChatGPT, and Copilot. SpendLens audits your stack in 2
          minutes and shows you exactly where the waste is.
        </p>

        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/audit" className="btn-primary text-base px-8 py-4">
            Audit my AI spend free <ArrowRight size={18} />
          </Link>
        </div>

        {/* Social proof */}
        <div className="animate-fade-up delay-400 mt-12 flex flex-wrap gap-6 justify-center text-sm text-slate-500">
          {[
            "No credit card",
            "Results in 60 seconds",
            "Used by 500+ engineering teams",
          ].map((text) => (
            <span key={text} className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#22c55e" }}
              />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: TrendingDown,
              title: "Benchmarked pricing",
              body: "Every recommendation traces to official vendor pricing pages — not guesses. A finance person will agree with the math.",
            },
            {
              icon: Zap,
              title: "AI-powered summary",
              body: "Get a personalized paragraph explaining your spend posture, written specifically for your stack and team size.",
            },
            {
              icon: Shield,
              title: "Honest analysis",
              body: "If you're spending well, we'll tell you. We don't manufacture savings to look impressive. Trust matters more.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="glass p-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "rgba(34,197,94,0.1)" }}
              >
                <Icon size={20} style={{ color: "#22c55e" }} />
              </div>
              <h3
                className="font-600 text-white mb-2"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600 }}
              >
                {title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-10 text-sm text-slate-600">
        <p>
          SpendLens is a free tool by{" "}
          <a
            href="https://credex.rocks"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Credex
          </a>{" "}
          — discounted AI infrastructure credits for startups.
        </p>
      </footer>
    </main>
  );
}
