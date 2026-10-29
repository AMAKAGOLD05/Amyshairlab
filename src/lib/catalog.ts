import type { CartLine, CategorySlug, Product } from "@/types/catalog";
import type { Taxonomy } from "@/types/content";

export function productsInCategory(slug: CategorySlug, list: Product[]) {
  return list.filter((product) => product.category === slug);
}

export function relatedProducts(product: Product, list: Product[], limit = 4) {
  const same = list.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  const rest = list.filter(
    (item) => item.category !== product.category && item.id !== product.id,
  );
  return [...same, ...rest].slice(0, limit);
}

export function startingPrice(product: Product) {
  if (product.lengths.length === 0) return product.price;
  return Math.min(...product.lengths.map((length) => length.price));
}

export function needsConfiguration(product: Product) {
  return (
    product.lengths.length > 1 ||
    product.variations.some((group) => group.options.length > 1)
  );
}

export function unitPrice(product: Product, length: string | null) {
  if (!length) return product.price;
  return product.lengths.find((option) => option.label === length)?.price ?? product.price;
}

export function defaultVariations(product: Product) {
  return product.variations
    .filter((group) => group.options.length === 1)
    .map((group) => ({ label: group.label, value: group.options[0] }));
}

export function searchProducts(query: string, list: Product[], collections: Taxonomy[] = []) {
  const needle = query.trim().toLowerCase();
  if (!needle) return list;
  return list.filter((product) => {
    const category = collections.find((item) => item.id === product.category);
    const haystack = [
      product.name,
      product.texture,
      product.description,
      category?.name ?? "",
      category?.shopName ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export function sortProducts(list: Product[], sort: SortKey) {
  const copy = [...list];
  if (sort === "price-asc") {
    copy.sort((a, b) => startingPrice(a) - startingPrice(b));
  } else if (sort === "price-desc") {
    copy.sort((a, b) => startingPrice(b) - startingPrice(a));
  } else if (sort === "newest") {
    copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } else {
    copy.sort(
      (a, b) =>
        Number(b.bestseller) - Number(a.bestseller) ||
        b.createdAt.localeCompare(a.createdAt),
    );
  }
  return copy;
}

export function isSortKey(value: string | null): value is SortKey {
  return (
    value === "featured" ||
    value === "price-asc" ||
    value === "price-desc" ||
    value === "newest"
  );
}

export function lineAvailability(line: CartLine, list: Product[]) {
  const product = list.find((item) => item.id === line.productId);
  if (!product) {
    return {
      ok: false as const,
      remaining: 0,
      message: "This piece is no longer in the catalogue.",
    };
  }
  if (product.stock <= 0) {
    return { ok: false as const, remaining: 0, message: "Sold out." };
  }
  if (line.quantity > product.stock) {
    return {
      ok: false as const,
      remaining: product.stock,
      message: `Only ${product.stock} available.`,
    };
  }
  return { ok: true as const, remaining: product.stock, message: "In stock" };
}
