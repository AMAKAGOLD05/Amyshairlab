"use client";

import { CartProvider } from "@/context/CartContext";
import { CatalogProvider, type SiteBundle } from "@/context/CatalogContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartDrawer } from "@/components/layout/CartDrawer";

export function Providers({
  site,
  children,
}: {
  site: SiteBundle;
  children: React.ReactNode;
}) {
  return (
    <CatalogProvider site={site}>
      <CartProvider>
        <WishlistProvider>
          {children}
          <CartDrawer />
        </WishlistProvider>
      </CartProvider>
    </CatalogProvider>
  );
}
