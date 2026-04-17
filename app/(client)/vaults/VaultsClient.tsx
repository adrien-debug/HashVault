"use client";

import { useState } from "react";
import { YieldBarChart } from "@/components/charts/YieldBarChart";
import { Card, Kpi, Label, LegendItem, Pill, ProgressBar, StratBar, TxRow } from "@/components/ui";
import type { Position, Product, ScenarioType, Transaction } from "@/lib/db/types";
import { formatDate } from "@/lib/format";

function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function productName(slug: string) { return slug === "prime" ? "HashVault Prime" : "HashVault Growth"; }

const REGIME_LABEL: Record<ScenarioType, string> = {
  bull: "Bull — accelerate growth",
  flat: "Sideways — baseline mix",
  bear: "Bear — protect capital",
};
const REGIME_SHORT: Record<ScenarioType, string> = { bull: "Bull", flat: "Sideways", bear: "Bear" };
const SCENARIO_BG:    Record<ScenarioType, string> = { bull: "#E6F7EC", flat: "#F1F3F5", bear: "#FEE4E2" };
const SCENARIO_COLOR: Record<ScenarioType, string> = { bull: "#1a7f3b", flat: "#111827", bear: "#9A2313" };
const TX_ICON:  Record<string, string> = { yield: "↓", fee: "−", deposit: "+", withdraw: "↑", claim: "↓" };
const TX_BG:    Record<string, string> = { yield: "#e6f7ec", fee: "#FDECEC", deposit: "#EEF2FF", withdraw: "#EEF2FF", claim: "#e6f7ec" };
const TX_COLOR: Record<string, string> = { yield: "#1a7f3b", fee: "#991B1B", deposit: "#3730A3", withdraw: "#3730A3", claim: "#1a7f3b" };

function VaultCard({ pos, index, product, txs }: { pos: Position; index: number; product: Product; txs: Transaction[] }) {
  const [regime, setRegime] = useState<ScenarioType>(product.activeRegime);
  const [txExpanded, setTxExpanded] = useState(false);

  const scenario  = product.scenarios.find((s) => s.type === regime)!;
  const gain      = pos.currentValueUsd - pos.amountUsd;
  const progPct   = Math.min(100, (pos.cumulativeProgressPct / product.cumulativeTargetPct) * 100);

  const yieldTxs  = txs.filter((t) => t.type === "yield").slice(0, 12).reverse();
  const barLabels = yieldTxs.map((t) => new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }));
  const barValues = yieldTxs.map((t) => t.amountUsd);
  const visibleTxs = txExpanded ? txs : txs.slice(0, 3);

  return (
    <Card id={pos.id} style={{ marginBottom: 16 }}>
      {/* header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <Pill />
          <h2 className="text-[16px] font-semibold my-2">{productName(pos.productSlug)} #{index}</h2>
          <p className="text-muted text-[12px] m-0">
            {product.pockets.map((pk) => pk.label).join(" · ")}
            {index > 1 && " · additional position"}
          </p>
        </div>
        <div className="text-right">
          <div className="kpi-lg">{product.apy}<small className="text-[14px] font-semibold text-muted ml-1">% APY</small></div>
          <p className="text-muted text-[12px] m-0">Daily distribution</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4 mb-4">
        <div><Label>Deposited</Label><Kpi size="sm" value={usd(pos.amountUsd)} /></div>
        <div>
          <Label>Current value</Label>
          <Kpi size="sm" value={usd(pos.currentValueUsd)} sub={<span className="text-pos">+{usd(gain)}</span>} />
        </div>
        <div><Label>Yield paid</Label><Kpi size="sm" value={usd(pos.yieldPaidUsd)} sub="USDC" /></div>
        <div><Label>Matures</Label><Kpi size="sm" value={formatDate(pos.maturesAt)} sub={`${product.lockMonths / 12}-year lock`} /></div>
      </div>

      {/* progress */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <strong className="text-[13px]">Cumulative target progress</strong>
          <span className="text-muted text-[12px]">{pos.cumulativeProgressPct}% of {product.cumulativeTargetPct}%</span>
        </div>
        <ProgressBar
          pct={progPct}
          hint={
            <span>
              Your <strong>invested capital</strong> unlocks for withdrawal when the cumulative target is reached <em>or</em>{" "}
              at {product.lockMonths / 12}-year maturity, whichever comes first. Yield is distributed daily throughout the lock period.
            </span>
          }
        />
      </div>

      {/* yield chart + safeguard */}
      <div className="grid-2 mb-4">
        <div>
          <Label>Yield paid — last months</Label>
          <YieldBarChart
            labels={barLabels}
            values={barValues}
            color={pos.productSlug === "growth" ? "#F59E0B" : "#34C759"}
          />
        </div>
        <div>
          <Label>Capital recovery status</Label>
          <Card className="mt-2 !bg-[#F9FFF8] !border-[#CFEAD8]">
            <div className="flex justify-between items-center">
              <strong className="text-[#1a7f3b] text-[13px]">✓ Safeguard active — not triggered</strong>
              <Pill />
            </div>
            <p className="text-muted text-[12px] mt-1.5">
              If principal is below initial deposit at maturity, HashVault mining infrastructure continues to operate
              for up to 2 additional years, with mining output directed exclusively to restoring capital.
            </p>
          </Card>
        </div>
      </div>

      {/* note for index > 1 */}
      {index > 1 && (
        <p className="text-[12px] text-muted bg-[#F3F8FF] border border-[#C7D9F1] rounded-[10px] p-3 mb-3">
          <strong>Note:</strong> This is a second entry into {productName(pos.productSlug)}. It follows the <em>same</em>{" "}
          strategy mix and rules as Position #1, but runs on its own {product.lockMonths / 12}-year timeline starting{" "}
          {formatDate(pos.startedAt)}.
        </p>
      )}

      {/* strategy details */}
      {index === 1 && (
        <details className="mb-2">
          <summary>Strategy details</summary>
          <div className="mt-3">
            <p className="text-[12px] text-muted mb-2">
              Current market regime: <strong className="text-dark">{REGIME_LABEL[regime]}</strong>
              <span className="ml-2 text-[11px]">· Click any scenario below to preview its allocation</span>
            </p>
            <StratBar mix={scenario.mix} />
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 mb-4">
              {scenario.mix.map((m, i) => {
                const tw = scenario.mix.reduce((a, x) => a + x.weight, 0);
                return (
                  <LegendItem
                    key={i}
                    color={m.color}
                    label={`${product.pockets[i]?.label} · ${Math.round((m.weight / tw) * 100)}%`}
                  />
                );
              })}
            </div>
            <div className="grid-3">
              {product.scenarios.map((s) => {
                const isActive = s.type === regime;
                return (
                  <div key={s.type} className={`scn${isActive ? " active" : ""}`} onClick={() => setRegime(s.type)}>
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-[0.05em]"
                      style={{ background: SCENARIO_BG[s.type], color: SCENARIO_COLOR[s.type] }}
                    >
                      ● {REGIME_SHORT[s.type]}
                    </span>
                    <h4 className="text-[13px] font-semibold my-2">{s.title}</h4>
                    <p className="text-[12px] text-muted leading-relaxed m-0">{s.description}</p>
                    <StratBar mix={s.mix} size="sm" />
                    {isActive && (
                      <p className="text-[10px] font-bold text-[#1a7f3b] uppercase tracking-widest mt-2 m-0">✓ Currently active</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </details>
      )}

      {/* transactions */}
      <details>
        <summary>Transactions</summary>
        <div className="mt-1.5">
          {visibleTxs.map((t) => (
            <TxRow
              key={t.id}
              icon={TX_ICON[t.type] ?? "·"}
              iconBg={TX_BG[t.type] ?? "#e6f7ec"}
              iconColor={TX_COLOR[t.type] ?? "#1a7f3b"}
              title={t.note ?? (t.type === "yield" ? "Yield distribution" : t.type)}
              date={formatDate(t.createdAt)}
              txHash={t.txHash}
              amount={`${t.amountUsd >= 0 ? "+" : ""}${t.amountUsd.toFixed(2)} USDC`}
              amountClass={t.amountUsd < 0 ? "text-neg" : t.type === "yield" ? "text-pos" : ""}
              frequency={t.frequency?.replace("one-off", "deposit")}
            />
          ))}
          {txs.length > 3 && (
            <div className="text-center mt-2.5">
              <button className="btn btn-ghost btn-sm" onClick={() => setTxExpanded((v) => !v)}>
                {txExpanded ? "Less ↑" : "More ↓"}
              </button>
            </div>
          )}
        </div>
      </details>
    </Card>
  );
}

type Props = { positions: Position[]; products: Product[]; transactions: Transaction[] };

export function VaultsClient({ positions, products, transactions }: Props) {
  const counter: Record<string, number> = {};
  return (
    <div>
      {positions.map((pos) => {
        const product = products.find((p) => p.slug === pos.productSlug);
        if (!product) return null;
        counter[pos.productSlug] = (counter[pos.productSlug] ?? 0) + 1;
        return (
          <VaultCard
            key={pos.id}
            pos={pos}
            index={counter[pos.productSlug]}
            product={product}
            txs={transactions.filter((t) => t.positionId === pos.id)}
          />
        );
      })}
    </div>
  );
}
