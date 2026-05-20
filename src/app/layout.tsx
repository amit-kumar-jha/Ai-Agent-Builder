import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "NexAgeAI — Build AI Agents That Work For You",
  description: "The enterprise-grade platform to design, customize, deploy, and monetize intelligent AI agents across any channel. No code required.",
  keywords: ["AI agent builder", "AI agents", "workflow automation", "LLM", "chatbot builder", "no-code AI", "AI SaaS", "agent marketplace"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nexageai.com'),
  openGraph: {
    title: "NexAgeAI — Build AI Agents That Work For You",
    description: "Design, deploy, and monetize intelligent AI agents across Slack, WhatsApp, web widgets, and API. 12+ LLM models, visual builder, and marketplace.",
    siteName: "NexAgeAI",
    type: "website",
    locale: "en_US",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "NexAgeAI Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexAgeAI — Build AI Agents That Work For You",
    description: "Design, deploy, and monetize intelligent AI agents. No code required.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
