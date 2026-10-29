"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageProps = {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  objectPosition?: string;
};

export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  objectPosition = "center center",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid h-full w-full place-items-center bg-sand text-cocoa ${className}`}
      >
        <span className="px-4 text-center font-serif text-3xl italic">Amy’s</span>
      </div>
    );
  }

  if (src.startsWith("/api/")) {
    return (
      // Uploaded files are served by the store and are not in the image optimizer allow-list.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        style={{ objectPosition }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
      style={{ objectPosition }}
      onError={() => setFailed(true)}
    />
  );
}
