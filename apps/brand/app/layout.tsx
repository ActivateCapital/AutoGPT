import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.creai.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CreAI — Where Creativity Meets AI",
  description:
    "CreAI is a creative intelligence studio: we build tools and ventures where human taste directs machine capability. Working AI agents you own, live today at skills.creai.dev — with more ventures in development.",
  keywords: "CreAI, creativity meets AI, AI studio, AI agents, agent skills, automation",
  authors: [{ name: "CreAI" }],
  openGraph: {
    title: "CreAI — Where Creativity Meets AI",
    description:
      "A creative intelligence studio building tools and ventures where human taste directs machine capability.",
    url: SITE_URL,
    siteName: "CreAI",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "CreAI — where creativity meets AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CreAI — Where Creativity Meets AI",
    description: "A creative intelligence studio building tools and ventures where human taste directs machine capability.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
