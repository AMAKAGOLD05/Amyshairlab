import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/PageIntro";
import { policies, type PolicySlug } from "@/data/site";

export const instant = false;

const slugs = Object.keys(policies) as PolicySlug[];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isPolicy(slug)) return { title: "Policy" };
  return {
    title: policies[slug].title,
    description: policies[slug].paragraphs[0],
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isPolicy(slug)) notFound();
  const policy = policies[slug];

  return (
    <article className="pb-20">
      <PageIntro eyebrow="Policy" title={policy.title}>
        {slug === "returns" ? (
          <p>How returns, exchanges, and damaged deliveries are handled at Amy’s Hairlab.</p>
        ) : slug === "shipping" ? (
          <p>How Amy’s Hairlab packs, dispatches, and delivers orders nationwide and internationally.</p>
        ) : slug === "privacy" ? (
          <p>How Amy’s Hairlab collects, uses, and protects your personal information.</p>
        ) : (
          <p>House policies for Amy’s Hairlab.</p>
        )}
      </PageIntro>
      <div className="mx-auto w-full max-w-3xl space-y-4 px-5 text-base leading-7 text-cocoa sm:px-8">
        {policy.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

function isPolicy(slug: string): slug is PolicySlug {
  return slugs.includes(slug as PolicySlug);
}
