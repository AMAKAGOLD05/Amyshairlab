import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { ProductFields } from "@/components/admin/ProductFields";
import { getAdminProduct, listCategories, listCollections, listMedia } from "@/lib/db";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const [product, categories, collections, media] = await Promise.all([
    getAdminProduct(id),
    listCategories(),
    listCollections(),
    listMedia(),
  ]);
  if (!product) notFound();
  return (
    <div>
      <AdminHeading title="Edit product" />
      <ProductFields product={product} categories={categories} collections={collections} media={media} />
    </div>
  );
}
