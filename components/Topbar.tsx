"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Dashboard", match: (p: string) => p === "/" },
  { href: "/vaults", label: "My Vaults", match: (p: string) => p.startsWith("/vaults") },
  { href: "/invest", label: "Invest", match: (p: string) => p.startsWith("/invest") },
] as const;

const DEMO_WALLET = "0x7Ab…a3F2";

export function Topbar() {
  const pathname = usePathname();

  return (
    <div className="topbar">
      <Link href="/" className="logo">
        <span className="logo-mark" aria-hidden />
        <span>HASHVAULT</span>
      </Link>

      <nav className="tabs" aria-label="Primary">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={active ? "tab active" : "tab"}
              aria-current={active ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="wallet">
        <span className="dot-live" aria-hidden />
        {DEMO_WALLET}
      </div>

      <style jsx>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          margin-bottom: 18px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .logo-mark {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: var(--dark);
          position: relative;
        }
        .logo-mark::after {
          content: "";
          position: absolute;
          inset: 4px;
          border-radius: 3px;
          background: var(--green);
        }
        .tabs {
          display: flex;
          gap: 4px;
          background: #f1f3f5;
          padding: 4px;
          border-radius: 10px;
        }
        .tab {
          border: 0;
          background: transparent;
          padding: 8px 14px;
          border-radius: 7px;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
          transition: background 0.15s, color 0.15s, box-shadow 0.15s;
        }
        .tab.active {
          background: var(--card);
          color: var(--dark);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .wallet {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border: 1px solid var(--border);
          border-radius: 999px;
          font-weight: 500;
        }
        @media (max-width: 720px) {
          .topbar {
            flex-wrap: wrap;
            gap: 12px;
          }
          .tabs {
            order: 3;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
