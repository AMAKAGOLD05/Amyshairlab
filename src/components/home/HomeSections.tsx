import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { btnSecondary } from "@/components/ui/styles";
import { HeroSlider } from "@/components/home/HeroSlider";
import { defaultHeroSlides, heroImage } from "@/data/hero";
import type { Product } from "@/types/catalog";
import type { HeroSlide, HomeContent, HomeSection, Taxonomy } from "@/types/content";

export { heroImage };

export function Hero({
  hero,
}: {
  hero?: {
    eyebrow: string;
    headline: string;
    supporting: string;
    align: "left" | "center";
    background: string;
    textColor: string;
    image: string;
    mobile: string;
    imageAlt: string;
    imagePosition: string;
    slides: HeroSlide[];
  };
}) {
  const content = hero ?? {
    eyebrow: "Calabar · Luxury hair",
    headline: "Let Your Hair Do the Talking.",
    supporting:
      "Discover luxury wigs crafted to elevate your beauty, express your style, and give you the confidence to stand out.",
    align: "center" as const,
    background: "",
    textColor: "",
    image: heroImage,
    mobile: "",
    imageAlt:
      "Model wearing a long voluminous black body-wave wig with a gold top, photographed for Amy’s Hairlab.",
    imagePosition: "center center",
    slides: defaultHeroSlides(),
  };
  const overlay = content.background || "#302410";
  const slides =
    content.slides?.length > 0
      ? content.slides
      : [
          {
            id: "slide-fallback",
            headline: content.headline,
            supporting: content.supporting,
            buttonLabel: "ORDER NOW →",
            buttonHref: "/shop",
            enabled: true,
          },
        ];
  const photo = content.image || heroImage;
  const mobilePhoto = content.mobile || photo;
  // Full-bleed cover framing — keep the subject centered; ignore legacy crop offsets.
  const position =
    !content.imagePosition || /18%|30%/.test(content.imagePosition)
      ? "center center"
      : content.imagePosition;

  return (
    <section
      className="relative isolate w-full max-w-none overflow-x-clip overflow-y-hidden"
      aria-label={content.imageAlt}
    >
      {/*
        One continuous full-bleed photograph (cover / center / no-repeat).
        No image grid, no letterboxed panels, no repeated tiles.
      */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full ${content.mobile ? "max-sm:hidden" : ""}`}
        style={{
          backgroundImage: `url("${photo}")`,
          backgroundPosition: position,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />
      {content.mobile ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full sm:hidden"
          style={{
            backgroundImage: `url("${mobilePhoto}")`,
            backgroundPosition: position,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
      ) : null}
      {/* Light readability wash only — not a substitute for a broken layout. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: overlay, opacity: 0.2 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso/30 via-transparent to-espresso/50"
      />
      <div
        className={`relative z-[1] mx-auto flex min-h-[min(58svh,28rem)] w-full max-w-6xl items-center px-5 py-12 sm:min-h-[min(52svh,30rem)] sm:px-8 sm:py-14 lg:min-h-[min(48svh,32rem)] lg:py-16 ${
          content.align === "left" ? "justify-start" : "justify-center"
        }`}
      >
        <HeroSlider
          slides={slides}
          eyebrow={content.eyebrow}
          align={content.align}
          textColor={content.textColor}
        />
      </div>
    </section>
  );
}

export function CollectionGrid({
  collections = [],
  heading = "Shop by collection",
  supporting = "Textures chosen for movement, finish, and the way the hair sits.",
}: {
  collections?: Taxonomy[];
  heading?: string;
  supporting?: string;
}) {
  const featured = collections.filter((collection) => collection.showOnHome);
  return (
    <section id="collections" className="bg-ivory">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span aria-hidden="true" className="mb-5 block h-0.5 w-12 bg-gold" />
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-deep">Textures</p>
          <h2 className="mt-3 font-serif text-5xl text-ink">{heading}</h2>
          {supporting ? <p className="mt-3 max-w-xl text-sm leading-6 text-cocoa">{supporting}</p> : null}
        </div>
        <Link href="/shop" className="text-[0.72rem] uppercase tracking-[0.18em] underline decoration-gold underline-offset-4">
          Shop all
        </Link>
      </div>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((collection) => (
          <li key={collection.id}>
            <Link href={`/collections/${collection.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <ProductImage
                  src={collection.image}
                  alt={collection.name}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                  className="transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 font-serif text-3xl text-ink">{collection.name}</h3>
              <p className="mt-1 text-sm text-muted">{collection.description}</p>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}

function chosen(products: Product[], section: HomeSection | undefined, flag: (product: Product) => boolean) {
  if (section?.productIds.length) {
    return section.productIds
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product));
  }
  return products.filter(flag);
}

export function NewArrivals({
  products = [],
  section,
}: {
  products?: Product[];
  section?: HomeSection;
}) {
  const list = chosen(products, section, (product) => product.isNew).sort((a, b) =>
    section?.productIds.length ? 0 : b.createdAt.localeCompare(a.createdAt),
  );
  const [lead, ...rest] = list;
  if (!lead) return null;

  return (
    <section className="bg-ivory">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
      <span aria-hidden="true" className="mb-5 block h-0.5 w-12 bg-gold" />
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-deep">Just in</p>
      <h2 className="mt-3 font-serif text-5xl text-ink">{section?.heading || "New arrivals"}</h2>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <article>
          <Link href={`/products/${lead.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand">
              <ProductImage
                src={lead.images[0]}
                alt={`Placeholder photograph for ${lead.name}`}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <h3 className="mt-4 font-serif text-4xl">{lead.name}</h3>
          </Link>
          <p className="mt-2 max-w-md text-sm leading-6 text-cocoa">{lead.description}</p>
          <Link
            href={`/products/${lead.slug}#purchase`}
            className={`${btnSecondary} mt-5`}
          >
            Shop this arrival
          </Link>
        </article>
        <ul className="divide-y divide-line border-y border-line">
          {rest.slice(0, 4).map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.slug}`} className="grid grid-cols-[5.5rem_1fr] items-center gap-4 py-4">
                <span className="relative block aspect-square bg-sand">
                  <ProductImage
                    src={product.images[0]}
                    alt=""
                    sizes="90px"
                  />
                </span>
                <span>
                  <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-gold-deep">
                    {product.texture}
                  </span>
                  <span className="mt-1 block font-serif text-2xl">{product.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}

function Featured({ products, section }: { products: Product[]; section: HomeSection }) {
  const list = chosen(products, section, (product) => Boolean(product.featured)).slice(0, 6);
  if (list.length === 0) return null;
  return (
    <section className="bg-ivory">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <span aria-hidden="true" className="mb-5 block h-0.5 w-12 bg-gold" />
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-deep">The edit</p>
        <h2 className="mt-3 font-serif text-5xl text-ink">{section.heading || "Featured"}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-cocoa">{section.supporting}</p>
        <div className="mt-10">
          <ProductGrid products={list} />
        </div>
      </div>
    </section>
  );
}

function PromoBanner({ section }: { section: HomeSection & { banner: string } }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <Link href={section.bannerHref || "/shop"} className="group block border border-line bg-paper">
        {section.banner ? (
          <div className="relative aspect-[16/7] overflow-hidden bg-sand">
            <ProductImage src={section.banner} alt={section.bannerAlt || section.heading} sizes="100vw" className="transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>
        ) : null}
        <div className="px-6 py-8">
          <h2 className="font-serif text-4xl">{section.heading}</h2>
          {section.supporting ? <p className="mt-3 max-w-xl text-sm leading-6 text-cocoa">{section.supporting}</p> : null}
        </div>
      </Link>
    </section>
  );
}

export function HomeView({
  home,
  products,
  collections,
}: {
  home: HomeContent;
  products: Product[];
  collections: Taxonomy[];
}) {
  const hero = {
    ...home.hero,
    image: home.hero.imageId ? `/api/media/${home.hero.imageId}` : heroImage,
    mobile: home.hero.mobileImageId ? `/api/media/${home.hero.mobileImageId}` : "",
    slides: home.hero.slides ?? [],
  };
  return (
    <>
      <Hero hero={hero} />
      {home.sections.filter((section) => section.visible).map((section) => {
        const banner = section.bannerImageId ? `/api/media/${section.bannerImageId}` : "";
        if (section.type === "collections") {
          return <CollectionGrid key={section.id} collections={collections} heading={section.heading} supporting={section.supporting} />;
        }
        if (section.type === "featured") return <Featured key={section.id} products={products} section={section} />;
        if (section.type === "arrivals") return <NewArrivals key={section.id} products={products} section={section} />;
        if (section.type === "banner") return <PromoBanner key={section.id} section={{ ...section, banner }} />;
        return null;
      })}
    </>
  );
}
