import type { Metadata } from "next";
import { CustomWigForm } from "@/components/custom/CustomWigForm";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Custom Wig",
  description:
    "Request a custom wig from Amy’s Hairlab. This demonstration form stays in your browser and does not place a live order.",
};

export default function CustomWigPage() {
  return (
    <div className="pb-20">
      <PageIntro eyebrow="Custom" title="A wig made around you">
        <p>
          Tell us how the hair should move: the length at the back, the density at the
          crown, the colour, and the hairline. A live atelier would answer with a quote.
          Here, the note is kept locally so you can see the form work.
        </p>
      </PageIntro>
      <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
        <CustomWigForm />
      </div>
    </div>
  );
}
