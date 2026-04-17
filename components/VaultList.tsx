"use client";

import { ArrowRight } from "lucide-react";

export function VaultList() {
  return (
    <section className="mb-0 anim-fade-up" style={{ animationDelay: "0.25s" }}>
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="m-0 text-[14px] font-semibold tracking-[-0.005em]">Your vaults</h2>
        <span className="text-[12px] text-[var(--text-faint)]">3 active</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1.2fr_0.6fr_1fr_1.4fr_1.2fr_16px] gap-4 px-4 pb-3 border-b border-[var(--hairline)] mb-2 max-lg:hidden">
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold">Vault</div>
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold text-right">Deposited</div>
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold text-right">Current value</div>
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold text-right">APY</div>
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold text-center">Trend 30d</div>
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold">Lock progress</div>
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold text-right">Next distribution</div>
        <div></div>
      </div>

      <div className="mt-0 bg-white rounded-[var(--r-card)] ring-1 ring-inset ring-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {[
          { name: "HashVault Prime", num: "#1", opened: "12 Oct 2024", type: "Moderate", dep: "$500,000", val: "$542,100", trend: "+8.4%", apy: "12%", prog: "50%", lock: "18 / 36 months", dist: "Tomorrow" },
          { name: "HashVault Prime", num: "#2", opened: "3 Aug 2025", type: "Moderate", dep: "$200,000", val: "$205,400", trend: "+2.7%", apy: "12%", prog: "22%", lock: "8 / 36 months", dist: "In 2 days" },
          { name: "HashVault Growth", num: "#1", opened: "12 Oct 2024", type: "Growth", dep: "$250,000", val: "$260,240", trend: "+4.1%", apy: "15%", prog: "33%", lock: "12 / 36 months", dist: "In 3 days" },
        ].map((v, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1.2fr_0.6fr_1fr_1.4fr_1.2fr_16px] gap-4 lg:items-center p-5 lg:px-4 lg:py-5 transition-colors cursor-pointer border-b border-[var(--hairline-soft)] last:border-b-0 hover:bg-[#fafafa] group max-lg:gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[var(--mint)] to-[var(--mint-light)] text-[var(--mint-darkest)] mb-2 uppercase tracking-widest shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint-darker)] shadow-[0_0_4px_rgba(66,100,57,0.4)]"></span>
                Live
              </span>
              <div className="font-semibold text-[var(--text)] text-[14px]">
                {v.name} <span className="text-[var(--text-faint)] font-medium">{v.num}</span>
              </div>
              <div className="text-[12px] text-[var(--text-faint)] mt-1 font-medium">
                Opened {v.opened} · {v.type}
              </div>
            </div>
            <div className="tabular-nums text-[15px] font-semibold text-right max-lg:text-left">{v.dep}</div>
            <div className="text-right max-lg:text-left">
              <span className="tabular-nums text-[15px] font-semibold">{v.val}</span>{" "}
              <span className="inline-flex items-center text-[12px] font-bold tabular-nums text-[var(--pos)] ml-1">
                {v.trend}
              </span>
            </div>
            <div className="tabular-nums text-[15px] font-semibold text-right max-lg:text-left">{v.apy}</div>
            <div className="h-6 w-full bg-[var(--bg)] rounded-sm overflow-hidden opacity-50 ring-1 ring-inset ring-black/[0.04]">
              {/* Placeholder for sparkline */}
            </div>
            <div className="px-2 max-lg:px-0">
              <div className="h-1.5 bg-[var(--bg)] rounded-full overflow-hidden mt-0 ring-1 ring-inset ring-black/[0.04]">
                <span className="block h-full bg-gradient-to-r from-[var(--mint-darker)] to-[var(--mint)] rounded-full transition-all duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)]" style={{ width: v.prog }}></span>
              </div>
              <div className="text-[12px] text-[var(--text-faint)] mt-2 tabular-nums font-medium">
                {v.lock}
              </div>
            </div>
            <div className="text-[12px] text-[var(--text-faint)] m-0 text-right font-medium max-lg:text-left">
              <span className="text-[var(--text)] font-semibold">{v.dist}</span><br />
              <span className="text-[var(--text-faint)] text-[11px] uppercase tracking-wider">00:00 UTC</span>
            </div>
            <div className="text-[var(--text-faint)] font-medium transition-colors text-right group-hover:text-[var(--text)] max-lg:hidden">
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
