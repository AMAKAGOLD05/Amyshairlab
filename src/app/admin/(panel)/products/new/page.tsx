import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { ProductFields } from "@/components/admin/ProductFields";
import { listCategories, listCollections, listMedia } from "@/lib/db";

export default async function NewProductPage() {
  await connection();
  const [categories, collections, media] = await Promise.all([
    listCategories(),
    listCollections(),
    listMedia(),
  ]);
  return (
    <div>
      <AdminHeading title="Add product" />
      <ProductFields product={null} categories={categories} collections={collections} media={media} />
    </div>
  );
}
