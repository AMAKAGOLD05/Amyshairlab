"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { lineAvailability } from "@/lib/catalog";
import { formatNaira } from "@/lib/money";
import { useSite } from "@/context/CatalogContext";
import { quoteDeliveryFee } from "@/data/site";
import type { CartLine } from "@/types/catalog";

export function CartLines({
  items,
  editable,
}: {
  items: CartLine[];
  editable: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="border border-line bg-paper px-6 py-12 text-center">
        <p className="font-serif text-3xl">Your bag is empty.</p>
        <p className="mt-3 text-sm text-muted">
          The hair you choose will stay here, including after a refresh.
        </p>
        <Link href="/shop" className="mt-6 inline-block text-[0.72rem] uppercase tracking-[0.18em] underline decoration-gold underline-offset-4">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.id} className="py-6">
          <CartRow item={item} editable={editable} />
        </li>
      ))}
    </ul>
  );
}

function CartRow({ item, editable }: { item: CartLine; editable: boolean }) {
  const { setQuantity, removeItem } = useCart();
  const { products } = useCatalog();
  const [error, setError] = useState<string | null>(null);
  const availability = lineAvailability(item, products);
  const details = [
    item.length,
    ...item.variations.map((variation) => `${variation.label}: ${variation.value}`),
  ].filter(Boolean);

  function update(next: number) {
    const result = setQuantity(item.id, next);
    setError(result.ok ? null : result.message);
  }

  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-4 sm:grid-cols-[6.5rem_1fr_auto]">
      <Link href={`/products/${item.slug}`} className="relative block aspect-[4/5] bg-sand">
        <ProductImage
          src={item.image}
          alt=""
          sizes="120px"
        />
      </Link>
      <div>
        <h3 className="font-serif text-2xl leading-tight">
          <Link href={`/products/${item.slug}`}>{item.name}</Link>
        </h3>
        {details.length > 0 ? (
          <p className="mt-1 text-sm text-muted">{details.join(" · ")}</p>
        ) : null}
        <p className="mt-2 text-sm">
          <span className="sr-only">Demonstration price. </span>
          {formatNaira(item.unitPrice)} each
        </p>
        <p className={`mt-1 text-sm ${availability.ok ? "text-muted" : "text-ink"}`}>
          {availability.message}
        </p>
        {editable ? (
          <div className="mt-3 flex items-center gap-3">
            <div className="inline-flex border border-line" role="group" aria-label={`Quantity for ${item.name}`}>
              <button
                type="button"
                className="h-10 w-10 disabled:text-muted"
                aria-label={`Decrease quantity of ${item.name}`}
                disabled={item.quantity <= 1}
                onClick={() => update(item.quantity - 1)}
              >
                −
              </button>
              <span className="grid h-10 min-w-8 place-items-center text-sm">{item.quantity}</span>
              <button
                type="button"
                className="h-10 w-10"
                aria-label={`Increase quantity of ${item.name}`}
                onClick={() => update(item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="text-[0.72rem] uppercase tracking-[0.16em] text-muted underline decoration-gold underline-offset-4"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm">Quantity {item.quantity}</p>
        )}
        {error ? (
          <p role="alert" className="mt-2 text-sm">
            {error}
          </p>
        ) : null}
      </div>
      <p className="col-span-2 text-sm sm:col-span-1 sm:text-right">
        <span className="sr-only">Line total. </span>
        {formatNaira(item.unitPrice * item.quantity)}
      </p>
    </div>
  );
}

export function BagTotals({
  subtotal,
  showDelivery,
  discount = 0,
  deliveryFee,
}: {
  subtotal: number;
  showDelivery: boolean;
  discount?: number;
  deliveryFee?: number;
}) {
  const { settings } = useSite();
  const delivery = deliveryFee ?? quoteDeliveryFee(Math.max(subtotal - discount, 0), settings.deliveryFee, settings.freeDeliveryThreshold);
  const total = Math.max(subtotal - discount, 0) + (showDelivery ? delivery : 0);

  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between gap-4">
        <dt>Subtotal</dt>
        <dd>{formatNaira(subtotal)}</dd>
      </div>
      {discount > 0 ? (
        <div className="flex justify-between gap-4">
          <dt>Promotion</dt>
          <dd>-{formatNaira(discount)}</dd>
        </div>
      ) : null}
      {showDelivery ? (
        <div className="flex justify-between gap-4">
          <dt>Demonstration delivery</dt>
          <dd>{delivery === 0 ? "Complimentary" : formatNaira(delivery)}</dd>
        </div>
      ) : (
        <div className="text-muted">Delivery is calculated at checkout.</div>
      )}
      <div className="flex justify-between gap-4 border-t border-line pt-3 font-medium">
        <dt>{showDelivery ? "Total payable" : "Subtotal due"}</dt>
        <dd>{formatNaira(showDelivery ? total : subtotal)}</dd>
      </div>
      <p className="text-xs leading-5 text-muted">
        Prices are demonstration amounts in Nigerian naira. No payment is taken.
      </p>
    </dl>
  );
}
