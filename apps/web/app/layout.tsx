import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://storefront-production-c1a7.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CreAI Automation Kits — Working AI Agents, Today",
  description:
    "Ready-to-deploy AI agent automation kits: lead qualification, inbox triage, and content repurposing. Prompt systems, runnable code, and no-code recipes you set up in 15 minutes.",
  keywords:
    "AI automation kit, AI agents, lead scoring, inbox triage, content repurposing, Claude automation, workflow automation, agent skills",
  authors: [{ name: "CreAI" }],
  openGraph: {
    title: "CreAI Automation Kits — Working AI Agents, Today",
    description:
      "Ready-to-deploy AI agent automation kits and agent skills for lead qualification, inbox triage, and content repurposing. Set up in 15 minutes.",
    url: SITE_URL,
    siteName: "CreAI",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "CreAI — working AI agents, this afternoon" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "CreAI Automation Kits — Working AI Agents, Today",
    description:
      "Ready-to-deploy AI agent automation kits and agent skills for lead qualification, inbox triage, and content repurposing.",
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
