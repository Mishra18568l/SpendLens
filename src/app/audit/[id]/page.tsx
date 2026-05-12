import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAudit } from "@/lib/storage";
import AuditResultsClient from "./AuditResultsClient";
import type { AuditResult } from "@/types";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const audit = await getAudit(params.id);
  if (!audit) return { title: "Audit not found — SpendLens" };

  const savings = audit.totalMonthlySavings;
  const title =
    savings > 0
      ? `Save $${savings}/mo on AI tools — SpendLens Audit`
      : "Your AI spend is already optimized — SpendLens";

  return {
    title,
    description: audit.aiSummary.slice(0, 155),
    openGraph: {
      title,
      description: audit.aiSummary.slice(0, 155),
      images: [
        {
          url: `/api/og?id=${params.id}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: audit.aiSummary.slice(0, 155),
      images: [`/api/og?id=${params.id}`],
    },
  };
}

export default async function AuditResultPage({ params }: Props) {
  const audit = await getAudit(params.id);
  if (!audit) notFound();
  return <AuditResultsClient audit={audit} />;
}
