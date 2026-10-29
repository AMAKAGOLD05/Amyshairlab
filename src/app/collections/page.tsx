import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ProductImage } from "@/components/ui/ProductImage";
import { getSiteBundle } from "@/lib/public";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Bone straight, body wave, deep wave, curly hair, wigs, closures and frontals, and hair bundles from Amy’s Hairlab.",
};

export default async function CollectionsPage() {
  const site = await getSiteBundle();
  return (
    <div className="pb-20">
      <PageIntro eyebrow="Collections" title="Textures, one house">
        <p>Choose a finish, then open the pieces that belong to it.</p>
      </PageIntro>
      <ul className="mx-auto grid w-full max-w-6xl gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {site.collections.map((collection) => (
          <li key={collection.id}>
            <Link href={`/collections/${collection.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <ProductImage
                  src={collection.image}
                  alt={collection.name}
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h2 className="mt-4 font-serif text-3xl">{collection.name}</h2>
              <p className="mt-2 text-sm leading-6 text-cocoa">{collection.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
