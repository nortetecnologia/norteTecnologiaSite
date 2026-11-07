"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export interface PromoItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  discount_percent: number | null;
  cover_image_url: string | null;
}

interface Props {
  promotions: PromoItem[];
}

export function PromoBanner({ promotions }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const count = promotions.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [count, paused, next]);

  if (count === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-[#0a0a0a] select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 50) next();
        else if (diff < -50) prev();
      }}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {promotions.map((promo, i) => (
          <Link
            key={promo.id}
            href={`/promocao/${promo.slug}`}
            className="relative block w-full shrink-0 overflow-hidden"
            tabIndex={i === current ? 0 : -1}
            aria-hidden={i !== current}
          >
            {promo.cover_image_url ? (
              <Image
                src={promo.cover_image_url}
                alt={promo.title}
                width={1920}
                height={640}
                className="block w-full object-cover aspect-[2/1] sm:aspect-auto sm:object-contain"
                unoptimized
                priority={i === 0}
                sizes="100vw"
              />
            ) : (
              <div className="h-[180px] bg-gradient-to-br from-[#1c1c1c] via-[#111] to-[#0a0a0a] sm:h-[260px] lg:h-[380px]" />
            )}

            {/* Gradiente esquerda → direita */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            {/* Gradiente baixo → cima */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Conteúdo */}
            <div className="absolute bottom-0 left-0 max-w-2xl px-5 pb-5 sm:px-8 sm:pb-7 lg:px-12 lg:pb-10">
              {promo.discount_percent && (
                <span className="mb-2 inline-block rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white sm:text-sm">
                  -{promo.discount_percent}% OFF
                </span>
              )}
              <h2 className="line-clamp-2 text-lg font-extrabold leading-tight text-white sm:text-2xl lg:text-4xl">
                {promo.title}
              </h2>
              {promo.subtitle && (
                <p className="mt-1 line-clamp-1 text-xs text-gray-300 sm:text-sm lg:text-base">
                  {promo.subtitle}
                </p>
              )}
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#ffd600] px-3 py-1.5 text-xs font-bold text-black sm:px-4 sm:py-2 sm:text-sm">
                Ver promoção →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {count > 1 && (
        <>
          {/* Seta esquerda */}
          <button
            type="button"
            onClick={prev}
            aria-label="Promoção anterior"
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80 sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Seta direita */}
          <button
            type="button"
            onClick={next}
            aria-label="Próxima promoção"
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80 sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Dots */}
          <div
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5"
            role="tablist"
            aria-label="Navegar entre promoções"
          >
            {promotions.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Promoção ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-[#ffd600]"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
