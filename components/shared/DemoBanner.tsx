import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="mb-6 px-5 py-4 rounded-2xl bg-white border border-[var(--hairline)] flex items-center gap-4 anim-fade-up shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="w-9 h-9 rounded-xl bg-[var(--gin-lightest)] grid place-items-center text-[var(--text-muted)] shrink-0">
        <Eye size={16} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Demo dashboard
        </div>
        <div className="mt-1 text-[13.5px] text-[var(--text-muted)] leading-[1.5]">
          The KPIs, chart and vault list below are mock data for layout preview. Real
          on-chain positions surface on the per-vault pages.
        </div>
      </div>
      <Link
        href="/platform"
        className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--text)] text-white text-[12.5px] font-semibold hover:bg-black transition-colors shrink-0"
      >
        Open platform
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
