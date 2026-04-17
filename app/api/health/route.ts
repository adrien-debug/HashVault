import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ ok: true, app: "HashVault" });
  } catch (err) {
    console.error("[api/health] unexpected error", err);
    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 500 },
    );
  }
}
