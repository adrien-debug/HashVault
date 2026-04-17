"use client";

import { useAccount, useChainId } from "wagmi";
import { isSupportedChain, SUPPORTED_CHAIN_IDS, ADDRESSES } from "@/lib/web3/contracts";

export function NetworkBanner() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  if (!isConnected) return null;
  if (isSupportedChain(chainId)) return null;

  const supported = SUPPORTED_CHAIN_IDS.map((id) => ADDRESSES[id].name).join(", ");

  return (
    <div className="mb-6 px-4 py-3 rounded-2xl bg-[#fff8ec] border border-[#f7c34a]/40 text-[13px] text-[#8a5a00] flex items-center gap-3">
      <span className="font-semibold uppercase tracking-widest text-[10px] px-2 py-0.5 rounded-full bg-[#f7c34a]/20 text-[#8a5a00]">
        Wrong network
      </span>
      <span>
        Connected chain <code className="font-mono">{chainId ?? "unknown"}</code> is not supported.
        Switch to {supported}.
      </span>
    </div>
  );
}
