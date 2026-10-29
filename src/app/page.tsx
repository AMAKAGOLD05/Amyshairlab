import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeSections";
import { getSiteBundle } from "@/lib/public";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteBundle();
  return {
    title: { absolute: `${site.settings.name} · ${site.home.hero.headline}` },
    description: site.home.hero.supporting,
  };
}

export default async function HomePage() {
  const site = await getSiteBundle();
  return <HomeView home={site.home} products={site.products} collections={site.collections} />;
}
