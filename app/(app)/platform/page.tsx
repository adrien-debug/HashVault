import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { VaultCard } from "@/components/platform/VaultCard";
import { PlatformPreviewBanner } from "@/components/platform/PlatformPreviewBanner";

export const metadata = {
  title: "HashVault — Platform",
};

export default function PlatformPage() {
  return (
    <>
      <header className="flex items-start justify-between gap-6 mb-12 anim-fade-up">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--mint-darker)]">
            Platform
          </span>
          <h1 className="mt-3 text-[40px] max-md:text-[30px] font-semibold tracking-[-0.025em] leading-[1.05]">
            Choose a vault.
          </h1>
          <p className="mt-3 text-[15px] text-[var(--text-muted)] max-w-[540px]">
            Deposit USDC and earn predictable monthly rewards. Pick the risk profile that
            fits your mandate.
          </p>
        </div>
        <ConnectWalletButton />
      </header>

      <PlatformPreviewBanner />

      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-6 anim-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <VaultCard
          vaultId="prime"
          fallbackName="HashVault Prime"
          fallbackTag="Moderate · USDC"
          fallbackAprPercent={12}
          description="Conservative allocation across mining infrastructure with USDC-denominated rewards distributed every 30 days."
          bullets={[
            "30-day reward epochs",
            "4-year vault duration",
            "Manual claim or auto-redeposit",
          ]}
        />
        <VaultCard
          vaultId="growth"
          fallbackName="HashVault Growth"
          fallbackTag="Growth · USDC"
          fallbackAprPercent={15}
          description="Higher-yield allocation with deeper exposure to next-generation mining capacity. Same USDC-in, USDC-out simplicity."
          bullets={[
            "30-day reward epochs",
            "4-year vault duration",
            "Manual claim or auto-redeposit",
          ]}
        />
      </section>

      <section
        className="mt-14 p-7 rounded-[var(--r-card)] bg-white border border-[var(--hairline)] anim-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        <h3 className="text-[14px] font-semibold tracking-[-0.005em]">How it works</h3>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-[13.5px]">
          {[
            { step: "01", title: "Approve USDC", body: "Grant the vault permission to move the USDC you intend to deposit." },
            { step: "02", title: "Deposit", body: "Send USDC into the vault. You're enrolled for the next 30-day epoch." },
            { step: "03", title: "Earn & claim", body: "Rewards accrue monthly. Claim, redeposit, or hold until maturity." },
          ].map(({ step, title, body }) => (
            <div key={step}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--mint-darker)]">
                Step {step}
              </div>
              <div className="mt-1.5 font-semibold text-[14px]">{title}</div>
              <div className="mt-1 text-[var(--text-muted)] leading-[1.5]">{body}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
