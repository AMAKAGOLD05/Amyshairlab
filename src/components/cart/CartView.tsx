"use client";

import Link from "next/link";
import { BagTotals, CartLines } from "@/components/cart/CartLines";
import { PageIntro } from "@/components/ui/PageIntro";
import { btnPrimary, btnSecondary } from "@/components/ui/styles";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { lineAvailability } from "@/lib/catalog";

export function CartView() {
  const { items, subtotal, ready } = useCart();
  const { products } = useCatalog();

  const blocked = items.some((item) => !lineAvailability(item, products).ok);

  return (
    <div className="pb-20">
      <PageIntro eyebrow="Bag" title="Shopping bag">
        <p>
          Quantities stay on this device. Change them here, then continue to the
          demonstration checkout.
        </p>
      </PageIntro>
      {!ready ? (
        <p className="px-5 text-sm text-muted">Opening your bag…</p>
      ) : (
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.3fr_0.7fr]">
          <CartLines items={items} editable />
          {items.length > 0 ? (
            <aside className="h-fit border border-line bg-paper p-6">
              <h2 className="font-serif text-3xl">Summary</h2>
              <div className="mt-5">
                <BagTotals subtotal={subtotal} showDelivery />
              </div>
              {blocked ? (
                <p role="alert" className="mt-4 text-sm">
                  Remove sold-out pieces, or lower a quantity, before checkout.
                </p>
              ) : null}
              <div className="mt-6 grid gap-3">
                {blocked ? (
                  <button type="button" className={btnPrimary} disabled>
                    Checkout
                  </button>
                ) : (
                  <Link href="/checkout" className={btnPrimary}>
                    Checkout
                  </Link>
                )}
                <Link href="/shop" className={btnSecondary}>
                  Continue shopping
                </Link>
              </div>
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}
