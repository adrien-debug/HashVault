import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-[var(--bg)] px-6">
      <div className="text-center max-w-[480px]">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--mint-darker)]">
          404
        </span>
        <h1 className="mt-3 text-[44px] font-semibold tracking-[-0.025em] leading-[1.05]">
          Page not found.
        </h1>
        <p className="mt-3 text-[15px] text-[var(--text-muted)]">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--text)] text-white font-semibold text-[13px] hover:bg-black transition-colors"
          >
            Back home
          </Link>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--hairline)] bg-white text-[13px] font-semibold hover:bg-[var(--gin-lightest)] transition-colors"
          >
            Open the platform
          </Link>
        </div>
      </div>
    </div>
  );
}
