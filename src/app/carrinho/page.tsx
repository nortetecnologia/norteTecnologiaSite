import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartPageClient } from "./CartPageClient";

export const metadata: Metadata = {
  title: "Carrinho | Norte Tecnologia",
  description: "Revise os itens do seu carrinho antes de finalizar o pedido.",
};

export default function CartPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-brand-gray-mid bg-brand-gray-dark px-4 py-3 lg:px-8">
          <div className="mx-auto max-w-content">
            <nav className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                Início
              </Link>
              <span>/</span>
              <span className="text-white">Carrinho</span>
            </nav>
          </div>
        </div>

        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <h1 className="mb-8 text-3xl font-bold text-white">Carrinho</h1>
            <CartPageClient />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
