"use client";

import { Wallet } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";

function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

type ConnectWalletButtonProps = {
  variant?: "primary" | "ghost";
  className?: string;
};

export function ConnectWalletButton({
  variant = "primary",
  className = "",
}: ConnectWalletButtonProps) {
  const { address, isConnected, status } = useAccount();
  const { disconnect } = useDisconnect();

  const open = () => {
    if (typeof window === "undefined") return;
    // AppKit registers a global custom element <appkit-button> and a window helper.
    // We use the helper to keep the CTA fully styled by us.
    const appkit = (window as unknown as {
      appKit?: { open: (opts?: { view?: string }) => void };
    }).appKit;
    if (appkit) {
      appkit.open();
      return;
    }
    // Fallback: dispatch a click on a hidden <appkit-button>
    const evt = new CustomEvent("w3m-open");
    window.dispatchEvent(evt);
  };

  const onClick = () => {
    if (isConnected) {
      disconnect();
      return;
    }
    open();
  };

  const baseClass =
    variant === "primary"
      ? "inline-flex items-center gap-2.5 px-6 py-3 bg-[var(--text)] text-white border-0 rounded-full font-semibold text-[14px] transition-colors hover:bg-[#191919] shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_2px_8px_rgba(0,0,0,0.15)] group"
      : "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border border-black/10 hover:bg-black/5 transition-colors";

  // wagmi resolves the cookie-restored state asynchronously on the client.
  // While reconnecting, we keep the CTA disabled to avoid an SSR/CSR mismatch
  // on the displayed address.
  const isLoading = status === "connecting" || status === "reconnecting";
  const label = isConnected && address ? shortAddress(address) : "Connect Wallet";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`${baseClass} ${className} disabled:opacity-60 disabled:cursor-not-allowed`}
      aria-label={isConnected ? "Disconnect wallet" : "Connect wallet"}
    >
      <Wallet
        size={16}
        className={
          variant === "primary"
            ? "text-white/70 transition-colors group-hover:text-white"
            : "text-[var(--text-muted)]"
        }
      />
      {label}
    </button>
  );
}
