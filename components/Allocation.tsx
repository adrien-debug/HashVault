"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function Allocation() {
  const data = [
    { name: "HashVault Prime", value: 700, color: "#10B981" },
    { name: "HashVault Growth", value: 252, color: "#A7FB90" },
  ];

  return (
    <section className="mb-8 anim-fade-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="m-0 text-[14px] font-semibold tracking-[-0.005em]">Allocation</h2>
        <a href="#" className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] font-medium transition-colors">Full breakdown in My Vaults →</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-lg:gap-8 bg-white rounded-[var(--r-card)] ring-1 ring-inset ring-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-8">
        <div>
          <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-6">By vault</div>
          <div className="relative w-[200px] h-[200px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="78%"
                  outerRadius="100%"
                  paddingAngle={0}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={4}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "10px 14px" }}
                  itemStyle={{ color: "#0a0a0a", fontWeight: "600", fontSize: "14px" }}
                  formatter={(value) => [`$ ${Number(value)}k`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center text-center pointer-events-none">
              <div>
                <div className="text-[24px] font-semibold tracking-[-0.02em] tabular-nums">$952k</div>
                <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-widest mt-0.5 font-bold">total</div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-0">
            <div className="flex items-center justify-between py-3 text-[13px] border-b border-[var(--hairline-soft)]">
              <div className="flex items-center gap-2.5 text-[var(--text)] font-medium">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#10B981]"></span>
                HashVault Prime
              </div>
              <div className="tabular-nums font-semibold text-[var(--text-muted)]">$700k · 73.5%</div>
            </div>
            <div className="flex items-center justify-between py-3 text-[13px]">
              <div className="flex items-center gap-2.5 text-[var(--text)] font-medium">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#A7FB90]"></span>
                HashVault Growth
              </div>
              <div className="tabular-nums font-semibold text-[var(--text-muted)]">$252k · 26.5%</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest font-bold mb-6">By underlying exposure</div>
          
          <div className="mb-4.5 last:mb-0">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[13px] font-medium">RWA Mining</span>
              <span className="text-[13px] tabular-nums text-[var(--text-muted)] font-medium">28%</span>
            </div>
            <div className="h-[5px] bg-[var(--gin)] rounded-full overflow-hidden">
              <span className="block h-full rounded-full transition-all duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] w-[28%] bg-gradient-to-r from-[var(--mint-darker)] to-[var(--mint)]"></span>
            </div>
          </div>
          
          <div className="mb-4.5 last:mb-0">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[13px] font-medium">USDC Yield</span>
              <span className="text-[13px] tabular-nums text-[var(--text-muted)] font-medium">22%</span>
            </div>
            <div className="h-[5px] bg-[var(--gin)] rounded-full overflow-hidden">
              <span className="block h-full rounded-full transition-all duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] w-[22%] bg-gradient-to-r from-[var(--mint)] to-[var(--mint-light)]"></span>
            </div>
          </div>
          
          <div className="mb-4.5 last:mb-0">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[13px] font-medium">BTC Hedged</span>
              <span className="text-[13px] tabular-nums text-[var(--text-muted)] font-medium">22%</span>
            </div>
            <div className="h-[5px] bg-[var(--gin)] rounded-full overflow-hidden">
              <span className="block h-full rounded-full transition-all duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] w-[22%] bg-gradient-to-r from-[#1a1a1a] to-[#444444]"></span>
            </div>
          </div>
          
          <div className="mb-4.5 last:mb-0">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[13px] font-medium">BTC Spot</span>
              <span className="text-[13px] tabular-nums text-[var(--text-muted)] font-medium">18%</span>
            </div>
            <div className="h-[5px] bg-[var(--gin)] rounded-full overflow-hidden">
              <span className="block h-full rounded-full transition-all duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] w-[18%] bg-gradient-to-r from-[#5c605c] to-[#888c88]"></span>
            </div>
          </div>
          
          <div className="mb-4.5 last:mb-0">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[13px] font-medium">Collateral Mining</span>
              <span className="text-[13px] tabular-nums text-[var(--text-muted)] font-medium">10%</span>
            </div>
            <div className="h-[5px] bg-[var(--gin)] rounded-full overflow-hidden">
              <span className="block h-full rounded-full transition-all duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)] w-[10%] bg-gradient-to-r from-[#888c88] to-[#b8c0b8]"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
