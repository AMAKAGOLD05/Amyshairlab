import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { CategoryManager } from "@/components/admin/TaxonomyManager";
import { listCategories } from "@/lib/db";

export const instant = false;

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await connection();
  const query = await searchParams;
  const categories = await listCategories();
  return (
    <div>
      <AdminHeading title="Categories" />
      <CategoryManager categories={categories} notice={query.error || (query.saved ? "Saved." : undefined)} />
    </div>
  );
}
