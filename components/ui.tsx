import type { ReactNode, CSSProperties } from "react";
import { Sparkline } from "@/components/Sparkline";

/* ═══════════════════════════════════════════════════════════════════════════
   CARD
   ═══════════════════════════════════════════════════════════════════════════ */
type CardVariant = "default" | "flat" | "mint" | "hover";
export function Card({
  children,
  className = "",
  style,
  id,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  variant?: CardVariant;
}) {
  const cls =
    variant === "flat"  ? "card-flat"  :
    variant === "mint"  ? "card-mint"  :
    variant === "hover" ? "card card-hover" :
                          "card";
  return (
    <div id={id} className={`${cls} ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE HEADER
   ═══════════════════════════════════════════════════════════════════════════ */
export function PageHeader({
  title, subtitle, right,
}: { title: ReactNode; subtitle?: ReactNode; right?: ReactNode }) {
  return (
    <div className="page-header flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 className="h1">{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION TITLE
   ═══════════════════════════════════════════════════════════════════════════ */
export function SectionTitle({
  title, subtitle, right,
}: { title: ReactNode; subtitle?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h2 className="m-0 text-[15px] font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="m-0 mt-0.5 text-[12px] text-muted">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LABEL (uppercase eyebrow)
   ═══════════════════════════════════════════════════════════════════════════ */
export function Label({ children }: { children: ReactNode }) {
  return <div className="label-upper mb-1.5">{children}</div>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI
   ═══════════════════════════════════════════════════════════════════════════ */
export function Kpi({
  value, sub, size = "md",
}: { value: ReactNode; sub?: ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  const cls =
    size === "xl" ? "kpi-xl" :
    size === "lg" ? "kpi-lg" :
    size === "sm" ? "kpi-sm" :
                    "kpi";
  return (
    <div>
      <div className={cls}>{value}</div>
      {sub && <div className="text-muted text-[12px] mt-1">{sub}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD (KPI + label + delta + sub)
   ═══════════════════════════════════════════════════════════════════════════ */
export function StatCard({
  label, value, sub, delta, accent, size = "lg", sparkline, sparklineColor,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  delta?: { value: ReactNode; positive?: boolean };
  accent?: string;
  size?: "md" | "lg" | "xl";
  sparkline?: number[];
  sparklineColor?: string;
}) {
  const valueCls = size === "xl" ? "kpi-xl" : size === "md" ? "kpi" : "kpi-lg";
  return (
    <div
      className="card relative overflow-hidden flex flex-col"
      style={accent ? { boxShadow: `inset 3px 0 0 ${accent}, var(--shadow-soft)` } : undefined}
    >
      <div className="flex-1">
        <div className="label-upper mb-2">{label}</div>
        <div className={valueCls}>{value}</div>
        {(sub || delta) && (
          <div className="flex items-center gap-2 mt-1.5 text-[12.5px]">
            {delta && (
              <span className={`inline-flex items-center gap-1 font-semibold ${delta.positive === false ? "text-neg" : "text-pos"}`}>
                <span aria-hidden>{delta.positive === false ? "↓" : "↑"}</span>
                {delta.value}
              </span>
            )}
            {sub && <span className="text-muted">{sub}</span>}
          </div>
        )}
      </div>
      {sparkline && sparkline.length > 1 && (
        <div className="mt-3 -mx-[22px] -mb-[22px]">
          <Sparkline values={sparkline} color={sparklineColor ?? "#34C759"} height={44} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PILL · BADGE
   ═══════════════════════════════════════════════════════════════════════════ */
export function Pill({ children, dotless = false }: { children?: ReactNode; dotless?: boolean }) {
  return (
    <span className="pill">
      {!dotless && <span className="dot-live" aria-hidden />}
      {children ?? "LIVE"}
    </span>
  );
}

export function Badge({
  children, variant = "neutral",
}: {
  children: ReactNode;
  variant?: "neutral" | "green" | "amber" | "red" | "blue";
}) {
  const colors: Record<string, string> = {
    neutral: "bg-[#F5F5F7] text-[#1D1D1F] [box-shadow:inset_0_0_0_1px_#ECECEF]",
    green:   "bg-[#F0FBF3] text-[#198F38] [box-shadow:inset_0_0_0_1px_#DCF6E3]",
    amber:   "bg-[#FEF3C7] text-[#92400E] [box-shadow:inset_0_0_0_1px_#FDE68A]",
    red:     "bg-[#FFEBEC] text-[#9A2313] [box-shadow:inset_0_0_0_1px_#FECDD3]",
    blue:    "bg-[#EBF3FF] text-[#1E40AF] [box-shadow:inset_0_0_0_1px_#DBEAFE]",
  };
  return (
    <span className={`badge ${colors[variant]}`}>{children}</span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════════════ */
export function ProgressBar({
  pct, color, hint,
}: { pct: number; color?: string; hint?: ReactNode }) {
  return (
    <div>
      <div className="progress">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, Math.max(0, pct))}%`,
            ...(color ? { background: color } : {}),
          }}
        />
      </div>
      {hint && <div className="text-[11px] text-muted mt-1.5">{hint}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STRATEGY BAR
   ═══════════════════════════════════════════════════════════════════════════ */
export function StratBar({
  mix, size = "md",
}: { mix: { color: string; weight: number }[]; size?: "xs" | "sm" | "md" }) {
  const total = mix.reduce((a, m) => a + m.weight, 0) || 1;
  const cls =
    size === "xs" ? "strat-bar strat-bar-xs" :
    size === "sm" ? "strat-bar strat-bar-sm" :
                    "strat-bar";
  return (
    <div className={cls}>
      {mix.map((m, i) => (
        <span
          key={i}
          style={{ width: `${(m.weight / total) * 100}%`, background: m.color, display: "block" }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEGEND ITEM
   ═══════════════════════════════════════════════════════════════════════════ */
export function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
      <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: color }} />
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUM ROW
   ═══════════════════════════════════════════════════════════════════════════ */
export function SumRow({
  label, value, valueClass = "",
}: { label: ReactNode; value: ReactNode; valueClass?: string }) {
  return (
    <div className="sum-row">
      <span className="text-muted">{label}</span>
      <strong className={valueClass}>{value}</strong>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TX ROW
   ═══════════════════════════════════════════════════════════════════════════ */
export function TxRow({
  icon, iconBg, iconColor, title, date, txHash, amount, amountClass, frequency,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  date: string;
  txHash: string;
  amount: string;
  amountClass?: string;
  frequency?: string;
}) {
  return (
    <div className="tx-row">
      <div className="tx-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
      <div>
        <strong className="text-[13px]">{title}</strong>
        <div className="text-[11px] text-muted mt-0.5">
          {date} · <span className="font-mono">tx {txHash.slice(0, 4)}…{txHash.slice(-2)}</span>
        </div>
      </div>
      <div className={`font-semibold ${amountClass ?? ""}`}>{amount}</div>
      <div className="text-muted text-[11px]">{frequency ?? ""}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════════════════ */
export function EmptyState({
  icon = "◇", title, description, action,
}: { icon?: ReactNode; title: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden>{icon}</div>
      <h3 className="m-0 text-[15px] font-semibold text-[var(--color-ink)]">{title}</h3>
      {description && <p className="m-0 mt-1 text-[13px] max-w-[340px]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKELETON
   ═══════════════════════════════════════════════════════════════════════════ */
export function Skeleton({
  width = "100%", height = 14, radius = 6, className = "",
}: { width?: number | string; height?: number | string; radius?: number; className?: string }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DIVIDER
   ═══════════════════════════════════════════════════════════════════════════ */
export function Divider({ className = "" }: { className?: string }) {
  return <hr className={`border-0 h-px bg-[var(--color-border-soft)] my-4 ${className}`} aria-hidden />;
}
