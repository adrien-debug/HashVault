import { db } from "@/lib/db/store";
import { InvestClient } from "./InvestClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Invest · HashVault" };

export default async function InvestPage() {
  const products = await db.listProducts();
  return <InvestClient products={products} />;
}
