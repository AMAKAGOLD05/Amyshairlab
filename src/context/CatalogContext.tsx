"use client";

import { createContext, useContext, useMemo } from "react";
import type { Product } from "@/types/catalog";
import type { HomeContent, Promotion, StoreSettings, Taxonomy } from "@/types/content";

export type SiteBundle = {
  products: Product[];
  collections: Taxonomy[];
  categories: Taxonomy[];
  settings: StoreSettings;
  home: HomeContent;
  promotion: Promotion;
};

type CatalogContextValue = SiteBundle & { ready: true };

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({
  site,
  children,
}: {
  site: SiteBundle;
  children: React.ReactNode;
}) {
  const value = useMemo<CatalogContextValue>(() => ({ ...site, ready: true }), [site]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used within CatalogProvider");
  return context;
}

export function useSite() {
  return useCatalog();
}
