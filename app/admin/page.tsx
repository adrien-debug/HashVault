import { db } from "@/lib/db/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

function usd(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function num(n: number) {
  return n.toLocaleString("en-US");
}

export default async function AdminDashboard() {
  const [products, users, positions, txs] = await Promise.all([
    db.listProducts(),
    db.listUsers(),
    db.listPositions(),
    db.listTransactions({}),
  ]);

  const tvl = positions.reduce((a, p) => a + p.currentValueUsd, 0);
  const deposits = positions.reduce((a, p) => a + p.amountUsd, 0);
  const yieldDist = txs.filter((t) => t.type === "yield").reduce((a, t) => a + t.amountUsd, 0);
  const fees = txs.filter((t) => t.type === "fee").reduce((a, t) => a + Math.abs(t.amountUsd), 0);
  const recentTxs = [...txs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 10);

  const kpis = [
    { label: "Total Value Locked", value: usd(tvl), sub: "across all positions", color: "#34C759" },
    { label: "Total Deposits", value: usd(deposits), sub: "capital committed", color: "#111827" },
    { label: "Yield Distributed", value: usd(yieldDist), sub: "USDC paid out", color: "#F59E0B" },
    { label: "Fees Collected", value: usd(fees), sub: "mgmt + perf", color: "#6B7280" },
  ];

  const statLine = [
    { label: "Products live", value: products.filter((p) => p.status === "live").length },
    { label: "Users", value: num(users.length) },
    { label: "Active positions", value: num(positions.length) },
    { label: "Total transactions", value: num(txs.length) },
  ];

  const txTypeIcon: Record<string, string> = { yield: "↓", fee: "−", deposit: "+", withdraw: "↑" };
  const txTypeBg: Record<string, string> = { yield: "#E6F7EC", fee: "#FDECEC", deposit: "#EEF2FF", withdraw: "#EEF2FF" };
  const txTypeColor: Record<string, string> = { yield: "#1a7f3b", fee: "#991B1B", deposit: "#3730A3", withdraw: "#3730A3" };

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontSize: 22 }}>Admin Dashboard</h1>
      <p style={{ color: "#6B7280", margin: "0 0 24px", fontSize: 13 }}>
        Platform overview · all data from database.
      </p>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20, borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>
              {k.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Stat line */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {statLine.map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>{s.label}</span>
            <strong style={{ fontSize: 18 }}>{s.value}</strong>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Products */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 15 }}>Products</h2>
            <a href="/admin/products" style={{ fontSize: 12, color: "#1a7f3b", fontWeight: 600 }}>Manage →</a>
          </div>
          {products.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #E5E7EB", fontSize: 13 }}>
              <div>
                <strong>{p.name}</strong>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Min {usd(p.minDeposit)} · {p.apy}% APY</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                background: p.status === "live" ? "#E6F7EC" : "#FEE4E2",
                color: p.status === "live" ? "#1a7f3b" : "#991B1B",
              }}>
                {p.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Recent transactions */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 15 }}>Recent Transactions</h2>
          </div>
          {recentTxs.map((t) => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #E5E7EB", fontSize: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 11, background: txTypeBg[t.type] ?? "#E6F7EC", color: txTypeColor[t.type] ?? "#1a7f3b" }}>
                {txTypeIcon[t.type]}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{t.note ?? t.type}</div>
                <div style={{ color: "#6B7280", fontSize: 11 }}>
                  {new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}{t.txHash.slice(0, 6)}…{t.txHash.slice(-2)}
                </div>
              </div>
              <div style={{ fontWeight: 600, color: t.amountUsd < 0 ? "#EF4444" : t.type === "yield" ? "#15803d" : "#111827" }}>
                {t.amountUsd >= 0 ? "+" : ""}{t.amountUsd.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
