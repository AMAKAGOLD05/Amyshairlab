import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import type { StoreSettings, Taxonomy } from "@/types/content";

export function Footer({
  settings,
  collections,
}: {
  settings: StoreSettings;
  collections: Taxonomy[];
}) {
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "TikTok", href: settings.tiktok },
    { label: "Pinterest", href: settings.pinterest },
    { label: "WhatsApp", href: settings.whatsapp },
  ].filter((item) => item.href);
  return (
    <footer className="mt-auto bg-espresso text-warm-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Wordmark tone="light" />
          <p className="mt-6 max-w-xs text-sm leading-6 text-warm-white/75">{settings.short}</p>
        </div>
        <div>
          <h2 className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">Shop</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-gold">
                Shop all
              </Link>
            </li>
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link href={`/collections/${collection.id}`} className="hover:text-gold">
                  {collection.shopName}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/custom-wig" className="hover:text-gold">
                Custom wig
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">The house</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-gold">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/policies/shipping" className="hover:text-gold">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/policies/returns" className="hover:text-gold">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy" className="hover:text-gold">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">Contact</h2>
          <address className="mt-4 space-y-2 text-sm not-italic leading-6 text-warm-white/75">
            <p>{settings.address}</p>
            <p>
              <a href={settings.phoneHref || undefined} className="hover:text-warm-white">
                {settings.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${settings.email}`} className="hover:text-warm-white">
                {settings.email}
              </a>
            </p>
            <p>{settings.hours}</p>
          </address>
          <ul className="mt-5 flex flex-wrap gap-4 text-sm">
            {socials.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-gold" target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-warm-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-warm-white/65 sm:flex-row sm:justify-between sm:px-8">
          <p>© 2026 Amy’s Hairlab. Demonstration store.</p>
          <p>All prices are sample prices in Nigerian naira.</p>
        </div>
      </div>
    </footer>
  );
}
