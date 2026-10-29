import { brand } from "@/data/site";
import type { HeroSlide } from "@/types/content";

/** Fixed homepage hero photograph (IMG_8419 — voluminous black body-wave wig). */
export const heroImage = "/IMG_8419.jpg";

/** Native pixel size of the current default hero file. */
export const heroNativeWidth = 844;
export const heroNativeHeight = 1024;

export function defaultHeroSlides(): HeroSlide[] {
  return [
    {
      id: "slide-order-now",
      headline: brand.headline,
      supporting: brand.supporting,
      buttonLabel: "ORDER NOW →",
      buttonHref: "/shop",
      enabled: true,
    },
    {
      id: "slide-shop-collection",
      headline: "Luxury That Speaks for Itself.",
      supporting:
        "Find your perfect look with beautiful wigs designed to make every moment unforgettable.",
      buttonLabel: "SHOP COLLECTION →",
      buttonHref: "/collections",
      enabled: true,
    },
  ];
}
