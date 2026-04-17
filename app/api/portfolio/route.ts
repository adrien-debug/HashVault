import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export const dynamic = "force-dynamic";

const DEFAULT_USER = "user_demo";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? DEFAULT_USER;
    const [positions, history, txs] = await Promise.all([
      db.listPositions({ userId }),
      db.portfolioHistory(),
      db.listTransactions({ userId, type: "yield" }),
    ]);
    const totalValueUsd = positions.reduce((a, p) => a + p.currentValueUsd, 0);
    const totalDepositedUsd = positions.reduce((a, p) => a + p.amountUsd, 0);
    const yieldEarnedUsd = positions.reduce((a, p) => a + p.yieldPaidUsd, 0);
    return NextResponse.json({
      summary: {
        totalValueUsd,
        totalDepositedUsd,
        yieldEarnedUsd,
        deltaUsd: totalValueUsd - totalDepositedUsd,
        deltaPct: totalDepositedUsd > 0 ? ((totalValueUsd - totalDepositedUsd) / totalDepositedUsd) * 100 : 0,
        positionsCount: positions.length,
        recentYieldCount: txs.length,
      },
      history,
      positions,
    });
  } catch (err) {
    console.error("[GET /api/portfolio]", err);
    return NextResponse.json({ error: "Failed to load portfolio" }, { status: 500 });
  }
}
