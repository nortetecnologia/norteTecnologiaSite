"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitReview, type ReviewSubmitResult } from "@/app/actions/submitReview";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [state, action, isPending] = useActionState<ReviewSubmitResult | null, FormData>(
    submitReview,
    null
  );
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setRating(0);
      setHovered(0);
    }
  }, [state]);

  const displayRating = hovered || rating;

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      {/* Estrelas */}
      <div>
        <label className="block text-sm font-medium text-[#d1d5db] mb-2">
          Avaliação <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-1" role="group" aria-label="Avaliação em estrelas">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
              className="text-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ffd600] focus:ring-offset-1 focus:ring-offset-transparent rounded"
            >
              <span className={displayRating >= star ? "text-[#ffd600]" : "text-[#3a3a3a]"}>
                ★
              </span>
            </button>
          ))}
        </div>
        {rating === 0 && state && !state.success && (
          <p className="text-xs text-[#6b7280] mt-1">Clique em uma estrela para avaliar.</p>
        )}
      </div>

      {/* Nome (opcional) */}
      <div>
        <label htmlFor="rv-name" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
          Nome <span className="text-[#6b7280] font-normal">(opcional)</span>
        </label>
        <input
          id="rv-name"
          name="name"
          type="text"
          maxLength={80}
          placeholder="Seu nome"
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
        />
      </div>

      {/* Comentário */}
      <div>
        <label htmlFor="rv-message" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
          Comentário <span className="text-red-400">*</span>
        </label>
        <textarea
          id="rv-message"
          name="message"
          required
          rows={4}
          maxLength={2000}
          placeholder="Conte sua experiência com este produto…"
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors resize-y min-h-[100px]"
        />
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-green-900/20 border border-green-800/40 px-4 py-3 text-sm text-green-400">
          Avaliação enviada! Obrigado pelo seu comentário.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-[#ffd600] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#e6c000] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Enviando…" : "Enviar Avaliação"}
      </button>
    </form>
  );
}
