"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { BagTotals, CartLines } from "@/components/cart/CartLines";
import { PageIntro } from "@/components/ui/PageIntro";
import { btnPrimary } from "@/components/ui/styles";
import {
  ORDERS_PENDING,
  ordersServerSnapshot,
  parseOrders,
  readOrdersRaw,
  subscribeOrders,
} from "@/lib/orders";

export function Confirmation() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const raw = useSyncExternalStore(subscribeOrders, readOrdersRaw, ordersServerSnapshot);
  const order = useMemo(() => {
    if (raw === ORDERS_PENDING || !orderNumber) return null;
    return parseOrders(raw).find((item) => item.orderNumber === orderNumber) ?? null;
  }, [orderNumber, raw]);

  if (raw === ORDERS_PENDING) {
    return <p className="px-5 py-24 text-center text-sm text-muted">Finding the order…</p>;
  }

  if (!order) {
    return (
      <div className="pb-20">
        <PageIntro eyebrow="Confirmation" title="No order on this device">
          <p>
            We could not find that demonstration order in this browser. Orders are not
            stored on a server.
          </p>
        </PageIntro>
        <div className="px-5 sm:px-8">
          <Link href="/shop" className={btnPrimary}>
            Return to the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageIntro eyebrow="Demonstration order" title="Your order is noted">
        <p>
          This is a demonstration checkout. Nothing was paid, nothing was charged, and
          Amy’s Hairlab has not received the order. It is saved only in this browser.
        </p>
      </PageIntro>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="border border-line bg-paper p-6">
          <h2 className="text-[0.68rem] uppercase tracking-[0.18em] text-gold-deep">
            Order number
          </h2>
          <p className="mt-2 font-serif text-4xl">{order.orderNumber}</p>
          <dl className="mt-6 space-y-2 text-sm leading-6">
            <div>
              <dt className="text-muted">Name</dt>
              <dd>{order.customer.fullName}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd>{order.customer.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd>{order.customer.phone}</dd>
            </div>
            <div>
              <dt className="text-muted">Deliver to</dt>
              <dd>
                {order.customer.address}, {order.customer.city}, {order.customer.state}
              </dd>
            </div>
            {order.customer.notes ? (
              <div>
                <dt className="text-muted">Notes</dt>
                <dd>{order.customer.notes}</dd>
              </div>
            ) : null}
          </dl>
        </section>
        <section>
          <h2 className="font-serif text-3xl">Order summary</h2>
          <div className="mt-4">
            <CartLines items={order.items} editable={false} />
          </div>
          <div className="mt-6 max-w-sm">
            <BagTotals subtotal={order.subtotal} discount={order.discount ?? 0} deliveryFee={order.deliveryFee} showDelivery />
          </div>
          <Link href="/shop" className={`${btnPrimary} mt-8`}>
            Continue shopping
          </Link>
        </section>
      </div>
    </div>
  );
}
