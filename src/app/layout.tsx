import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens — AI Tool Spend Audit",
  description:
    "Find out exactly where your team is overspending on AI tools. Get a free, instant audit with actionable savings recommendations.",
  openGraph: {
    title: "SpendLens — AI Tool Spend Audit",
    description:
      "Free AI spend audit for startups. See where you're overpaying and how much you could save.",
    url: "https://spendlens.vercel.app",
    siteName: "SpendLens",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "SpendLens AI Spend Audit",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — AI Tool Spend Audit",
    description:
      "Free AI spend audit for startups. See where you're overpaying.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
