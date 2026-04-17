import { Sparkles } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
};

export function PreviewBanner({
  title = "Preview mode",
  description = "This vault is not deployed yet. Numbers shown are target values — deposits and claims are disabled until launch.",
}: Props) {
  return (
    <div className="mb-8 px-5 py-4 rounded-2xl bg-gradient-to-r from-[var(--mint-lightest)] to-white border border-[var(--mint)]/40 flex items-start gap-4 anim-fade-up">
      <div className="w-9 h-9 rounded-xl bg-[var(--mint-lighter)] grid place-items-center text-[var(--mint-darkest)] shrink-0">
        <Sparkles size={16} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold uppercase tracking-widest text-[var(--mint-darkest)]">
          {title}
        </div>
        <div className="mt-1 text-[13.5px] text-[var(--text-muted)] leading-[1.5]">
          {description}
        </div>
      </div>
    </div>
  );
}
