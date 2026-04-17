import Link from "next/link";
import { db } from "@/lib/db/store";
import { Card, LegendItem, PageHeader, StratBar } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }

export default async function AdminProducts() {
  const [products, positions] = await Promise.all([db.listProducts(), db.listPositions()]);

  return (
    <div>
      <PageHeader title="Products" subtitle="Manage vault products. Clients see these on the Invest page (read-only)." />

      <div className="flex flex-col gap-4 stagger">
        {products.map((p) => {
          const posCount = positions.filter((pos) => pos.productSlug === p.slug).length;
          const tvl      = positions.filter((pos) => pos.productSlug === p.slug).reduce((a, pos) => a + pos.currentValueUsd, 0);

          return (
            <Card key={p.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h2 className="m-0 text-[18px] font-semibold">{p.name}</h2>
                    <span
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: p.status === "live" ? "#E6F7EC" : p.status === "paused" ? "#FEF3C7" : "#F1F3F5",
                        color:      p.status === "live" ? "#1a7f3b" : p.status === "paused" ? "#92400E" : "#6B7280",
                      }}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-muted text-[13px]">{p.lead}</div>
                </div>
                <Link href={`/admin/products/${p.slug}`} className="btn btn-dark btn-sm">Edit →</Link>
              </div>

              {/* Stats */}
              <div className="grid-6" style={{ marginBottom: 16 }}>
                {[
                  { k: "APY",       v: `${p.apy}%` },
                  { k: "Lock",      v: `${p.lockMonths / 12}y` },
                  { k: "Min dep.",  v: usd(p.minDeposit) },
                  { k: "Target",    v: `${p.cumulativeTargetPct}%` },
                  { k: "Positions", v: posCount },
                  { k: "TVL",       v: "$" + Math.round(tvl / 1000) + "k" },
                ].map(({ k, v }) => (
                  <div key={k} className="text-center rounded-[10px] py-3 px-1.5" style={{ background: "var(--color-bg-soft)", boxShadow: "inset 0 0 0 1px var(--color-border-soft)" }}>
                    <div className="label-upper mb-1">{k}</div>
                    <div className="text-[15px] font-bold tracking-tight">{v}</div>
                  </div>
                ))}
              </div>

              {/* Pockets */}
              <div className="label-upper mb-2">Strategy pockets</div>
              <StratBar mix={p.pockets.map((pk) => ({ color: pk.color, weight: pk.pct }))} />
              <div className="flex flex-wrap gap-x-3.5 gap-y-1 mt-1.5 mb-2">
                {p.pockets.map((pk) => <LegendItem key={pk.label} color={pk.color} label={`${pk.label} · ${pk.pct}%`} />)}
              </div>
              <div className="text-faint text-[12px] mt-2">
                Fees: {p.feesMgmtPct}% mgmt + {p.feesPerfPct}% perf · {p.network} · Regime: {p.activeRegime}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
