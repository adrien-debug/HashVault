import { Allocation } from "@/components/Allocation";
import { Header } from "@/components/Header";
import { KpiStrip } from "@/components/KpiStrip";
import { PortfolioChart } from "@/components/PortfolioChart";
import { VaultList } from "@/components/VaultList";
import { DemoBanner } from "@/components/shared/DemoBanner";

export const metadata = {
  title: "HashVault — Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <DemoBanner />
      <Header />
      <KpiStrip />
      <PortfolioChart />
      <Allocation />
      <VaultList />
    </>
  );
}
