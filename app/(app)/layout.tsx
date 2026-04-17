import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { NetworkBanner } from "@/components/shared/NetworkBanner";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-screen">
      <Sidebar />
      <main className="px-10 py-8 pb-20 max-w-[1280px] max-lg:px-5 max-lg:py-6">
        <NetworkBanner />
        {children}
      </main>
    </div>
  );
}
