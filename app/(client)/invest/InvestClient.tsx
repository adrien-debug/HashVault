"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Card, Kpi, Label, LegendItem, Pill, ProgressBar, SectionTitle, StratBar, SumRow } from "@/components/ui";
import type { Product } from "@/lib/db/types";

function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function riskVariant(r: string): "green"|"amber"|"neutral" {
  if (r === "Conservative") return "green";
  if (r === "Growth")       return "amber";
  return "neutral";
}

/* ── Stepper ── */
function Stepper({ step }: { step: 1|2|3|4 }) {
  const steps = ["Select vault", "Product details", "Deposit & simulate", "Confirmed"];
  return (
    <div className="stepper">
      {steps.map((label, i) => {
        const num = i + 1;
        const done   = num < step;
        const active = num === step;
        return (
          <>
            <div key={label} className={`stepper-step${done ? " done" : active ? " active" : ""}`}>
              <span className="stepper-num">{done ? "✓" : num}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < steps.length - 1 && <div className={`stepper-bar${done ? " done" : ""}`} key={`bar-${i}`} />}
          </>
        );
      })}
    </div>
  );
}

/* ── Step 1 — select ── */
function StepSelect({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
  return (
    <div>
      <h1 className="text-[20px] font-bold mb-1">Invest in a HashVault</h1>
      <p className="text-muted mb-5">Choose the vault that matches your risk appetite and target APY.</p>
      <div className="grid-2">
        {products.filter((p) => p.status === "live").map((prod) => (
          <Card key={prod.id}>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-[16px] font-semibold m-0">{prod.name}</h2>
              <Pill />
            </div>
            <div className="kpi-lg mb-1">{prod.apy}<small className="text-[14px] font-semibold text-muted ml-1">% APY</small></div>
            <p className="text-muted text-[12px] mb-3">{prod.lead}</p>
            <div className="flex gap-2 flex-wrap mb-3">
              <Badge variant={riskVariant(prod.risk)}>{prod.risk}</Badge>
              <Badge>{prod.lockMonths / 12}Y Lock</Badge>
              <Badge>{prod.network}</Badge>
            </div>
            <Label>Strategy mix</Label>
            <StratBar mix={prod.pockets.map((pk) => ({ color: pk.color, weight: pk.pct }))} />
            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5 mb-3">
              {prod.pockets.map((pk) => <LegendItem key={pk.label} color={pk.color} label={`${pk.label} ${pk.pct}%`} />)}
            </div>
            <div className="flex justify-between text-[12px] text-muted mb-4">
              <span>Min: <strong className="text-dark">{usd(prod.minDeposit)}</strong></span>
              <span>Mgmt {prod.feesMgmtPct}% · Perf {prod.feesPerfPct}%</span>
            </div>
            <button className="btn btn-full" onClick={() => onSelect(prod)}>Invest in {prod.name} →</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Step 2 — details ── */
function StepProduct({ product, onBack, onNext }: { product: Product; onBack: () => void; onNext: () => void }) {
  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-4" onClick={onBack}>← Back</button>
      <h1 className="text-[20px] font-bold mb-1">{product.name}</h1>
      <p className="text-muted mb-4 text-[13px]">{product.description}</p>
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle title="Strategy breakdown" />
        <StratBar mix={product.pockets.map((pk) => ({ color: pk.color, weight: pk.pct }))} />
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 mb-3">
          {product.pockets.map((pk) => <LegendItem key={pk.label} color={pk.color} label={`${pk.label} · ${pk.pct}%`} />)}
        </div>
        <div className="grid-3">
          {product.scenarios.map((s) => (
            <div key={s.type} className="scn">
              <p className="text-[12px] font-bold uppercase tracking-[0.05em] m-0 mb-1">{s.title}</p>
              <p className="text-muted text-[12px] m-0">{s.description}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle title="Fees & terms" />
        <SumRow label="Management fee"  value={`${product.feesMgmtPct}% / year`} />
        <SumRow label="Performance fee" value={`${product.feesPerfPct}% on yield above baseline`} />
        <SumRow label="Minimum deposit" value={usd(product.minDeposit)} />
        <SumRow label="Lock period"     value={`${product.lockMonths / 12} years`} />
        <SumRow label="Distribution"    value="Daily, in USDC" />
        <SumRow label="Network"         value={product.network} />
      </Card>
      <button className="btn btn-full" onClick={onNext}>Continue to deposit →</button>
    </div>
  );
}

/* ── Step 3 — deposit ── */
function StepDeposit({ product, onBack, onConfirm }: { product: Product; onBack: () => void; onConfirm: () => void }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const num    = parseFloat(amount) || 0;
  const valid  = num >= product.minDeposit;
  const years  = product.lockMonths / 12;
  const annual = num * (product.apy / 100);

  async function confirm() {
    if (!valid) return;
    setLoading(true);
    try {
      await fetch("/api/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: "0x7Ab3…a3F2", productSlug: product.slug, amountUsd: num }),
      });
      onConfirm();
    } catch { alert("Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-4" onClick={onBack}>← Back</button>
      <div className="grid-2">
        <Card>
          <SectionTitle title="Deposit amount" />
          <div className={`amt-input mb-1${valid && num > 0 ? " valid" : !valid && num > 0 ? " invalid" : ""}`}>
            <input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} min={product.minDeposit} />
            <span className="amt-input-ticker">USDC</span>
          </div>
          {num > 0 && !valid && <p className="text-neg text-[11px] mb-2">Min. deposit is {usd(product.minDeposit)}</p>}
          <p className="text-muted text-[11px] mb-4">Minimum: {usd(product.minDeposit)} · Network: {product.network}</p>
          <SumRow label="Lock period" value={`${years} years`} />
          <SumRow label="APY"         value={`${product.apy}%`} />
          <SumRow label="Mgmt fee"    value={`${product.feesMgmtPct}%/yr`} />
          <SumRow label="Perf fee"    value={`${product.feesPerfPct}% on yield`} />
          <button className="btn btn-full mt-5" disabled={!valid || loading} onClick={confirm}>
            {loading ? "Processing…" : "Confirm deposit →"}
          </button>
        </Card>

        <Card>
          <SectionTitle title="Yield projection" right={<span className="text-muted text-[12px]">{product.apy}% APY · {years}yr</span>} />
          {num === 0 ? (
            <p className="text-muted text-[13px]">Enter an amount to see your projection.</p>
          ) : (
            <>
              <div className="grid-2 mb-4">
                <div><Label>Est. annual yield</Label><Kpi size="sm" value={usd(annual)} sub="before fees" /></div>
                <div><Label>Over {years}yr (est.)</Label><Kpi size="sm" value={usd(annual * years * 0.9)} sub="net of fees" /></div>
              </div>
              {[1, 2, 3, 5].filter((y) => y <= years + 1).map((y, i, arr) => {
                const projected = num + annual * y * 0.9;
                const pct = ((projected - num) / num) * 100;
                return (
                  <div key={y} className="mb-2">
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-muted">Year {y}</span>
                      <span><strong>{usd(projected)}</strong> <span className="text-pos">+{pct.toFixed(1)}%</span></span>
                    </div>
                    <ProgressBar pct={(i + 1) / arr.length * 100} />
                  </div>
                );
              })}
              <p className="text-[11px] text-muted mt-3">* Estimates are indicative based on target APY.</p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ── Step 4 — confirmed ── */
function StepConfirmed({ product, router }: { product: Product; router: ReturnType<typeof useRouter> }) {
  return (
    <Card style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
      <div className="w-14 h-14 rounded-full bg-[#e6f7ec] grid place-items-center text-[26px] mx-auto mb-4">✓</div>
      <h2 className="text-[20px] font-bold mb-2">Position opened!</h2>
      <p className="text-muted text-[13px] mb-5">
        Your deposit in <strong>{product.name}</strong> is now active. Yield distributions start accruing from tomorrow at 00:00 UTC.
      </p>
      <div className="flex gap-2 justify-center">
        <button className="btn" onClick={() => router.push("/vaults")}>View in My Vaults →</button>
        <button className="btn btn-ghost" onClick={() => router.push("/")}>Go to Dashboard</button>
      </div>
    </Card>
  );
}

/* ── Main ── */
export function InvestClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [step, setStep]       = useState<1|2|3|4>(1);
  const [product, setProduct] = useState<Product | null>(null);

  return (
    <div>
      <Stepper step={step} />
      {step === 1 && <StepSelect products={products} onSelect={(p) => { setProduct(p); setStep(2); }} />}
      {step === 2 && product && <StepProduct product={product} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && product && <StepDeposit product={product} onBack={() => setStep(2)} onConfirm={() => setStep(4)} />}
      {step === 4 && product && <StepConfirmed product={product} router={router} />}
    </div>
  );
}
