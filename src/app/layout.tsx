import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/context/Providers";
import { getSiteBundle } from "@/lib/public";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Amy’s Hairlab",
    template: "%s · Amy’s Hairlab",
  },
  description:
    "Let Your Hair Do the Talking. Luxury hair, wigs, closures, and frontals from Amy’s Hairlab in Calabar.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteBundle();
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Providers site={site}>
          <div className="sticky top-0 z-40">
            <AnnouncementBar
              message={site.settings.announcement}
              href={site.settings.announcementHref}
            />
            {site.promotion.bannerVisible && site.promotion.bannerText ? (
              <div className="bg-gold text-center text-warm-white">
                <Link href={site.promotion.bannerHref || "/shop"} className="block px-5 py-2 text-sm font-medium">
                  {site.promotion.bannerText}
                </Link>
              </div>
            ) : null}
            <Suspense fallback={<div className="h-[4.75rem] border-b border-line bg-ivory" />}>
              <Header />
            </Suspense>
          </div>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer settings={site.settings} collections={site.collections} />
        </Providers>
      </body>
    </html>
  );
}
