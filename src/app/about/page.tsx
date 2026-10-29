import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Amy’s Hairlab is a Calabar house for luxury hair, personal style, and the private pleasure of a finish that feels like your own.",
};

export default function AboutPage() {
  return (
    <article className="pb-20">
      <header className="mx-auto grid w-full max-w-6xl items-end gap-10 px-5 pt-14 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-deep">About us</p>
          <h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">
            Let the hair speak before you do.
          </h1>
        </div>
        <p className="text-lg leading-8 text-cocoa">
          Amy’s Hairlab is for the woman who already knows the look. She wants the length
          to land in the right place, the wave to keep its promise, and the hairline to
          disappear so the face can do the rest.
        </p>
      </header>
      <div className="mx-auto mt-14 grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-3">
        <section>
          <h2 className="font-serif text-3xl">Beauty</h2>
          <p className="mt-3 text-sm leading-7 text-cocoa">
            We edit bone straight, body wave, deep wave, curl, and finished wigs. The aim
            is not more hair. It is hair that agrees with the face, the clothes, and the
            day.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl">Personal style</h2>
          <p className="mt-3 text-sm leading-7 text-cocoa">
            Some women want a quiet centre part. Some want a pixie that reads as a choice,
            not a compromise. Custom orders exist for the lengths and densities the ready
            edit does not cover.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl">The wearing</h2>
          <p className="mt-3 text-sm leading-7 text-cocoa">
            The best compliment is not “nice wig”. It is the moment you forget you are
            wearing anything extra. That is the standard this house is written toward.
          </p>
        </section>
      </div>
    </article>
  );
}
