import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--mint-lightest)] via-white to-[var(--bg)]" />
      <div className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,var(--mint-lighter),transparent_60%)] -z-10 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-32 max-lg:pt-12 max-lg:pb-20">
        <div className="anim-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest bg-white border border-[var(--hairline)] text-[var(--mint-darkest)] mb-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint-darker)] shadow-[0_0_0_3px_rgba(167,251,144,0.35)]" />
            Built on Base · USDC native
          </span>

          <h1 className="text-[80px] max-lg:text-[56px] max-md:text-[44px] font-semibold tracking-[-0.035em] leading-[0.95] text-[var(--text)] max-w-[920px]">
            Earn institutional-grade yield
            <br />
            <span className="text-[var(--text-muted)]">on your USDC.</span>
          </h1>

          <p className="mt-8 text-[20px] max-md:text-[17px] leading-[1.5] text-[var(--text-muted)] max-w-[640px] font-normal">
            HashVault Prime and Growth are non-custodial vaults backed by real-world mining
            infrastructure. Predictable rewards, transparent on-chain accounting, no
            re-staking — just deposit USDC and earn.
          </p>

          <div className="mt-10 flex items-center gap-4 flex-wrap">
            <Link
              href="/platform"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[var(--mint)] text-[var(--mint-darkest)] font-bold text-[15px] hover:bg-[var(--mint-light)] transition-colors shadow-[var(--shadow-mint)] ring-1 ring-inset ring-black/5"
            >
              Launch App
              <ArrowUpRight size={18} strokeWidth={2.25} />
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white text-[var(--text)] font-semibold text-[14px] border border-[var(--hairline)] hover:bg-[var(--gin-lightest)] transition-colors"
            >
              Explore products
            </Link>
          </div>

          <div className="mt-16 flex items-end gap-12 flex-wrap text-left">
            <div>
              <div className="text-[44px] font-semibold tabular-nums tracking-[-0.02em] leading-none">12<span className="text-[24px] text-[var(--text-muted)] font-medium ml-0.5">%</span></div>
              <div className="text-[12px] text-[var(--text-faint)] uppercase tracking-widest font-bold mt-2">Prime APR · target</div>
            </div>
            <div className="w-px h-12 bg-[var(--hairline)]" />
            <div>
              <div className="text-[44px] font-semibold tabular-nums tracking-[-0.02em] leading-none">15<span className="text-[24px] text-[var(--text-muted)] font-medium ml-0.5">%</span></div>
              <div className="text-[12px] text-[var(--text-faint)] uppercase tracking-widest font-bold mt-2">Growth APR · target</div>
            </div>
            <div className="w-px h-12 bg-[var(--hairline)]" />
            <div>
              <div className="text-[44px] font-semibold tabular-nums tracking-[-0.02em] leading-none">USDC</div>
              <div className="text-[12px] text-[var(--text-faint)] uppercase tracking-widest font-bold mt-2">Native asset · Base</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
