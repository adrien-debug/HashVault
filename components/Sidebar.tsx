"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import {
  LayoutGrid,
  Layers,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { shortenAddress } from "@/lib/format";

type NavItem = { href: string; label: string; icon: LucideIcon };

const PRIMARY: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/platform", label: "Platform", icon: Layers },
];

const SECONDARY: NavItem[] = [
  { href: "#", label: "Settings", icon: Settings },
  { href: "#", label: "Support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const isActive = (href: string) => href !== "#" && pathname?.startsWith(href);

  return (
    <aside className="sticky top-0 h-screen flex flex-col gap-8 py-6 px-4 border-r border-[var(--hairline-soft)] max-lg:static max-lg:h-auto max-lg:flex-row max-lg:items-center max-lg:gap-4 max-lg:border-r-0 max-lg:border-b max-lg:overflow-x-auto">
      <Link href="/" className="flex items-center gap-2.5 px-2 font-semibold text-[13px] tracking-[0.02em]">
        <div className="relative w-6 h-6 rounded-[7px] bg-[var(--text)] after:absolute after:inset-[5px] after:rounded-[3px] after:bg-[var(--mint)]" />
        <span>HASHVAULT</span>
      </Link>

      <nav className="flex flex-col gap-0.5 max-lg:flex-row">
        <SectionLabel>Overview</SectionLabel>
        {PRIMARY.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}

        <SectionLabel>Account</SectionLabel>
        {SECONDARY.map((item) => (
          <NavLink key={item.label} item={item} active={false} disabled />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 max-lg:mt-0 max-lg:ml-auto max-lg:flex-row">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--card)] border border-[var(--hairline)] shadow-[var(--shadow-soft)]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--mint-darker)] to-[var(--mint)] grid place-items-center text-white font-semibold text-[11px] shrink-0">
            {isConnected && address ? address.slice(2, 4).toUpperCase() : "—"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-mono text-[11px] text-[var(--text)] font-medium truncate">
              {isConnected ? shortenAddress(address) : "Not connected"}
            </span>
            <span className="text-[10px] text-[var(--text-faint)] flex items-center gap-1 before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[var(--mint-darker)] before:shadow-[0_0_0_2px_rgba(167,251,144,0.35)]">
              {isConnected ? "Wallet connected" : "Connect from a page"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pb-1.5 text-[10px] text-[var(--text-faint)] tracking-[0.08em] uppercase font-medium mt-2 max-lg:hidden">
      {children}
    </div>
  );
}

function NavLink({
  item,
  active,
  disabled,
}: {
  item: NavItem;
  active: boolean;
  disabled?: boolean;
}) {
  const Icon = item.icon;
  const className = `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] transition-colors ${
    active
      ? "text-[var(--text)] font-semibold bg-black/5"
      : "text-[var(--text-muted)] font-medium hover:bg-black/5 hover:text-[var(--text)]"
  } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;

  const content = (
    <>
      <span className={`w-4 h-4 grid place-items-center ${active ? "text-[var(--mint-darker)]" : "opacity-85"}`}>
        <Icon size={16} strokeWidth={1.75} />
      </span>
      {item.label}
    </>
  );

  if (disabled) {
    return (
      <span className={className} aria-disabled>
        {content}
      </span>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}
