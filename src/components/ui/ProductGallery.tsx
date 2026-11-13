"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  url: string;
  is_primary: boolean;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(
    images.find((i) => i.is_primary)?.url ?? images[0]?.url ?? null
  );

  const hasMultiple = images.length > 1;

  return (
    <div>
      {/* Imagem principal */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-black">
        {selectedUrl ? (
          <Image
            src={selectedUrl}
            alt={name}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-24 w-24 text-brand-gray-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedUrl(img.url)}
              aria-label={`Ver foto ${i + 1} de ${name}`}
              className={`relative h-20 w-20 overflow-hidden rounded-md border-2 bg-brand-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ${
                selectedUrl === img.url
                  ? "border-brand-yellow"
                  : "border-brand-gray-mid hover:border-gray-500"
              }`}
            >
              <Image
                src={img.url}
                alt={`${name} foto ${i + 1}`}
                fill
                unoptimized
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
