"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

function generateData(n: number, base: number, vol: number, trend: number) {
  const data = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.45) * vol + trend;
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.max(0, v),
    });
  }
  return data;
}

export function PortfolioChart() {
  const data = useMemo(() => generateData(180, 600000, 4500, 950), []);

  return (
    <section className="mb-8 anim-fade-up" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="m-0 text-[14px] font-semibold tracking-[-0.005em]">Portfolio value</h2>
        <div className="inline-flex gap-0.5 bg-black/5 p-1 rounded-full">
          <button className="border-0 bg-transparent px-3 py-1.5 rounded-full text-[12px] font-medium text-[var(--text-muted)]">7d</button>
          <button className="border-0 bg-transparent px-3 py-1.5 rounded-full text-[12px] font-medium text-[var(--text-muted)]">30d</button>
          <button className="border-0 bg-[var(--card)] px-3 py-1.5 rounded-full text-[12px] font-semibold text-[var(--text)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">12M</button>
          <button className="border-0 bg-transparent px-3 py-1.5 rounded-full text-[12px] font-medium text-[var(--text-muted)]">All</button>
        </div>
      </div>
      
      <div className="bg-white rounded-[var(--r-card)] p-7 pb-5 relative overflow-hidden ring-1 ring-inset ring-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="relative w-full h-[260px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.04)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#888888", fontWeight: 500 }} 
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#888888", fontWeight: 500 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "12px 16px" }}
                itemStyle={{ color: "#111111", fontWeight: "700", fontSize: "15px" }}
                formatter={(value) => [
                  `$ ${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
                  "",
                ]}
                labelStyle={{ color: "#888888", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}
                cursor={{ stroke: "rgba(0,0,0,0.08)", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                activeDot={{ r: 5, fill: "#10B981", stroke: "#ffffff", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
