import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Highlights } from "@/components/landing/Highlights";
import { LandingNav } from "@/components/landing/LandingNav";

export const metadata = {
  title: "HashVault — Institutional-grade USDC vaults",
  description:
    "Earn predictable, transparent yield on USDC through HashVault Prime and Growth — built for institutional standards.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Highlights />
      </main>
      <Footer />
    </div>
  );
}
