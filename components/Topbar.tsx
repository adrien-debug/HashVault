"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/",       label: "Dashboard", match: (p: string) => p === "/"               },
  { href: "/vaults", label: "My Vaults", match: (p: string) => p.startsWith("/vaults") },
  { href: "/invest", label: "Invest",    match: (p: string) => p.startsWith("/invest") },
] as const;

export function Topbar() {
  const pathname = usePathname();
  return (
    <div className="topbar">
      <Link href="/" className="topbar-logo">
        <span className="topbar-logomark" aria-hidden />
        HASHVAULT
      </Link>

      <nav className="topbar-tabs" aria-label="Primary navigation">
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

      <div className="topbar-wallet">
        <span className="dot-live" aria-hidden />
        0x7Ab…a3F2
      </div>
    </div>
  );
}
