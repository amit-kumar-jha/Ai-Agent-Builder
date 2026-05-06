import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "AgentOS - AI Agent Builder Platform",
  description: "Build, deploy, and monetize AI agents without code. Visual workflow builder with multi-model support, execution tracing, and cost transparency.",
  keywords: ["AI", "agent builder", "workflow automation", "GPT-4", "Claude", "no-code"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
