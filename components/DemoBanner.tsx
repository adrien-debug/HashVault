"use client";

export function DemoBanner() {
  return (
    <div
      className="mb-6 rounded-[var(--r-input)] border border-[var(--hairline)] bg-[var(--card)] px-4 py-2.5 text-center text-[12px] font-medium text-[var(--text-muted)] shadow-[var(--shadow-soft)]"
      role="status"
    >
      <span className="text-[var(--text)] font-semibold">Demo mode</span>
      {" — "}
      Balances, charts, and vault rows are illustrative. Wallet connection uses test networks when configured.
    </div>
  );
}
