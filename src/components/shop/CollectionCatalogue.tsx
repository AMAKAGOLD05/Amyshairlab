"use client";

import { ProductGrid } from "@/components/product/ProductCard";
import { useCatalog } from "@/context/CatalogContext";
import type { CategorySlug } from "@/types/catalog";

export function CollectionCatalogue({ slug }: { slug: CategorySlug }) {
  const { products } = useCatalog();
  const items = products.filter((product) => product.category === slug);

  if (items.length === 0) {
    return (
      <p role="status" className="text-sm text-muted">
        This collection does not have pieces yet.
      </p>
    );
  }

  return <ProductGrid products={items} />;
}
