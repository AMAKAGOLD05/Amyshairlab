"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { deleteProductAction } from "@/lib/actions";
import { fieldClass } from "@/components/ui/styles";
import { formatNaira } from "@/lib/money";
import type { AdminProduct } from "@/lib/db";
import type { Taxonomy } from "@/types/content";

export function ProductTable({
  products,
  categories,
  collections,
  notice,
}: {
  products: AdminProduct[];
  categories: Taxonomy[];
  collections: Taxonomy[];
  notice?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("all");
  const [pending, setPending] = useState<AdminProduct | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (pending) dialog.current?.showModal();
  }, [pending]);
  const categoryName = new Map(categories.map((item) => [item.id, item.name]));
  const visible = useMemo(() => products.filter((product) => {
    if (category !== "all" && product.categoryId !== category) return false;
    if (stock === "in" && product.stock <= 0) return false;
    if (stock === "out" && product.stock > 0) return false;
    if (query && !product.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  }), [category, products, query, stock]);

  return (
    <div>
      {notice ? <p className="mb-4 border border-line bg-paper px-4 py-3 text-sm" role="status">{notice}</p> : null}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name" className={fieldClass} aria-label="Search products" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass} aria-label="Filter by category">
          <option value="all">All categories</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select value={stock} onChange={(event) => setStock(event.target.value)} className={fieldClass} aria-label="Filter by stock">
          <option value="all">All stock</option>
          <option value="in">In stock</option>
          <option value="out">Sold out</option>
        </select>
      </div>
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="bg-paper text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-3 py-3">Image</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Availability</th>
              <th className="px-3 py-3"> </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id} className="border-t border-line">
                <td className="px-3 py-3">
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0].src} alt="" className="h-14 w-14 object-cover" />
                  ) : <span className="text-xs text-muted">None</span>}
                </td>
                <td className="px-3 py-3">
                  <p>{product.name}</p>
                  <p className="text-xs text-muted">{collections.find((item) => item.id === product.collectionId)?.name}</p>
                </td>
                <td className="px-3 py-3">{formatNaira(product.price)}</td>
                <td className="px-3 py-3">{categoryName.get(product.categoryId) ?? "—"}</td>
                <td className="px-3 py-3">{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</td>
                <td className="px-3 py-3">{product.available ? "Available" : "Hidden"}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/products/${product.id}`} className="underline decoration-gold underline-offset-4">Edit</Link>
                    <button
                      type="button"
                      className="underline decoration-gold underline-offset-4"
                      onClick={() => setPending(product)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog ref={dialog} className="w-full max-w-md bg-ivory p-6" onClose={() => setPending(null)}>
        <h2 className="font-serif text-3xl">Delete this product?</h2>
        <p className="mt-3 text-sm leading-6 text-cocoa">
          {pending?.name} will leave the shop and its collections. Images still used elsewhere stay in the library.
        </p>
        <div className="mt-6 flex gap-3">
          <form action={deleteProductAction}>
            <input type="hidden" name="id" value={pending?.id ?? ""} />
            <button type="submit" className="bg-ink px-4 py-2 text-sm text-ivory">Delete</button>
          </form>
          <button type="button" className="border border-ink px-4 py-2 text-sm" onClick={() => dialog.current?.close()}>Cancel</button>
        </div>
      </dialog>
    </div>
  );
}
