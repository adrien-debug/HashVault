"use client";

import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { useVaultInfo } from "@/hooks/useVault";

export function PlatformPreviewBanner() {
  const prime = useVaultInfo("prime");
  const growth = useVaultInfo("growth");

  if (prime.isReady || growth.isReady) return null;

  return (
    <PreviewBanner
      title="Vaults coming soon"
      description="Both Prime and Growth vaults are in preview. Browse the cards below to simulate target rewards — deposits open as soon as the contracts are deployed."
    />
  );
}
