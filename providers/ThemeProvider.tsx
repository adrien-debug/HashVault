"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type Ctx = {
  theme: Theme;
  resolved: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "hashvault.theme";

function readInitial(): Theme {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitial);

  const applyTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.colorScheme = t;
  }, []);

  const setTheme = useCallback(
    (t: Theme) => {
      setThemeState(t);
      try { localStorage.setItem(STORAGE_KEY, t); } catch {}
      applyTheme(t);
    },
    [applyTheme],
  );

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return (
    <ThemeCtx.Provider value={{ theme, resolved: theme, setTheme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/**
 * Inline script injected in <head> to avoid flash on first paint.
 * Reads from localStorage / system preference and sets data-theme.
 */
export const NO_FLASH_SCRIPT = `
(function() {
  try {
    var key = "${STORAGE_KEY}";
    var stored = localStorage.getItem(key);
    var t = stored === "dark" || stored === "light" ? stored : "light";
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.colorScheme = t;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;
