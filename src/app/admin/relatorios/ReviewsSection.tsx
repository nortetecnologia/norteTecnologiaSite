"use client";

import { useState, useMemo } from "react";

interface ReviewRow {
  id: string;
  product_name: string;
  product_slug: string;
  name: string | null;
  rating: number;
  message: string;
  created_at: string;
}

interface ReviewsSectionProps {
  reviews: ReviewRow[];
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} estrelas`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-[#ffd600]" : "text-[#3a3a3a]"} aria-hidden="true">★</span>
      ))}
    </span>
  );
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [filterProduct, setFilterProduct] = useState("");
  const [filterRating, setFilterRating] = useState("0");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "rating_desc" | "rating_asc">("date_desc");

  const productNames = useMemo(() => {
    const names = Array.from(new Set(reviews.map((r) => r.product_name))).sort();
    return names;
  }, [reviews]);

  const filtered = useMemo(() => {
    let list = reviews;
    if (filterProduct) list = list.filter((r) => r.product_name === filterProduct);
    if (filterRating !== "0") list = list.filter((r) => r.rating === parseInt(filterRating, 10));

    list = [...list].sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "date_asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "rating_desc") return b.rating - a.rating;
      if (sortBy === "rating_asc") return a.rating - b.rating;
      return 0;
    });
    return list;
  }, [reviews, filterProduct, filterRating, sortBy]);

  if (reviews.length === 0) {
    return (
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-2">Avaliações de Produtos</h2>
        <p className="text-[#6b7280] text-sm">Nenhuma avaliação recebida ainda.</p>
      </section>
    );
  }

  const avgGlobal = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 space-y-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-white font-semibold">Avaliações de Produtos</h2>
        <p className="text-[#6b7280] text-xs">
          {reviews.length} avaliação{reviews.length !== 1 ? "ões" : ""} · média global{" "}
          <span className="text-[#ffd600] font-medium">{avgGlobal.toFixed(1)} ★</span>
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffd600] transition-colors"
          aria-label="Filtrar por produto"
        >
          <option value="">Todos os produtos</option>
          {productNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffd600] transition-colors"
          aria-label="Filtrar por nota"
        >
          <option value="0">Todas as notas</option>
          {[5, 4, 3, 2, 1].map((s) => (
            <option key={s} value={s}>{s} ★</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffd600] transition-colors"
          aria-label="Ordenar"
        >
          <option value="date_desc">Mais recentes</option>
          <option value="date_asc">Mais antigas</option>
          <option value="rating_desc">Maior nota</option>
          <option value="rating_asc">Menor nota</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#6b7280] text-sm">Nenhuma avaliação encontrada com os filtros selecionados.</p>
      ) : (
        <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
          {filtered.map((r) => (
            <div key={r.id} className="border border-[#2a2a2a] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Stars rating={r.rating} />
                  <span className="text-sm font-medium text-white">{r.name ?? "Cliente anônimo"}</span>
                </div>
                <time dateTime={r.created_at} className="text-xs text-[#6b7280] shrink-0">
                  {new Date(r.created_at).toLocaleDateString("pt-BR")}
                </time>
              </div>
              <p className="text-xs text-[#ffd600] font-medium">{r.product_name}</p>
              <p className="text-sm text-[#9ca3af] leading-relaxed">{r.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
