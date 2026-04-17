"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useVaultInfo } from "@/hooks/useVault";
import { formatNumber } from "@/lib/format";
import type { VaultId } from "@/lib/web3/contracts";

type Props = {
  vaultId: VaultId;
  fallbackName: string;
  fallbackTag: string;
  fallbackAprPercent: number;
  description: string;
  bullets: string[];
};

export function VaultCard({
  vaultId,
  fallbackName,
  fallbackTag,
  fallbackAprPercent,
  description,
  bullets,
}: Props) {
  const info = useVaultInfo(vaultId);
  const apr = info.annualAprPercent || fallbackAprPercent;
  const totalDeposits = info.isReady ? Number(info.totalDeposits) : null;

  return (
    <article className="group relative p-9 rounded-[var(--r-card)] bg-white border border-[var(--hairline)] hover:border-[var(--mint-dark)] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--mint-darker)]">
          {fallbackTag}
        </span>
        {info.isReady ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--mint-darkest)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint-darker)] shadow-[0_0_0_3px_rgba(167,251,144,0.35)]" />
            Live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--mint-darkest)]/80 px-2 py-0.5 rounded-full bg-[var(--mint-lightest)] border border-[var(--mint)]/30">
            Preview
          </span>
        )}
      </div>

      <h3 className="text-[26px] font-semibold tracking-[-0.015em]">
        {info.vault?.label ?? fallbackName}
      </h3>
      <p className="mt-3 text-[14.5px] text-[var(--text-muted)] leading-[1.55]">{description}</p>

      <div className="mt-7 grid grid-cols-2 gap-6">
        <div>
          <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-widest font-bold">
            Annual APR
          </div>
          <div className="mt-1.5 text-[28px] font-semibold tabular-nums tracking-[-0.015em] leading-none">
            {formatNumber(apr, 2)}
            <span className="text-[16px] text-[var(--text-muted)] ml-1 font-medium">%</span>
          </div>
          <div className="mt-1 text-[10px] text-[var(--text-faint)] font-medium">
            {info.isReady ? "Live" : "Target"}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-widest font-bold">
            {info.isReady ? "Total deposits" : "Reward epoch"}
          </div>
          <div className="mt-1.5 text-[28px] font-semibold tabular-nums tracking-[-0.015em] leading-none">
            {totalDeposits !== null ? (
              <>
                <span className="text-[16px] text-[var(--text-muted)] mr-1 font-medium">$</span>
                {formatNumber(totalDeposits, 0)}
              </>
            ) : (
              <>
                30
                <span className="text-[16px] text-[var(--text-muted)] ml-1 font-medium">days</span>
              </>
            )}
          </div>
          <div className="mt-1 text-[10px] text-[var(--text-faint)] font-medium">
            {info.isReady ? "All-time TVL" : "USDC distribution"}
          </div>
        </div>
      </div>

      <ul className="mt-7 flex flex-col gap-2.5">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-center gap-2.5 text-[13px] font-medium text-[var(--text-muted)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint-darker)]" />
            {b}
          </li>
        ))}
      </ul>

      <Link
        href={`/vault/${vaultId}`}
        className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[var(--text)] text-white text-[13px] font-semibold hover:bg-black transition-colors"
      >
        {info.isReady ? "Open vault" : "Preview vault"}
        <ArrowRight size={15} />
      </Link>
    </article>
  );
}
