import { db } from "@/lib/db/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users" };

export default async function AdminUsers() {
  const [users, positions, txs] = await Promise.all([
    db.listUsers(),
    db.listPositions(),
    db.listTransactions({}),
  ]);

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontSize: 22 }}>Users</h1>
      <p style={{ color: "#6B7280", margin: "0 0 24px", fontSize: 13 }}>
        All registered investors.
      </p>

      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["User", "Wallet", "Positions", "Total deposited", "Total value", "Yield paid", "Since"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7280", fontWeight: 600, borderBottom: "1px solid #E5E7EB" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userPos = positions.filter((p) => p.userId === user.id);
              const userTxs = txs.filter((t) =>
                userPos.some((p) => p.id === t.positionId),
              );
              const deposited = userPos.reduce((a, p) => a + p.amountUsd, 0);
              const value = userPos.reduce((a, p) => a + p.currentValueUsd, 0);
              const yield_ = userPos.reduce((a, p) => a + p.yieldPaidUsd, 0);

              return (
                <tr key={user.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{user.label ?? "—"}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace" }}>{user.id}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, fontFamily: "monospace", color: "#374151" }}>
                    {user.walletAddress.slice(0, 6)}…{user.walletAddress.slice(-4)}
                    <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "inherit" }}>
                      {user.walletAddress}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                    {userPos.length}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>
                    ${deposited.toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>${value.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: value > deposited ? "#15803d" : "#EF4444", fontWeight: 600 }}>
                      {value > deposited ? "+" : ""}${(value - deposited).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#15803d", fontWeight: 600 }}>
                    +${yield_.toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#6B7280" }}>
                    {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #E5E7EB", fontSize: 12, color: "#9CA3AF" }}>
          {users.length} user{users.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
