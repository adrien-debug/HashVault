import { db } from "@/lib/db/store";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard · HashVault" };

export default async function DashboardPage() {
  const [positions, history, products] = await Promise.all([
    db.listPositions({ userId: "user_demo" }),
    db.portfolioHistory(),
    db.listProducts(),
  ]);

  const totalValueUsd = positions.reduce((a, p) => a + p.currentValueUsd, 0);
  const totalDepositedUsd = positions.reduce((a, p) => a + p.amountUsd, 0);
  const yieldEarnedUsd = positions.reduce((a, p) => a + p.yieldPaidUsd, 0);
  const deltaUsd = totalValueUsd - totalDepositedUsd;
  const deltaPct = totalDepositedUsd > 0
    ? ((deltaUsd / totalDepositedUsd) * 100).toFixed(2)
    : "0";

  return (
    <DashboardClient
      totalValueUsd={totalValueUsd}
      deltaUsd={deltaUsd}
      deltaPct={deltaPct}
      yieldEarnedUsd={yieldEarnedUsd}
      positions={positions}
      products={products}
      history={history}
    />
  );
}
