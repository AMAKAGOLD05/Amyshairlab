import type { Metadata } from "next";
import { Suspense } from "react";
import { Confirmation } from "@/components/checkout/Confirmation";

export const metadata: Metadata = {
  title: "Order confirmation",
  description: "Demonstration order confirmation for Amy’s Hairlab. No payment was taken.",
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<p className="px-5 py-24 text-center text-sm text-muted">Finding the order…</p>}>
      <Confirmation />
    </Suspense>
  );
}
