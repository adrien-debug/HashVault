"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileDrawer } from "@/components/MobileDrawer";
import { useCommandPalette } from "@/providers/CommandPaletteProvider";

const TABS = [
  { href: "/",       label: "Dashboard", match: (p: string) => p === "/"               },
  { href: "/vaults", label: "My Vaults", match: (p: string) => p.startsWith("/vaults") },
  { href: "/invest", label: "Invest",    match: (p: string) => p.startsWith("/invest") },
] as const;

export function Topbar() {
  const pathname = usePathname();
  const { open } = useCommandPalette();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="topbar anim-fade-in">
        {/* Burger — mobile only */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="sm:hidden topbar-icon-btn p-1.5"
          aria-label="Open navigation menu"
        >
          <Menu size={18} strokeWidth={2.25} />
        </button>

        <Link href="/" className="topbar-logo" aria-label="HashVault home">
          <span className="topbar-logomark" aria-hidden />
          <span className="hidden sm:inline">HASHVAULT</span>
        </Link>

        <nav className="topbar-tabs hidden sm:flex" aria-label="Primary navigation">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`topbar-tab${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {/* ⌘K trigger */}
          <button
            type="button"
            onClick={open}
            className="topbar-icon-btn hidden sm:flex items-center gap-1.5 text-[var(--color-faint)] hover:text-[var(--color-ink)] px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[12px] font-medium transition-colors"
            aria-label="Open command palette"
            data-tooltip="⌘K"
          >
            <Search size={13} strokeWidth={2.25} />
            <span className="hidden md:inline">Search</span>
            <kbd>⌘K</kbd>
          </button>

          <ThemeToggle />

          <div className="topbar-wallet hidden sm:flex" title="Connected wallet (demo)">
            <span className="dot-live" aria-hidden />
            0x7Ab…a3F2
          </div>
        </div>
      </div>

      {drawerOpen && <MobileDrawer onClose={() => setDrawerOpen(false)} />}
    </>
  );
}
