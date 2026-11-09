import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.creai.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // The creai.dev tile. Bing reads /favicon.ico first and prefers sizes that are multiples of 48.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: SITE_URL },
  title: "Claude Skills & AI Agent Kits for Business | Creai",
  description:
    "Claude skills and AI agent kits for lead scoring, inbox triage and content repurposing. Install in 60 seconds or run the kits in 15 minutes. Try one free.",
  keywords:
    "AI automation kit, AI agents, lead scoring, inbox triage, content repurposing, Claude automation, workflow automation, agent skills",
  authors: [{ name: "Creai" }],
  openGraph: {
    title: "Creai Automation Kits — Working AI Agents, Today",
    description:
      "Ready-to-deploy AI agent automation kits and agent skills for lead qualification, inbox triage, and content repurposing. Set up in 15 minutes.",
    url: SITE_URL,
    siteName: "Creai",
    locale: "en_US",
    type: "website",
    // JPEG on purpose: iMessage and WhatsApp drop preview images much over 300 KB.
    images: [{ url: "/og.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "Creai — working AI agents, this afternoon" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
    title: "Creai Automation Kits — Working AI Agents, Today",
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
