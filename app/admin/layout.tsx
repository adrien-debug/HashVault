import Link from "next/link";
import type { Metadata } from "next";
import {
  LayoutDashboard, Package, ListOrdered, Users, ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: { default: "Admin · HashVault", template: "%s · Admin" },
};

const NAV = [
  { href: "/admin",            label: "Overview",  Icon: LayoutDashboard },
  { href: "/admin/products",   label: "Products",  Icon: Package          },
  { href: "/admin/positions",  label: "Positions", Icon: ListOrdered      },
  { href: "/admin/users",      label: "Users",     Icon: Users            },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen relative z-[1]" style={{ background: "var(--color-bg)" }}>
      {/* Sidebar */}
      <aside
        className="w-[240px] flex flex-col flex-shrink-0 py-6 sticky top-0 h-screen"
        style={{
          background: "linear-gradient(180deg, #0F1115 0%, #1A1D24 100%)",
          color: "#fff",
        }}
      >
        <div className="px-5 pb-5 mx-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 font-bold tracking-[0.04em] text-[12.5px]">
            <span
              className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center flex-shrink-0"
              style={{
                background: "#1A1D24",
                boxShadow: "inset 0 0 0 1.5px var(--color-mint-500), 0 0 12px rgba(52,199,89,.30)",
              }}
            >
              <span className="w-[10px] h-[10px] rounded-[3px]" style={{ background: "var(--color-mint-500)" }} />
            </span>
            HASHVAULT
          </div>
          <div className="text-[10px] text-white/35 mt-1.5 tracking-[0.10em] uppercase ml-[35px]">Admin Console</div>
        </div>

        <nav className="py-4 flex-1">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="admin-nav-link">
              <Icon size={15} strokeWidth={2.25} className="opacity-70 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-5 pt-4 mx-3 border-t border-white/10">
          <Link href="/" className="text-[12px] text-white/45 hover:text-white/80 flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={13} />
            Back to app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 lg:p-10 overflow-y-auto max-w-[1400px]">
        <div className="anim-fade-up">{children}</div>
      </main>
    </div>
  );
}
