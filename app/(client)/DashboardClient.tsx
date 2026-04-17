"use client";

import Link from "next/link";
import { PortfolioLineChart } from "@/components/charts/PortfolioLineChart";
import { AllocationDonut } from "@/components/charts/AllocationDonut";
import type { Position, Product } from "@/lib/db/types";
import type { PortfolioPoint } from "@/lib/db/types";

const VAULT_COLORS: Record<string, string> = {
  prime: "#34C759",
  growth: "#111827",
};
const TINTS: Record<number, string> = { 1: "#34C759", 2: "#5ad67a", 3: "#82e29a" };
const DARKS: Record<number, string> = { 1: "#111827", 2: "#3B4B63", 3: "#55677F" };

const EXPOSURE_MAP: Record<string, string> = {
  "RWA Mining": "Mining infrastructure",
  "Collateral Mining": "Mining infrastructure",
  "USDC Yield": "Stablecoin yield",
  "BTC Hedged": "BTC-correlated",
  "BTC Spot": "BTC-correlated",
};
const EXPOSURE_COLORS: Record<string, string> = {
  "BTC-correlated": "#F59E0B",
  "Mining infrastructure": "#34C759",
  "Stablecoin yield": "#111827",
};

function usd(n: number, fractions = 0) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: fractions });
}

function productName(slug: string) {
  return slug === "prime" ? "HashVault Prime" : "HashVault Growth";
}

function nextDistLabel() {
  const next = new Date();
  next.setUTCDate(next.getUTCDate() + 1);
  next.setUTCHours(0, 0, 0, 0);
  return next.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " · 00:00 UTC";
}

type Props = {
  totalValueUsd: number;
  deltaUsd: number;
  deltaPct: string;
  yieldEarnedUsd: number;
  positions: Position[];
  products: Product[];
  history: PortfolioPoint[];
};

export function DashboardClient({
  totalValueUsd,
  deltaUsd,
  deltaPct,
  yieldEarnedUsd,
  positions,
  products,
  history,
}: Props) {
  const total = positions.reduce((a, p) => a + p.amountUsd, 0);

  // Donut slices — one per position
  const productIndex: Record<string, number> = {};
  const donutSlices = positions.map((pos) => {
    productIndex[pos.productSlug] = (productIndex[pos.productSlug] ?? 0) + 1;
    const idx = productIndex[pos.productSlug];
    const pct = total > 0 ? Math.round((pos.amountUsd / total) * 1000) / 10 : 0;
    const color =
      pos.productSlug === "prime" ? (TINTS[idx] ?? "#34C759") : (DARKS[idx] ?? "#111827");
    return {
      label: `${productName(pos.productSlug)} #${idx}`,
      value: pct,
      color,
    };
  });

  // Exposure bars
  const expo: Record<string, number> = {};
  positions.forEach((pos) => {
    const product = products.find((p) => p.slug === pos.productSlug);
    if (!product) return;
    const weight = total > 0 ? pos.amountUsd / total : 0;
    product.pockets.forEach((pk) => {
      const bucket = EXPOSURE_MAP[pk.label] ?? "Other";
      expo[bucket] = (expo[bucket] ?? 0) + pk.pct * weight;
    });
  });
  const expoOrder = ["BTC-correlated", "Mining infrastructure", "Stablecoin yield"];

  // APY per position
  function apy(pos: Position) {
    const p = products.find((pr) => pr.slug === pos.productSlug);
    return p ? `${p.apy}%` : "—";
  }
  function lockProgress(pos: Position) {
    const start = new Date(pos.startedAt).getTime();
    const end = new Date(pos.maturesAt).getTime();
    const now = Date.now();
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  }
  function monthsProgress(pos: Position) {
    const product = products.find((p) => p.slug === pos.productSlug);
    if (!product) return "—";
    const start = new Date(pos.startedAt);
    const now = new Date();
    const months = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );
    return `${months} / ${product.lockMonths} months`;
  }

  const lineLabels = history.map((h) => h.month);
  const lineValues = history.map((h) => h.valueUsd);

  return (
    <div>
      {/* KPI row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div className="card">
          <div className="h-uppercase" style={{ marginBottom: 4 }}>Portfolio value</div>
          <div className="kpi">{usd(totalValueUsd)}</div>
          <div className="pos" style={{ fontWeight: 600, marginTop: 2 }}>
            + {usd(deltaUsd)} &nbsp; (+{deltaPct}%)
          </div>
        </div>
        <div className="card">
          <div className="h-uppercase" style={{ marginBottom: 4 }}>Yield earned to date</div>
          <div className="kpi">{usd(yieldEarnedUsd)}</div>
          <div className="muted" style={{ marginTop: 2 }}>USDC · distributed daily</div>
        </div>
        <div className="card">
          <div className="h-uppercase" style={{ marginBottom: 4 }}>Next distribution</div>
          <div className="kpi">Tomorrow</div>
          <div className="muted" style={{ marginTop: 2 }}>{nextDistLabel()}</div>
        </div>
      </div>

      {/* Portfolio chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>Portfolio value — last 12 months</h2>
          <span className="muted" style={{ fontSize: 12 }}>USD, daily</span>
        </div>
        <PortfolioLineChart labels={lineLabels} values={lineValues} />
      </div>

      {/* Allocation */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>Allocation · recap</h2>
          <Link href="/vaults" style={{ fontSize: 12, fontWeight: 600, color: "var(--green-strong)" }}>
            See full breakdown in My Vaults →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div className="h-uppercase" style={{ marginBottom: 8 }}>By vault</div>
            <AllocationDonut slices={donutSlices} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", justifyContent: "center", marginTop: 8, fontSize: 11 }}>
              {donutSlices.map((s) => (
                <span key={s.label} style={{ color: "var(--muted)" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      marginRight: 5,
                      verticalAlign: "middle",
                      background: s.color,
                    }}
                  />
                  {s.label} · {s.value}%
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="h-uppercase" style={{ marginBottom: 10 }}>By underlying exposure</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {expoOrder
                .filter((b) => (expo[b] ?? 0) > 0.01)
                .map((b) => {
                  const v = expo[b] ?? 0;
                  return (
                    <div key={b}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span>
                          <span
                            style={{
                              display: "inline-block",
                              width: 10,
                              height: 10,
                              borderRadius: 3,
                              marginRight: 6,
                              verticalAlign: "middle",
                              background: EXPOSURE_COLORS[b],
                            }}
                          />
                          {b}
                        </span>
                        <strong>{v.toFixed(1)}%</strong>
                      </div>
                      <div className="progress">
                        <span style={{ width: `${v}%`, background: EXPOSURE_COLORS[b] }} />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="muted" style={{ fontSize: 11, marginTop: 14 }}>
              {positions.length} positions ·{" "}
              {usd(positions.filter((p) => p.productSlug === "prime").reduce((a, p) => a + p.amountUsd, 0))} Prime +{" "}
              {usd(positions.filter((p) => p.productSlug === "growth").reduce((a, p) => a + p.amountUsd, 0))} Growth.
            </div>
          </div>
        </div>
      </div>

      {/* Vault table */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Your vaults</h2>
          <Link href="/invest" className="btn" style={{ fontSize: 13, padding: "8px 14px" }}>
            Invest in a vault →
          </Link>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Vault", "Deposited", "Current value", "APY", "Lock progress", "Next distribution", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "12px 10px",
                    borderBottom: "1px solid var(--border)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--muted)",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const slug = pos.productSlug;
              const pidx = (() => {
                const counter: Record<string, number> = {};
                let out = 1;
                for (const p of positions) {
                  counter[p.productSlug] = (counter[p.productSlug] ?? 0) + 1;
                  if (p.id === pos.id) { out = counter[p.productSlug]; break; }
                }
                return out;
              })();
              const gain = pos.currentValueUsd - pos.amountUsd;
              const gainPct = ((gain / pos.amountUsd) * 100).toFixed(1);
              const prog = lockProgress(pos);
              return (
                <tr
                  key={pos.id}
                  className="vault-row"
                  onClick={() => { window.location.href = `/vaults#${pos.id}`; }}
                  style={{ cursor: "pointer" }}
                >
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                    <strong>{productName(slug)} #{pidx}</strong>
                    <div className="muted" style={{ fontSize: 11 }}>
                      Opened {new Date(pos.startedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                      {products.find((p) => p.slug === slug)?.risk}
                    </div>
                  </td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", fontSize: 13 }}>{usd(pos.amountUsd)}</td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                    {usd(pos.currentValueUsd)}{" "}
                    <span className="pos" style={{ fontSize: 11 }}>+{gainPct}%</span>
                  </td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", fontSize: 13 }}>{apy(pos)}</td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", fontSize: 13, minWidth: 160 }}>
                    <div className="progress"><span style={{ width: `${prog}%` }} /></div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{monthsProgress(pos)}</div>
                  </td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", fontSize: 13 }}>Tomorrow · 00:00 UTC</td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid var(--border)", color: "#9CA3AF", fontWeight: 700, textAlign: "right", width: 24 }}>→</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
