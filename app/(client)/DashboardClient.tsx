"use client";

import Link from "next/link";
import { PortfolioLineChart } from "@/components/charts/PortfolioLineChart";
import { AllocationDonut } from "@/components/charts/AllocationDonut";
import { Card, Kpi, Label, LegendItem, ProgressBar, SectionTitle } from "@/components/ui";
import type { PortfolioPoint, Position, Product } from "@/lib/db/types";
import { formatDate } from "@/lib/format";

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
const EXPOSURE_ORDER = ["BTC-correlated", "Mining infrastructure", "Stablecoin yield"];

function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function productName(slug: string) { return slug === "prime" ? "HashVault Prime" : "HashVault Growth"; }

type Props = {
  totalValueUsd: number; deltaUsd: number; deltaPct: string;
  yieldEarnedUsd: number; positions: Position[]; products: Product[]; history: PortfolioPoint[];
};

export function DashboardClient({ totalValueUsd, deltaUsd, deltaPct, yieldEarnedUsd, positions, products, history }: Props) {
  const total = positions.reduce((a, p) => a + p.amountUsd, 0);

  /* donut slices */
  const posIdx: Record<string, number> = {};
  const donutSlices = positions.map((pos) => {
    posIdx[pos.productSlug] = (posIdx[pos.productSlug] ?? 0) + 1;
    const idx = posIdx[pos.productSlug];
    const color = pos.productSlug === "prime" ? (TINTS[idx] ?? "#34C759") : (DARKS[idx] ?? "#111827");
    const pct = total > 0 ? Math.round((pos.amountUsd / total) * 1000) / 10 : 0;
    return { label: `${productName(pos.productSlug)} #${idx}`, value: pct, color };
  });

  /* exposure */
  const expo: Record<string, number> = {};
  positions.forEach((pos) => {
    const product = products.find((p) => p.slug === pos.productSlug);
    if (!product) return;
    const w = total > 0 ? pos.amountUsd / total : 0;
    product.pockets.forEach((pk) => {
      const bucket = EXPOSURE_MAP[pk.label] ?? "Other";
      expo[bucket] = (expo[bucket] ?? 0) + pk.pct * w;
    });
  });

  function apy(pos: Position) {
    const found = products.find((p) => p.slug === pos.productSlug);
    return found ? `${found.apy}%` : "—";
  }
  function lockProgress(pos: Position) {
    const start = new Date(pos.startedAt).getTime();
    const end = new Date(pos.maturesAt).getTime();
    return Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
  }
  function lockLabel(pos: Position) {
    const product = products.find((p) => p.slug === pos.productSlug);
    const months = Math.floor((Date.now() - new Date(pos.startedAt).getTime()) / (1000 * 60 * 60 * 24 * 30));
    return `${months} / ${product?.lockMonths ?? "?"} months`;
  }

  const primeAmt  = positions.filter((p) => p.productSlug === "prime").reduce((a, p) => a + p.amountUsd, 0);
  const growthAmt = positions.filter((p) => p.productSlug === "growth").reduce((a, p) => a + p.amountUsd, 0);

  const posCounter: Record<string, number> = {};

  return (
    <div>
      {/* KPI row */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <Card>
          <Label>Portfolio value</Label>
          <Kpi value={usd(totalValueUsd)} />
          <p className="text-pos font-semibold mt-0.5">+{usd(deltaUsd)} (+{deltaPct}%)</p>
        </Card>
        <Card>
          <Label>Yield earned to date</Label>
          <Kpi value={usd(yieldEarnedUsd)} />
          <p className="text-muted mt-0.5">USDC · distributed daily</p>
        </Card>
        <Card>
          <Label>Next distribution</Label>
          <Kpi value="Tomorrow" />
          <p className="text-muted mt-0.5">
            {(() => {
              const d = new Date(); d.setUTCDate(d.getUTCDate() + 1); d.setUTCHours(0, 0, 0, 0);
              return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " · 00:00 UTC";
            })()}
          </p>
        </Card>
      </div>

      {/* Portfolio chart */}
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle title="Portfolio value — last 12 months" right={<span className="text-muted text-[12px]">USD, daily</span>} />
        <PortfolioLineChart labels={history.map((h) => h.month)} values={history.map((h) => h.valueUsd)} />
      </Card>

      {/* Allocation */}
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle
          title="Allocation · recap"
          right={<Link href="/vaults" className="text-[12px] font-semibold text-[#1a7f3b]">See full breakdown in My Vaults →</Link>}
        />
        <div className="grid-2">
          <div>
            <Label>By vault</Label>
            <AllocationDonut slices={donutSlices} />
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
              {donutSlices.map((s) => <LegendItem key={s.label} color={s.color} label={`${s.label} · ${s.value}%`} />)}
            </div>
          </div>
          <div>
            <Label>By underlying exposure</Label>
            <div className="flex flex-col gap-3 mt-2">
              {EXPOSURE_ORDER.filter((b) => (expo[b] ?? 0) > 0.01).map((b) => (
                <div key={b}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <LegendItem color={EXPOSURE_COLORS[b]} label={b} />
                    <strong>{(expo[b] ?? 0).toFixed(1)}%</strong>
                  </div>
                  <ProgressBar pct={expo[b] ?? 0} color={EXPOSURE_COLORS[b]} />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-3">
              {positions.length} positions · {usd(primeAmt)} Prime + {usd(growthAmt)} Growth.
            </p>
          </div>
        </div>
      </Card>

      {/* Your vaults table */}
      <Card>
        <SectionTitle
          title="Your vaults"
          right={<Link href="/invest" className="btn btn-sm">Invest in a vault →</Link>}
        />
        <table className="data-table">
          <thead>
            <tr>{["Vault", "Deposited", "Current value", "APY", "Lock progress", "Next distribution", ""].map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              posCounter[pos.productSlug] = (posCounter[pos.productSlug] ?? 0) + 1;
              const pidx = posCounter[pos.productSlug];
              const gain = pos.currentValueUsd - pos.amountUsd;
              const gainPct = ((gain / pos.amountUsd) * 100).toFixed(1);
              const product = products.find((p) => p.slug === pos.productSlug);
              return (
                <tr key={pos.id} className="vault-row" onClick={() => (window.location.href = `/vaults#${pos.id}`)}>
                  <td>
                    <strong>{productName(pos.productSlug)} #{pidx}</strong>
                    <div className="text-[11px] text-muted mt-0.5">Opened {formatDate(pos.startedAt)} · {product?.risk}</div>
                  </td>
                  <td>{usd(pos.amountUsd)}</td>
                  <td>{usd(pos.currentValueUsd)} <span className="text-pos text-[11px]">+{gainPct}%</span></td>
                  <td>{apy(pos)}</td>
                  <td style={{ minWidth: 160 }}>
                    <ProgressBar pct={lockProgress(pos)} hint={lockLabel(pos)} />
                  </td>
                  <td>Tomorrow · 00:00 UTC</td>
                  <td className="go-arrow text-right w-6">→</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
