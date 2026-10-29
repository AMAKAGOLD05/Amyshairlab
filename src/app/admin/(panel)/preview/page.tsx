import { connection } from "next/server";
import { HomeView } from "@/components/home/HomeSections";
import { getHome, listAdminProducts, listCollections, toPublicProduct } from "@/lib/db";

export default async function PreviewPage() {
  await connection();
  const [home, adminProducts, collections] = await Promise.all([
    getHome("home_draft"),
    listAdminProducts(),
    listCollections(),
  ]);
  return (
    <div>
      <p className="mb-6 border border-gold bg-paper px-4 py-3 text-sm">This is the saved draft. Publish it from the homepage editor to show it on the public site.</p>
      <div className="border border-line bg-ivory">
        <HomeView home={home} products={adminProducts.map(toPublicProduct)} collections={collections} />
      </div>
    </div>
  );
}
