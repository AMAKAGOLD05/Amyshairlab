export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto w-full max-w-6xl px-5 pt-14 pb-8 sm:px-8">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-deep">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-none text-ink sm:text-6xl">
        {title}
      </h1>
      {children ? (
        <div className="mt-5 max-w-2xl text-base leading-7 text-cocoa">{children}</div>
      ) : null}
    </header>
  );
}
