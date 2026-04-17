import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base, baseSepolia, sepolia } from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "wagmi";
import { ENV } from "./env";

export const networks = [base, baseSepolia, sepolia] as const;

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId: ENV.WALLETCONNECT_PROJECT_ID,
  networks: [...networks],
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
