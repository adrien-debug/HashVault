import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin · HashVault", template: "%s · Admin" },
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "⬡" },
  { href: "/admin/products", label: "Products", icon: "◈" },
  { href: "/admin/positions", label: "Positions", icon: "◉" },
  { href: "/admin/users", label: "Users", icon: "◎" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F7F8FA" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: "#111827",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        padding: "24px 0",
      }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, letterSpacing: 0.5 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 6, background: "#111827",
              border: "2px solid #34C759", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "#34C759", display: "block" }} />
            </span>
            <span style={{ fontSize: 13 }}>HASHVAULT</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>
            Admin Console
          </div>
        </div>

        <nav style={{ padding: "16px 0", flex: 1 }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,.65)",
                textDecoration: "none",
                transition: "color .15s, background .15s",
              }}
              className="admin-nav-link"
            >
              <span style={{ fontSize: 16, opacity: 0.7 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,.35)", display: "flex", alignItems: "center", gap: 6 }}>
            ← Back to app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {children}
      </main>

      <style>{`
        .admin-nav-link:hover { color: #fff !important; background: rgba(255,255,255,.05); }
      `}</style>
    </div>
  );
}
