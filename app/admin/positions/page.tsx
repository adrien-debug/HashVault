import { db } from "@/lib/db/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Positions" };

export default async function AdminPositions() {
  const [positions, products, users, txs] = await Promise.all([
    db.listPositions(),
    db.listProducts(),
    db.listUsers(),
    db.listTransactions({}),
  ]);

  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  function productIndexOf(pos: (typeof positions)[0]) {
    const sameUser = positions.filter(
      (p) => p.userId === pos.userId && p.productSlug === pos.productSlug,
    );
    return sameUser.findIndex((p) => p.id === pos.id) + 1;
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontSize: 22 }}>Positions</h1>
      <p style={{ color: "#6B7280", margin: "0 0 24px", fontSize: 13 }}>
        All investor positions across all products.
      </p>

      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Position", "Investor", "Deposited", "Current value", "Yield paid", "Progress", "Matures", "Transactions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7280", fontWeight: 600, borderBottom: "1px solid #E5E7EB" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const product = productMap[pos.productSlug];
              const user = userMap[pos.userId];
              const idx = productIndexOf(pos);
              const gain = pos.currentValueUsd - pos.amountUsd;
              const gainPct = ((gain / pos.amountUsd) * 100).toFixed(1);
              const posTxs = txs.filter((t) => t.positionId === pos.id);
              const prog = Math.round((pos.cumulativeProgressPct / (product?.cumulativeTargetPct ?? 100)) * 100);

              return (
                <tr key={pos.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>
                      {product?.name ?? pos.productSlug} #{idx}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                      Opened {new Date(pos.startedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12 }}>
                    <div style={{ fontWeight: 600 }}>{user?.label ?? "—"}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace" }}>
                      {user?.walletAddress?.slice(0, 6)}…{user?.walletAddress?.slice(-4)}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>
                    ${pos.amountUsd.toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>${pos.currentValueUsd.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: gain >= 0 ? "#15803d" : "#EF4444", fontWeight: 600 }}>
                      {gain >= 0 ? "+" : ""}{gainPct}%
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#15803d", fontWeight: 600 }}>
                    +${pos.yieldPaidUsd.toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 16px", minWidth: 140 }}>
                    <div style={{ display: "flex", height: 6, background: "#F1F3F5", borderRadius: 999, overflow: "hidden", marginBottom: 4 }}>
                      <span style={{ width: `${prog}%`, background: "#34C759", display: "block" }} />
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>
                      {pos.cumulativeProgressPct}% of {product?.cumulativeTargetPct ?? "—"}%
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#6B7280" }}>
                    {new Date(pos.maturesAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, textAlign: "center" }}>
                    <span style={{ background: "#F1F3F5", borderRadius: 6, padding: "2px 8px", fontWeight: 600, fontSize: 12 }}>
                      {posTxs.length}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #E5E7EB", fontSize: 12, color: "#9CA3AF" }}>
          {positions.length} position{positions.length !== 1 ? "s" : ""} · Total TVL: ${positions.reduce((a, p) => a + p.currentValueUsd, 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
