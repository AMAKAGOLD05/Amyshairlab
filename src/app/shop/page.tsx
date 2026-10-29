import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Amy’s Hairlab wigs and hair pieces.",
};

export default function ShopPage() {
  return <ShopBrowser />;
}
