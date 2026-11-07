"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitFeedback, type FeedbackSubmitResult } from "@/app/actions/submitFeedback";

interface FeedbackFormProps {
  contactEmail?: string | null;
}

export function FeedbackForm({ contactEmail }: FeedbackFormProps = {}) {
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

      {/* LGPD — aviso de coleta de dados */}
      <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-xs text-[#9ca3af] leading-relaxed space-y-1.5">
        <p className="font-medium text-[#d1d5db]">Aviso de coleta de dados pessoais (LGPD)</p>
        <p>
          Ao enviar este formulário, a <strong className="text-[#d1d5db]">Norte Tecnologia</strong> coletará
          os dados informados (nome e e-mail, se fornecidos, e a mensagem) com a finalidade exclusiva de
          responder ao seu contato. O tratamento tem como base legal o seu <strong className="text-[#d1d5db]">consentimento</strong> (Art.&nbsp;7,&nbsp;I&nbsp;da&nbsp;LGPD).
        </p>
        <p>
          Os dados serão armazenados por até <strong className="text-[#d1d5db]">2 anos</strong> e não serão
          compartilhados com terceiros.
        </p>
        <p>
          Você tem direito a acessar, corrigir, solicitar a exclusão ou a portabilidade dos seus dados,
          bem como revogar este consentimento a qualquer momento, sem prejuízo ao tratamento já realizado.
          {contactEmail ? (
            <> Para exercer seus direitos, entre em contato pelo e-mail{" "}
              <strong className="text-[#ffd600]">{contactEmail}</strong>.
            </>
          ) : (
            <> Para exercer seus direitos, entre em contato diretamente com a Norte Tecnologia.</>
          )}
        </p>
      </div>

      {/* Checkbox de consentimento */}
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="consent_given"
          required
          className="mt-0.5 w-4 h-4 accent-[#ffd600] cursor-pointer shrink-0"
        />
        <span className="text-xs text-[#9ca3af] leading-relaxed">
          Li e concordo com o aviso acima e autorizo o tratamento dos meus dados pessoais conforme descrito.
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
