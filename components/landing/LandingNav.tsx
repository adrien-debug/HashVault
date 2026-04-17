import Link from "next/link";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b border-[var(--hairline)]">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-[14px] tracking-[0.02em]">
          <span className="relative w-6 h-6 rounded-[7px] bg-[var(--text)] after:absolute after:inset-[5px] after:rounded-[3px] after:bg-[var(--mint)]" />
          <span>HASHVAULT</span>
        </Link>

        <div className="flex items-center gap-8 text-[13px] text-[var(--text-muted)] font-medium max-md:hidden">
          <a href="#products" className="hover:text-[var(--text)] transition-colors">Products</a>
          <a href="#why" className="hover:text-[var(--text)] transition-colors">Why HashVault</a>
          <a href="#security" className="hover:text-[var(--text)] transition-colors">Security</a>
        </div>

        <Link
          href="/platform"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text)] text-white font-semibold text-[13px] hover:bg-black transition-colors shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_2px_8px_rgba(0,0,0,0.15)]"
        >
          Launch App
          <span aria-hidden>→</span>
        </Link>
      </div>
    </nav>
  );
}
