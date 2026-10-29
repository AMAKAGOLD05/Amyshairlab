import Link from "next/link";

export function AnnouncementBar({ message, href }: { message: string; href: string }) {
  if (!message) return null;
  return (
    <div className="bg-espresso text-warm-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-5 py-2.5 text-center sm:px-8">
        <Link href={href || "/shop"} className="text-[0.68rem] tracking-[0.14em] uppercase sm:tracking-[0.18em]">
          {message}
        </Link>
      </div>
    </div>
  );
}
