"use client";

import { useChainId, useReadContract } from "wagmi";
import VaultFactoryAbi from "@/lib/abi/VaultFactory.json";
import { getChainAddresses } from "@/lib/web3/contracts";

const FACTORY_ABI = VaultFactoryAbi;

export function useDeployedVaults() {
  const chainId = useChainId();
  const chain = getChainAddresses(chainId);
  const enabled = Boolean(
    chain && chain.factory !== "0x0000000000000000000000000000000000000000",
  );

  const all = useReadContract({
    address: chain?.factory,
    abi: FACTORY_ABI,
    functionName: "getAllVaults",
    query: { enabled },
  });

  const total = useReadContract({
    address: chain?.factory,
    abi: FACTORY_ABI,
    functionName: "getTotalVaults",
    query: { enabled },
  });

  return {
    isReady: enabled,
    addresses: (all.data as `0x${string}`[] | undefined) ?? [],
    totalVaults: total.data ? Number(total.data as bigint) : 0,
    isLoading: all.isLoading || total.isLoading,
    refetch: () => {
      void all.refetch();
      void total.refetch();
    },
  };
}
