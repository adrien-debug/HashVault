import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { VaultPreviewBanner } from "@/components/vault/VaultPreviewBanner";
import { DepositCard } from "@/components/vault/DepositCard";
import { UserPositionCard } from "@/components/vault/UserPositionCard";
import { VaultMetrics } from "@/components/vault/VaultMetrics";

const VAULT_META = {
  prime: {
    name: "HashVault Prime",
    tag: "Moderate · USDC",
    fallbackAprPercent: 12,
    description:
      "Conservative allocation across mining infrastructure with USDC-denominated rewards distributed every 30 days.",
  },
  growth: {
    name: "HashVault Growth",
    tag: "Growth · USDC",
    fallbackAprPercent: 15,
    description:
      "Higher-yield allocation with deeper exposure to next-generation mining capacity. Same USDC-in, USDC-out simplicity.",
  },
} as const;

type RouteParams = { id: keyof typeof VAULT_META };

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const meta = VAULT_META[id];
  if (!meta) return { title: "HashVault — Vault" };
  return { title: `HashVault — ${meta.name}` };
}

export default async function VaultDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const meta = VAULT_META[id];
  if (!meta) notFound();

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-8 anim-fade-up">
        <Link
          href="/platform"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft size={15} />
          Back to platform
        </Link>
        <ConnectWalletButton />
      </div>

      <header className="mb-10 anim-fade-up" style={{ animationDelay: "0.05s" }}>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--mint-darker)]">
          {meta.tag}
        </span>
        <h1 className="mt-3 text-[40px] max-md:text-[30px] font-semibold tracking-[-0.025em] leading-[1.05]">
          {meta.name}
        </h1>
        <p className="mt-3 text-[15px] text-[var(--text-muted)] max-w-[640px]">
          {meta.description}
        </p>
      </header>

      <VaultPreviewBanner vaultId={id} />

      <div className="mb-8">
        <VaultMetrics vaultId={id} fallbackAprPercent={meta.fallbackAprPercent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepositCard vaultId={id} fallbackAprPercent={meta.fallbackAprPercent} />
        <UserPositionCard vaultId={id} />
      </div>

      <section
        className="mt-10 p-7 rounded-[var(--r-card)] bg-white border border-[var(--hairline)] anim-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        <h3 className="text-[14px] font-semibold tracking-[-0.005em] mb-4">
          What to expect
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[13.5px] text-[var(--text-muted)]">
          <li>
            <span className="block font-semibold text-[var(--text)] mb-1">
              30-day epochs
            </span>
            Rewards accrue continuously and become claimable at the end of each epoch.
          </li>
          <li>
            <span className="block font-semibold text-[var(--text)] mb-1">
              4-year lock
            </span>
            Principal is locked for the vault lifetime. Rewards remain claimable monthly.
          </li>
          <li>
            <span className="block font-semibold text-[var(--text)] mb-1">USDC in, USDC out</span>
            All deposits and rewards are denominated in USDC — no auxiliary tokens.
          </li>
        </ul>
      </section>
    </>
  );
}
