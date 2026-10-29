import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Demonstration checkout for Amy’s Hairlab. Delivery details only. No card payment is collected.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
