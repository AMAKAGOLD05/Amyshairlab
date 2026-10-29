import Image from "next/image";
import Link from "next/link";

export function Wordmark({
  tone = "dark",
  priority = false,
}: {
  tone?: "dark" | "light";
  priority?: boolean;
}) {
  const color = tone === "light" ? "text-warm-white" : "text-ink";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3 ${color}`}
      aria-label="Amy’s Hairlab, home"
    >
      <Image
        src="/logo.png"
        alt=""
        width={366}
        height={508}
        priority={priority}
        className="h-12 w-auto shrink-0 sm:h-14"
      />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.45rem] italic tracking-tight sm:text-[1.7rem]">Amy’s</span>
        <span className="mt-1 text-[0.58rem] uppercase tracking-[0.34em] sm:text-[0.62rem] sm:tracking-[0.42em]">
          Hairlab
        </span>
      </span>
    </Link>
  );
}
