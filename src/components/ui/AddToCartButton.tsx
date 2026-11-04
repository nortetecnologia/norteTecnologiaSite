"use client";

import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const router = useRouter();

  function handleAddToCart() {
    addItem({ ...product, quantity: 1 });
  }

  function handleBuyNow() {
    addItem({ ...product, quantity: 1 });
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleAddToCart}
        className="flex-1 rounded-md border border-brand-yellow px-6 py-3 text-sm font-semibold text-brand-yellow transition-colors hover:bg-brand-yellow hover:text-brand-black"
      >
        Adicionar ao Carrinho
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        className="flex-1 rounded-md bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
      >
        Comprar Agora
      </button>
    </div>
  );
}
