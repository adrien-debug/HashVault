"use client";

import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { useVaultInfo } from "@/hooks/useVault";
import type { VaultId } from "@/lib/web3/contracts";

export function VaultPreviewBanner({ vaultId }: { vaultId: VaultId }) {
  const info = useVaultInfo(vaultId);
  if (info.isReady) return null;
  return <PreviewBanner />;
}
