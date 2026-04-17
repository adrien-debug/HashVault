import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [products, users, positions, txs] = await Promise.all([
      db.listProducts(),
      db.listUsers(),
      db.listPositions(),
      db.listTransactions({}),
    ]);
    const tvlUsd = positions.reduce((a, p) => a + p.currentValueUsd, 0);
    const depositsUsd = positions.reduce((a, p) => a + p.amountUsd, 0);
    const yieldDistributedUsd = txs
      .filter((t) => t.type === "yield")
      .reduce((a, t) => a + t.amountUsd, 0);
    const feesCollectedUsd = txs
      .filter((t) => t.type === "fee")
      .reduce((a, t) => a + Math.abs(t.amountUsd), 0);

    return NextResponse.json({
      tvlUsd,
      depositsUsd,
      yieldDistributedUsd,
      feesCollectedUsd,
      productsCount: products.length,
      activeProductsCount: products.filter((p) => p.status === "live").length,
      usersCount: users.length,
      positionsCount: positions.length,
      transactionsCount: txs.length,
    });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
