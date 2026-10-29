import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { setOrderStatusAction } from "@/lib/actions";
import { getOrder } from "@/lib/db";
import { formatNaira } from "@/lib/money";
import { fieldClass } from "@/components/ui/styles";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm underline">All orders</Link>
      <h1 className="mt-4 font-serif text-5xl">{order.orderNumber}</h1>
      <p className="mt-2 text-sm text-muted">{order.placedAt.replace("T", " ").slice(0, 16)} UTC</p>
      <form action={setOrderStatusAction} className="mt-6 flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={order.id} />
        <label className="text-sm">Status
          <select name="status" defaultValue={order.status} className={`${fieldClass} mt-2`}>
            {["placed", "confirmed", "packed", "dispatched", "delivered", "cancelled"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
        <button className="bg-ink px-4 py-3 text-sm text-ivory">Update status</button>
      </form>
      <h2 className="mt-10 font-serif text-3xl">Customer</h2>
      <dl className="mt-3 space-y-1 text-sm">
        <div>{order.customer.fullName}</div>
        <div>{order.customer.email}</div>
        <div>{order.customer.phone}</div>
        <div>{order.customer.address}</div>
        <div>{order.customer.city}, {order.customer.state}</div>
        {order.customer.notes ? <div>Notes: {order.customer.notes}</div> : null}
      </dl>
      <h2 className="mt-10 font-serif text-3xl">Pieces</h2>
      <ul className="mt-3 divide-y divide-line border-y border-line text-sm">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between gap-4 py-3">
            <span>
              {item.name} × {item.quantity}
              {item.length ? ` · ${item.length}` : ""}
              {item.variations.map((variation) => ` · ${variation.value}`).join("")}
            </span>
            <span>{formatNaira(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatNaira(order.subtotal)}</dd></div>
        {order.discount ? <div className="flex justify-between"><dt>Discount</dt><dd>-{formatNaira(order.discount)}</dd></div> : null}
        <div className="flex justify-between"><dt>Delivery</dt><dd>{formatNaira(order.deliveryFee)}</dd></div>
        <div className="flex justify-between font-medium"><dt>Total</dt><dd>{formatNaira(order.total)}</dd></div>
      </dl>
    </div>
  );
}
