"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/homepage", label: "Homepage Editor" },
  { href: "/admin/library", label: "Image Library" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/promotions", label: "Promotions" },
  { href: "/admin/settings", label: "Store Settings" },
];

export function AdminFrame({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-line bg-paper lg:border-r lg:border-b-0">
        <div className="px-5 py-6">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold-deep">Amy’s Hairlab</p>
          <p className="mt-2 font-serif text-3xl">Atelier</p>
          <p className="mt-2 text-xs text-muted">{email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:px-3" aria-label="Atelier">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block shrink-0 px-3 py-2 text-sm ${active ? "bg-ink text-ivory" : "hover:bg-ivory"}`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <form action={logoutAction}>
            <button type="submit" className="block w-full px-3 py-2 text-left text-sm hover:bg-ivory">
              Logout
            </button>
          </form>
        </nav>
      </aside>
      <div className="px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}

export function AdminHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <h1 className="font-serif text-5xl">{title}</h1>
      {children}
    </div>
  );
}
