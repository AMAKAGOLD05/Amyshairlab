import Link from "next/link";
import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { ProductTable } from "@/components/admin/ProductTable";
import { btnPrimary } from "@/components/ui/styles";
import { listAdminProducts, listCategories, listCollections } from "@/lib/db";

export const instant = false;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await connection();
  const query = await searchParams;
  const notice = query.saved ? "Product saved. The shop is updated." : query.deleted ? "Product deleted." : undefined;
  const [products, categories, collections] = await Promise.all([
    listAdminProducts(),
    listCategories(),
    listCollections(),
  ]);
  return (
    <div>
      <AdminHeading title="Products">
        <Link href="/admin/products/new" className={btnPrimary}>Add Product</Link>
      </AdminHeading>
      <ProductTable
        products={products}
        categories={categories}
        collections={collections}
        notice={notice}
      />
    </div>
  );
}
