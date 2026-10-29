"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";

export function Gallery({ name, images }: { name: string; images: string[] }) {
  const slides = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);
  const current = slides[active] ?? slides[0];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <ProductImage
          src={current}
          alt={`Placeholder photograph of ${name}`}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
      {slides.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {slides.map((image, index) => (
            <li key={`${image}-${index}`}>
              <button
                type="button"
                aria-label={`Show photograph ${index + 1} of ${name}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => setActive(index)}
                className={`relative block aspect-square w-full overflow-hidden bg-sand ${
                  index === active ? "outline outline-1 outline-offset-2 outline-ink" : ""
                }`}
              >
                <ProductImage
                  src={image}
                  alt=""
                  sizes="120px"
                  className={index === active ? "" : "opacity-80"}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 text-xs tracking-wide text-muted">
        Photography placeholder until Amy’s Hairlab images are added.
      </p>
    </div>
  );
}
