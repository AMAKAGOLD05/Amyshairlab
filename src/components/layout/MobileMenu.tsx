"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSite } from "@/context/CatalogContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/custom-wig", label: "Custom wig" },
  { href: "/wishlist", label: "Wishlist" },
] as const;

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { collections } = useSite();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="drawer bg-ivory text-ink"
      id="mobile-menu"
      aria-label="Menu"
      onClose={onClose}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-5">
          <p className="font-serif text-2xl italic">Menu</p>
          <button type="button" onClick={onClose} className="text-sm uppercase tracking-[0.16em] text-gold-deep">
            Close
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={onClose} className="font-serif text-4xl hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            Collections
          </p>
          <ul className="mt-4 space-y-3">
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link
                  href={`/collections/${collection.id}`}
                  onClick={onClose}
                  className="text-base"
                >
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </dialog>
  );
}
