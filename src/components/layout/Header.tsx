"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSite } from "@/context/CatalogContext";
import { useWishlist } from "@/context/WishlistContext";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchDialog } from "@/components/layout/SearchDialog";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { count, ready: cartReady, openDrawer } = useCart();
  const { count: saved, ready: wishlistReady } = useWishlist();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [searchPath, setSearchPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const searchOpen = searchPath === pathname;
  const { collections } = useSite();
  const bagCount = cartReady ? count : 0;
  const savedCount = wishlistReady ? saved : 0;

  return (
    <header className="border-b border-line bg-ivory text-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 sm:px-8">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center justify-self-start border border-gold text-ink lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
          onClick={() => setMenuPath(pathname)}
        >
          <MenuIcon />
        </button>
        <div className="col-start-2 justify-self-center lg:col-start-1 lg:justify-self-start">
          <Wordmark priority />
        </div>
        <nav className="hidden items-center justify-center gap-8 lg:flex" aria-label="Primary">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`text-[0.72rem] uppercase tracking-[0.2em] transition-colors hover:text-gold ${
                pathname === link.href ? "text-gold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="group relative">
            <Link
              href="/collections"
              className={`text-[0.72rem] uppercase tracking-[0.2em] transition-colors hover:text-gold ${
                pathname.startsWith("/collections") ? "text-gold" : ""
              }`}
              aria-current={pathname.startsWith("/collections") ? "page" : undefined}
              aria-haspopup="true"
            >
              Collections
            </Link>
            <div className="invisible absolute top-full left-1/2 z-20 w-64 -translate-x-1/2 pt-4 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <ul className="border border-line bg-paper py-3 shadow-sm">
                {collections.map((collection) => (
                    <li key={collection.id}>
                      <Link
                        href={`/collections/${collection.id}`}
                        className="block px-4 py-2 text-sm hover:bg-ivory hover:text-gold"
                      >
                        {collection.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </nav>
        <div className="col-start-3 flex items-center gap-4 justify-self-end lg:gap-5">
          <button
            type="button"
            onClick={() => setSearchPath(pathname)}
            className="text-[0.72rem] uppercase tracking-[0.16em] transition-colors hover:text-gold"
          >
            <span className="sr-only sm:not-sr-only">Search</span>
            <SearchIcon className="sm:hidden" />
          </button>
          <Link
            href="/wishlist"
            className="relative text-[0.72rem] uppercase tracking-[0.16em] transition-colors hover:text-gold"
            aria-label={`Wishlist, ${savedCount} saved`}
          >
            <span className="hidden lg:inline">Wishlist</span>
            <HeartIcon className="lg:hidden" />
            {savedCount > 0 ? (
              <span className="ml-1 text-gold">{savedCount}</span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            className="text-[0.72rem] uppercase tracking-[0.16em] transition-colors hover:text-gold"
            aria-label={`Shopping bag, ${bagCount} items`}
          >
            <span className="hidden lg:inline">Bag</span>
            <BagIcon className="lg:hidden" />
            <span aria-hidden="true"> {bagCount}</span>
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuPath(null)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchPath(null)} />
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-9.1C5 8 6.8 6.2 9 6.2c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.8 4 4.7C19 15.6 12 20 12 20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function BagIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
