"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductStatus, ScenarioType } from "@/lib/db/types";

type Props = { product: Product };

const REGIME_OPTIONS: { value: ScenarioType; label: string }[] = [
  { value: "bull", label: "Bull — accelerate growth" },
  { value: "flat", label: "Sideways — baseline mix" },
  { value: "bear", label: "Bear — protect capital" },
];

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "live", label: "Live" },
  { value: "paused", label: "Paused" },
  { value: "draft", label: "Draft" },
];

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>
        {label}
      </label>
      {children}
      {help && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{help}</div>}
    </div>
  );
}

function Input({ value, onChange, type = "text", step }: { value: string | number; onChange: (v: string) => void; type?: string; step?: string }) {
  return (
    <input
      type={type}
      value={value}
      step={step}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 12px",
        fontSize: 14, outline: "none", fontFamily: "inherit",
      }}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 12px", fontSize: 14, background: "#fff" }}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function ProductEditClient({ product }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    status: product.status as ProductStatus,
    apy: product.apy,
    minDeposit: product.minDeposit,
    cumulativeTargetPct: product.cumulativeTargetPct,
    feesMgmtPct: product.feesMgmtPct,
    feesPerfPct: product.feesPerfPct,
    activeRegime: product.activeRegime as ScenarioType,
    lead: product.lead,
    description: product.description,
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${product.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <a href="/admin/products" style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>← Products</a>
          <h1 style={{ margin: 0, fontSize: 22 }}>{product.name}</h1>
          <p style={{ color: "#6B7280", margin: "4px 0 0", fontSize: 13 }}>Edit product configuration. Changes affect client visibility immediately.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            background: saving ? "#9CA3AF" : "#34C759",
            color: "#fff", border: 0, padding: "10px 20px",
            borderRadius: 10, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
            fontSize: 14,
          }}
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save changes"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: "#991B1B", fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Left col */}
        <div>
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7280" }}>Core settings</h3>

            <Field label="Status">
              <Select value={form.status} onChange={(v) => set("status", v as ProductStatus)} options={STATUS_OPTIONS} />
            </Field>
            <Field label="Target APY (%)" help="Annual percentage yield shown to clients">
              <Input type="number" value={form.apy} onChange={(v) => set("apy", Number(v))} step="0.1" />
            </Field>
            <Field label="Minimum deposit (USDC)" help="Minimum investment per position">
              <Input type="number" value={form.minDeposit} onChange={(v) => set("minDeposit", Number(v))} step="1000" />
            </Field>
            <Field label="Cumulative target (%)" help="Vault closes when this cumulative yield is reached">
              <Input type="number" value={form.cumulativeTargetPct} onChange={(v) => set("cumulativeTargetPct", Number(v))} step="1" />
            </Field>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7280" }}>Fees</h3>
            <Field label="Management fee (%)" help="Annual management fee">
              <Input type="number" value={form.feesMgmtPct} onChange={(v) => set("feesMgmtPct", Number(v))} step="0.1" />
            </Field>
            <Field label="Performance fee (%)" help="Performance fee on yield">
              <Input type="number" value={form.feesPerfPct} onChange={(v) => set("feesPerfPct", Number(v))} step="1" />
            </Field>
          </div>
        </div>

        {/* Right col */}
        <div>
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7280" }}>Market regime</h3>
            <Field label="Active regime" help="Controls the strategy allocation shown to clients">
              <Select value={form.activeRegime} onChange={(v) => set("activeRegime", v as ScenarioType)} options={REGIME_OPTIONS} />
            </Field>

            <div style={{ marginTop: 8 }}>
              {product.scenarios.map((s) => {
                const isActive = s.type === form.activeRegime;
                const tw = s.mix.reduce((a, m) => a + m.weight, 0);
                return (
                  <div
                    key={s.type}
                    onClick={() => set("activeRegime", s.type)}
                    style={{
                      border: `1px solid ${isActive ? "#34C759" : "#E5E7EB"}`,
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 8,
                      background: isActive ? "#F4FCF6" : "#FAFBFC",
                      cursor: "pointer",
                      transition: "border-color .15s, background .15s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <strong style={{ fontSize: 13 }}>{s.title}</strong>
                      {isActive && <span style={{ fontSize: 10, fontWeight: 700, color: "#1a7f3b", textTransform: "uppercase" }}>● Active</span>}
                    </div>
                    <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", background: "#F1F3F5" }}>
                      {s.mix.map((m, i) => (
                        <span key={i} style={{ width: `${(m.weight / tw) * 100}%`, background: m.color, display: "block" }} />
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 11, color: "#6B7280", marginTop: 6 }}>
                      {s.mix.map((m, i) => (
                        <span key={i}>
                          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, marginRight: 4, verticalAlign: "middle", background: m.color }} />
                          {product.pockets[i]?.label} {Math.round((m.weight / tw) * 100)}%
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, textTransform: "uppercase", letterSpacing: ".06em", color: "#6B7280" }}>Copy (client-facing)</h3>
            <Field label="Lead sentence">
              <Input value={form.lead} onChange={(v) => set("lead", v)} />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
