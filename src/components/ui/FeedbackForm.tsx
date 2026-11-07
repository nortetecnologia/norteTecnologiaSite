"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitFeedback, type FeedbackSubmitResult } from "@/app/actions/submitFeedback";

export function FeedbackForm() {
  const [state, action, isPending] = useActionState<FeedbackSubmitResult | null, FormData>(
    submitFeedback,
    null
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-name" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
            Nome <span className="text-[#6b7280] font-normal">(opcional)</span>
          </label>
          <input
            id="fb-name"
            name="name"
            type="text"
            maxLength={80}
            placeholder="Seu nome"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="fb-email" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
            E-mail <span className="text-[#6b7280] font-normal">(opcional)</span>
          </label>
          <input
            id="fb-email"
            name="email"
            type="email"
            maxLength={120}
            placeholder="seu@email.com"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="fb-message" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
          Mensagem <span className="text-red-400">*</span>
        </label>
        <textarea
          id="fb-message"
          name="message"
          required
          rows={4}
          maxLength={2000}
          placeholder="Conte sua experiência, sugestão ou dúvida…"
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors resize-y min-h-[100px]"
        />
      </div>

      {/* LGPD consent */}
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="consent_given"
          required
          className="mt-0.5 w-4 h-4 accent-[#ffd600] cursor-pointer shrink-0"
        />
        <span className="text-xs text-[#9ca3af] leading-relaxed">
          Concordo que a Norte Tecnologia armazene e utilize meus dados (nome e e-mail, se fornecidos) para responder a este contato, conforme a{" "}
          <strong className="text-[#d1d5db]">Lei Geral de Proteção de Dados (LGPD)</strong>.
          Os dados não serão compartilhados com terceiros.
        </span>
      </label>

      {state?.error && (
        <div className="rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-green-900/20 border border-green-800/40 px-4 py-3 text-sm text-green-400">
          Feedback enviado com sucesso! Agradecemos seu contato.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-[#ffd600] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#e6c000] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Enviando…" : "Enviar Feedback"}
      </button>
    </form>
  );
}
