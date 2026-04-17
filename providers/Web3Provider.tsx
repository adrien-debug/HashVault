"use client";

import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { type Config, cookieToInitialState, WagmiProvider } from "wagmi";
import { ENV, validateWeb3Env } from "@/lib/web3/env";
import { networks, wagmiAdapter, wagmiConfig } from "@/lib/web3/wagmi";

type Web3ProviderProps = {
  children: ReactNode;
  cookies: string | null;
};

const metadata = {
  name: "HashVault",
  description: "HashVault — institutional-grade USDC vaults",
  url: "https://hashvault.app",
  icons: ["https://hashvault.app/icon.png"],
};

let appKitInitialized = false;

function ensureAppKit() {
  if (appKitInitialized) return;
  if (!ENV.WALLETCONNECT_PROJECT_ID) {
    // Surface a clean error in dev rather than crashing inside reown.
    console.warn(
      "[HashVault] AppKit not initialized — NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing.",
    );
    return;
  }
  createAppKit({
    adapters: [wagmiAdapter],
    projectId: ENV.WALLETCONNECT_PROJECT_ID,
    networks: [...networks],
    defaultNetwork: networks.find((n) => n.id === ENV.DEFAULT_CHAIN_ID) ?? networks[1],
    metadata,
    features: { analytics: true },
    themeMode: "light",
    themeVariables: {
      "--w3m-accent": "#a7fb90",
      "--w3m-border-radius-master": "12px",
    },
  });
  appKitInitialized = true;
}

export function Web3Provider({ children, cookies }: Web3ProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Vault data changes slowly; avoid noisy refetching.
            staleTime: 15_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  ensureAppKit();

  const initialState = useMemo(
    () => cookieToInitialState(wagmiConfig as Config, cookies),
    [cookies],
  );

  useEffect(() => {
    const { warnings } = validateWeb3Env();
    if (warnings.length > 0) {
      for (const w of warnings) console.warn(`[HashVault] ${w}`);
    }
  }, []);

  return (
    <WagmiProvider config={wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
