import type { ReactNode, CSSProperties } from "react";

/* ─── Card ─────────────────────────────────────────────────────────────── */
export function Card({
  children, className = "", style, id,
}: {
  children: ReactNode; className?: string; style?: CSSProperties; id?: string;
}) {
  return <div id={id} className={`card ${className}`} style={style}>{children}</div>;
}

/* ─── Section title ─────────────────────────────────────────────────────── */
export function SectionTitle({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="m-0 text-[15px] font-semibold">{title}</h2>
      {right && <div>{right}</div>}
    </div>
  );
}

/* ─── Label ─────────────────────────────────────────────────────────────── */
export function Label({ children }: { children: ReactNode }) {
  return <div className="label-upper mb-1">{children}</div>;
}

/* ─── KPI ───────────────────────────────────────────────────────────────── */
export function Kpi({ value, sub, size = "md" }: { value: ReactNode; sub?: ReactNode; size?: "sm"|"md"|"lg" }) {
  const cls = size === "sm" ? "kpi-sm" : size === "lg" ? "kpi-lg" : "kpi";
  return (
    <div>
      <div className={cls}>{value}</div>
      {sub && <div className="text-muted text-[12px] mt-0.5">{sub}</div>}
    </div>
  );
}

/* ─── Pill ──────────────────────────────────────────────────────────────── */
export function Pill({ children }: { children?: ReactNode }) {
  return (
    <span className="pill">
      <span className="dot-live" aria-hidden />
      {children ?? "LIVE"}
    </span>
  );
}

/* ─── Badge ─────────────────────────────────────────────────────────────── */
export function Badge({
  children, variant = "neutral",
}: { children: ReactNode; variant?: "neutral"|"green"|"amber"|"red" }) {
  const colors: Record<string, string> = {
    neutral: "bg-[#f1f3f5] text-[#111827]",
    green:   "bg-[#e6f7ec] text-[#1a7f3b]",
    amber:   "bg-[#fef3c7] text-[#92400e]",
    red:     "bg-[#fee4e2] text-[#991b1b]",
  };
  return <span className={`badge ${colors[variant]}`}>{children}</span>;
}

/* ─── Progress bar ──────────────────────────────────────────────────────── */
export function ProgressBar({ pct, color, hint }: { pct: number; color?: string; hint?: ReactNode }) {
  return (
    <div>
      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%`, ...(color ? { background: color } : {}) }}
        />
      </div>
      {hint && <div className="text-[11px] text-muted mt-1">{hint}</div>}
    </div>
  );
}

/* ─── Strategy bar ──────────────────────────────────────────────────────── */
export function StratBar({ mix, size = "md" }: { mix: { color: string; weight: number }[]; size?: "xs"|"sm"|"md" }) {
  const total = mix.reduce((a, m) => a + m.weight, 0) || 1;
  const cls = size === "xs" ? "strat-bar strat-bar-xs" : size === "sm" ? "strat-bar strat-bar-sm" : "strat-bar";
  return (
    <div className={cls}>
      {mix.map((m, i) => (
        <span key={i} style={{ width: `${(m.weight / total) * 100}%`, background: m.color }} />
      ))}
    </div>
  );
}

/* ─── Legend item ───────────────────────────────────────────────────────── */
export function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
      <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: color }} />
      {label}
    </span>
  );
}

/* ─── Sum row ───────────────────────────────────────────────────────────── */
export function SumRow({ label, value, valueClass = "" }: { label: ReactNode; value: ReactNode; valueClass?: string }) {
  return (
    <div className="sum-row">
      <span className="text-muted">{label}</span>
      <strong className={valueClass}>{value}</strong>
    </div>
  );
}

/* ─── Tx row ────────────────────────────────────────────────────────────── */
export function TxRow({
  icon, iconBg, iconColor, title, date, txHash, amount, amountClass, frequency,
}: {
  icon: string; iconBg: string; iconColor: string; title: string;
  date: string; txHash: string; amount: string; amountClass?: string; frequency?: string;
}) {
  return (
    <div className="tx-row">
      <div className="tx-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
      <div>
        <strong>{title}</strong>
        <div className="text-[11px] text-muted">{date} · tx {txHash.slice(0, 4)}…{txHash.slice(-2)}</div>
      </div>
      <div className={amountClass ?? ""}>{amount}</div>
      <div className="text-muted text-[11px]">{frequency ?? ""}</div>
    </div>
  );
}
