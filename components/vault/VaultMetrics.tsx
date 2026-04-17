"use client";

import { useNowSeconds } from "@/hooks/useNowSeconds";
import { useVaultInfo } from "@/hooks/useVault";
import { formatDuration, formatNumber } from "@/lib/format";
import { VAULT_CONSTANTS, type VaultId } from "@/lib/web3/contracts";

type Props = { vaultId: VaultId; fallbackAprPercent: number };

export function VaultMetrics({ vaultId, fallbackAprPercent }: Props) {
  const info = useVaultInfo(vaultId);
  const now = useNowSeconds();

  const apr = info.annualAprPercent || fallbackAprPercent;
  const isPreview = !info.isReady;

  const totalDepositsValue = info.isReady
    ? `$${formatNumber(Number(info.totalDeposits), 0)}`
    : "—";
  const totalDepositsHint = isPreview ? "Open at launch" : undefined;

  const currentEpochValue = info.isReady ? `#${info.currentEpoch}` : "Epoch 1";
  const currentEpochHint = isPreview ? "Starts at first deposit" : undefined;

  const epochEnd = info.epochEndTime;
  const epochProgress =
    now && info.epochStartTime && info.epochEndTime
      ? Math.min(
          100,
          Math.max(
            0,
            ((now - info.epochStartTime) / VAULT_CONSTANTS.EPOCH_DURATION_SECONDS) * 100,
          ),
        )
      : 0;
  const countdownValue =
    epochEnd && now ? formatDuration(Math.max(0, epochEnd - now)) : "30d";
  const countdownHint = isPreview ? "Reward epoch length" : undefined;

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-4 gap-0 bg-white rounded-[var(--r-card)] ring-1 ring-inset ring-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden anim-fade-up"
      style={{ animationDelay: "0.1s" }}
    >
      <Cell
        label="Annual APR"
        value={`${formatNumber(apr, 2)}%`}
        hint={isPreview ? "Target" : "Live"}
        bordered
      />
      <Cell
        label="Total deposits"
        value={totalDepositsValue}
        hint={totalDepositsHint}
        bordered
      />
      <Cell
        label="Current epoch"
        value={currentEpochValue}
        hint={currentEpochHint}
        bordered
      />
      <Cell
        label="Next distribution"
        value={countdownValue}
        hint={countdownHint}
        progress={epochEnd ? epochProgress : undefined}
      />
    </section>
  );
}

function Cell({
  label,
  value,
  hint,
  bordered,
  progress,
}: {
  label: string;
  value: string;
  hint?: string;
  bordered?: boolean;
  progress?: number;
}) {
  return (
    <div
      className={`px-7 py-6 ${
        bordered ? "border-b md:border-b-0 md:border-r border-[var(--hairline-soft)]" : ""
      }`}
    >
      <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-3">
        {label}
      </div>
      <div className="text-[26px] font-semibold tracking-tight tabular-nums leading-none">
        {value}
      </div>
      {hint ? (
        <div className="mt-2 text-[11px] text-[var(--text-faint)] font-medium">
          {hint}
        </div>
      ) : null}
      {progress !== undefined ? (
        <div className="mt-4 h-1.5 bg-[var(--bg)] rounded-full overflow-hidden ring-1 ring-inset ring-black/[0.04]">
          <span
            className="block h-full bg-gradient-to-r from-[var(--mint-darker)] to-[var(--mint)] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
