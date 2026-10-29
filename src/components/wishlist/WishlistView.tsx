"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductCard";
import { btnPrimary } from "@/components/ui/styles";
import { useCatalog } from "@/context/CatalogContext";
import { useWishlist } from "@/context/WishlistContext";

export function WishlistView() {
  const { ids, ready } = useWishlist();
  const { products } = useCatalog();

  const saved = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => product !== undefined);

  if (!ready) {
    return <p className="px-5 pb-20 text-sm text-muted">Opening your wishlist…</p>;
  }

  if (saved.length === 0) {
    return (
      <div className="px-5 pb-20 sm:px-8">
        <p className="max-w-md text-sm leading-6 text-cocoa">
          Nothing is saved yet. Use the heart on a piece to keep it here. The list stays
          in this browser.
        </p>
        <Link href="/shop" className={`${btnPrimary} mt-6`}>
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
      <ProductGrid products={saved} />
    </div>
  );
}
