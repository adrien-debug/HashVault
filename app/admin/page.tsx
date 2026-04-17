import Link from "next/link";
import { db } from "@/lib/db/store";
import { Card, PageHeader, Pill, SectionTitle, StatCard, TxRow } from "@/components/ui";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }

const TX_ICON:  Record<string, string> = { yield: "↓", fee: "−", deposit: "+", withdraw: "↑" };
const TX_BG:    Record<string, string> = { yield: "#E6F7EC", fee: "#FDECEC", deposit: "#EEF2FF", withdraw: "#EEF2FF" };
const TX_COLOR: Record<string, string> = { yield: "#1a7f3b", fee: "#991B1B", deposit: "#3730A3", withdraw: "#3730A3" };

export default async function AdminDashboard() {
  const [products, users, positions, txs] = await Promise.all([
    db.listProducts(), db.listUsers(), db.listPositions(), db.listTransactions({}),
  ]);

  const tvl       = positions.reduce((a, p) => a + p.currentValueUsd, 0);
  const deposits  = positions.reduce((a, p) => a + p.amountUsd, 0);
  const yieldDist = txs.filter((t) => t.type === "yield").reduce((a, t) => a + t.amountUsd, 0);
  const fees      = txs.filter((t) => t.type === "fee").reduce((a, t) => a + Math.abs(t.amountUsd), 0);
  const recentTxs = [...txs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 10);

  const kpis = [
    { label: "Total Value Locked",  value: usd(tvl),       sub: "across all positions", accent: "#34C759" },
    { label: "Total Deposits",      value: usd(deposits),  sub: "capital committed",    accent: "#111827" },
    { label: "Yield Distributed",   value: usd(yieldDist), sub: "USDC paid out",        accent: "#F59E0B" },
    { label: "Fees Collected",      value: usd(fees),      sub: "mgmt + perf",          accent: "#6B7280" },
  ];

  const stats = [
    { label: "Products live",       value: products.filter((p) => p.status === "live").length },
    { label: "Users",               value: users.length },
    { label: "Active positions",    value: positions.length },
    { label: "Total transactions",  value: txs.length },
  ];

  return (
    <div>
      <PageHeader
        title="Admin overview"
        subtitle="Platform-wide metrics · all data live from database."
        right={<Pill>LIVE</Pill>}
      />

      {/* KPI grid */}
      <div className="grid-4 stagger" style={{ marginBottom: 22 }}>
        {kpis.map((k) => (
          <StatCard
            key={k.label}
            label={k.label}
            value={k.value}
            sub={k.sub}
            accent={k.accent}
            size="lg"
          />
        ))}
      </div>

      {/* Stat line */}
      <div className="grid-4 stagger" style={{ marginBottom: 22 }}>
        {stats.map((s) => (
          <Card key={s.label} variant="flat" className="!p-4 flex justify-between items-center">
            <span className="text-muted text-[13px]">{s.label}</span>
            <strong className="text-[18px] tracking-tight">{s.value}</strong>
          </Card>
        ))}
      </div>

      <div className="grid-2">
        {/* Products */}
        <Card>
          <SectionTitle
            title="Products"
            right={<Link href="/admin/products" className="text-[12px] font-semibold text-[#1a7f3b]">Manage →</Link>}
          />
          {products.map((p) => (
            <div key={p.id} className="flex justify-between items-center py-2.5 border-b border-border last:border-0 text-[13px]">
              <div>
                <strong>{p.name}</strong>
                <div className="text-muted text-[11px] mt-0.5">Min {usd(p.minDeposit)} · {p.apy}% APY</div>
              </div>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: p.status === "live" ? "#E6F7EC" : "#FEE4E2",
                  color:      p.status === "live" ? "#1a7f3b"  : "#991B1B",
                }}
              >
                {p.status.toUpperCase()}
              </span>
            </div>
          ))}
        </Card>

        {/* Recent transactions */}
        <Card>
          <SectionTitle title="Recent Transactions" />
          {recentTxs.map((t) => (
            <TxRow
              key={t.id}
              icon={TX_ICON[t.type] ?? "·"}
              iconBg={TX_BG[t.type] ?? "#E6F7EC"}
              iconColor={TX_COLOR[t.type] ?? "#1a7f3b"}
              title={t.note ?? t.type}
              date={formatDate(t.createdAt)}
              txHash={t.txHash}
              amount={`${t.amountUsd >= 0 ? "+" : ""}${t.amountUsd.toFixed(2)}`}
              amountClass={t.amountUsd < 0 ? "text-neg font-semibold" : t.type === "yield" ? "text-pos font-semibold" : "font-semibold"}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}
