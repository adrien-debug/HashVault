export function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] bg-[var(--bg)]">
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-2.5 font-semibold text-[13px] tracking-[0.02em]">
          <span className="relative w-6 h-6 rounded-[7px] bg-[var(--text)] after:absolute after:inset-[5px] after:rounded-[3px] after:bg-[var(--mint)]" />
          <span>HASHVAULT</span>
        </div>
        <div className="flex items-center gap-6 text-[12px] text-[var(--text-muted)] font-medium">
          <span>© {new Date().getFullYear()} HashVault. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-5 text-[12px] text-[var(--text-muted)] font-medium">
          <a href="#" className="hover:text-[var(--text)] transition-colors">Terms</a>
          <a href="#" className="hover:text-[var(--text)] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[var(--text)] transition-colors">Risk disclosures</a>
        </div>
      </div>
    </footer>
  );
}
