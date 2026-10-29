import { connection } from "next/server";
import Link from "next/link";
import { AdminHeading } from "@/components/admin/Frame";
import { listAdminProducts, listOrders } from "@/lib/db";
import { formatNaira } from "@/lib/money";

export default async function OverviewPage() {
  await connection();
  const [products, orders] = await Promise.all([listAdminProducts(), listOrders()]);
  const stock = products.reduce((sum, product) => sum + product.stock, 0);
  const sales = orders.reduce((sum, order) => sum + order.total, 0);
  return (
    <div>
      <AdminHeading title="Overview" />
      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat label="Products" value={String(products.length)} />
        <Stat label="Pieces in stock" value={String(stock)} />
        <Stat label="Recorded orders" value={String(orders.length)} />
      </dl>
      <p className="mt-6 text-sm text-muted">Recorded order value {formatNaira(sales)}.</p>
      <h2 className="mt-10 font-serif text-3xl">Latest orders</h2>
      {orders.length === 0 ? <p className="mt-3 text-sm text-muted">Orders placed at checkout will appear here.</p> : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {orders.slice(0, 6).map((order) => (
            <li key={order.id} className="flex items-center justify-between py-3 text-sm">
              <Link href={`/admin/orders/${order.id}`} className="underline">{order.orderNumber}</Link>
              <span>{order.customer.fullName}</span>
              <span>{formatNaira(order.total)}</span>
              <span className="uppercase tracking-[0.14em]">{order.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-paper p-5">
      <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">{label}</dt>
      <dd className="mt-2 font-serif text-4xl">{value}</dd>
    </div>
  );
}
