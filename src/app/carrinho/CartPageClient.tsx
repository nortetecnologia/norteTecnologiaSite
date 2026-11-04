"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

export function CartPageClient() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="mb-6 h-20 w-20 text-brand-gray-light"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        <h2 className="mb-2 text-xl font-semibold text-white">Seu carrinho está vazio</h2>
        <p className="mb-6 text-gray-400">Adicione produtos para continuar.</p>
        <Link
          href="/categoria"
          className="rounded-md bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
        >
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Lista de itens */}
      <div className="lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold text-white">
          {totalItems} {totalItems === 1 ? "item" : "itens"}
        </h2>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex gap-4 rounded-lg border border-brand-gray-mid bg-brand-gray-dark p-4"
            >
              {/* Thumbnail */}
              <Link href={`/produto/${item.slug}`} className="shrink-0">
                <div className="relative h-20 w-20 overflow-hidden rounded-md bg-brand-black">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.product_name}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg
                        className="h-8 w-8 text-brand-gray-light"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/produto/${item.slug}`}
                    className="text-sm font-medium text-white hover:text-brand-yellow transition-colors line-clamp-2"
                  >
                    {item.product_name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product_id)}
                    className="shrink-0 text-gray-500 hover:text-red-400 transition-colors"
                    aria-label={`Remover ${item.product_name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-brand-gray-mid text-gray-300 hover:border-brand-yellow hover:text-brand-yellow transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3" aria-hidden="true">
                        <path d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-brand-gray-mid text-gray-300 hover:border-brand-yellow hover:text-brand-yellow transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3" aria-hidden="true">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                      </svg>
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-sm font-bold text-brand-yellow">
                    {formatCurrency(item.unit_price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
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

          <Link
            href="/checkout"
            className="block w-full rounded-md bg-brand-yellow px-6 py-3 text-center text-base font-bold text-brand-black transition-colors hover:bg-brand-yellow-dark"
          >
            Finalizar Pedido
          </Link>

          <Link
            href="/categoria"
            className="mt-3 block text-center text-sm font-medium text-gray-400 hover:text-brand-yellow transition-colors"
          >
            ← Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
