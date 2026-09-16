import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://storefront-production-c1a7.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CreAI Automation Kits — Working AI Agents, Today",
  description:
    "Ready-to-deploy AI agent automation kits: lead qualification, inbox triage, and content repurposing. Prompt systems, runnable code, and no-code recipes you set up in 15 minutes.",
  keywords:
    "AI automation kit, AI agents, lead scoring, inbox triage, content repurposing, Claude automation, workflow automation",
  authors: [{ name: "CreAI" }],
  openGraph: {
    title: "CreAI Automation Kits — Working AI Agents, Today",
    description:
      "Ready-to-deploy AI agent automation kits for lead qualification, inbox triage, and content repurposing. Set up in 15 minutes.",
    url: "https://www.creai.dev",
    siteName: "CreAI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CreAI Automation Kits — Working AI Agents, Today",
    description:
      "Ready-to-deploy AI agent automation kits for lead qualification, inbox triage, and content repurposing.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
