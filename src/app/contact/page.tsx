import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageIntro } from "@/components/ui/PageIntro";
import { getSiteBundle } from "@/lib/public";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Amy’s Hairlab in Calabar. We deliver nationwide and internationally.",
};

export default async function ContactPage() {
  const { settings } = await getSiteBundle();
  return (
    <div className="pb-20">
      <PageIntro eyebrow="Contact" title="Write to the house">
        <p>
          Ask about a texture, a length, or a showroom visit. The details below are
          placeholders, and the form does not leave this device.
        </p>
      </PageIntro>
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <address className="not-italic">
          <h2 className="font-serif text-3xl">Studio</h2>
          <p className="mt-4 text-sm leading-7 text-cocoa">{settings.address}</p>
          <p className="mt-2 text-sm">
            <a href={settings.phoneHref}>{settings.phone}</a>
          </p>
          <p className="mt-2 text-sm">
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">{settings.hours}</p>
        </address>
        <ContactForm />
      </div>
    </div>
  );
}
