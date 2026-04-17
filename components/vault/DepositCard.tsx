"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import {
  useDeposit,
  useExpectedRewards,
  useUsdcAllowance,
  useUsdcApprove,
  useVaultInfo,
} from "@/hooks/useVault";
import { formatNumber } from "@/lib/format";
import type { VaultId } from "@/lib/web3/contracts";

type Props = { vaultId: VaultId; fallbackAprPercent: number };

export function DepositCard({ vaultId, fallbackAprPercent }: Props) {
  const { isConnected } = useAccount();
  const info = useVaultInfo(vaultId);
  const allowance = useUsdcAllowance(vaultId);
  const approve = useUsdcApprove(vaultId);
  const deposit = useDeposit(vaultId);
  const [amount, setAmount] = useState("");
  const expected = useExpectedRewards(vaultId, amount);

  const isPreview = !info.isReady;
  const aprPercent = info.annualAprPercent || fallbackAprPercent;

  const numericAmount = Number(amount || 0);
  const balanceNumber = Number(allowance.balance || 0);
  const allowanceNumber = Number(allowance.allowance || 0);
  const needsApprove = numericAmount > 0 && allowanceNumber < numericAmount;
  const aboveBalance = numericAmount > balanceNumber;
  const disabledDeposit = !numericAmount || aboveBalance || needsApprove;

  const lastApproveHash = useRef<string | undefined>(undefined);
  const lastDepositHash = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (approve.isConfirmed && approve.hash && approve.hash !== lastApproveHash.current) {
      lastApproveHash.current = approve.hash;
      allowance.refetch();
      approve.reset();
    }
  }, [approve.isConfirmed, approve.hash, approve, allowance]);

  useEffect(() => {
    if (deposit.isConfirmed && deposit.hash && deposit.hash !== lastDepositHash.current) {
      lastDepositHash.current = deposit.hash;
      setAmount("");
      allowance.refetch();
      deposit.reset();
    }
  }, [deposit.isConfirmed, deposit.hash, deposit, allowance]);

  const setMax = () => setAmount(allowance.balance);

  const status = useMemo(() => {
    if (!isConnected || isPreview) return null;
    if (approve.isPending || approve.isConfirming)
      return { tone: "info" as const, text: "Approving USDC…" };
    if (deposit.isPending || deposit.isConfirming)
      return { tone: "info" as const, text: "Submitting deposit…" };
    if (approve.error)
      return { tone: "error" as const, text: approve.error.message };
    if (deposit.error)
      return { tone: "error" as const, text: deposit.error.message };
    if (aboveBalance)
      return { tone: "error" as const, text: "Amount exceeds your USDC balance." };
    return null;
  }, [
    isConnected,
    isPreview,
    approve.isPending,
    approve.isConfirming,
    deposit.isPending,
    deposit.isConfirming,
    approve.error,
    deposit.error,
    aboveBalance,
  ]);

  const expectedReward =
    isPreview && numericAmount > 0
      ? (numericAmount * aprPercent) / 100 / 12
      : numericAmount > 0
        ? Number(expected.expectedMonthlyRewards)
        : 0;

  return (
    <section
      className="relative p-7 rounded-[var(--r-card)] bg-white ring-1 ring-inset ring-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] anim-fade-up"
      style={{ animationDelay: "0.15s" }}
    >
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-[14px] font-semibold tracking-[-0.005em]">Deposit</h3>
        <span className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold">
          {isPreview ? "Preview · USDC" : "USDC"}
        </span>
      </div>

      <div>
        <div className="rounded-[var(--r-input)] bg-[var(--gin-lightest)] border border-[var(--hairline)] p-4">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-2">
            <span>{isPreview ? "Simulated amount" : "Amount"}</span>
            <button
              type="button"
              className="text-[var(--mint-darker)] hover:text-[var(--mint-darkest)] transition-colors disabled:opacity-50"
              onClick={setMax}
              disabled={isPreview || !isConnected}
            >
              Balance: {isConnected && !isPreview ? formatNumber(allowance.balance, 2) : "—"}
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <input
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const v = e.target.value.replace(",", ".");
                if (v === "" || /^\d*\.?\d*$/.test(v)) setAmount(v);
              }}
              className="bg-transparent outline-none border-0 text-[28px] font-semibold tabular-nums tracking-[-0.015em] w-full"
            />
            <button
              type="button"
              onClick={setMax}
              disabled={isPreview || !isConnected}
              className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--mint-lighter)] text-[var(--mint-darkest)] hover:bg-[var(--mint-light)] disabled:opacity-50 transition-colors"
            >
              Max
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-[12.5px]">
          <Stat
            label="Allowance"
            value={
              isConnected && !isPreview
                ? `${formatNumber(allowance.allowance, 2)} USDC`
                : "—"
            }
          />
          <Stat
            label="Est. monthly reward"
            value={
              numericAmount > 0
                ? `${formatNumber(expectedReward, 2)} USDC`
                : "—"
            }
            highlight={isPreview && numericAmount > 0}
          />
          <Stat label="Annual APR" value={`${formatNumber(aprPercent, 2)}%`} />
          <Stat label="Lock" value="4 years" />
        </div>
      </div>

      {status ? (
        <div
          className={`mt-4 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium ${
            status.tone === "error"
              ? "bg-[#fff1f0] text-[var(--neg)] border border-[var(--neg)]/15"
              : "bg-[var(--mint-lightest)] text-[var(--mint-darkest)] border border-[var(--mint)]/30"
          }`}
        >
          {status.text}
        </div>
      ) : null}

      <div className="mt-5 flex gap-3">
        {isPreview ? (
          isConnected ? (
            <button
              type="button"
              disabled
              className="flex-1 py-3.5 rounded-full text-[13px] font-semibold bg-[var(--gin-lightest)] text-[var(--text-muted)] border border-[var(--hairline)] cursor-not-allowed"
              title="Available once the vault is deployed"
            >
              Available at launch
            </button>
          ) : (
            <ConnectWalletButton variant="primary" className="flex-1 justify-center" />
          )
        ) : (
          <>
            <button
              type="button"
              disabled={
                !needsApprove ||
                approve.isPending ||
                approve.isConfirming ||
                aboveBalance ||
                !numericAmount
              }
              onClick={() => approve.approve(amount)}
              className="flex-1 py-3.5 rounded-full text-[13px] font-semibold border border-[var(--hairline)] bg-white hover:bg-[var(--gin-lightest)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {needsApprove ? "Approve" : "Approved"}
            </button>
            <button
              type="button"
              disabled={
                disabledDeposit ||
                deposit.isPending ||
                deposit.isConfirming
              }
              onClick={() => deposit.deposit(amount)}
              className="flex-1 py-3.5 rounded-full text-[13px] font-semibold bg-[var(--text)] text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Deposit
            </button>
          </>
        )}
      </div>

      {isPreview ? (
        <p className="mt-4 text-[12px] text-[var(--text-faint)] leading-[1.5]">
          You can simulate a deposit amount to preview your monthly reward at the
          target {formatNumber(aprPercent, 2)}% APR. The form unlocks automatically
          once the vault contract is deployed.
        </p>
      ) : null}
    </section>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`px-3.5 py-3 rounded-xl border ${
        highlight
          ? "bg-[var(--mint-lightest)] border-[var(--mint)]/40"
          : "bg-[var(--gin-lightest)] border-[var(--hairline)]"
      }`}
    >
      <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-1">
        {label}
      </div>
      <div
        className={`font-semibold tabular-nums ${
          highlight ? "text-[var(--mint-darkest)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
