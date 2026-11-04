"use client";

import { useActionState, useState } from "react";
import { saveStoreSettings, type SettingsActionState } from "./actions";
import type { StoreSettingsData } from "@/lib/store-settings";
import { DEFAULT_PAYMENT_METHODS } from "@/lib/payment-methods";
import { BusinessHoursEditor } from "./BusinessHoursEditor";

interface Props {
  initialData: StoreSettingsData;
}

export function ConfiguracoesForm({ initialData }: Props) {
  const [state, action, isPending] = useActionState<SettingsActionState, FormData>(
    saveStoreSettings,
    null
  );

  const [paymentMethods, setPaymentMethods] = useState<string[]>(
    initialData.payment_methods?.length ? initialData.payment_methods : DEFAULT_PAYMENT_METHODS
  );
  const [newMethod, setNewMethod] = useState("");

  function addPaymentMethod() {
    const trimmed = newMethod.trim();
    if (!trimmed || paymentMethods.includes(trimmed) || paymentMethods.length >= 10) return;
    setPaymentMethods([...paymentMethods, trimmed]);
    setNewMethod("");
  }

  function removePaymentMethod(method: string) {
    if (paymentMethods.length <= 1) return;
    setPaymentMethods(paymentMethods.filter((m) => m !== method));
  }

  return (
    <form action={action} className="space-y-8">
      {/* Feedback */}
      {state?.success && (
        <div className="rounded-lg bg-green-900/20 border border-green-800/40 px-4 py-3 text-sm text-green-400">
          Configurações salvas com sucesso.
        </div>
      )}
      {state?.error && (
        <div className="rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      {/* Informações da Loja */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Informações da Loja
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="store_name" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
              Nome da Loja
            </label>
            <input
              id="store_name"
              name="store_name"
              type="text"
              defaultValue={initialData.store_name}
              placeholder="Norte Tecnologia"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
              E-mail de Contato
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={initialData.email ?? ""}
              placeholder="contato@nortetecnologia.com"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
              Endereço
            </label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={initialData.address ?? ""}
              placeholder="Rua Exemplo, 123"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label htmlFor="city" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
                Cidade
              </label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={initialData.city ?? ""}
                placeholder="Belém"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="state_abbr" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
                UF
              </label>
              <input
                id="state_abbr"
                name="state_abbr"
                type="text"
                maxLength={2}
                defaultValue={initialData.state_abbr ?? "PA"}
                placeholder="PA"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors uppercase"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          WhatsApp e Contato
        </h2>
        <div>
          <label htmlFor="whatsapp_number" className="block text-sm font-medium text-[#d1d5db] mb-1.5">
            Número do WhatsApp
          </label>
          <input
            id="whatsapp_number"
            name="whatsapp_number"
            type="text"
            defaultValue={initialData.whatsapp_number ?? ""}
            placeholder="5591999999999 (com código do país)"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
          />
          <p className="mt-1.5 text-xs text-[#6b7280]">
            Somente dígitos: código do país (55) + DDD + número. Exemplo: 5591999887766.
          </p>
          {initialData.whatsapp_number && (
            <a
              href={`https://wa.me/${initialData.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#ffd600] hover:underline"
            >
              Testar link atual →
            </a>
          )}
        </div>
      </section>

      {/* Horário */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Horário de Funcionamento
        </h2>
        <BusinessHoursEditor initialSchedule={initialData.business_hours_schedule} />
      </section>

      {/* Formas de Pagamento */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Formas de Pagamento
        </h2>

        {/* hidden input serializado para o Server Action */}
        <input type="hidden" name="payment_methods" value={JSON.stringify(paymentMethods)} />

        <div className="mb-4 flex flex-wrap gap-2">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-1 text-sm text-white"
            >
              {method}
              <button
                type="button"
                onClick={() => removePaymentMethod(method)}
                disabled={paymentMethods.length <= 1}
                className="text-[#6b7280] hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30 transition-colors"
                aria-label={`Remover ${method}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {paymentMethods.length < 10 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPaymentMethod(); } }}
              placeholder="Nova forma de pagamento…"
              maxLength={40}
              className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
            />
            <button
              type="button"
              onClick={addPaymentMethod}
              disabled={!newMethod.trim()}
              className="rounded-lg border border-[#ffd600] px-4 py-2 text-sm font-medium text-[#ffd600] hover:bg-[#ffd600]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar
            </button>
          </div>
        )}
        <p className="mt-2 text-xs text-[#6b7280]">
          Máximo 10 formas de pagamento. Ao menos uma é obrigatória.
        </p>
      </section>

      {/* Salvar */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#ffd600] text-[#0a0a0a] font-semibold px-8 py-2.5 rounded-lg hover:bg-[#e6c000] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {isPending ? "Salvando…" : "Salvar Configurações"}
        </button>
      </div>
    </form>
  );
}
