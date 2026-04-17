"use client";

import { ConnectWalletButton } from "./ConnectWalletButton";

export function Header() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-end pb-8 mb-8 anim-fade-up">
      <div>
        <p className="text-[var(--text-muted)] text-[13px] m-0 mb-2 font-medium tracking-wide">
          DEMO PORTFOLIO,&nbsp;<span className="text-[var(--text)] font-semibold">PREVIEW</span>
        </p>
        <h1 className="text-[72px] font-semibold tracking-tighter leading-none tabular-nums text-[var(--text)] m-0">
          <span className="text-[40px] text-[var(--text-muted)] font-medium tracking-normal mr-1.5">$</span>
          752,340<span className="text-[40px] text-[var(--text-muted)] font-medium tracking-normal">.12</span>
        </h1>
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold tabular-nums text-[var(--pos)]">
            <span className="text-[12px]">▲</span>$52,340.12
            <span className="text-[var(--text-muted)] font-medium ml-1">+7.48%</span>
          </span>
          <span className="text-[var(--text-faint)] text-[13px] font-medium">
            since opening · Oct 12, 2024
          </span>
        </div>
      </div>

      <div className="relative bg-[var(--mint)] rounded-[var(--r-card)] p-7 pb-6 shadow-[var(--shadow-mint)] overflow-hidden ring-1 ring-inset ring-black/5 anim-fade-up" style={{ animationDelay: "0.05s" }}>
        <div className="absolute -bottom-[60%] -right-[30%] w-[240px] h-[240px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.6),transparent_70%)] pointer-events-none"></div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--mint-darkest)] bg-white/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
          Live wallet (optional)
        </span>
        <h2 className="mt-4 mb-2 text-[24px] font-semibold tracking-tight text-[var(--text)] leading-tight">
          Try wallet<br />connect.
        </h2>
        <p className="m-0 text-[14px] text-black/70 max-w-[240px] font-medium">
          Opens AppKit for a real testnet connection; figures on the left stay demo-only.
        </p>
        <ConnectWalletButton variant="primary" className="mt-6" />
      </div>
    </section>
  );
}
