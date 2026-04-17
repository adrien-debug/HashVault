"use client";

import { useState } from "react";
import { YieldBarChart } from "@/components/charts/YieldBarChart";
import type { Position, Product, Transaction } from "@/lib/db/types";
import type { ScenarioType } from "@/lib/db/types";

function usd(n: number, fractions = 0) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: fractions });
}
function productName(slug: string) {
  return slug === "prime" ? "HashVault Prime" : "HashVault Growth";
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function shortHash(h: string) {
  return h.slice(0, 4) + "…" + h.slice(-2);
}

const REGIME_LABEL: Record<ScenarioType, string> = {
  bull: "Bull — accelerate growth",
  flat: "Sideways — baseline mix",
  bear: "Bear — protect capital",
};
const REGIME_SHORT: Record<ScenarioType, string> = {
  bull: "Bull",
  flat: "Sideways",
  bear: "Bear",
};

type Props = {
  positions: Position[];
  products: Product[];
  transactions: Transaction[];
};

function VaultCard({
  pos,
  index,
  product,
  txs,
}: {
  pos: Position;
  index: number;
  product: Product;
  txs: Transaction[];
}) {
  const [activeRegime, setActiveRegime] = useState<ScenarioType>(product.activeRegime);
  const [txExpanded, setTxExpanded] = useState(false);
  const [stratOpen, setStratOpen] = useState(false);

  const scenario = product.scenarios.find((s) => s.type === activeRegime)!;
  const totalWeight = scenario.mix.reduce((a, m) => a + m.weight, 0);

  const visibleTxs = txExpanded ? txs : txs.slice(0, 3);
  const gain = pos.currentValueUsd - pos.amountUsd;

  // Chart data — last months yield
  const yieldTxs = txs.filter((t) => t.type === "yield").slice(0, 12).reverse();
  const barLabels = yieldTxs.map((t) =>
    new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
  );
  const barValues = yieldTxs.map((t) => t.amountUsd);

  const txIcon: Record<string, string> = {
    yield: "↓",
    fee: "−",
    deposit: "+",
    withdraw: "↑",
    claim: "↓",
  };
  const txBg: Record<string, string> = {
    yield: "var(--green-soft)",
    fee: "#FDECEC",
    deposit: "#EEF2FF",
    withdraw: "#EEF2FF",
    claim: "var(--green-soft)",
  };
  const txColor: Record<string, string> = {
    yield: "var(--green-strong)",
    fee: "#991B1B",
    deposit: "#3730A3",
    withdraw: "#3730A3",
    claim: "var(--green-strong)",
  };

  return (
    <div
      id={pos.id}
      className="card"
      style={{ marginBottom: 16 }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <span className="pill"><span className="dot-live" />LIVE</span>
          <h2 style={{ margin: "8px 0 2px" }}>
            {productName(pos.productSlug)} #{index}
          </h2>
          <div className="muted" style={{ fontSize: 12 }}>
            {product.pockets.map((pk) => pk.label).join(" · ")}
            {index > 1 ? " · additional position" : ""}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="kpi">
            {product.apy}%<small style={{ fontSize: 13, color: "var(--muted)", marginLeft: 4 }}>APY</small>
          </div>
          <div className="muted" style={{ fontSize: 12 }}>Daily distribution</div>
        </div>
      </div>

      {/* KPIs 4 cols */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 16 }}>
        <div>
          <div className="h-uppercase" style={{ marginBottom: 4 }}>Deposited</div>
          <div className="kpi sm">{usd(pos.amountUsd)}</div>
        </div>
        <div>
          <div className="h-uppercase" style={{ marginBottom: 4 }}>Current value</div>
          <div className="kpi sm">{usd(pos.currentValueUsd)}</div>
          <div className="pos" style={{ fontSize: 12 }}>+{usd(gain)}</div>
        </div>
        <div>
          <div className="h-uppercase" style={{ marginBottom: 4 }}>Yield paid</div>
          <div className="kpi sm">{usd(pos.yieldPaidUsd)}</div>
          <div className="muted" style={{ fontSize: 12 }}>USDC</div>
        </div>
        <div>
          <div className="h-uppercase" style={{ marginBottom: 4 }}>Matures</div>
          <div className="kpi sm">{fmtDate(pos.maturesAt)}</div>
          <div className="muted" style={{ fontSize: 12 }}>{product.lockMonths / 12}-year lock</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <strong>Cumulative target progress</strong>
          <span className="muted">{pos.cumulativeProgressPct}% of {product.cumulativeTargetPct}%</span>
        </div>
        <div className="progress">
          <span style={{ width: `${(pos.cumulativeProgressPct / product.cumulativeTargetPct) * 100}%` }} />
        </div>
        <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
          Your <strong>invested capital</strong> unlocks for withdrawal when the cumulative target is reached{" "}
          <em>or</em> at {product.lockMonths / 12}-year maturity, whichever comes first. Yield is distributed
          daily throughout the lock period.
        </div>
      </div>

      {/* Yield chart + safeguard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div className="h-uppercase" style={{ marginBottom: 6 }}>Yield paid — last months</div>
          <YieldBarChart
            labels={barLabels}
            values={barValues}
            color={pos.productSlug === "growth" ? "#F59E0B" : "#34C759"}
          />
        </div>
        <div>
          <div className="h-uppercase" style={{ marginBottom: 6 }}>Capital recovery status</div>
          <div
            className="card"
            style={{ marginTop: 8, background: "#F9FFF8", borderColor: "#CFEAD8" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "var(--green-strong)" }}>✓ Safeguard active — not triggered</strong>
              <span className="pill">auto</span>
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              If principal is below initial deposit at maturity, HashVault mining infrastructure
              continues to operate for up to 2 additional years, with mining output directed
              exclusively to restoring capital.
            </div>
          </div>
        </div>
      </div>

      {/* Note for index > 1 */}
      {index > 1 && (
        <div
          className="muted"
          style={{ fontSize: 12, marginBottom: 12, background: "#F3F8FF", border: "1px solid #C7D9F1", borderRadius: 10, padding: "10px 14px" }}
        >
          <strong>Note:</strong> This is a second entry into {productName(pos.productSlug)}. It follows the{" "}
          <em>same</em> strategy mix and rules as Position #1, but runs on its own{" "}
          {product.lockMonths / 12}-year timeline starting {fmtDate(pos.startedAt)}.
        </div>
      )}

      {/* Strategy details */}
      {index === 1 && (
        <details style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", marginBottom: 10, background: "#FAFBFC" }}
          onToggle={(e) => setStratOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary style={{ cursor: "pointer", fontWeight: 600, listStyle: "none" }}>
            Strategy details
          </summary>
          {stratOpen && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                Current market regime:{" "}
                <strong style={{ color: "var(--dark)" }}>{REGIME_LABEL[activeRegime]}</strong>
                <span style={{ fontSize: 11 }}>· Click any scenario below to preview its allocation</span>
              </div>
              {/* Strategy bar */}
              <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: "#F1F3F5", marginBottom: 8 }}>
                {scenario.mix.map((m, i) => (
                  <span
                    key={i}
                    style={{ width: `${(m.weight / totalWeight) * 100}%`, background: m.color, display: "block" }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
                {scenario.mix.map((m, i) => (
                  <span key={i}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        marginRight: 6,
                        verticalAlign: "middle",
                        background: m.color,
                      }}
                    />
                    {product.pockets[i]?.label} · {Math.round((m.weight / totalWeight) * 100)}%
                  </span>
                ))}
              </div>
              {/* Scenario cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {product.scenarios.map((s) => {
                  const isActive = s.type === activeRegime;
                  const tw = s.mix.reduce((a, m) => a + m.weight, 0);
                  return (
                    <div
                      key={s.type}
                      onClick={() => setActiveRegime(s.type)}
                      style={{
                        border: `1px solid ${isActive ? "var(--green)" : "var(--border)"}`,
                        borderRadius: 10,
                        padding: 12,
                        background: isActive ? "#F4FCF6" : "#fff",
                        boxShadow: isActive ? "0 0 0 3px rgba(52,199,89,.10)" : "none",
                        cursor: "pointer",
                        transition: "border-color .15s, box-shadow .15s, background .15s",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 999,
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                          background:
                            s.type === "bull" ? "#E6F7EC"
                            : s.type === "bear" ? "#FEE4E2"
                            : "#F1F3F5",
                          color:
                            s.type === "bull" ? "var(--green-strong)"
                            : s.type === "bear" ? "#9A2313"
                            : "var(--dark)",
                        }}
                      >
                        ● {REGIME_SHORT[s.type]}
                      </span>
                      <h4 style={{ margin: "8px 0 4px", fontSize: 13 }}>{s.title}</h4>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                        {s.description}
                      </p>
                      <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: "#F1F3F5", marginTop: 10 }}>
                        {s.mix.map((m, i) => (
                          <span key={i} style={{ width: `${(m.weight / tw) * 100}%`, background: m.color, display: "block" }} />
                        ))}
                      </div>
                      {isActive && (
                        <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: "var(--green-strong)", letterSpacing: ".05em", textTransform: "uppercase" }}>
                          ✓ Currently active
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </details>
      )}

      {/* Transactions */}
      <details style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", background: "#FAFBFC" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, listStyle: "none" }}>Transactions</summary>
        <div style={{ marginTop: 6 }}>
          {visibleTxs.map((t) => (
            <div
              key={t.id}
              style={{
                display: "grid",
                gridTemplateColumns: "24px 1fr auto auto",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid var(--border)",
                fontSize: 13,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  background: txBg[t.type] ?? "var(--green-soft)",
                  color: txColor[t.type] ?? "var(--green-strong)",
                }}
              >
                {txIcon[t.type]}
              </div>
              <div>
                <strong>{t.note ?? (t.type === "yield" ? "Yield distribution" : t.type)}</strong>
                <div className="muted" style={{ fontSize: 11 }}>
                  {fmtDate(t.createdAt)} · tx {shortHash(t.txHash)}
                </div>
              </div>
              <div className={t.amountUsd < 0 ? "neg" : t.type === "yield" ? "pos" : ""}>
                {t.amountUsd >= 0 ? "+" : ""}
                {t.amountUsd.toFixed(2)} USDC
              </div>
              <div className="muted">{t.frequency?.replace("one-off", "deposit") ?? ""}</div>
            </div>
          ))}
          {txs.length > 3 && (
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <button className="btn ghost" onClick={() => setTxExpanded((v) => !v)}>
                {txExpanded ? "Less ↑" : "More ↓"}
              </button>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

export function VaultsClient({ positions, products, transactions }: Props) {
  const productIndexCounter: Record<string, number> = {};

  return (
    <div>
      {positions.map((pos) => {
        const product = products.find((p) => p.slug === pos.productSlug);
        if (!product) return null;
        productIndexCounter[pos.productSlug] = (productIndexCounter[pos.productSlug] ?? 0) + 1;
        const idx = productIndexCounter[pos.productSlug];
        const txs = transactions.filter((t) => t.positionId === pos.id);
        return (
          <VaultCard key={pos.id} pos={pos} index={idx} product={product} txs={txs} />
        );
      })}
    </div>
  );
}
