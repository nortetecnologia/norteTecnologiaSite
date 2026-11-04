"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

const PAYMENT_METHODS = ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito"];

type DeliveryMode = "retirada" | "entrega";

interface CheckoutClientProps {
  whatsappNumber: string | null;
}

function buildWhatsAppMessage(params: {
  items: { product_name: string; quantity: number; unit_price: number }[];
  totalPrice: number;
  paymentMethod: string;
  deliveryMode: DeliveryMode;
  address: string;
  observations: string;
}): string {
  const { items, totalPrice, paymentMethod, deliveryMode, address, observations } = params;

  const lines: string[] = ["🛒 *Novo Pedido — Norte Tecnologia*", ""];

  lines.push("*Produtos:*");
  for (const item of items) {
    const subtotal = formatCurrency(item.unit_price * item.quantity);
    const unit = formatCurrency(item.unit_price);
    lines.push(`• ${item.product_name}`);
    lines.push(`  Qtd: ${item.quantity} × ${unit} = ${subtotal}`);
  }

  lines.push("");
  lines.push(`*Total: ${formatCurrency(totalPrice)}*`);
  lines.push("");
  lines.push(`*Forma de pagamento:* ${paymentMethod}`);
  lines.push(
    `*Modalidade:* ${deliveryMode === "retirada" ? "Retirada na loja" : "Entrega"}`
  );

  if (deliveryMode === "entrega" && address.trim()) {
    lines.push(`*Endereço de entrega:* ${address.trim()}`);
  }

  if (observations.trim()) {
    lines.push(`*Observações:* ${observations.trim()}`);
  }

  return lines.join("\n");
}

export function CheckoutClient({ whatsappNumber }: CheckoutClientProps) {
  const { items, totalPrice } = useCart();

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("retirada");
  const [address, setAddress] = useState("");
  const [observations, setObservations] = useState("");

  const digits = (whatsappNumber ?? "").replace(/\D/g, "");

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-4 text-gray-400">Seu carrinho está vazio.</p>
        <Link
          href="/categoria"
          className="rounded-md bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-black hover:bg-brand-yellow-dark transition-colors"
        >
          Ver Produtos
        </Link>
      </div>
    );
  }

  const isDelivery = deliveryMode === "entrega";
  const addressMissing = isDelivery && address.trim() === "";

  function handleFinish() {
    if (addressMissing) return;

    const message = buildWhatsAppMessage({
      items,
      totalPrice,
      paymentMethod,
      deliveryMode,
      address,
      observations,
    });

    const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Formulário */}
      <div className="lg:col-span-2 space-y-6">
        {/* Forma de pagamento */}
        <fieldset className="rounded-lg border border-brand-gray-mid bg-brand-gray-dark p-6">
          <legend className="mb-4 text-base font-semibold text-white px-1">Forma de Pagamento</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method}
                className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                  paymentMethod === method
                    ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                    : "border-brand-gray-mid text-gray-400 hover:border-gray-500"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="sr-only"
                />
                {method}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Modalidade */}
        <fieldset className="rounded-lg border border-brand-gray-mid bg-brand-gray-dark p-6">
          <legend className="mb-4 text-base font-semibold text-white px-1">Modalidade de Recebimento</legend>
          <div className="grid grid-cols-2 gap-3">
            {(["retirada", "entrega"] as DeliveryMode[]).map((mode) => (
              <label
                key={mode}
                className={`flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 transition-colors ${
                  deliveryMode === mode
                    ? "border-brand-yellow bg-brand-yellow/10"
                    : "border-brand-gray-mid hover:border-gray-500"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={mode}
                  checked={deliveryMode === mode}
                  onChange={() => setDeliveryMode(mode)}
                  className="sr-only"
                />
                <span
                  className={`text-sm font-semibold ${
                    deliveryMode === mode ? "text-brand-yellow" : "text-white"
                  }`}
                >
                  {mode === "retirada" ? "🏪 Retirada na Loja" : "🚚 Entrega"}
                </span>
                <span className="text-xs text-gray-500">
                  {mode === "retirada"
                    ? "Retire presencialmente no estabelecimento."
                    : "Informe o endereço de entrega abaixo."}
                </span>
              </label>
            ))}
          </div>

          {isDelivery && (
            <div className="mt-4">
              <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-300">
                Endereço de Entrega <span className="text-red-400">*</span>
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro, cidade"
                className="w-full rounded-md border border-brand-gray-mid bg-brand-black px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-brand-yellow focus:outline-none"
              />
              {addressMissing && (
                <p className="mt-1 text-xs text-red-400">Informe o endereço para entrega.</p>
              )}
            </div>
          )}
        </fieldset>

        {/* Observações */}
        <div className="rounded-lg border border-brand-gray-mid bg-brand-gray-dark p-6">
          <label htmlFor="observations" className="mb-1.5 block text-base font-semibold text-white">
            Observações <span className="text-xs font-normal text-gray-500">(opcional)</span>
          </label>
          <textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={3}
            placeholder="Alguma informação adicional para o pedido?"
            className="w-full resize-none rounded-md border border-brand-gray-mid bg-brand-black px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-brand-yellow focus:outline-none"
          />
        </div>
      </div>

      {/* Resumo */}
      <div>
        <div className="rounded-lg border border-brand-gray-mid bg-brand-gray-dark p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Resumo do Pedido</h2>

          <div className="mb-4 space-y-2 border-b border-brand-gray-mid pb-4">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between gap-2 text-sm">
                <span className="text-gray-400 line-clamp-1 flex-1">
                  {item.product_name} ×{item.quantity}
                </span>
                <span className="shrink-0 text-gray-300">
                  {formatCurrency(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-6 flex items-center justify-between">
            <span className="text-base font-semibold text-white">Total</span>
            <span className="text-xl font-bold text-brand-yellow">{formatCurrency(totalPrice)}</span>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            disabled={addressMissing}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-yellow px-6 py-3 text-base font-bold text-brand-black transition-colors hover:bg-brand-yellow-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enviar Pedido pelo WhatsApp
          </button>

          <p className="mt-3 text-xs text-gray-500 text-center">
            Você será redirecionado ao WhatsApp com as informações do pedido preenchidas.
          </p>

          <Link
            href="/carrinho"
            className="mt-3 block text-center text-sm font-medium text-gray-400 hover:text-brand-yellow transition-colors"
          >
            ← Voltar ao Carrinho
          </Link>
        </div>
      </div>
    </div>
  );
}
