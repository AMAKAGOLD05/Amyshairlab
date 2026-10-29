"use client";

import Link from "next/link";
import { Gallery } from "@/components/product/Gallery";
import { ProductGrid } from "@/components/product/ProductCard";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import type { Product } from "@/types/catalog";

export function ProductDetail({
  product,
  related,
  collectionName,
}: {
  product: Product;
  related: Product[];
  collectionName: string;
}) {

  return (
    <article className="pb-20">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2">
        <Gallery name={product.name} images={product.images} />
        <div>
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.16em] text-muted">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/shop" className="hover:text-ink">
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/collections/${product.category}`} className="hover:text-ink">
                  {collectionName}
                </Link>
              </li>
            </ol>
          </nav>
          <p className="mt-5 text-[0.68rem] uppercase tracking-[0.22em] text-gold-deep">
            {product.texture}
          </p>
          <h1 className="mt-2 font-serif text-5xl leading-none">{product.name}</h1>
          <p className="mt-5 text-base leading-7 text-cocoa">{product.description}</p>
          <PurchasePanel key={product.id} product={product} />
          <h2 className="mt-10 text-[0.68rem] uppercase tracking-[0.18em] text-cocoa">
            Details
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-cocoa">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Stock status: {product.stock > 0 ? `${product.stock} in the sample stock list` : "Sold out"}.
          </p>
        </div>
      </div>
      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <h2 className="font-serif text-4xl">Related pieces</h2>
        <div className="mt-8">
          <ProductGrid products={related} />
        </div>
      </section>
    </article>
  );
}
