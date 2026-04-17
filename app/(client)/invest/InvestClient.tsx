"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
import { ensureChartsRegistered } from "@/components/charts/ChartRegistry";
import type { Product, ScenarioType } from "@/lib/db/types";

type Step = 1 | 2 | 3 | 4;

const REGIME_SHORT: Record<ScenarioType, string> = { bull: "Bull", flat: "Sideways", bear: "Bear" };
const WALLET_BALANCE = 742_110;

function usd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function Stepper({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Select" },
    { n: 2, label: "Product" },
    { n: 3, label: "Deposit" },
    { n: 4, label: "Confirmed" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 18, fontSize: 12 }}>
      {steps.map((s, i) => (
        <span key={s.n} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "none" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: s.n < step ? "var(--green)" : s.n === step ? "var(--dark)" : "var(--muted)",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                background:
                  s.n < step ? "var(--green)" : s.n === step ? "var(--dark)" : "#F1F3F5",
                color: s.n <= step ? "#fff" : "var(--muted)",
                flexShrink: 0,
              }}
            >
              {s.n < step ? "✓" : s.n}
            </span>
            {s.label}
          </span>
          {i < 3 && (
            <span
              style={{
                flex: 1,
                height: 2,
                background: s.n < step ? "var(--green)" : "#F1F3F5",
                margin: "0 10px",
                borderRadius: 2,
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}

// ---- Step 1 ----
function Step1({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (slug: string) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
      {products.map((p) => (
        <div key={p.slug} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="pill"><span className="dot-live" />LIVE</span>
          <h2 style={{ marginTop: 6, marginBottom: 0 }}>{p.name}</h2>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-.02em" }}>
            {p.apy}<small style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)", marginLeft: 4 }}>% APY</small>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{p.lead}</div>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--muted)", margin: "0 0 14px" }}>
            {p.description}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              padding: "12px 0",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {[
              { k: "Lock", v: `${p.lockMonths / 12} years` },
              { k: "Min deposit", v: usd(p.minDeposit) },
              { k: "Risk", v: p.risk },
            ].map(({ k, v }) => (
              <div key={k}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--muted)", fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                  {k === "Risk" ? (
                    <span style={{ background: "#F1F3F5", color: "var(--dark)", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
                      {v}
                    </span>
                  ) : v}
                </div>
              </div>
            ))}
          </div>
          <button className="btn full" onClick={() => onSelect(p.slug)}>Select →</button>
        </div>
      ))}
    </div>
  );
}

// ---- Step 2 ----
function Step2({ product, onBack, onNext }: { product: Product; onBack: () => void; onNext: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    ensureChartsRegistered();
    const canvas = ref.current;
    if (!canvas) return;
    const chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: product.pockets.map((x) => x.label),
        datasets: [{ data: product.pockets.map((x) => x.pct), backgroundColor: product.pockets.map((x) => x.color), borderWidth: 0 }],
      },
      options: { cutout: "60%", plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false },
    });
    return () => chart.destroy();
  }, [product]);

  const terms = [
    ["Target APY", `${product.apy}%`],
    ["Lock period", `${product.lockMonths} months (${product.lockMonths / 12} years)`],
    ["Minimum deposit", usd(product.minDeposit)],
    ["Deposit token", product.depositToken],
    ["Network", product.network],
    ["Yield distribution", "Daily"],
    ["Withdraw condition", `${product.cumulativeTargetPct}% target or ${product.lockMonths / 12}-year maturity`],
    ["Custody", "Audited — institutional"],
    ["Fees", `${product.feesMgmtPct}% mgmt + ${product.feesPerfPct}% perf`],
  ];

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="pill"><span className="dot-live" />LIVE</span>
          <h2 style={{ margin: "8px 0 2px" }}>{product.name}</h2>
          <div className="muted">{product.lead}</div>
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-.02em" }}>
          {product.apy}<small style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)", marginLeft: 4 }}>% APY</small>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 18 }}>
        <div>
          <div className="h-uppercase" style={{ marginBottom: 8 }}>Key terms</div>
          {terms.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed var(--border)", fontSize: 13 }}>
              <span>{k}</span><strong>{v}</strong>
            </div>
          ))}
        </div>
        <div>
          <div className="h-uppercase" style={{ marginBottom: 8 }}>Strategy pockets</div>
          <div style={{ position: "relative", height: 170 }}><canvas ref={ref} /></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", justifyContent: "center", fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            {product.pockets.map((pk) => (
              <span key={pk.label}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, marginRight: 5, verticalAlign: "middle", background: pk.color }} />
                {pk.label} · {pk.pct}%
              </span>
            ))}
          </div>
          <div
            className="card"
            style={{ background: "#F9FFF8", borderColor: "#CFEAD8", marginTop: 18 }}
          >
            <strong style={{ color: "var(--green-strong)" }}>Capital recovery mechanism</strong>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              If the vault&apos;s principal is below the initial deposit at maturity, HashVault mining
              infrastructure continues to operate for up to two additional years, with output directed
              exclusively toward restoring the original capital base.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
        <button className="btn ghost" onClick={onBack}>← Back</button>
        <button className="btn" onClick={onNext}>Continue to deposit →</button>
      </div>
    </div>
  );
}

// ---- Step 3 ----
function Step3({
  product,
  onBack,
  onConfirm,
  depositRef,
}: {
  product: Product;
  onBack: () => void;
  onConfirm: (amt: number) => void;
  depositRef: React.MutableRefObject<number>;
}) {
  const [amount, setAmount] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const valid = amount >= product.minDeposit;
  const canSubmit = valid && agreed;

  const targetPct = product.cumulativeTargetPct / 100;
  const targetValue = amount * (1 + targetPct);
  const yearly = Math.round(amount * (product.apy / 100));
  const total = Math.round(amount * targetPct);

  const regimes = [
    { key: "bull", label: "Bull", targetMonth: 12, color: "#34C759" },
    { key: "flat", label: "Sideways", targetMonth: 26, color: "#6B7280" },
    { key: "bear", label: "Bear", targetMonth: 36, color: "#F59E0B" },
  ];

  const drawChart = useCallback(() => {
    ensureChartsRegistered();
    const canvas = chartRef.current;
    if (!canvas) return;
    chartInstance.current?.destroy();
    if (amount < product.minDeposit) { chartInstance.current = null; return; }

    const months = Array.from({ length: 37 }, (_, i) => i);
    const datasets = regimes.flatMap((reg) => {
      const base = Math.pow(1 + targetPct, 1 / reg.targetMonth) - 1;
      const data = months.map((m) => {
        if (m > reg.targetMonth) return null;
        if (reg.key === "bear" && m > 10 && m <= 14) return Math.round(amount * Math.pow(1 + base, 10));
        return Math.round(amount * Math.pow(1 + base, m));
      });
      return [{
        label: `${reg.label} · closes M${reg.targetMonth}`,
        data,
        borderColor: reg.color,
        backgroundColor: "transparent",
        borderWidth: 2.5,
        fill: false,
        tension: 0.25,
        pointRadius: 0,
        spanGaps: false,
      }];
    });
    datasets.push({
      label: "Target",
      data: months.map(() => Math.round(targetValue)),
      borderColor: "rgba(17,24,39,.25)",
      borderWidth: 1,
      borderDash: [4, 4],
      pointRadius: 0,
      fill: false,
      tension: 0,
    } as unknown as typeof datasets[0]);

    chartInstance.current = new Chart(canvas, {
      type: "line",
      data: { labels: months.map((m) => "M" + m), datasets },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { callback: (_, i) => i % 6 === 0 ? "M" + i : "" } },
          y: { min: Math.round(amount * 0.98), ticks: { callback: (v) => "$" + (Number(v) / 1000).toFixed(0) + "k" } },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [amount, product.minDeposit, targetPct, targetValue]);

  useEffect(() => { drawChart(); }, [drawChart]);
  useEffect(() => () => { chartInstance.current?.destroy(); }, []);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="pill"><span className="dot-live" />LIVE</span>
          <h2 style={{ margin: "8px 0 2px" }}>{product.name}</h2>
          <div className="muted">Deposit USDC on Base. Minimum <strong>{usd(product.minDeposit)}</strong>.</div>
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-.02em" }}>
          {product.apy}<small style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)", marginLeft: 4 }}>% APY</small>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 20 }}>
        {/* Left: input */}
        <div>
          <div className="h-uppercase" style={{ marginBottom: 8 }}>Amount (USDC)</div>
          <div className={`amt-input${valid && amount > 0 ? " valid" : amount > 0 && !valid ? " invalid" : ""}`}>
            <input
              type="number"
              placeholder="Enter amount in USDC"
              min={0}
              step={1000}
              value={amount || ""}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            />
            {valid && amount > 0 && (
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>✓</span>
            )}
            <span style={{ fontWeight: 600, color: "var(--muted)" }}>USDC</span>
          </div>
          <div style={{ fontSize: 12, marginTop: 6, display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
            <span>Wallet balance: <strong>{usd(WALLET_BALANCE)} USDC</strong></span>
            {amount === 0 && <span>Minimum: <strong>{usd(product.minDeposit)}</strong></span>}
            {amount > 0 && valid && <span style={{ color: "var(--green-strong)", fontWeight: 600 }}>✓ Minimum reached</span>}
            {amount > 0 && !valid && (
              <span style={{ color: "#B42318", fontWeight: 600 }}>
                Add {usd(product.minDeposit - amount)} to reach minimum
              </span>
            )}
          </div>

          <label style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "flex-start", cursor: "pointer" }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 2 }} />
            <span style={{ fontSize: 13 }}>I have read and accept the <span style={{ color: "var(--green-strong)", textDecoration: "underline", cursor: "pointer" }}>term sheet</span>.</span>
          </label>

          <button
            className="btn full"
            style={{ marginTop: 16 }}
            disabled={!canSubmit}
            onClick={() => {
              depositRef.current = amount;
              onConfirm(amount);
            }}
          >
            Confirm deposit →
          </button>
        </div>

        {/* Right: summary + chart */}
        <div>
          <div className="h-uppercase" style={{ marginBottom: 8 }}>Summary</div>
          {[
            ["You deposit", amount > 0 ? usd(amount) + " USDC" : "—"],
            ["Target APY", `${product.apy}%`],
            ["Est. yearly yield", yearly > 0 ? usd(yearly) + " USDC" : "—"],
            ["Total yield at close", total > 0 ? usd(total) + " USDC" : "—"],
            ["Capital unlocks", `when target is hit · max ${product.lockMonths} months`],
            ["Fees", `${product.feesMgmtPct}% mgmt · ${product.feesPerfPct}% perf`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed var(--border)", fontSize: 13 }}>
              <span>{k}</span>
              <strong className={k === "Est. yearly yield" || k === "Total yield at close" ? "pos" : ""}>{v}</strong>
            </div>
          ))}

          <div className="h-uppercase" style={{ marginTop: 16, marginBottom: 4 }}>Time to target · scenario simulation</div>
          <p className="muted" style={{ fontSize: 11, margin: "2px 0 6px" }}>
            {amount > 0 ? `Deposit of ${usd(amount)}. ` : ""}
            The vault closes and your capital unlocks as soon as the cumulative target {product.cumulativeTargetPct}% is reached.
          </p>
          {amount >= product.minDeposit ? (
            <div style={{ position: "relative", height: 260 }}>
              <canvas ref={chartRef} />
            </div>
          ) : (
            <div style={{
              height: 260,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "var(--muted)",
              border: "1px dashed var(--border)",
              borderRadius: 10,
              background: "#FAFBFC",
            }}>
              <div style={{ fontSize: 22 }}>📈</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>Enter an amount to simulate</div>
              <div style={{ fontSize: 11 }}>Scenarios appear once the {usd(product.minDeposit)} minimum is reached.</div>
            </div>
          )}
          {amount >= product.minDeposit && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", justifyContent: "center", marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
              {regimes.map((r) => (
                <span key={r.key}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, marginRight: 5, verticalAlign: "middle", background: r.color }} />
                  {r.label} · closes at M{r.targetMonth}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scenario cards */}
      <div style={{ marginTop: 22 }}>
        <div className="h-uppercase" style={{ marginBottom: 6 }}>Dynamic allocation · rebalancing by market condition</div>
        <p className="muted" style={{ fontSize: 12, margin: "4px 0 10px" }}>
          Automated portfolio controls continuously rebalance exposures, tighten volatility thresholds, and shift capital toward more defensive strategies during downturns.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {product.scenarios.map((s) => {
            const tw = s.mix.reduce((a, m) => a + m.weight, 0);
            return (
              <div key={s.type} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12, background: "#fff" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600,
                  padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: ".05em",
                  background: s.type === "bull" ? "#E6F7EC" : s.type === "bear" ? "#FEE4E2" : "#F1F3F5",
                  color: s.type === "bull" ? "var(--green-strong)" : s.type === "bear" ? "#9A2313" : "var(--dark)",
                }}>
                  ● {REGIME_SHORT[s.type]}
                </span>
                <h4 style={{ margin: "8px 0 4px", fontSize: 13 }}>{s.title}</h4>
                <p style={{ margin: 0, fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{s.description}</p>
                <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: "#F1F3F5", marginTop: 10 }}>
                  {s.mix.map((m, i) => (
                    <span key={i} style={{ width: `${(m.weight / tw) * 100}%`, background: m.color, display: "block" }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
        <button className="btn ghost" onClick={onBack}>← Back</button>
        <span className="muted" style={{ fontSize: 12, alignSelf: "center" }}>Deposits are settled on Base. Network fee ≈ $0.02.</span>
      </div>
    </div>
  );
}

// ---- Step 4 ----
function Step4({ product, amount, onReset }: { product: Product; amount: number; onReset: () => void }) {
  const lockDate = new Date();
  lockDate.setMonth(lockDate.getMonth() + product.lockMonths);
  const fakeTx = "0x9a7c…F1b2";

  return (
    <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{
        width: 54, height: 54, borderRadius: "50%", background: "var(--green-soft)", color: "var(--green-strong)",
        display: "grid", placeItems: "center", fontSize: 28, margin: "0 auto 10px",
      }}>✓</div>
      <h2>Your deposit is live</h2>
      <div className="muted">It will start accruing yield in the next daily distribution cycle.</div>

      <div style={{ maxWidth: 420, margin: "24px auto 0", textAlign: "left" }}>
        {[
          ["Vault", product.name],
          ["Amount", usd(amount) + " USDC"],
          ["Network", "Base"],
          ["Transaction", fakeTx + " ↗"],
          ["Lock until", lockDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed var(--border)", fontSize: 13 }}>
            <span>{k}</span>
            <strong style={k === "Transaction" ? { color: "var(--green-strong)", textDecoration: "underline" } : {}}>{v}</strong>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
        <a href="/vaults" className="btn">Go to My Vaults</a>
        <button className="btn ghost" onClick={onReset}>Invest again</button>
      </div>
    </div>
  );
}

// ---- Main ----
export function InvestClient({ products }: { products: Product[] }) {
  const [step, setStep] = useState<Step>(1);
  const [selectedSlug, setSelectedSlug] = useState<string>(products[0]?.slug ?? "prime");
  const depositRef = useRef<number>(0);
  const [confirmedAmt, setConfirmedAmt] = useState(0);

  const product = products.find((p) => p.slug === selectedSlug) ?? products[0];

  async function handleConfirm(amount: number) {
    try {
      await fetch("/api/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: selectedSlug, amountUsd: amount }),
      });
    } catch {
      // demo — continue even if fails
    }
    setConfirmedAmt(amount);
    setStep(4);
  }

  function reset() {
    setStep(1);
    setConfirmedAmt(0);
    depositRef.current = 0;
  }

  return (
    <div>
      <Stepper step={step} />
      {step === 1 && (
        <Step1 products={products} onSelect={(slug) => { setSelectedSlug(slug); setStep(2); }} />
      )}
      {step === 2 && product && (
        <Step2 product={product} onBack={() => setStep(1)} onNext={() => setStep(3)} />
      )}
      {step === 3 && product && (
        <Step3
          product={product}
          onBack={() => setStep(2)}
          onConfirm={handleConfirm}
          depositRef={depositRef}
        />
      )}
      {step === 4 && product && (
        <Step4 product={product} amount={confirmedAmt} onReset={reset} />
      )}
    </div>
  );
}
