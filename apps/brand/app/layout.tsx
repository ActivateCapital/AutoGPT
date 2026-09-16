import type { Metadata } from "next";
import { Gloock, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const gloock = Gloock({ weight: "400", subsets: ["latin"], variable: "--font-gloock" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const plexmono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-plexmono" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.creai.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CreAI — Where Creativity Meets AI",
  description:
    "CreAI is a creative intelligence studio: ventures where human taste directs machine capability. CreAI Skills is live today; more rooms are being built.",
  keywords: "CreAI, creativity meets AI, AI studio, AI agents, agent skills, generative art",
  authors: [{ name: "CreAI" }],
  openGraph: {
    title: "CreAI — Where Creativity Meets AI",
    description: "A creative intelligence studio. Human taste directs machine capability.",
    url: SITE_URL,
    siteName: "CreAI",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "CreAI — where creativity meets AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CreAI — Where Creativity Meets AI",
    description: "A creative intelligence studio. Human taste directs machine capability.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${gloock.variable} ${grotesk.variable} ${plexmono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
