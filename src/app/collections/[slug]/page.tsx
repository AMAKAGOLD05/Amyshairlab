import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionCatalogue } from "@/components/shop/CollectionCatalogue";
import { ProductImage } from "@/components/ui/ProductImage";
import { getSiteBundle } from "@/lib/public";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteBundle();
  const collection = site.collections.find((item) => item.id === slug);
  if (!collection) return { title: "Collection" };
  return { title: collection.shopName, description: collection.description };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteBundle();
  const collection = site.collections.find((item) => item.id === slug);
  if (!collection) notFound();
  return (
    <article className="pb-20">
      <header className="mx-auto grid w-full max-w-6xl items-end gap-8 px-5 pt-12 sm:px-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-deep">Collection</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl">{collection.name}</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-cocoa">{collection.description}</p>
          <Link
            href={`/shop?category=${collection.id}`}
            className="mt-6 inline-block text-[0.72rem] uppercase tracking-[0.18em] underline decoration-gold underline-offset-4"
          >
            Filter this texture in the shop
          </Link>
        </div>
        <div className="relative aspect-[5/4] overflow-hidden bg-sand">
          <ProductImage src={collection.image} alt={collection.name} sizes="(min-width: 1024px) 40vw, 100vw" priority />
        </div>
      </header>
      <div className="mx-auto mt-14 w-full max-w-6xl px-5 sm:px-8">
        <CollectionCatalogue slug={collection.id} />
      </div>
    </article>
  );
}
