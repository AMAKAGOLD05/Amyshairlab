"use client";

import Link from "next/link";
import { Price } from "@/components/ui/Price";
import { ProductImage } from "@/components/ui/ProductImage";
import { useWishlist } from "@/context/WishlistContext";
import { startingPrice } from "@/lib/catalog";
import type { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const saved = wishlist.has(product.id);
  const from = product.lengths.length > 1;

  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-500 hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={() => wishlist.toggle(product.id)}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center bg-paper/95 text-ink"
        >
          <Heart filled={saved} />
        </button>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-serif text-2xl leading-tight text-ink">
          <Link href={`/products/${product.slug}`} className="hover:text-gold-deep">
            {product.name}
          </Link>
        </h3>
        <Price className="mt-2" amount={startingPrice(product)} compareAt={product.compareAt} from={from} />
        <div className="mt-4">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex min-h-10 items-center text-[0.68rem] uppercase tracking-[0.16em] text-ink underline decoration-gold underline-offset-4"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-9.1C5 8 6.8 6.2 9 6.2c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.8 4 4.7C19 15.6 12 20 12 20z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
