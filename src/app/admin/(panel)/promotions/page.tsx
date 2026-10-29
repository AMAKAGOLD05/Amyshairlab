import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { PromotionForm } from "@/components/admin/SettingsForms";
import { getPromotion } from "@/lib/db";

export default async function PromotionsPage() {
  await connection();
  const promotion = await getPromotion();
  return (
    <div>
      <AdminHeading title="Promotions" />
      <p className="mb-6 max-w-2xl text-sm leading-6 text-cocoa">
        One code can be entered at checkout. The discount is calculated on the server from the saved prices.
      </p>
      <PromotionForm promotion={promotion} />
    </div>
  );
}
