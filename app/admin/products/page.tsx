import Link from "next/link";
import { db } from "@/lib/db/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function AdminProducts() {
  const [products, positions] = await Promise.all([
    db.listProducts(),
    db.listPositions(),
  ]);

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontSize: 22 }}>Products</h1>
      <p style={{ color: "#6B7280", margin: "0 0 24px", fontSize: 13 }}>
        Manage vault products. Clients see these on the Invest page (read-only).
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {products.map((p) => {
          const posCount = positions.filter((pos) => pos.productSlug === p.slug).length;
          const tvl = positions
            .filter((pos) => pos.productSlug === p.slug)
            .reduce((a, pos) => a + pos.currentValueUsd, 0);

          return (
            <div key={p.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h2 style={{ margin: 0, fontSize: 18 }}>{p.name}</h2>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 999,
                      background: p.status === "live" ? "#E6F7EC" : p.status === "paused" ? "#FEF3C7" : "#F1F3F5",
                      color: p.status === "live" ? "#1a7f3b" : p.status === "paused" ? "#92400E" : "#6B7280",
                    }}>
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ color: "#6B7280", fontSize: 13 }}>{p.lead}</div>
                </div>
                <Link
                  href={`/admin/products/${p.slug}`}
                  style={{ background: "#111827", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                >
                  Edit →
                </Link>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 16 }}>
                {[
                  { k: "APY", v: `${p.apy}%` },
                  { k: "Lock", v: `${p.lockMonths / 12}y` },
                  { k: "Min deposit", v: "$" + p.minDeposit.toLocaleString() },
                  { k: "Target", v: `${p.cumulativeTargetPct}%` },
                  { k: "Positions", v: posCount },
                  { k: "TVL", v: "$" + Math.round(tvl / 1000) + "k" },
                ].map(({ k, v }) => (
                  <div key={k} style={{ textAlign: "center", background: "#F7F8FA", borderRadius: 8, padding: "10px 6px" }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7280", fontWeight: 600, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Pockets */}
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>Strategy pockets</div>
                <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: "#F1F3F5", marginBottom: 6 }}>
                  {p.pockets.map((pk) => (
                    <span key={pk.label} style={{ width: `${pk.pct}%`, background: pk.color, display: "block" }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: "#6B7280" }}>
                  {p.pockets.map((pk) => (
                    <span key={pk.label}>
                      <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, marginRight: 5, verticalAlign: "middle", background: pk.color }} />
                      {pk.label} · {pk.pct}%
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 12, fontSize: 12, color: "#9CA3AF" }}>
                Fees: {p.feesMgmtPct}% mgmt + {p.feesPerfPct}% perf · {p.network} · Regime: {p.activeRegime}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
