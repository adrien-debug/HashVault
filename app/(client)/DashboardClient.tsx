"use client";

import Link from "next/link";
import { PortfolioLineChart } from "@/components/charts/PortfolioLineChart";
import { AllocationDonut } from "@/components/charts/AllocationDonut";
import {
  Badge,
  Card,
  Label,
  LegendItem,
  PageHeader,
  Pill,
  ProgressBar,
  SectionTitle,
  StatCard,
} from "@/components/ui";
import type { PortfolioPoint, Position, Product } from "@/lib/db/types";
import { formatDate } from "@/lib/format";
import { useNowMs } from "@/hooks/useNowMs";

const TINTS: Record<number, string> = { 1: "#34C759", 2: "#5ad67a", 3: "#82e29a" };
const DARKS: Record<number, string> = { 1: "#F59E0B", 2: "#D97706", 3: "#B45309" };
const EXPOSURE_MAP: Record<string, string> = {
  "RWA Mining": "Mining infrastructure",
  "Collateral Mining": "Mining infrastructure",
  "USDC Yield": "Stablecoin yield",
  "BTC Hedged": "BTC-correlated",
  "BTC Spot": "BTC-correlated",
};
const EXPOSURE_COLORS: Record<string, string> = {
  "BTC-correlated":    "#F59E0B",
  "Mining infrastructure": "#34C759",
  "Stablecoin yield":  "#6B7280",
};
const EXPOSURE_ORDER = ["BTC-correlated", "Mining infrastructure", "Stablecoin yield"];

function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function productName(slug: string) { return slug === "prime" ? "HashVault Prime" : "HashVault Growth"; }

type Props = {
  totalValueUsd: number; deltaUsd: number; deltaPct: string;
  yieldEarnedUsd: number; positions: Position[]; products: Product[]; history: PortfolioPoint[];
};

export function DashboardClient({ totalValueUsd, deltaUsd, deltaPct, yieldEarnedUsd, positions, products, history }: Props) {
  const nowMs = useNowMs();
  const total = positions.reduce((a, p) => a + p.amountUsd, 0);

  /* donut slices */
  const posIdx: Record<string, number> = {};
  const donutSlices = positions.map((pos) => {
    posIdx[pos.productSlug] = (posIdx[pos.productSlug] ?? 0) + 1;
    const idx = posIdx[pos.productSlug];
    const color = pos.productSlug === "prime" ? (TINTS[idx] ?? "#34C759") : (DARKS[idx] ?? "#0F1115");
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
    if (nowMs === 0) return 0;
    const start = new Date(pos.startedAt).getTime();
    const end = new Date(pos.maturesAt).getTime();
    return Math.min(100, Math.max(0, ((nowMs - start) / (end - start)) * 100));
  }
  function lockLabel(pos: Position) {
    const product = products.find((p) => p.slug === pos.productSlug);
    if (nowMs === 0) return `0 / ${product?.lockMonths ?? "?"} months`;
    const months = Math.floor((nowMs - new Date(pos.startedAt).getTime()) / (1000 * 60 * 60 * 24 * 30));
    return `${months} / ${product?.lockMonths ?? "?"} months`;
  }

  const primeAmt  = positions.filter((p) => p.productSlug === "prime").reduce((a, p) => a + p.amountUsd, 0);
  const growthAmt = positions.filter((p) => p.productSlug === "growth").reduce((a, p) => a + p.amountUsd, 0);

  const tomorrow = (() => {
    const d = new Date(); d.setUTCDate(d.getUTCDate() + 1); d.setUTCHours(0, 0, 0, 0);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " · 00:00 UTC";
  })();

  const posCounter: Record<string, number> = {};

  return (
    <div>
      <PageHeader
        title="Portfolio overview"
        subtitle="Your HashVault positions, distributions, and target progress."
        right={<Pill>LIVE · MAINNET</Pill>}
      />

      {/* Hero KPI row */}
      <div className="grid-3 stagger" style={{ marginBottom: 18 }}>
        <StatCard
          label="Portfolio value"
          value={usd(totalValueUsd)}
          delta={{ value: `${usd(deltaUsd)} (+${deltaPct}%)`, positive: true }}
          sub="vs. total deposited"
          accent="#34C759"
          size="xl"
          sparkline={history.map((h) => h.valueUsd)}
          sparklineColor="#34C759"
        />
        <StatCard
          label="Yield earned to date"
          value={usd(yieldEarnedUsd)}
          sub="USDC · distributed daily"
          accent="#1FAE45"
          size="lg"
          sparkline={history.map((h) => h.valueUsd * 0.06 / 12)}
          sparklineColor="#1FAE45"
        />
        <StatCard
          label="Next distribution"
          value="Tomorrow"
          sub={tomorrow}
          accent="#0F1115"
          size="lg"
        />
      </div>

      {/* Portfolio chart */}
      <Card className="anim-fade-up" style={{ marginBottom: 18 }}>
        <SectionTitle
          title="Portfolio value"
          subtitle="Last 12 months · USD, daily snapshots"
          right={<Badge variant="green">+{deltaPct}%</Badge>}
        />
        <PortfolioLineChart labels={history.map((h) => h.month)} values={history.map((h) => h.valueUsd)} />
      </Card>

      {/* Allocation */}
      <Card className="anim-fade-up" style={{ marginBottom: 18 }}>
        <SectionTitle
          title="Allocation"
          subtitle="By vault and underlying exposure"
          right={
            <Link href="/vaults" className="text-[12px] font-semibold text-[var(--color-mint-700)] hover:text-[var(--color-mint-800)] inline-flex items-center gap-1">
              Full breakdown <span aria-hidden>→</span>
            </Link>
          }
        />
        <div className="grid-2">
          <div>
            <Label>By vault</Label>
            <AllocationDonut slices={donutSlices} />
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3">
              {donutSlices.map((s) => <LegendItem key={s.label} color={s.color} label={`${s.label} · ${s.value}%`} />)}
            </div>
          </div>
          <div>
            <Label>By underlying exposure</Label>
            <div className="flex flex-col gap-3.5 mt-2">
              {EXPOSURE_ORDER.filter((b) => (expo[b] ?? 0) > 0.01).map((b) => (
                <div key={b}>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <LegendItem color={EXPOSURE_COLORS[b]} label={b} />
                    <strong className="text-[var(--color-ink)]">{(expo[b] ?? 0).toFixed(1)}%</strong>
                  </div>
                  <ProgressBar pct={expo[b] ?? 0} color={EXPOSURE_COLORS[b]} />
                </div>
              ))}
            </div>
            <p className="text-[11.5px] text-muted mt-4">
              <strong className="text-[var(--color-ink)]">{positions.length}</strong> position{positions.length > 1 ? "s" : ""} ·{" "}
              <strong className="text-[var(--color-ink)]">{usd(primeAmt)}</strong> Prime +{" "}
              <strong className="text-[var(--color-ink)]">{usd(growthAmt)}</strong> Growth.
            </p>
          </div>
        </div>
      </Card>

      {/* Your vaults table */}
      <Card className="anim-fade-up !p-0 overflow-hidden">
        <div className="px-[22px] pt-[22px] pb-2">
          <SectionTitle
            title="Your vaults"
            subtitle="Active positions, current value, and lock progress."
            right={<Link href="/invest" className="btn btn-sm">Invest in a vault →</Link>}
          />
        </div>
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
                  <td className="font-semibold">{usd(pos.amountUsd)}</td>
                  <td>
                    <div className="font-semibold">{usd(pos.currentValueUsd)}</div>
                    <div className="text-pos text-[11px] font-semibold">+{gainPct}%</div>
                  </td>
                  <td><strong>{apy(pos)}</strong></td>
                  <td style={{ minWidth: 180 }} suppressHydrationWarning>
                    <ProgressBar pct={lockProgress(pos)} hint={lockLabel(pos)} />
                  </td>
                  <td className="text-muted">Tomorrow · 00:00 UTC</td>
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
