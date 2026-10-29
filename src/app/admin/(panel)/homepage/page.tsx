import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { HomeEditor } from "@/components/admin/HomeEditor";
import { getHome, listMedia, toPublicProduct, listAdminProducts } from "@/lib/db";

export default async function HomepagePage() {
  await connection();
  const [home, adminProducts, media] = await Promise.all([
    getHome("home_draft"),
    listAdminProducts(),
    listMedia(),
  ]);
  return (
    <div>
      <AdminHeading title="Homepage editor" />
      <HomeEditor initial={home} products={adminProducts.map(toPublicProduct)} media={media} />
    </div>
  );
}
