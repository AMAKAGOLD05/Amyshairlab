import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { AdminHeading } from "@/components/admin/Frame";
import { OrderFilters } from "@/components/admin/OrderFilters";
import { listOrders } from "@/lib/db";
import { formatNaira } from "@/lib/money";

export const instant = false;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await connection();
  const query = await searchParams;
  const needle = (query.q ?? "").trim().toLowerCase();
  const orders = (await listOrders()).filter((order) => {
    if (query.status && order.status !== query.status) return false;
    if (!needle) return true;
    return [order.orderNumber, order.customer.fullName, order.customer.email, order.customer.city]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
  return (
    <div>
      <AdminHeading title="Orders" />
      <Suspense fallback={null}>
        <OrderFilters />
      </Suspense>
      {orders.length === 0 ? <p className="text-sm text-muted">No orders match. Orders appear here after a customer checks out.</p> : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-paper text-[0.68rem] uppercase tracking-[0.16em] text-muted">
              <tr>
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-line">
                  <td className="px-3 py-3"><Link href={`/admin/orders/${order.id}`} className="underline">{order.orderNumber}</Link></td>
                  <td className="px-3 py-3">{order.customer.fullName}<br /><span className="text-xs text-muted">{order.customer.city}, {order.customer.state}</span></td>
                  <td className="px-3 py-3">{formatNaira(order.total)}</td>
                  <td className="px-3 py-3 uppercase tracking-[0.14em]">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
