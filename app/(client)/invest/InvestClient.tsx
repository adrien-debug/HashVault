"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge, Card, Kpi, Label, LegendItem, PageHeader, Pill,
  ProgressBar, SectionTitle, StratBar, SumRow,
} from "@/components/ui";
import { useToast } from "@/providers/ToastProvider";
import type { Product } from "@/lib/db/types";

function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function riskVariant(r: string): "green" | "amber" | "neutral" {
  if (r === "Conservative") return "green";
  if (r === "Growth")       return "amber";
  return "neutral";
}

/* ─────────────────────────────────────────────────────────────────────────
   STEPPER
   ───────────────────────────────────────────────────────────────────────── */
function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = ["Select vault", "Product details", "Deposit & simulate", "Confirmed"];
  return (
    <div className="stepper">
      {steps.map((label, i) => {
        const num = i + 1;
        const done   = num < step;
        const active = num === step;
        return (
          <Fragment key={label}>
            <div className={`stepper-step${done ? " done" : active ? " active" : ""}`}>
              <span className="stepper-num">{done ? "✓" : num}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < steps.length - 1 && <div className={`stepper-bar${done ? " done" : ""}`} />}
          </Fragment>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP 1 · SELECT
   ───────────────────────────────────────────────────────────────────────── */
function StepSelect({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
  return (
    <div>
      <PageHeader
        title="Invest in a HashVault"
        subtitle="Choose the vault that matches your risk appetite and target APY."
      />
      <div className="grid-2 stagger">
        {products.filter((p) => p.status === "live").map((prod) => (
          <Card key={prod.id} variant="hover" className="overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-[18px] font-semibold tracking-tight m-0">{prod.name}</h2>
                <p className="text-muted text-[12.5px] mt-1 mb-0">{prod.lead}</p>
              </div>
              <Pill />
            </div>

            {/* Hero APY */}
            <div className="card-mint mb-4 !p-4 !rounded-[12px]">
              <div className="flex items-baseline gap-1">
                <span className="kpi-xl">{prod.apy}</span>
                <span className="text-[16px] font-semibold text-muted">% APY</span>
              </div>
              <div className="text-[11.5px] text-[var(--color-mint-700)] font-semibold mt-1">
                Daily distribution · USDC
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              <Badge variant={riskVariant(prod.risk)}>{prod.risk}</Badge>
              <Badge>{prod.lockMonths / 12}Y Lock</Badge>
              <Badge variant="blue">{prod.network}</Badge>
            </div>

            <Label>Strategy mix</Label>
            <StratBar mix={prod.pockets.map((pk) => ({ color: pk.color, weight: pk.pct }))} />
            <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-2 mb-4">
              {prod.pockets.map((pk) => <LegendItem key={pk.label} color={pk.color} label={`${pk.label} ${pk.pct}%`} />)}
            </div>

            <div className="flex justify-between items-center text-[12px] text-muted mb-4 pt-3 border-t border-[var(--color-border-soft)]">
              <span>Min: <strong className="text-[var(--color-ink)]">{usd(prod.minDeposit)}</strong></span>
              <span>Mgmt {prod.feesMgmtPct}% · Perf {prod.feesPerfPct}%</span>
            </div>

            <button className="btn btn-full" onClick={() => onSelect(prod)}>
              Invest in {prod.name} <span aria-hidden>→</span>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP 2 · PRODUCT
   ───────────────────────────────────────────────────────────────────────── */
function StepProduct({ product, onBack, onNext }: { product: Product; onBack: () => void; onNext: () => void }) {
  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-4" onClick={onBack}>← Back</button>
      <PageHeader
        title={product.name}
        subtitle={product.description}
        right={<Pill />}
      />

      <Card style={{ marginBottom: 18 }}>
        <SectionTitle title="Strategy breakdown" subtitle="Underlying allocation across mining, BTC and stablecoin yield." />
        <StratBar mix={product.pockets.map((pk) => ({ color: pk.color, weight: pk.pct }))} />
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 mb-5">
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

      <Card style={{ marginBottom: 18 }}>
        <SectionTitle title="Fees & terms" />
        <SumRow label="Management fee"  value={`${product.feesMgmtPct}% / year`} />
        <SumRow label="Performance fee" value={`${product.feesPerfPct}% on yield above baseline`} />
        <SumRow label="Minimum deposit" value={usd(product.minDeposit)} />
        <SumRow label="Lock period"     value={`${product.lockMonths / 12} years`} />
        <SumRow label="Distribution"    value="Daily, in USDC" />
        <SumRow label="Network"         value={product.network} />
      </Card>

      <button className="btn btn-full btn-lg" onClick={onNext}>
        Continue to deposit <span aria-hidden>→</span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP 3 · DEPOSIT
   ───────────────────────────────────────────────────────────────────────── */
function StepDeposit({ product, onBack, onConfirm }: { product: Product; onBack: () => void; onConfirm: () => void }) {
  const [amount, setAmount]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const num    = parseFloat(amount) || 0;
  const valid  = num >= product.minDeposit;
  const years  = product.lockMonths / 12;
  const annual = num * (product.apy / 100);

  async function confirm() {
    if (!valid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: "0x7Ab3…a3F2", productSlug: product.slug, amountUsd: num }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onConfirm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const presets = [10000, 25000, 100000].filter((v) => v >= product.minDeposit);

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-4" onClick={onBack}>← Back</button>
      <div className="grid-2">
        <Card>
          <SectionTitle title="Deposit amount" subtitle={`Min ${usd(product.minDeposit)} · ${product.network}`} />
          <div className={`amt-input mb-2${valid && num > 0 ? " valid" : !valid && num > 0 ? " invalid" : ""}`}>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={product.minDeposit}
              aria-label="Deposit amount in USDC"
            />
            <span className="amt-input-ticker">USDC</span>
          </div>
          {num > 0 && !valid && <p className="text-neg text-[11px] mb-2">Min. deposit is {usd(product.minDeposit)}</p>}

          {presets.length > 0 && (
            <div className="flex gap-2 mb-4">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="btn btn-ghost btn-sm flex-1"
                  onClick={() => setAmount(String(p))}
                >
                  {p >= 1000 ? `$${p / 1000}k` : `$${p}`}
                </button>
              ))}
            </div>
          )}

          <SumRow label="Lock period" value={`${years} years`} />
          <SumRow label="APY"         value={`${product.apy}%`} />
          <SumRow label="Mgmt fee"    value={`${product.feesMgmtPct}%/yr`} />
          <SumRow label="Perf fee"    value={`${product.feesPerfPct}% on yield`} />

          {error && (
            <p className="text-neg text-[12px] mt-3 mb-0 p-3 bg-[var(--color-neg-soft)] rounded-[8px]">
              {error}
            </p>
          )}

          <button className="btn btn-full btn-lg mt-5" disabled={!valid || loading} onClick={confirm}>
            {loading ? "Processing…" : <>Confirm deposit <span aria-hidden>→</span></>}
          </button>
          <p className="text-[11px] text-faint text-center mt-2.5 m-0">Demo · no on-chain transaction sent</p>
        </Card>

        <Card>
          <SectionTitle
            title="Yield projection"
            subtitle={`${product.apy}% APY · ${years}-year horizon`}
          />
          {num === 0 ? (
            <div className="py-12 text-center">
              <div className="empty-state-icon mx-auto" aria-hidden>$</div>
              <p className="text-muted text-[13px] mt-3 mb-0">Enter an amount to see your projection.</p>
            </div>
          ) : (
            <>
              <div className="grid-2 mb-5">
                <div><Label>Est. annual yield</Label><Kpi size="sm" value={usd(annual)} sub="before fees" /></div>
                <div><Label>Over {years}yr (est.)</Label><Kpi size="sm" value={usd(annual * years * 0.9)} sub="net of fees" /></div>
              </div>
              {[1, 2, 3, 5].filter((y) => y <= years + 1).map((y, i, arr) => {
                const projected = num + annual * y * 0.9;
                const pct = ((projected - num) / num) * 100;
                return (
                  <div key={y} className="mb-3">
                    <div className="flex justify-between text-[12.5px] mb-1.5">
                      <span className="text-muted">Year {y}</span>
                      <span><strong>{usd(projected)}</strong> <span className="text-pos font-semibold">+{pct.toFixed(1)}%</span></span>
                    </div>
                    <ProgressBar pct={(i + 1) / arr.length * 100} />
                  </div>
                );
              })}
              <p className="text-[11px] text-faint mt-4 mb-0">* Estimates are indicative based on target APY, net of fees (10% buffer).</p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP 4 · CONFIRMED
   ───────────────────────────────────────────────────────────────────────── */
function StepConfirmed({ product, router }: { product: Product; router: ReturnType<typeof useRouter> }) {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      variant: "success",
      title: "Position opened",
      description: `${product.name} · yield starts tomorrow at 00:00 UTC`,
      duration: 6000,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card style={{ maxWidth: 540, margin: "60px auto", textAlign: "center" }}>
      <div
        className="w-16 h-16 rounded-full grid place-items-center text-[32px] mx-auto mb-5"
        style={{
          background: "linear-gradient(180deg, var(--color-mint-100), var(--color-mint-50))",
          color: "var(--color-mint-700)",
          boxShadow: "0 8px 24px rgba(52,199,89,.18)",
        }}
        aria-hidden
      >
        ✓
      </div>
      <h2 className="text-[22px] font-bold tracking-tight m-0 mb-2">Position opened!</h2>
      <p className="text-muted text-[13.5px] mb-6 m-0">
        Your deposit in <strong className="text-[var(--color-ink)]">{product.name}</strong> is now active.
        Yield distributions start accruing from tomorrow at 00:00 UTC.
      </p>
      <div className="flex gap-2 justify-center">
        <button className="btn" onClick={() => router.push("/vaults")}>
          View in My Vaults <span aria-hidden>→</span>
        </button>
        <button className="btn btn-ghost" onClick={() => router.push("/")}>Go to Dashboard</button>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN
   ───────────────────────────────────────────────────────────────────────── */
export function InvestClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [step, setStep]       = useState<1 | 2 | 3 | 4>(1);
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
