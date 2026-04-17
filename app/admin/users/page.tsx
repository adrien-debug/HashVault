import { db } from "@/lib/db/store";
import { PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users" };

function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }

export default async function AdminUsers() {
  const [users, positions] = await Promise.all([db.listUsers(), db.listPositions()]);

  return (
    <div>
      <PageHeader title="Users" subtitle="All registered investors." />

      <div className="card overflow-hidden !p-0">
        <table className="data-table">
          <thead>
            <tr>
              {["User", "Wallet", "Positions", "Total deposited", "Total value", "Yield paid", "Since"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userPos  = positions.filter((p) => p.userId === user.id);
              const deposited = userPos.reduce((a, p) => a + p.amountUsd, 0);
              const value     = userPos.reduce((a, p) => a + p.currentValueUsd, 0);
              const yield_    = userPos.reduce((a, p) => a + p.yieldPaidUsd, 0);
              const gain      = value - deposited;

              return (
                <tr key={user.id}>
                  <td>
                    <strong>{user.label ?? "—"}</strong>
                    <div className="text-faint text-[11px] font-mono mt-0.5">{user.id}</div>
                  </td>
                  <td className="font-mono text-[12px]">
                    {user.walletAddress.slice(0, 6)}…{user.walletAddress.slice(-4)}
                    <div className="text-faint text-[10px] font-sans mt-0.5">{user.walletAddress}</div>
                  </td>
                  <td className="font-semibold text-center">{userPos.length}</td>
                  <td className="font-semibold">{usd(deposited)}</td>
                  <td>
                    <div className="font-semibold">{usd(value)}</div>
                    <div className={`text-[11px] font-semibold ${gain >= 0 ? "text-pos" : "text-neg"}`}>
                      {gain >= 0 ? "+" : ""}{usd(gain)}
                    </div>
                  </td>
                  <td className="text-pos font-semibold">+{usd(yield_)}</td>
                  <td className="text-muted text-[12px]">{formatDate(user.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-border text-faint text-[12px]">
          {users.length} user{users.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
