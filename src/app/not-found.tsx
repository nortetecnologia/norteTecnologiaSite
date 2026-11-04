import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <p className="mb-2 text-6xl font-extrabold text-brand-yellow">404</p>
        <h1 className="mb-4 text-2xl font-bold text-white">Página não encontrada</h1>
        <p className="mb-8 max-w-md text-gray-400">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="rounded-md bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
        >
          Voltar para a página inicial
        </Link>
      </main>
      <Footer />
    </>
  );
}
