"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BagTotals, CartLines } from "@/components/cart/CartLines";
import { useCart } from "@/context/CartContext";
import { btnPrimary, btnSecondary } from "@/components/ui/styles";

export function CartDrawer() {
  const { items, drawerOpen, closeDrawer, notice, subtotal, clearNotice } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (drawerOpen && !dialog.open) dialog.showModal();
    if (!drawerOpen && dialog.open) dialog.close();
  }, [drawerOpen]);

  return (
    <dialog
      ref={ref}
      className="drawer bg-ivory"
      aria-labelledby="bag-title"
      onClose={() => {
        closeDrawer();
        clearNotice();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-5">
          <h2 id="bag-title" className="font-serif text-3xl">
            Your bag
          </h2>
          <button type="button" onClick={closeDrawer} className="text-sm">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {notice ? (
            <p role="status" className="mb-4 border border-gold bg-paper px-3 py-3 text-sm">
              {notice}
            </p>
          ) : null}
          <CartLines items={items} editable />
        </div>
        <div className="border-t border-line px-5 py-5">
          <BagTotals subtotal={subtotal} showDelivery={false} />
          <div className="mt-5 grid gap-3">
            <Link href="/cart" className={btnSecondary} onClick={closeDrawer}>
              View bag
            </Link>
            <Link
              href="/checkout"
              className={btnPrimary}
              onClick={closeDrawer}
              aria-disabled={items.length === 0}
              tabIndex={items.length === 0 ? -1 : undefined}
            >
              Checkout
            </Link>
            <Link href="/shop" onClick={closeDrawer} className="text-center text-[0.72rem] uppercase tracking-[0.18em] text-muted">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}
