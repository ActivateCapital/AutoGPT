import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreAI - Build AI Agents That Actually Work For You",
  description: "The first no-code platform to create autonomous AI agents that automate your business workflows. No coding required. 500+ integrations.",
  keywords: "AI automation, AI agents, autonomous agents, workflow automation, no-code automation, business automation, AutoGPT, n8n alternative",
  authors: [{ name: "CreAI" }],
  openGraph: {
    title: "CreAI - Build AI Agents That Actually Work For You",
    description: "The first no-code platform to create autonomous AI agents that automate your business workflows.",
    url: "https://www.creai.dev",
    siteName: "CreAI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CreAI Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreAI - Build AI Agents That Actually Work For You",
    description: "The first no-code platform to create autonomous AI agents that automate your business workflows.",
    images: ["/og-image.jpg"],
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
