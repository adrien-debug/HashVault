"use client";

import { useEffect, useState } from "react";

export function KpiStrip() {
  const [timeLeft, setTimeLeft] = useState({ h: "07", m: "23" });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const t = new Date(now);
      t.setUTCDate(t.getUTCDate() + 1);
      t.setUTCHours(0, 0, 0, 0);
      const diff = t.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
      });
    };
    tick();
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-10 anim-fade-up bg-white rounded-[var(--r-card)] ring-1 ring-inset ring-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden" style={{ animationDelay: "0.1s" }}>
      <div className="px-8 py-6 border-b md:border-b-0 md:border-r border-[var(--hairline-soft)]">
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-3">
          Yield earned to date
        </div>
        <div className="text-[32px] font-semibold tracking-tight tabular-nums leading-none">
          <span className="text-[16px] text-[var(--text-muted)] font-medium mr-1">$</span>
          42,180
          <small className="text-[14px] text-[var(--text-muted)] font-medium ml-1 tracking-normal">USDC</small>
        </div>
        <div className="text-[13px] text-[var(--text-muted)] mt-3 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-[var(--pos)]">
            <span className="text-[11px]">▲</span>+$1,240
          </span>
          <span className="text-[var(--text-faint)] font-medium">last 30d</span>
        </div>
      </div>

      <div className="px-8 py-6 border-b md:border-b-0 md:border-r border-[var(--hairline-soft)]">
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-3">
          Weighted avg APY
        </div>
        <div className="text-[32px] font-semibold tracking-tight tabular-nums leading-none">
          12.8
          <small className="text-[16px] text-[var(--text-muted)] font-medium ml-1 tracking-normal">%</small>
        </div>
        <div className="text-[13px] text-[var(--text-muted)] mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[var(--text-faint)] font-medium">across</span>
          <span className="text-[var(--text)] font-semibold">3 active vaults</span>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-3">
          Next distribution
        </div>
        <div className="text-[32px] font-semibold tracking-tight tabular-nums leading-none">
          <span>{timeLeft.h}</span>
          <small className="text-[16px] text-[var(--text-muted)] font-medium ml-1 mr-2 tracking-normal">h</small>
          <span>{timeLeft.m}</span>
          <small className="text-[16px] text-[var(--text-muted)] font-medium ml-1 tracking-normal">m</small>
        </div>
        <div className="text-[13px] text-[var(--text-muted)] mt-3 flex items-center gap-2 flex-wrap font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint-darker)] shadow-[0_0_0_3px_rgba(66,100,57,0.15)]"></span>
          <span className="text-[var(--text-muted)]">Tomorrow · est. $116.06</span>
        </div>
      </div>
    </section>
  );
}
