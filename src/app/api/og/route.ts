import { NextRequest, NextResponse } from "next/server";
import { getAudit } from "@/lib/storage";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  let title = "SpendLens — AI Tool Spend Audit";
  let subtitle = "Free AI spend audit for startups";

  if (id) {
    const audit = await getAudit(id);
    if (audit && audit.totalMonthlySavings > 0) {
      title = `Save $${audit.totalMonthlySavings}/mo on AI tools`;
      subtitle = `$${audit.totalAnnualSavings}/year identified across ${audit.recommendations.length} tool${audit.recommendations.length === 1 ? "" : "s"}`;
    } else if (audit) {
      title = "Your AI spend is already optimized";
      subtitle = `${audit.recommendations.length} tool${audit.recommendations.length === 1 ? "" : "s"} audited — spending well`;
    }
  }

  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#4ade80"/>
      <stop offset="100%" style="stop-color:#22c55e"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Glow circle -->
  <circle cx="600" cy="315" r="280" fill="rgba(34,197,94,0.04)"/>
  <circle cx="600" cy="315" r="200" fill="rgba(34,197,94,0.03)"/>

  <!-- Border -->
  <rect x="40" y="40" width="1120" height="550" rx="20" fill="none" stroke="rgba(34,197,94,0.2)" stroke-width="1.5"/>

  <!-- Brand -->
  <text x="80" y="110" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="#22c55e">SpendLens</text>

  <!-- Main title -->
  <text x="600" y="280" font-family="system-ui,sans-serif" font-size="56" font-weight="800" fill="#f1f5f9" text-anchor="middle">${title}</text>

  <!-- Subtitle -->
  <text x="600" y="350" font-family="system-ui,sans-serif" font-size="28" fill="#94a3b8" text-anchor="middle">${subtitle}</text>

  <!-- CTA -->
  <rect x="450" y="420" width="300" height="58" rx="10" fill="url(#accent)"/>
  <text x="600" y="457" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#0a1a0a" text-anchor="middle">Free audit →</text>

  <!-- Credex badge -->
  <text x="600" y="550" font-family="system-ui,sans-serif" font-size="18" fill="#475569" text-anchor="middle">by Credex — discounted AI credits for startups</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
