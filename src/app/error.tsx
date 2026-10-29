"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-serif text-5xl">Something went wrong.</h1>
      <p className="mt-4 text-sm leading-6 text-cocoa">
        The page could not be shown. Nothing was charged. This is a demonstration store.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex min-h-12 items-center justify-center bg-ink px-6 text-[0.72rem] uppercase tracking-[0.22em] text-ivory"
      >
        Try again
      </button>
    </div>
  );
}
