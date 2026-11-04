import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getStoreSettings } from "@/lib/store-settings";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | Norte Tecnologia",
  description: "Finalize seu pedido e envie pelo WhatsApp.",
};

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

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
              <Link href="/carrinho" className="hover:text-white transition-colors">
                Carrinho
              </Link>
              <span>/</span>
              <span className="text-white">Checkout</span>
            </nav>
          </div>
        </div>

        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <h1 className="mb-8 text-3xl font-bold text-white">Finalizar Pedido</h1>
            <CheckoutClient
              whatsappNumber={settings.whatsapp_number}
              paymentMethods={settings.payment_methods}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
