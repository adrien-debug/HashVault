import Link from "next/link";
import { ShieldCheck, Coins, LineChart, ArrowRight } from "lucide-react";

const products = [
  {
    name: "HashVault Prime",
    tag: "Moderate · 12% APR",
    description:
      "Conservative allocation across mining infrastructure with USDC-denominated rewards distributed every 30 days.",
    bullets: ["12% target APR", "30-day reward epochs", "4-year vault duration"],
  },
  {
    name: "HashVault Growth",
    tag: "Growth · 15% APR",
    description:
      "Higher-yield allocation with deeper exposure to next-generation mining capacity. Same USDC-in, USDC-out simplicity.",
    bullets: ["15% target APR", "30-day reward epochs", "4-year vault duration"],
  },
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Non-custodial by design",
    body: "Smart contracts on Base. You hold your USDC until deposit, you control claims and withdrawals.",
  },
  {
    icon: Coins,
    title: "Real yield, no rebases",
    body: "Rewards are distributed in USDC from real-world infrastructure cash flows, not token emissions.",
  },
  {
    icon: LineChart,
    title: "Transparent accounting",
    body: "Every deposit, epoch, and reward distribution is verifiable on-chain. No black box.",
  },
];

export function Highlights() {
  return (
    <>
      <section id="products" className="py-24 max-md:py-16 border-t border-[var(--hairline)] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-14">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--mint-darker)]">Products</span>
            <h2 className="mt-3 text-[44px] max-md:text-[32px] font-semibold tracking-[-0.025em] leading-[1.05]">
              Two vaults. One simple flow.
            </h2>
            <p className="mt-4 text-[17px] max-md:text-[15px] text-[var(--text-muted)] max-w-[620px]">
              Pick the risk profile that matches your mandate. Deposit USDC. Claim
              rewards monthly. Withdraw at maturity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p) => (
              <article
                key={p.name}
                className="group relative p-10 max-md:p-7 rounded-[var(--r-card)] bg-[var(--gin-lightest)] border border-[var(--hairline)] hover:border-[var(--mint-dark)] transition-colors"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--mint-darker)]">{p.tag}</span>
                <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.015em]">{p.name}</h3>
                <p className="mt-4 text-[15px] text-[var(--text-muted)] leading-[1.55]">{p.description}</p>

                <ul className="mt-6 flex flex-col gap-2.5">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-[13.5px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint-darker)]" />
                      {b}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/platform"
                  className="mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--text)] hover:gap-2.5 transition-all"
                >
                  View vault <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="py-24 max-md:py-16 border-t border-[var(--hairline)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-14 max-w-[640px]">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--mint-darker)]">Why HashVault</span>
            <h2 className="mt-3 text-[44px] max-md:text-[32px] font-semibold tracking-[-0.025em] leading-[1.05]">
              Built for institutional standards.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-8 rounded-[var(--r-card)] bg-white border border-[var(--hairline)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--mint-lightest)] grid place-items-center text-[var(--mint-darker)] mb-5">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.005em]">{title}</h3>
                <p className="mt-2 text-[14px] text-[var(--text-muted)] leading-[1.55]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="py-24 max-md:py-16 border-t border-[var(--hairline)] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <h2 className="text-[36px] max-md:text-[28px] font-semibold tracking-[-0.02em] leading-[1.1]">
              Ready to put your USDC to work?
            </h2>
            <p className="mt-3 text-[16px] text-[var(--text-muted)] max-w-[520px]">
              Connect your wallet, choose a vault, and deposit in under a minute.
            </p>
          </div>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[var(--text)] text-white font-bold text-[15px] hover:bg-black transition-colors"
          >
            Launch App
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
