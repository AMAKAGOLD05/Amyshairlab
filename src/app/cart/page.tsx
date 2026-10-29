import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review the hair in your Amy’s Hairlab bag before demonstration checkout.",
};

export default function CartPage() {
  return <CartView />;
}
