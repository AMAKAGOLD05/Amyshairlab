"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { fieldClass } from "@/components/ui/styles";

export function OrderFilters() {
  const params = useSearchParams();
  const router = useRouter();
  return (
    <form
      className="mb-6 grid gap-3 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const next = new URLSearchParams();
        const q = String(data.get("q") ?? "");
        const status = String(data.get("status") ?? "");
        if (q) next.set("q", q);
        if (status) next.set("status", status);
        router.replace(next.size ? `/admin/orders?${next}` : "/admin/orders");
      }}
    >
      <input name="q" defaultValue={params.get("q") ?? ""} placeholder="Search name, email, or order number" className={fieldClass} aria-label="Search orders" />
      <select name="status" defaultValue={params.get("status") ?? ""} className={fieldClass} aria-label="Filter by status">
        <option value="">All statuses</option>
        {["placed", "confirmed", "packed", "dispatched", "delivered", "cancelled"].map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button className="text-left text-sm underline">Apply</button>
    </form>
  );
}
