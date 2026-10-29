"use client";

import { ProductGrid } from "@/components/product/ProductCard";
import { useSite } from "@/context/CatalogContext";

export function ShopBrowser() {
  const { products } = useSite();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
      {products.length === 0 ? (
        <p role="status" className="text-center text-sm text-muted">
          No products yet.
        </p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
