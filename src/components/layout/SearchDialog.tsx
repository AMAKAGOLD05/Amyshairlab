"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCatalog } from "@/context/CatalogContext";
import { searchProducts, startingPrice } from "@/lib/catalog";
import { formatNaira } from "@/lib/money";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { products, collections } = useCatalog();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const results = query.trim() ? searchProducts(query, products, collections).slice(0, 6) : [];

  return (
    <dialog
      ref={ref}
      className="sheet w-[min(36rem,calc(100vw-2rem))] bg-paper p-0"
      aria-labelledby="search-title"
      onClose={onClose}
    >
      <form
        className="p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          const next = query.trim();
          onClose();
          router.push(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="search-title" className="font-serif text-3xl">
            Search the edit
          </h2>
          <button type="button" className="text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <label htmlFor="site-search" className="mt-6 block text-[0.68rem] uppercase tracking-[0.18em] text-cocoa">
          Product name
        </label>
        <input
          id="site-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Bone straight, pixie, frontal…"
          className="mt-2 w-full border-b border-ink bg-transparent py-3 text-lg outline-none"
        />
        <button type="submit" className="mt-4 text-[0.72rem] uppercase tracking-[0.18em] underline decoration-gold underline-offset-4">
          View all matches
        </button>
        {query.trim() && results.length === 0 ? (
          <p role="status" className="mt-6 text-sm text-muted">
            No products match “{query.trim()}”.
          </p>
        ) : null}
        {results.length > 0 ? (
          <ul className="mt-6 divide-y divide-line border-t border-line">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <span>
                    <span className="block font-serif text-xl">{product.name}</span>
                    <span className="text-xs uppercase tracking-[0.16em] text-muted">
                      {product.texture}
                    </span>
                  </span>
                  <span className="text-sm">{formatNaira(startingPrice(product))}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </form>
    </dialog>
  );
}
