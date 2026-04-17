"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className={`topbar-icon-btn ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-tooltip={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun size={16} strokeWidth={2.25} /> : <Moon size={16} strokeWidth={2.25} />}
    </button>
  );
}
