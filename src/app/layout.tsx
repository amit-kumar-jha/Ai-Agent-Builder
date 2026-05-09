import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "NexAgeAI - AI Agent Builder Platform",
  description: "Build, deploy, and monetize AI agents without code. Visual workflow builder with multi-model support, execution tracing, and cost transparency.",
  keywords: ["AI", "agent builder", "workflow automation", "GPT-4", "Claude", "no-code"],
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
