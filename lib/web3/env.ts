/**
 * Web3 environment configuration.
 * All values are read from NEXT_PUBLIC_* env vars at build time.
 * See `.env.example` at the project root for the list of required variables.
 */

const fallback = (value: string | undefined, fallback: string): string =>
  value && value.length > 0 ? value : fallback;

export const ENV = {
  WALLETCONNECT_PROJECT_ID: fallback(
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    "",
  ),

  // Default chain id used by the wagmi adapter (Base Sepolia for dev).
  DEFAULT_CHAIN_ID: Number(
    fallback(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID, "84532"),
  ),

  // ===== Base Mainnet (chainId 8453) — production target =====
  BASE_USDC: fallback(
    process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Circle USDC on Base
  ),
  BASE_VAULT_FACTORY: fallback(
    process.env.NEXT_PUBLIC_BASE_VAULT_FACTORY_ADDRESS,
    "0x0000000000000000000000000000000000000000", // TODO: set after deployment
  ),
  BASE_VAULT_PRIME: fallback(
    process.env.NEXT_PUBLIC_BASE_VAULT_PRIME_ADDRESS,
    "0x0000000000000000000000000000000000000000", // TODO: set after deployment
  ),
  BASE_VAULT_GROWTH: fallback(
    process.env.NEXT_PUBLIC_BASE_VAULT_GROWTH_ADDRESS,
    "0x0000000000000000000000000000000000000000", // TODO: set after deployment
  ),

  // ===== Base Sepolia (chainId 84532) — testnet =====
  BASE_SEPOLIA_USDC: fallback(
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_USDC_ADDRESS,
    "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Circle USDC on Base Sepolia
  ),
  BASE_SEPOLIA_VAULT_FACTORY: fallback(
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_VAULT_FACTORY_ADDRESS,
    "0x0000000000000000000000000000000000000000", // TODO: set after deployment
  ),
  BASE_SEPOLIA_VAULT_PRIME: fallback(
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_VAULT_PRIME_ADDRESS,
    "0x0000000000000000000000000000000000000000", // TODO: set after deployment
  ),
  BASE_SEPOLIA_VAULT_GROWTH: fallback(
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_VAULT_GROWTH_ADDRESS,
    "0x0000000000000000000000000000000000000000", // TODO: set after deployment
  ),

  // ===== Sepolia fallback for dev (existing Meeneo deployment) =====
  // Use only if you want to point the app at the legacy Sepolia contracts.
  SEPOLIA_USDC: fallback(
    process.env.NEXT_PUBLIC_SEPOLIA_USDC_ADDRESS,
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  ),
  SEPOLIA_VAULT: fallback(
    process.env.NEXT_PUBLIC_SEPOLIA_VAULT_ADDRESS,
    "0x20b5f7EC98ac1ee823e516Fb0d5Cace6229D37aF",
  ),
} as const;

export function validateWeb3Env(): { ok: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const ZERO = "0x0000000000000000000000000000000000000000";

  if (!ENV.WALLETCONNECT_PROJECT_ID) {
    warnings.push(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing — wallet connection will fail.",
    );
  }
  if (ENV.BASE_VAULT_PRIME === ZERO && ENV.BASE_VAULT_GROWTH === ZERO) {
    warnings.push(
      "Base vault addresses are placeholders — set NEXT_PUBLIC_BASE_VAULT_PRIME_ADDRESS / NEXT_PUBLIC_BASE_VAULT_GROWTH_ADDRESS after deployment.",
    );
  }

  return { ok: warnings.length === 0, warnings };
}
