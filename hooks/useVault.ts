"use client";

import { useMemo } from "react";
import { formatUnits, parseUnits, type Address } from "viem";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import EpochVaultAbi from "@/lib/abi/EpochVault.json";
import { ERC20_ABI } from "@/lib/abi/erc20";
import {
  type VaultId,
  VAULT_CONSTANTS,
  getChainAddresses,
  getVault,
} from "@/lib/web3/contracts";

const VAULT_ABI = EpochVaultAbi;
const DECIMALS = VAULT_CONSTANTS.USDC_DECIMALS;

const safeFormat = (value: bigint | undefined): string =>
  value === undefined ? "0" : formatUnits(value, DECIMALS);

// ---------- Vault static info ----------

export function useVaultInfo(vaultId: VaultId) {
  const chainId = useChainId();
  const vault = getVault(chainId, vaultId);
  const enabled = Boolean(vault);
  const address = vault?.address;

  const totalDeposits = useReadContract({
    address,
    abi: VAULT_ABI,
    functionName: "totalDeposits",
    query: { enabled },
  });
  const currentEpoch = useReadContract({
    address,
    abi: VAULT_ABI,
    functionName: "currentEpoch",
    query: { enabled },
  });
  const monthlyAPR = useReadContract({
    address,
    abi: VAULT_ABI,
    functionName: "monthlyAPR",
    query: { enabled },
  });
  const annualAPR = useReadContract({
    address,
    abi: VAULT_ABI,
    functionName: "getAnnualAPR",
    query: { enabled },
  });
  const epochStartTime = useReadContract({
    address,
    abi: VAULT_ABI,
    functionName: "epochStartTime",
    query: { enabled },
  });

  return {
    vault,
    isReady: enabled,
    totalDeposits: safeFormat(totalDeposits.data as bigint | undefined),
    currentEpoch: currentEpoch.data ? Number(currentEpoch.data as bigint) : 0,
    monthlyAprBps: monthlyAPR.data ? Number(monthlyAPR.data as bigint) : 0,
    monthlyAprPercent: monthlyAPR.data ? Number(monthlyAPR.data as bigint) / 100 : 0,
    annualAprPercent: annualAPR.data ? Number(annualAPR.data as bigint) / 100 : 0,
    epochStartTime: epochStartTime.data ? Number(epochStartTime.data as bigint) : 0,
    epochEndTime: epochStartTime.data
      ? Number(epochStartTime.data as bigint) + VAULT_CONSTANTS.EPOCH_DURATION_SECONDS
      : 0,
    isLoading:
      totalDeposits.isLoading ||
      currentEpoch.isLoading ||
      monthlyAPR.isLoading ||
      annualAPR.isLoading,
  };
}

// ---------- User-specific data ----------

type RawUserInfo = readonly [bigint, bigint, bigint, bigint, bigint];

export function useUserVaultInfo(vaultId: VaultId) {
  const chainId = useChainId();
  const { address: account } = useAccount();
  const vault = getVault(chainId, vaultId);
  const enabled = Boolean(vault && account);
  const address = vault?.address;

  const userInfo = useReadContract({
    address,
    abi: VAULT_ABI,
    functionName: "userInfo",
    args: account ? [account] : undefined,
    query: { enabled },
  });

  const pendingRewards = useReadContract({
    address,
    abi: VAULT_ABI,
    functionName: "pendingRewards",
    args: account ? [account] : undefined,
    query: { enabled },
  });

  const parsed = useMemo(() => {
    if (!userInfo.data) return null;
    const raw = userInfo.data as unknown as RawUserInfo;
    const [depositAmount, lastClaimedEpoch, pending, lastDepositEpoch, firstDepositTime] = raw;
    const firstDeposit = Number(firstDepositTime);

    return {
      depositAmount: formatUnits(depositAmount, DECIMALS),
      depositAmountRaw: depositAmount,
      lastClaimedEpoch: Number(lastClaimedEpoch),
      pendingRewardsFromInfo: formatUnits(pending, DECIMALS),
      lastDepositEpoch: Number(lastDepositEpoch),
      firstDepositTime: firstDeposit,
      lockEndTime: firstDeposit + VAULT_CONSTANTS.WITHDRAWAL_LOCK_SECONDS,
    };
  }, [userInfo.data]);

  return {
    isReady: enabled,
    userInfo: parsed,
    pendingRewards: safeFormat(pendingRewards.data as bigint | undefined),
    pendingRewardsRaw: (pendingRewards.data ?? 0n) as bigint,
    isLoading: userInfo.isLoading || pendingRewards.isLoading,
    refetch: () => {
      void userInfo.refetch();
      void pendingRewards.refetch();
    },
  };
}

// ---------- USDC allowance / approve ----------

export function useUsdcAllowance(vaultId: VaultId) {
  const chainId = useChainId();
  const { address: account } = useAccount();
  const chain = getChainAddresses(chainId);
  const vault = getVault(chainId, vaultId);
  const enabled = Boolean(chain && vault && account);

  const allowance = useReadContract({
    address: chain?.usdc,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: account && vault ? [account, vault.address] : undefined,
    query: { enabled },
  });

  const balance = useReadContract({
    address: chain?.usdc,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: { enabled: Boolean(account && chain) },
  });

  return {
    allowance: safeFormat(allowance.data as bigint | undefined),
    allowanceRaw: (allowance.data ?? 0n) as bigint,
    balance: safeFormat(balance.data as bigint | undefined),
    balanceRaw: (balance.data ?? 0n) as bigint,
    refetch: () => {
      void allowance.refetch();
      void balance.refetch();
    },
  };
}

export function useUsdcApprove(vaultId: VaultId) {
  const chainId = useChainId();
  const chain = getChainAddresses(chainId);
  const vault = getVault(chainId, vaultId);
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const approve = (amount: string) => {
    if (!chain || !vault) {
      console.error("[useUsdcApprove] chain or vault not configured");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      console.error("[useUsdcApprove] invalid amount", amount);
      return;
    }
    try {
      writeContract({
        address: chain.usdc,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [vault.address, parseUnits(amount, DECIMALS)],
      });
    } catch (err) {
      console.error("[useUsdcApprove] write failed", err);
    }
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming: receipt.isLoading,
    isConfirmed: receipt.isSuccess,
    error,
    reset,
  };
}

// ---------- Vault writes ----------

function useVaultWrite(vaultId: VaultId, functionName: string) {
  const chainId = useChainId();
  const vault = getVault(chainId, vaultId);
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const call = (args?: unknown[]) => {
    if (!vault) {
      console.error(`[useVaultWrite:${functionName}] vault not configured for chain ${chainId}`);
      return;
    }
    try {
      writeContract({
        address: vault.address,
        abi: VAULT_ABI,
        functionName,
        args: args as never,
      });
    } catch (err) {
      console.error(`[useVaultWrite:${functionName}] write failed`, err);
    }
  };

  return {
    call,
    hash,
    isPending,
    isConfirming: receipt.isLoading,
    isConfirmed: receipt.isSuccess,
    error,
    reset,
  };
}

export function useDeposit(vaultId: VaultId) {
  const w = useVaultWrite(vaultId, "deposit");
  return {
    deposit: (amount: string) => {
      if (!amount || Number(amount) <= 0) {
        console.error("[useDeposit] invalid amount", amount);
        return;
      }
      w.call([parseUnits(amount, DECIMALS)]);
    },
    ...w,
  };
}

export function useWithdraw(vaultId: VaultId) {
  const w = useVaultWrite(vaultId, "withdraw");
  return {
    /** amount === "0" or empty → withdraw all */
    withdraw: (amount: string = "0") => {
      const value = !amount ? 0n : parseUnits(amount, DECIMALS);
      w.call([value]);
    },
    ...w,
  };
}

export function useClaimRewards(vaultId: VaultId) {
  const w = useVaultWrite(vaultId, "claimRewards");
  return { claimRewards: () => w.call(), ...w };
}

export function useRedepositRewards(vaultId: VaultId) {
  const w = useVaultWrite(vaultId, "redeposit");
  return { redepositRewards: () => w.call(), ...w };
}

export function useEmergencyWithdraw(vaultId: VaultId) {
  const w = useVaultWrite(vaultId, "emergencyWithdraw");
  return { emergencyWithdraw: () => w.call(), ...w };
}

// ---------- Helpers ----------

export function useExpectedRewards(vaultId: VaultId, amount: string | undefined) {
  const chainId = useChainId();
  const vault = getVault(chainId, vaultId);
  const enabled = Boolean(vault && amount && Number(amount) > 0);

  const { data } = useReadContract({
    address: vault?.address,
    abi: VAULT_ABI,
    functionName: "calculateExpectedRewards",
    args: enabled ? [parseUnits(amount as string, DECIMALS)] : undefined,
    query: { enabled },
  });

  return {
    expectedMonthlyRewards: safeFormat(data as bigint | undefined),
  };
}

export type VaultAddress = Address;

/**
 * Pure helper — call from event handlers / effects only.
 * Returns withdrawal lock status for a user given their `lockEndTime`
 * (in seconds since epoch, as exposed by `useUserVaultInfo`).
 */
export function computeWithdrawStatus(
  firstDepositTime: number,
  lockEndTime: number,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): { canWithdraw: boolean; timeRemainingSeconds: number } {
  if (!firstDepositTime) {
    return { canWithdraw: false, timeRemainingSeconds: 0 };
  }
  const canWithdraw = nowSeconds >= lockEndTime;
  const timeRemainingSeconds = canWithdraw ? 0 : Math.max(0, lockEndTime - nowSeconds);
  return { canWithdraw, timeRemainingSeconds };
}
