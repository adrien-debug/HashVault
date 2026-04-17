import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin · HashVault", template: "%s · Admin" },
};

const NAV = [
  { href: "/admin",            label: "Dashboard", icon: "⬡" },
  { href: "/admin/products",   label: "Products",  icon: "◈" },
  { href: "/admin/positions",  label: "Positions", icon: "◉" },
  { href: "/admin/users",      label: "Users",     icon: "◎" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-[220px] bg-dark text-white flex flex-col flex-shrink-0 py-6">
        <div className="px-5 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 font-bold tracking-wide text-[13px]">
            <span className="w-[22px] h-[22px] rounded-[6px] bg-dark border-2 border-mint flex items-center justify-center flex-shrink-0">
              <span className="w-[10px] h-[10px] rounded-[3px] bg-mint block" />
            </span>
            HASHVAULT
          </div>
          <div className="text-[10px] text-white/35 mt-1 tracking-[0.08em] uppercase">Admin Console</div>
        </div>

        <nav className="py-4 flex-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav-link">
              <span className="text-[16px] opacity-70">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 pt-4 border-t border-white/10">
          <Link href="/" className="text-[12px] text-white/35 flex items-center gap-1.5">
            ← Back to app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
