import Link from "next/link";
import { btnPrimary } from "@/components/ui/styles";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-deep">404</p>
      <h1 className="mt-3 font-serif text-5xl">This page is not in the collection.</h1>
      <p className="mt-4 text-sm leading-6 text-cocoa">
        The link may be mistyped, or the piece is no longer in the demonstration catalogue.
      </p>
      <Link href="/shop" className={`${btnPrimary} mt-8`}>
        Shop all
      </Link>
    </div>
  );
}
