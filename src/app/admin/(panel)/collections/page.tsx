import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { CollectionManager } from "@/components/admin/TaxonomyManager";
import { listAdminProducts, listCollections } from "@/lib/db";

export const instant = false;

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await connection();
  const query = await searchParams;
  const [collections, products] = await Promise.all([listCollections(), listAdminProducts()]);
  return (
    <div>
      <AdminHeading title="Collections" />
      <CollectionManager
        collections={collections}
        products={products}
        notice={query.error || (query.saved ? "Saved." : undefined)}
      />
    </div>
  );
}
