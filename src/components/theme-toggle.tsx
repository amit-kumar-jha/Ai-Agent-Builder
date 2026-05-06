"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="btn btn-secondary btn-icon"
      style={{ borderRadius: 'var(--radius-full)' }}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 dark:hidden" style={{ display: theme === 'dark' ? 'none' : 'block' }} />
      <Moon className="h-5 w-5 hidden dark:block" style={{ display: theme === 'dark' ? 'block' : 'none' }} />
    </button>
  );
}
