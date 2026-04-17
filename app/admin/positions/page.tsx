import { db } from "@/lib/db/store";
import { ProgressBar } from "@/components/ui";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Positions" };

function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }

export default async function AdminPositions() {
  const [positions, products, users, txs] = await Promise.all([
    db.listPositions(), db.listProducts(), db.listUsers(), db.listTransactions({}),
  ]);

  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));
  const userMap    = Object.fromEntries(users.map((u) => [u.id, u]));

  function posIndex(pos: (typeof positions)[0]) {
    const same = positions.filter((p) => p.userId === pos.userId && p.productSlug === pos.productSlug);
    return same.findIndex((p) => p.id === pos.id) + 1;
  }

  const totalTvl = positions.reduce((a, p) => a + p.currentValueUsd, 0);

  return (
    <div>
      <h1 className="m-0 mb-1 text-[22px] font-bold">Positions</h1>
      <p className="text-muted text-[13px] mt-0 mb-6">All investor positions across all products.</p>

      <div className="card overflow-hidden" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              {["Position", "Investor", "Deposited", "Current value", "Yield paid", "Progress", "Matures", "Txs"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const product = productMap[pos.productSlug];
              const user    = userMap[pos.userId];
              const idx     = posIndex(pos);
              const gain    = pos.currentValueUsd - pos.amountUsd;
              const gainPct = ((gain / pos.amountUsd) * 100).toFixed(1);
              const prog    = Math.round((pos.cumulativeProgressPct / (product?.cumulativeTargetPct ?? 100)) * 100);
              const posTxs  = txs.filter((t) => t.positionId === pos.id);

              return (
                <tr key={pos.id}>
                  <td>
                    <strong>{product?.name ?? pos.productSlug} #{idx}</strong>
                    <div className="text-muted text-[11px] mt-0.5">Opened {formatDate(pos.startedAt)}</div>
                  </td>
                  <td>
                    <strong>{user?.label ?? "—"}</strong>
                    <div className="text-faint text-[11px] font-mono mt-0.5">
                      {user?.walletAddress?.slice(0, 6)}…{user?.walletAddress?.slice(-4)}
                    </div>
                  </td>
                  <td className="font-semibold">{usd(pos.amountUsd)}</td>
                  <td>
                    <div className="font-semibold">{usd(pos.currentValueUsd)}</div>
                    <div className={`text-[11px] font-semibold ${gain >= 0 ? "text-pos" : "text-neg"}`}>
                      {gain >= 0 ? "+" : ""}{gainPct}%
                    </div>
                  </td>
                  <td className="text-pos font-semibold">+{usd(pos.yieldPaidUsd)}</td>
                  <td style={{ minWidth: 140 }}>
                    <ProgressBar
                      pct={prog}
                      hint={`${pos.cumulativeProgressPct}% of ${product?.cumulativeTargetPct ?? "—"}%`}
                    />
                  </td>
                  <td className="text-muted text-[12px]">{formatDate(pos.maturesAt)}</td>
                  <td className="text-center">
                    <span className="badge">{posTxs.length}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-border text-faint text-[12px]">
          {positions.length} position{positions.length !== 1 ? "s" : ""} · Total TVL: {usd(totalTvl)}
        </div>
      </div>
    </div>
  );
}
