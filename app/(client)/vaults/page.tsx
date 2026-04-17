import { db } from "@/lib/db/store";
import { VaultsClient } from "./VaultsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Vaults" };

export default async function VaultsPage() {
  const [positions, products, transactions] = await Promise.all([
    db.listPositions({ userId: "user_demo" }),
    db.listProducts(),
    db.listTransactions({ userId: "user_demo" }),
  ]);
  return <VaultsClient positions={positions} products={products} transactions={transactions} />;
}
