"use client";

import {
  createContext, useCallback, useContext, useEffect,
  useRef, useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Vault, TrendingUp, Settings,
  Users, Package, ListOrdered, Search, Command,
  ArrowRight, Moon, Sun,
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type ActionKind = "navigate" | "action";

type PaletteItem = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  section: string;
  kind: ActionKind;
  href?: string;
  keywords?: string[];
  run?: () => void;
};

type Ctx = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const PalCtx = createContext<Ctx | null>(null);

/* ─── Fuzzy filter ───────────────────────────────────────────────────────── */
function matches(item: PaletteItem, q: string): boolean {
  if (!q) return true;
  const haystack = [item.label, item.description ?? "", ...(item.keywords ?? [])].join(" ").toLowerCase();
  const needle = q.toLowerCase().trim();
  return needle.split("").every((ch) => haystack.includes(ch)) && haystack.includes(needle[0]);
}

/* ─── Panel ──────────────────────────────────────────────────────────────── */
function Panel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { theme, toggle: toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const ITEMS: PaletteItem[] = [
    {
      id: "dash", label: "Dashboard", description: "Portfolio overview & KPIs", section: "Navigate",
      kind: "navigate", href: "/", icon: <LayoutDashboard size={15} />, keywords: ["home", "portfolio"],
    },
    {
      id: "vaults", label: "My Vaults", description: "Positions, yield & transactions", section: "Navigate",
      kind: "navigate", href: "/vaults", icon: <Vault size={15} />, keywords: ["position", "lock"],
    },
    {
      id: "invest", label: "Invest", description: "Open a new vault position", section: "Navigate",
      kind: "navigate", href: "/invest", icon: <TrendingUp size={15} />, keywords: ["deposit", "new"],
    },
    {
      id: "admin", label: "Admin overview", description: "Platform metrics", section: "Admin",
      kind: "navigate", href: "/admin", icon: <Settings size={15} />, keywords: ["dashboard"],
    },
    {
      id: "admin-products", label: "Admin · Products", description: "Manage vault products", section: "Admin",
      kind: "navigate", href: "/admin/products", icon: <Package size={15} />, keywords: ["product", "vault"],
    },
    {
      id: "admin-positions", label: "Admin · Positions", description: "All investor positions", section: "Admin",
      kind: "navigate", href: "/admin/positions", icon: <ListOrdered size={15} />, keywords: ["tvl", "position"],
    },
    {
      id: "admin-users", label: "Admin · Users", description: "Registered investors", section: "Admin",
      kind: "navigate", href: "/admin/users", icon: <Users size={15} />, keywords: ["investor", "wallet"],
    },
    {
      id: "theme", label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      description: "Toggle appearance", section: "Settings", kind: "action",
      icon: theme === "dark" ? <Sun size={15} /> : <Moon size={15} />, keywords: ["dark", "light", "theme", "mode"],
      run: () => { toggleTheme(); onClose(); },
    },
  ];

  const filtered = ITEMS.filter((item) => matches(item, query));
  const grouped = filtered.reduce<Record<string, PaletteItem[]>>((acc, item) => {
    (acc[item.section] ??= []).push(item);
    return acc;
  }, {});
  const flat = Object.values(grouped).flat();

  /* keep active clamped */
  const safeActive = Math.min(active, Math.max(0, flat.length - 1));

  function go(item: PaletteItem) {
    if (item.kind === "action" && item.run) {
      item.run();
    } else if (item.href) {
      router.push(item.href);
      onClose();
    }
  }

  /* keyboard navigation */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[safeActive];
      if (item) go(item);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  /* scroll active item into view */
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${safeActive}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [safeActive]);

  function onQueryChange(value: string) {
    setQuery(value);
    setActive(0);
  }

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk-panel" onClick={(e) => e.stopPropagation()} onKeyDown={onKey}>
        {/* Input */}
        <div className="cmdk-input-wrap">
          <Search size={17} className="flex-shrink-0 text-[var(--color-faint)]" />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Search pages, actions…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Command palette search"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="flex-shrink-0 opacity-40 hover:opacity-70 transition-opacity text-[var(--color-muted)]"
              onClick={() => onQueryChange("")}
              aria-label="Clear"
            >
              <span className="text-[18px] leading-none">×</span>
            </button>
          )}
        </div>

        {/* Results */}
        <div className="cmdk-list" ref={listRef} role="listbox">
          {flat.length === 0 ? (
            <div className="cmdk-empty">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            Object.entries(grouped).map(([section, items]) => (
              <div key={section}>
                <div className="cmdk-section-label">{section}</div>
                {items.map((item) => {
                  const idx = flat.indexOf(item);
                  const isActive = idx === safeActive;
                  return (
                    <div
                      key={item.id}
                      data-idx={idx}
                      role="option"
                      aria-selected={isActive}
                      className={`cmdk-item${isActive ? " active" : ""}`}
                      onClick={() => go(item)}
                      onMouseEnter={() => setActive(idx)}
                    >
                      <div className="cmdk-item-icon">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        {item.description && <div className="cmdk-item-meta truncate">{item.description}</div>}
                      </div>
                      {item.kind === "navigate" && (
                        <ArrowRight size={13} className="flex-shrink-0 opacity-30" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="cmdk-footer">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd>↑</kbd><kbd>↓</kbd> <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd>↵</kbd> <span>select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd>esc</kbd> <span>close</span>
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Command size={11} /><kbd>K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Provider ───────────────────────────────────────────────────────────── */
export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open   = useCallback(() => setIsOpen(true), []);
  const close  = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  /* ⌘K / Ctrl+K global shortcut */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return (
    <PalCtx.Provider value={{ open, close, toggle }}>
      {children}
      {isOpen && <Panel onClose={close} />}
    </PalCtx.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(PalCtx);
  if (!ctx) throw new Error("useCommandPalette must be used within <CommandPaletteProvider>");
  return ctx;
}
