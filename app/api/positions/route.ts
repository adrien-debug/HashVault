import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import type { ProductSlug } from "@/lib/db/types";

export const dynamic = "force-dynamic";

const DEFAULT_USER = "user_demo";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? DEFAULT_USER;
    const productSlug = url.searchParams.get("productSlug") ?? undefined;
    const positions = await db.listPositions({ userId, productSlug: productSlug ?? undefined });
    return NextResponse.json({ positions });
  } catch (err) {
    console.error("[GET /api/positions]", err);
    return NextResponse.json({ error: "Failed to load positions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      userId?: string;
      productSlug?: ProductSlug;
      amountUsd?: number;
    };
    if (!body.productSlug || !body.amountUsd || body.amountUsd <= 0) {
      return NextResponse.json(
        { error: "productSlug and positive amountUsd required" },
        { status: 400 },
      );
    }
    const product = await db.getProduct(body.productSlug);
    if (!product) {
      return NextResponse.json({ error: "Unknown product" }, { status: 404 });
    }
    if (body.amountUsd < product.minDeposit) {
      return NextResponse.json(
        { error: `Below minimum deposit of $${product.minDeposit.toLocaleString()}` },
        { status: 400 },
      );
    }
    const pos = await db.createPosition({
      userId: body.userId ?? DEFAULT_USER,
      productSlug: body.productSlug,
      amountUsd: body.amountUsd,
    });
    return NextResponse.json({ position: pos }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/positions]", err);
    return NextResponse.json({ error: "Failed to create position" }, { status: 500 });
  }
}
