import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { relatedProducts } from "@/lib/catalog";
import { getSiteBundle } from "@/lib/public";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteBundle();
  const product = site.products.find((item) => item.slug === slug);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteBundle();
  const product = site.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const collection = site.collections.find((item) => item.id === product.category);
  return (
    <ProductDetail
      product={product}
      related={relatedProducts(product, site.products)}
      collectionName={collection?.name ?? product.texture}
    />
  );
}
