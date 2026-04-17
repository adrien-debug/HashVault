"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { X, LayoutDashboard, Vault, TrendingUp } from "lucide-react";

const TABS = [
  { href: "/",       label: "Dashboard", Icon: LayoutDashboard, match: (p: string) => p === "/"               },
  { href: "/vaults", label: "My Vaults", Icon: Vault,           match: (p: string) => p.startsWith("/vaults") },
  { href: "/invest", label: "Invest",    Icon: TrendingUp,      match: (p: string) => p.startsWith("/invest") },
] as const;

export function MobileDrawer({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const initialPathname = useRef(pathname);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* close when route actually changes (not on initial mount) */
  useEffect(() => {
    if (pathname !== initialPathname.current) {
      onClose();
    }
  }, [pathname, onClose]);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div
        className="drawer-panel flex flex-col"
        style={{ background: "var(--color-card)", borderRight: "1px solid var(--color-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-soft)]">
          <span className="font-bold tracking-[0.05em] text-[13px]">HASHVAULT</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--color-bg-soft)] transition-colors text-[var(--color-muted)]"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {TABS.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-5 py-3 text-[14px] font-medium transition-colors ${
                  active
                    ? "text-[var(--color-mint-700)] bg-[var(--color-mint-50)]"
                    : "text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]"
                }`}
              >
                <Icon size={17} strokeWidth={2.25} />
                {label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-mint-500)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Wallet */}
        <div className="px-5 py-4 border-t border-[var(--color-border-soft)]">
          <div className="topbar-wallet w-full justify-center">
            <span className="dot-live" aria-hidden />
            0x7Ab…a3F2
          </div>
        </div>
      </div>
    </>
  );
}
