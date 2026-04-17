"use client";

import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useNowSeconds } from "@/hooks/useNowSeconds";
import {
  computeWithdrawStatus,
  useClaimRewards,
  useRedepositRewards,
  useUserVaultInfo,
  useVaultInfo,
  useWithdraw,
} from "@/hooks/useVault";
import { formatDuration, formatNumber } from "@/lib/format";
import { VAULT_CONSTANTS, type VaultId } from "@/lib/web3/contracts";

type Props = { vaultId: VaultId };

export function UserPositionCard({ vaultId }: Props) {
  const { isConnected } = useAccount();
  const info = useVaultInfo(vaultId);
  const user = useUserVaultInfo(vaultId);
  const claim = useClaimRewards(vaultId);
  const redeposit = useRedepositRewards(vaultId);
  const withdraw = useWithdraw(vaultId);
  const now = useNowSeconds();
  const isPreview = !info.isReady;

  useEffect(() => {
    if (claim.isConfirmed) {
      user.refetch();
      claim.reset();
    }
  }, [claim.isConfirmed, claim, user]);

  useEffect(() => {
    if (redeposit.isConfirmed) {
      user.refetch();
      redeposit.reset();
    }
  }, [redeposit.isConfirmed, redeposit, user]);

  useEffect(() => {
    if (withdraw.isConfirmed) {
      user.refetch();
      withdraw.reset();
    }
  }, [withdraw.isConfirmed, withdraw, user]);

  const lock = useMemo(() => {
    if (!user.userInfo || !now) return null;
    return computeWithdrawStatus(
      user.userInfo.firstDepositTime,
      user.userInfo.lockEndTime,
      now,
    );
  }, [user.userInfo, now]);

  const lockProgress =
    user.userInfo && now
      ? Math.min(
          100,
          Math.max(
            0,
            ((now - user.userInfo.firstDepositTime) /
              VAULT_CONSTANTS.WITHDRAWAL_LOCK_SECONDS) *
              100,
          ),
        )
      : 0;

  const hasPosition = user.userInfo && user.userInfo.depositAmountRaw > 0n;
  const hasRewards = user.pendingRewardsRaw > 0n;
  const busy =
    claim.isPending ||
    claim.isConfirming ||
    redeposit.isPending ||
    redeposit.isConfirming ||
    withdraw.isPending ||
    withdraw.isConfirming;

  return (
    <section
      className="p-7 rounded-[var(--r-card)] bg-white ring-1 ring-inset ring-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] anim-fade-up"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-[14px] font-semibold tracking-[-0.005em]">Your position</h3>
        {hasPosition ? (
          <span className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold">
            Active
          </span>
        ) : null}
      </div>

      {isPreview ? (
        <PreviewState isConnected={isConnected} />
      ) : !isConnected ? (
        <div className="py-6 text-center">
          <p className="text-[13px] text-[var(--text-muted)] mb-5">
            Connect your wallet to view your position in this vault.
          </p>
          <ConnectWalletButton variant="primary" />
        </div>
      ) : !hasPosition ? (
        <div className="py-6 text-center text-[13px] text-[var(--text-muted)]">
          No deposit yet. Use the panel above to start earning.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 text-[12.5px]">
            <Metric
              label="Deposited"
              value={`${formatNumber(user.userInfo!.depositAmount, 2)}`}
              suffix="USDC"
            />
            <Metric
              label="Pending rewards"
              value={formatNumber(user.pendingRewards, 4)}
              suffix="USDC"
              highlight={hasRewards}
            />
            <Metric
              label="Last claimed epoch"
              value={`#${user.userInfo!.lastClaimedEpoch}`}
            />
            <Metric
              label="Lock"
              value={
                lock?.canWithdraw
                  ? "Unlocked"
                  : formatDuration(lock?.timeRemainingSeconds ?? 0)
              }
            />
          </div>

          <div className="mt-5">
            <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-2">
              Lock progress
            </div>
            <div className="h-1.5 bg-[var(--bg)] rounded-full overflow-hidden ring-1 ring-inset ring-black/[0.04]">
              <span
                className="block h-full bg-gradient-to-r from-[var(--mint-darker)] to-[var(--mint)] rounded-full transition-all"
                style={{ width: `${lockProgress}%` }}
              />
            </div>
            <div className="text-[11px] text-[var(--text-faint)] mt-2 tabular-nums font-medium">
              {Math.round(lockProgress)}% · 4-year vault
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={!hasRewards || busy}
                onClick={() => claim.claimRewards()}
                className="py-3 rounded-full text-[13px] font-semibold bg-[var(--mint)] text-[var(--mint-darkest)] hover:bg-[var(--mint-light)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Claim rewards
              </button>
              <button
                type="button"
                disabled={!hasRewards || busy}
                onClick={() => redeposit.redepositRewards()}
                className="py-3 rounded-full text-[13px] font-semibold border border-[var(--hairline)] bg-white hover:bg-[var(--gin-lightest)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Compound
              </button>
            </div>
            <button
              type="button"
              disabled={!lock?.canWithdraw || busy}
              onClick={() => withdraw.withdraw("0")}
              className="py-3 rounded-full text-[13px] font-semibold border border-[var(--hairline)] bg-white hover:bg-[var(--gin-lightest)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title={lock?.canWithdraw ? "Withdraw your full deposit" : "Locked until maturity"}
            >
              {lock?.canWithdraw ? "Withdraw all" : "Locked until maturity"}
            </button>
          </div>

          {(claim.error || redeposit.error || withdraw.error) ? (
            <div className="mt-4 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium bg-[#fff1f0] text-[var(--neg)] border border-[var(--neg)]/15">
              {(claim.error || redeposit.error || withdraw.error)?.message}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function PreviewState({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="py-2">
      <div className="grid grid-cols-2 gap-4 text-[12.5px] opacity-60">
        <Metric label="Deposited" value="0.00" suffix="USDC" />
        <Metric label="Pending rewards" value="0.0000" suffix="USDC" />
        <Metric label="Last claimed epoch" value="—" />
        <Metric label="Lock" value="4y" />
      </div>

      <div className="mt-5">
        <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-2">
          Lock progress
        </div>
        <div className="h-1.5 bg-[var(--bg)] rounded-full overflow-hidden ring-1 ring-inset ring-black/[0.04]">
          <span className="block h-full w-0 bg-gradient-to-r from-[var(--mint-darker)] to-[var(--mint)] rounded-full" />
        </div>
        <div className="text-[11px] text-[var(--text-faint)] mt-2 tabular-nums font-medium">
          0% · 4-year vault
        </div>
      </div>

      <div className="mt-6 px-4 py-4 rounded-2xl bg-[var(--gin-lightest)] border border-dashed border-[var(--hairline)]">
        <div className="text-[12.5px] text-[var(--text-muted)] leading-[1.5]">
          Once the vault is deployed, you’ll be able to{" "}
          <span className="font-semibold text-[var(--text)]">claim rewards</span>,{" "}
          <span className="font-semibold text-[var(--text)]">compound</span>, or{" "}
          <span className="font-semibold text-[var(--text)]">withdraw</span> from this
          panel.
        </div>
        {!isConnected ? (
          <div className="mt-4">
            <ConnectWalletButton variant="primary" className="w-full justify-center" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  suffix,
  highlight,
}: {
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div className="px-3.5 py-3 rounded-xl bg-[var(--gin-lightest)] border border-[var(--hairline)]">
      <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-1">
        {label}
      </div>
      <div
        className={`tabular-nums font-semibold ${
          highlight ? "text-[var(--mint-darkest)]" : ""
        }`}
      >
        {value}
        {suffix ? (
          <span className="text-[11px] text-[var(--text-muted)] ml-1 font-medium">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
