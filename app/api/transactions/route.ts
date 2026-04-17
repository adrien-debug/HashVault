import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import type { TransactionType } from "@/lib/db/types";

export const dynamic = "force-dynamic";

const DEFAULT_USER = "user_demo";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? DEFAULT_USER;
    const positionId = url.searchParams.get("positionId") ?? undefined;
    const type = url.searchParams.get("type") as TransactionType | null;
    const limit = url.searchParams.get("limit");
    const txs = await db.listTransactions({
      userId,
      positionId: positionId ?? undefined,
      type: type ?? undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return NextResponse.json({ transactions: txs });
  } catch (err) {
    console.error("[GET /api/transactions]", err);
    return NextResponse.json({ error: "Failed to load transactions" }, { status: 500 });
  }
}
