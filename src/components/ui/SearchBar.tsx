"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import type { SearchSuggestion } from "@/app/api/search-suggestions/route";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setValue(q);
    setSuggestions([]);
    setOpen(false);
  }, [searchParams]);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search-suggestions?q=${encodeURIComponent(q.trim())}`);
      const data: SearchSuggestion[] = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setValue(q);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 280);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = value.trim();
    if (q.length >= 1) {
      setOpen(false);
      router.push(`/busca?q=${encodeURIComponent(q)}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[activeIndex];
      if (selected) {
        setOpen(false);
        router.push(`/produto/${selected.slug}`);
      }
    }
  }

  // Close on click outside
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function formatPrice(price: number) {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div ref={containerRef} className="flex-1 relative">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos"
            aria-autocomplete="list"
            aria-expanded={open}
            autoComplete="off"
            className="w-full rounded-lg border border-brand-gray-mid bg-brand-gray-dark py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
          />
          <button
            type="submit"
            aria-label="Pesquisar"
            className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 hover:text-brand-yellow transition-colors"
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Dropdown de sugestões */}
      {open && suggestions.length > 0 && (
        <div
          role="listbox"
          aria-label="Sugestões de produtos"
          className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-brand-gray-mid bg-[#111111] shadow-2xl"
        >
          <ul className="divide-y divide-[#1f1f1f]">
            {suggestions.map((item, i) => (
              <li key={item.id} role="option" aria-selected={i === activeIndex}>
                <Link
                  href={`/produto/${item.slug}`}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                    i === activeIndex ? "bg-brand-gray-dark" : "hover:bg-[#1a1a1a]"
                  }`}
                >
                  {/* Imagem */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-[#2a2a2a] bg-brand-gray-dark">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-0.5"
                        sizes="48px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-5 w-5" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 1.5 1.5M21 3h-18v18h18V3z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.name}</p>
                    {item.categoryName && (
                      <p className="truncate text-xs text-gray-500">{item.categoryName}</p>
                    )}
                  </div>

                  {/* Preço */}
                  <span className="shrink-0 text-sm font-bold text-brand-yellow">
                    {formatPrice(item.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Rodapé — ver todos os resultados */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              const q = value.trim();
              if (q) router.push(`/busca?q=${encodeURIComponent(q)}`);
            }}
            className="flex w-full items-center justify-center gap-1.5 border-t border-[#1f1f1f] bg-[#0d0d0d] px-4 py-2.5 text-xs font-medium text-brand-yellow hover:bg-[#111111] transition-colors"
          >
            Ver todos os resultados para &ldquo;{value.trim()}&rdquo;
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
