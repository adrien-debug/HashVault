import { base, baseSepolia, sepolia } from "wagmi/chains";
import { ENV } from "./env";

export type VaultId = "prime" | "growth";
export type SupportedChainId = typeof base.id | typeof baseSepolia.id | typeof sepolia.id;

export type VaultDescriptor = {
  id: VaultId;
  label: string;
  address: `0x${string}`;
};

export type ChainAddresses = {
  chainId: SupportedChainId;
  name: string;
  usdc: `0x${string}`;
  factory: `0x${string}`;
  vaults: Record<VaultId, VaultDescriptor>;
};

const ZERO = "0x0000000000000000000000000000000000000000" as const;

const asAddress = (value: string): `0x${string}` =>
  (value.startsWith("0x") ? value : `0x${value}`) as `0x${string}`;

export const ADDRESSES: Record<SupportedChainId, ChainAddresses> = {
  [base.id]: {
    chainId: base.id,
    name: "Base",
    usdc: asAddress(ENV.BASE_USDC),
    factory: asAddress(ENV.BASE_VAULT_FACTORY),
    vaults: {
      prime: {
        id: "prime",
        label: "HashVault Prime",
        address: asAddress(ENV.BASE_VAULT_PRIME),
      },
      growth: {
        id: "growth",
        label: "HashVault Growth",
        address: asAddress(ENV.BASE_VAULT_GROWTH),
      },
    },
  },
  [baseSepolia.id]: {
    chainId: baseSepolia.id,
    name: "Base Sepolia",
    usdc: asAddress(ENV.BASE_SEPOLIA_USDC),
    factory: asAddress(ENV.BASE_SEPOLIA_VAULT_FACTORY),
    vaults: {
      prime: {
        id: "prime",
        label: "HashVault Prime",
        address: asAddress(ENV.BASE_SEPOLIA_VAULT_PRIME),
      },
      growth: {
        id: "growth",
        label: "HashVault Growth",
        address: asAddress(ENV.BASE_SEPOLIA_VAULT_GROWTH),
      },
    },
  },
  [sepolia.id]: {
    chainId: sepolia.id,
    name: "Sepolia",
    usdc: asAddress(ENV.SEPOLIA_USDC),
    factory: ZERO,
    vaults: {
      prime: {
        id: "prime",
        label: "HashVault Prime (legacy)",
        address: asAddress(ENV.SEPOLIA_VAULT),
      },
      growth: {
        id: "growth",
        label: "HashVault Growth (legacy)",
        address: ZERO,
      },
    },
  },
} as const;

export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  base.id,
  baseSepolia.id,
  sepolia.id,
];

export function isSupportedChain(chainId: number | undefined): chainId is SupportedChainId {
  if (chainId === undefined) return false;
  return (SUPPORTED_CHAIN_IDS as number[]).includes(chainId);
}

export function getChainAddresses(chainId: number | undefined): ChainAddresses | null {
  if (!isSupportedChain(chainId)) return null;
  return ADDRESSES[chainId];
}

export function getVault(
  chainId: number | undefined,
  vaultId: VaultId,
): VaultDescriptor | null {
  const chain = getChainAddresses(chainId);
  if (!chain) return null;
  const vault = chain.vaults[vaultId];
  if (vault.address === ZERO) return null;
  return vault;
}

// On-chain constants (from EpochVault.sol)
export const VAULT_CONSTANTS = {
  EPOCH_DURATION_SECONDS: 30 * 24 * 60 * 60,
  WITHDRAWAL_LOCK_SECONDS: 4 * 365 * 24 * 60 * 60,
  BASIS_POINTS: 10_000n,
  USDC_DECIMALS: 6,
} as const;
