"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useActionState } from "react";
import { saveProductAction, type ActionState } from "@/lib/actions";
import { btnPrimary, btnSecondary, fieldClass, labelClass } from "@/components/ui/styles";
import type { AdminProduct } from "@/lib/db";
import type { MediaItem, Taxonomy } from "@/types/content";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const ACCEPT_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

type DraftImage = {
  key: string;
  src: string;
  alt: string;
  mediaId: string | null;
  externalUrl: string | null;
  file?: File;
};

export function ProductFields({
  product,
  categories,
  collections,
  media,
}: {
  product: AdminProduct | null;
  categories: Taxonomy[];
  collections: Taxonomy[];
  media: MediaItem[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveProductAction, {});
  const [images, setImages] = useState<DraftImage[]>(
    product?.images.map((image) => ({
      key: image.id,
      src: image.src,
      alt: image.alt,
      mediaId: image.mediaId,
      externalUrl: image.mediaId ? null : image.src,
    })) ?? [],
  );
  const [uploadError, setUploadError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputId = useId();
  const dragDepth = useRef(0);

  function addFiles(list: FileList | File[] | null) {
    if (!list?.length) return;
    const next = [...images];
    let error = "";
    for (const file of Array.from(list)) {
      if (!ACCEPT_TYPES.has(file.type)) {
        error = "Use a JPG, PNG, WEBP, or GIF image.";
        continue;
      }
      if (file.size > MAX_BYTES) {
        error = "Each image must be 5 MB or smaller.";
        continue;
      }
      next.push({
        key: crypto.randomUUID(),
        src: URL.createObjectURL(file),
        alt: "",
        mediaId: null,
        externalUrl: null,
        file,
      });
    }
    setUploadError(error);
    setImages(next);
  }

  function submit(formData: FormData) {
    const order: { kind: "kept" | "new"; mediaId?: string | null; externalUrl?: string | null; alt: string; fileIndex?: number }[] = [];
    let fileIndex = 0;
    for (const image of images) {
      if (image.file) {
        formData.append("newFile", image.file);
        order.push({ kind: "new", alt: image.alt, fileIndex });
        fileIndex += 1;
      } else {
        order.push({ kind: "kept", mediaId: image.mediaId, externalUrl: image.externalUrl, alt: image.alt });
      }
    }
    formData.set("imageOrder", JSON.stringify(order));
    return action(formData);
  }

  return (
    <form action={submit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <input type="hidden" name="id" defaultValue={product?.id ?? ""} />
      <div className="space-y-4">
        <Field name="name" label="Product name" defaultValue={product?.name} required />
        <Field name="slug" label="Page address" defaultValue={product?.slug} placeholder="Filled from the name if left blank" />
        <Area name="description" label="Description" defaultValue={product?.description} required />
        <Area name="details" label="Details, one per line" defaultValue={product?.details.join("\n")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="price" label="Selling price (₦)" defaultValue={product ? String(product.price) : ""} required />
          <Field name="compareAt" label="Original price, if discounted (₦)" defaultValue={product?.compareAt ? String(product.compareAt) : ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select name="categoryId" label="Category" defaultValue={product?.categoryId ?? categories[0]?.id ?? ""} options={categories.map((item) => ({ value: item.id, label: item.name }))} />
          <Select name="collectionId" label="Collection" defaultValue={product?.collectionId ?? collections[0]?.id ?? ""} options={collections.map((item) => ({ value: item.id, label: item.name }))} />
        </div>
        <Field name="texture" label="Texture label" defaultValue={product?.texture} />
        <Field name="stock" label="Stock quantity" type="number" defaultValue={product ? String(product.stock) : "1"} required />
        <Area name="lengths" label="Lengths, one per line as 18&quot; 84000" defaultValue={product?.lengths.map((item) => `${item.label} ${item.price}`).join("\n")} />
        <Area name="variations" label="Variations, one per line as Colour: Natural, Honey" defaultValue={product?.variations.map((item) => `${item.label}: ${item.options.join(", ")}`).join("\n")} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Check name="available" label="Available to buy" defaultChecked={product?.available ?? true} />
          <Check name="featured" label="Featured" defaultChecked={product?.featured ?? false} />
          <Check name="bestseller" label="Bestseller" defaultChecked={product?.bestseller ?? false} />
          <Check name="isNew" label="New arrival" defaultChecked={product?.isNew ?? false} />
        </div>
        {state.error ? <p role="alert" className="text-sm">{state.error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={btnPrimary} disabled={pending}>{pending ? "Saving…" : "Save Product"}</button>
          <Link href="/admin/products" className={btnSecondary}>Cancel</Link>
        </div>
      </div>
      <div>
        <p className={labelClass}>Product images</p>
        <p className="mt-2 text-sm leading-6 text-muted">The first image is the main image. Upload from this computer or choose one from the library.</p>
        <label
          htmlFor={fileInputId}
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-10 text-center transition-colors ${
            dragging ? "border-ink bg-sand" : "border-line bg-paper hover:border-ink"
          }`}
          onDragEnter={(event) => {
            event.preventDefault();
            dragDepth.current += 1;
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (dragDepth.current === 0) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            dragDepth.current = 0;
            setDragging(false);
            addFiles(event.dataTransfer.files);
          }}
        >
          <span className="text-[0.68rem] uppercase tracking-[0.18em] text-cocoa">
            {dragging ? "Drop images here" : "Drop images here or browse"}
          </span>
          <span className="mt-3 text-sm text-muted">JPG, PNG, WEBP, or GIF · max 5 MB each</span>
          <span className={`${btnSecondary} pointer-events-none mt-5`}>Choose files</span>
          <input
            id={fileInputId}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
        {uploadError ? <p role="alert" className="mt-2 text-sm">{uploadError}</p> : null}
        <button type="button" className={`${btnSecondary} mt-4`} onClick={() => setLibraryOpen((open) => !open)}>
          {libraryOpen ? "Close library" : "Choose from library"}
        </button>
        {libraryOpen ? (
          <ul className="mt-4 grid grid-cols-3 gap-2">
            {media.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="block w-full border border-line"
                  onClick={() => setImages((current) => [...current, { key: crypto.randomUUID(), src: `/api/media/${item.id}`, alt: item.alt, mediaId: item.id, externalUrl: null }])}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/media/${item.id}`} alt={item.alt || item.filename} className="aspect-square w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="mt-4 space-y-3">
          {images.map((image, index) => (
            <li key={image.key} className="grid grid-cols-[4.5rem_1fr] gap-3 border border-line bg-paper p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt="" className="aspect-square w-full object-cover" />
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold-deep">{index === 0 ? "Main image" : `Image ${index + 1}`}</p>
                <label className="mt-2 block text-xs text-muted">
                  Alternative text
                  <input
                    value={image.alt}
                    onChange={(event) => setImages((current) => current.map((item) => item.key === image.key ? { ...item, alt: event.target.value } : item))}
                    className={`${fieldClass} mt-1`}
                  />
                </label>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <button type="button" disabled={index === 0} onClick={() => setImages((current) => move(current, index, -1))}>Move earlier</button>
                  <button type="button" disabled={index === images.length - 1} onClick={() => setImages((current) => move(current, index, 1))}>Move later</button>
                  <button type="button" onClick={() => setImages((current) => current.filter((item) => item.key !== image.key))}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}

function move<T>(list: T[], index: number, direction: number) {
  const next = [...list];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = props.name ?? label;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} {...props} className={fieldClass} />
    </div>
  );
}

function Area({ label, name, defaultValue, required }: { label: string; name: string; defaultValue?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>{label}</label>
      <textarea id={name} name={name} defaultValue={defaultValue} required={required} className={`${fieldClass} min-h-28`} />
    </div>
  );
}

function Select({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>{label}</label>
      <select id={name} name={name} defaultValue={defaultValue} className={fieldClass}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="accent-ink" />
      {label}
    </label>
  );
}
