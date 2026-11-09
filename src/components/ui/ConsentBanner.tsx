"use client";

import Link from "next/link";
import { useConsent } from "@/contexts/ConsentContext";

export function ConsentBanner() {
  const { state, accept, deny } = useConsent();

  if (state !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Aviso de privacidade e coleta de dados"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2a2a2a] bg-[#111111]/95 backdrop-blur-sm px-4 py-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-sm text-[#9ca3af] leading-relaxed">
          Usamos dados de navegação (cliques e pesquisas) para entender quais produtos são mais
          buscados e melhorar a loja.{" "}
          <strong className="text-white">Nenhum dado pessoal é coletado.</strong>{" "}
          Você pode recusar e nada será registrado. Veja nossa{" "}
          <Link href="/privacidade" className="text-[#ffd600] hover:underline underline-offset-2">
            Política de Privacidade
          </Link>
          .
        </p>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={deny}
            className="rounded-lg border border-[#3a3a3a] bg-transparent px-4 py-2 text-sm font-medium text-[#9ca3af] transition-colors hover:border-[#4b5563] hover:text-white"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-[#ffd600] px-4 py-2 text-sm font-bold text-[#0a0a0a] transition-colors hover:bg-[#e6c000]"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
