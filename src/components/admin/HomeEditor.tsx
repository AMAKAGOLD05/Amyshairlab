"use client";

import Link from "next/link";
import { useState } from "react";
import { useActionState } from "react";
import { saveHomeAction, type ActionState } from "@/lib/actions";
import { heroImage } from "@/data/hero";
import { btnPrimary, btnSecondary, fieldClass, labelClass } from "@/components/ui/styles";
import type { Product } from "@/types/catalog";
import type { HeroSlide, HomeContent, HomeSection, HomeSectionType, MediaItem } from "@/types/content";

const kinds: HomeSectionType[] = ["collections", "bestsellers", "featured", "arrivals", "banner", "story", "custom", "testimonials", "gallery", "newsletter"];

export function HomeEditor({ initial, products, media }: { initial: HomeContent; products: Product[]; media: MediaItem[] }) {
  const [content, setContent] = useState(initial);
  const [state, action, pending] = useActionState<ActionState, FormData>(saveHomeAction, {});
  const [libraryFor, setLibraryFor] = useState<"hero" | "mobile" | null>(null);

  function patchHero(partial: Partial<HomeContent["hero"]>) {
    setContent((current) => ({ ...current, hero: { ...current.hero, ...partial } }));
  }

  function submit(formData: FormData) {
    formData.set("content", JSON.stringify(content));
    return action(formData);
  }

  const slides = content.hero.slides ?? [];

  return (
    <form action={submit} className="space-y-10">
      {state.ok ? <p className="border border-line bg-paper px-4 py-3 text-sm" role="status">{state.ok}</p> : null}
      {state.error ? <p role="alert" className="text-sm">{state.error}</p> : null}
      <section className="space-y-4 border border-line bg-paper p-5">
        <h2 className="font-serif text-3xl">Announcement bar</h2>
        <label className={labelClass}>Text
          <input value={content.announcement} onChange={(event) => setContent({ ...content, announcement: event.target.value })} className={`${fieldClass} mt-2`} />
        </label>
        <label className={labelClass}>Destination
          <input value={content.announcementHref} onChange={(event) => setContent({ ...content, announcementHref: event.target.value })} className={`${fieldClass} mt-2`} />
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-4xl">Hero background</h2>
        <p className="text-sm leading-6 text-cocoa">
          One fixed photograph stays behind every text slide. Changing slides never changes this image.
        </p>
        <label className={labelClass}>Eyebrow
          <input value={content.hero.eyebrow} onChange={(event) => patchHero({ eyebrow: event.target.value })} className={`${fieldClass} mt-2`} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Text alignment
            <select value={content.hero.align} onChange={(event) => patchHero({ align: event.target.value === "center" ? "center" : "left" })} className={`${fieldClass} mt-2`}>
              <option value="left">Left</option>
              <option value="center">Center</option>
            </select>
          </label>
          <label className={labelClass}>Image position
            <select value={content.hero.imagePosition} onChange={(event) => patchHero({ imagePosition: event.target.value })} className={`${fieldClass} mt-2`}>
              <option value="center 18%">Face and hair (recommended)</option>
              <option value="center top">Top</option>
              <option value="center 12%">Upper</option>
              <option value="center center">Center</option>
              <option value="center 30%">Mid</option>
              <option value="center bottom">Bottom</option>
              <option value="left center">Left</option>
              <option value="right center">Right</option>
            </select>
          </label>
          <label className={labelClass}>Overlay colour
            <input type="color" value={content.hero.background || "#302410"} onChange={(event) => patchHero({ background: event.target.value })} className="mt-2 h-11 w-full" />
          </label>
          <label className={labelClass}>Text colour
            <input type="color" value={content.hero.textColor || "#FFFDF8"} onChange={(event) => patchHero({ textColor: event.target.value })} className="mt-2 h-11 w-full" />
          </label>
        </div>
        <button type="button" className="text-sm underline" onClick={() => patchHero({ background: "", textColor: "", align: "center", imagePosition: "center center" })}>Use the luxury defaults</button>
        <label className={labelClass}>Image description
          <input value={content.hero.imageAlt} onChange={(event) => patchHero({ imageAlt: event.target.value })} className={`${fieldClass} mt-2`} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <HeroImage
            label="Desktop image"
            name="heroImage"
            src={content.hero.imageId ? `/api/media/${content.hero.imageId}` : heroImage}
            onRemove={() => patchHero({ imageId: null })}
            onLibrary={() => setLibraryFor("hero")}
            isDefault={!content.hero.imageId}
          />
          <HeroImage
            label="Mobile image (optional)"
            name="heroMobile"
            src={content.hero.mobileImageId ? `/api/media/${content.hero.mobileImageId}` : ""}
            onRemove={() => patchHero({ mobileImageId: null })}
            onLibrary={() => setLibraryFor("mobile")}
          />
        </div>
        {libraryFor ? (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {media.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => { patchHero(libraryFor === "hero" ? { imageId: item.id } : { mobileImageId: item.id }); setLibraryFor(null); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/media/${item.id}`} alt={item.alt || item.filename} className="aspect-square w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-4xl">Hero Content Slider</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cocoa">
              Edit the headlines, descriptions, and buttons that rotate over the fixed background. Slides auto-change every 5 seconds on the live homepage.
            </p>
          </div>
          <button
            type="button"
            className={btnSecondary}
            onClick={() =>
              patchHero({
                slides: [
                  ...slides,
                  {
                    id: crypto.randomUUID(),
                    headline: "New slide headline",
                    supporting: "Add a short description for this slide.",
                    buttonLabel: "SHOP NOW →",
                    buttonHref: "/shop",
                    enabled: true,
                  },
                ],
              })
            }
          >
            Add slide
          </button>
        </div>
        {slides.map((slide, index) => (
          <article key={slide.id} className="space-y-3 border border-line bg-paper p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold-deep">Slide {index + 1}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <button type="button" onClick={() => moveSlide(index, -1)}>Up</button>
                <button type="button" onClick={() => moveSlide(index, 1)}>Down</button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Delete this hero slide?")) {
                      patchHero({ slides: slides.filter((item) => item.id !== slide.id) });
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={slide.enabled}
                onChange={(event) => updateSlide(slide.id, { enabled: event.target.checked })}
              />
              Show this slide
            </label>
            <label className={labelClass}>Headline
              <input
                value={slide.headline}
                onChange={(event) => updateSlide(slide.id, { headline: event.target.value })}
                className={`${fieldClass} mt-2`}
              />
            </label>
            <label className={labelClass}>Description
              <textarea
                value={slide.supporting}
                onChange={(event) => updateSlide(slide.id, { supporting: event.target.value })}
                className={`${fieldClass} mt-2 min-h-24`}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>Button text
                <input
                  value={slide.buttonLabel}
                  onChange={(event) => updateSlide(slide.id, { buttonLabel: event.target.value })}
                  className={`${fieldClass} mt-2`}
                />
              </label>
              <label className={labelClass}>Button destination
                <input
                  value={slide.buttonHref}
                  onChange={(event) => updateSlide(slide.id, { buttonHref: event.target.value })}
                  className={`${fieldClass} mt-2`}
                />
              </label>
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-4xl">Sections</h2>
          <label className="text-sm">Add
            <select className={`${fieldClass} ml-2`} defaultValue="" onChange={(event) => {
              const type = event.target.value as HomeSectionType;
              if (!type) return;
              setContent((current) => ({ ...current, sections: [...current.sections, blank(type)] }));
              event.target.value = "";
            }}>
              <option value="">Choose</option>
              {kinds.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
            </select>
          </label>
        </div>
        {content.sections.map((section, index) => (
          <article key={section.id} className="space-y-3 border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold-deep">{section.type}</p>
              <div className="flex gap-3 text-sm">
                <button type="button" onClick={() => move(index, -1)}>Up</button>
                <button type="button" onClick={() => move(index, 1)}>Down</button>
                <button type="button" onClick={() => { if (window.confirm("Remove this section from the homepage?")) setContent((current) => ({ ...current, sections: current.sections.filter((item) => item.id !== section.id) })); }}>Delete</button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={section.visible} onChange={(event) => updateSection(section.id, { visible: event.target.checked })} />
              Show this section
            </label>
            <input value={section.heading} aria-label="Heading" onChange={(event) => updateSection(section.id, { heading: event.target.value })} className={fieldClass} />
            <textarea value={section.supporting} aria-label="Supporting text" onChange={(event) => updateSection(section.id, { supporting: event.target.value })} className={`${fieldClass} min-h-24`} />
            {section.type === "featured" || section.type === "bestsellers" || section.type === "arrivals" ? (
              <select multiple value={section.productIds} aria-label="Products in this section" onChange={(event) => updateSection(section.id, { productIds: Array.from(event.target.selectedOptions).map((option) => option.value) })} className={`${fieldClass} min-h-36`}>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
            ) : null}
            {section.type === "banner" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={section.bannerHref} aria-label="Banner destination" onChange={(event) => updateSection(section.id, { bannerHref: event.target.value })} className={fieldClass} />
                <select value={section.bannerImageId ?? ""} aria-label="Banner image" onChange={(event) => updateSection(section.id, { bannerImageId: event.target.value || null })} className={fieldClass}>
                  <option value="">No image</option>
                  {media.map((item) => <option key={item.id} value={item.id}>{item.filename}</option>)}
                </select>
              </div>
            ) : null}
          </article>
        ))}
      </section>
      <div className="flex flex-wrap gap-3">
        <button type="submit" name="intent" value="draft" className={btnSecondary} disabled={pending}>Save Draft</button>
        <button type="submit" name="intent" value="preview" className={btnSecondary} disabled={pending}>Preview Changes</button>
        <button type="submit" name="intent" value="publish" className={btnPrimary} disabled={pending}>Publish Changes</button>
        <Link href="/" className="self-center text-sm underline" target="_blank">Open the live homepage</Link>
      </div>
    </form>
  );

  function updateSlide(id: string, partial: Partial<HeroSlide>) {
    patchHero({ slides: slides.map((slide) => (slide.id === id ? { ...slide, ...partial } : slide)) });
  }
  function moveSlide(index: number, direction: number) {
    const next = [...slides];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    patchHero({ slides: next });
  }
  function updateSection(id: string, partial: Partial<HomeSection>) {
    setContent((current) => ({ ...current, sections: current.sections.map((section) => section.id === id ? { ...section, ...partial } : section) }));
  }
  function move(index: number, direction: number) {
    setContent((current) => {
      const sections = [...current.sections];
      const target = index + direction;
      if (target < 0 || target >= sections.length) return current;
      const [item] = sections.splice(index, 1);
      sections.splice(target, 0, item);
      return { ...current, sections };
    });
  }
}

function blank(type: HomeSectionType): HomeSection {
  return { id: crypto.randomUUID(), type, heading: "New section", supporting: "", visible: true, productIds: [], bannerImageId: null, bannerAlt: "", bannerHref: "/shop" };
}

function HeroImage({
  label,
  name,
  src,
  onRemove,
  onLibrary,
  isDefault = false,
}: {
  label: string;
  name: string;
  src: string;
  onRemove: () => void;
  onLibrary: () => void;
  isDefault?: boolean;
}) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="mt-2 aspect-[16/10] w-full object-cover object-[center_30%]" />
      ) : (
        <p className="mt-2 text-sm text-muted">Upload a photograph or choose one from the Image Library.</p>
      )}
      {isDefault ? (
        <p className="mt-2 text-sm text-muted">Showing your uploaded default hero photograph (IMG_8419). Upload a new file to replace it.</p>
      ) : null}
      <input name={name} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-3 block w-full text-sm" />
      <div className="mt-2 flex gap-3 text-sm">
        <button type="button" onClick={onLibrary}>Library</button>
        {!isDefault ? <button type="button" onClick={onRemove}>Remove</button> : null}
      </div>
    </div>
  );
}
