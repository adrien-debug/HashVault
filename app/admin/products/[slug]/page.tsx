import { notFound } from "next/navigation";
import { db } from "@/lib/db/store";
import { ProductEditClient } from "./ProductEditClient";

export const dynamic = "force-dynamic";

export default async function AdminProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.getProduct(slug);
  if (!product) notFound();
  return <ProductEditClient product={product} />;
}
