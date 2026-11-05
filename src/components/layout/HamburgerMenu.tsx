"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

interface HamburgerMenuProps {
  categories: Category[];
}

export function HamburgerMenu({ categories }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Necessário para createPortal funcionar no SSR do Next.js
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const drawerContent = (
    <>
      {/* Overlay — fora do header, sem interferência de stacking context */}
      <div
        className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        id="categories-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de categorias"
        className={`fixed inset-y-0 left-0 z-[201] flex w-72 flex-col bg-brand-black border-r border-brand-gray-mid shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-brand-gray-mid px-5">
          <span className="text-base font-bold text-white">
            Norte <span className="text-brand-yellow">Tecnologia</span>
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-brand-gray-mid transition-colors"
            aria-label="Fechar menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category list */}
        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="Categorias">
          <p className="px-5 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Categorias
          </p>

          {categories.length === 0 ? (
            <div className="mx-4 mt-2 rounded-lg border border-dashed border-brand-gray-light px-4 py-6 text-center">
              <p className="text-sm text-gray-500">Nenhuma categoria cadastrada.</p>
            </div>
          ) : (
            <ul className="px-2 pb-2">
              {categories.map((cat) => {
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                const isExpanded = expanded.has(cat.id);

                return (
                  <li key={cat.id}>
                    <div className="flex items-center rounded-lg transition-colors hover:bg-brand-gray-dark group">
                      <Link
                        href={`/categoria/${cat.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex flex-1 items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 group-hover:text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 shrink-0 text-brand-yellow" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                        </svg>
                        {cat.name}
                      </Link>

                      {hasSubs && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(cat.id)}
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-gray-500 hover:text-brand-yellow transition-colors mr-1"
                          aria-label={isExpanded ? "Recolher subcategorias" : "Expandir subcategorias"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {hasSubs && isExpanded && (
                      <ul className="ml-7 mb-1 border-l border-brand-gray-mid pl-3">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/categoria/${cat.slug}/${sub.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-gray-400 transition-colors hover:bg-brand-gray-dark hover:text-white"
                            >
                              <span className="h-1 w-1 shrink-0 rounded-full bg-brand-gray-light" aria-hidden="true" />
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-auto border-t border-brand-gray-mid px-4 py-4">
            <Link
              href="/categoria"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-brand-yellow hover:underline"
            >
              Ver todas as categorias
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* Botão hamburguer — fica no header normalmente */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-brand-gray-mid text-gray-300 hover:border-brand-yellow hover:text-brand-yellow transition-colors"
        aria-label="Abrir menu de categorias"
        aria-expanded={isOpen}
        aria-controls="categories-drawer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Portal: overlay + drawer fora do stacking context do header */}
      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
