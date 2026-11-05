import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Categorias | Norte Tecnologia",
  description: "Explore todas as categorias de produtos da Norte Tecnologia.",
};

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  subcategories: { id: string; name: string; slug: string }[];
}

interface DisplayCategory {
  name: string;
  slug: string;
  icon: string;
  imageUrl?: string;
  description: string;
}

const STATIC_CATEGORIES: DisplayCategory[] = [
  { name: "Computadores", icon: "🖥️", slug: "computadores", description: "Desktops e all-in-ones" },
  { name: "Notebooks", icon: "💻", slug: "notebooks", description: "Portáteis para trabalho e estudo" },
  { name: "Periféricos", icon: "🖱️", slug: "perifericos", description: "Mouse, teclado, headset e mais" },
  { name: "Impressoras", icon: "🖨️", slug: "impressoras", description: "Impressoras e suprimentos" },
  { name: "Componentes", icon: "⚙️", slug: "componentes", description: "Peças e upgrades para PC" },
  { name: "Acessórios", icon: "🎧", slug: "acessorios", description: "Cabos, adaptadores e acessórios" },
];

export default async function CategoriesPage() {
  let categories: { name: string; slug: string; imageUrl?: string; subcategoryCount: number }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug, image_url, subcategories(id, name, slug)")
      .order("position", { ascending: true });

    if (data && data.length > 0) {
      categories = (data as CategoryRow[]).map((c) => ({
        name: c.name,
        slug: c.slug,
        imageUrl: c.image_url ?? undefined,
        subcategoryCount: c.subcategories?.length ?? 0,
      }));
    }
  } catch {
    // DB não disponível
  }

  const displayCategories: DisplayCategory[] =
    categories.length > 0
      ? categories.map((c) => ({
          name: c.name,
          slug: c.slug,
          icon: "📦",
          imageUrl: c.imageUrl,
          description:
            c.subcategoryCount > 0
              ? `${c.subcategoryCount} subcategor${c.subcategoryCount === 1 ? "ia" : "ias"}`
              : "Ver produtos",
        }))
      : STATIC_CATEGORIES;

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
              <span className="text-white">Categorias</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <h1 className="mb-2 text-3xl font-bold text-white lg:text-4xl">Categorias</h1>
            <p className="text-gray-400">Escolha uma categoria para ver os produtos disponíveis.</p>
          </div>
        </section>

        {/* Grid */}
        <section className="px-4 pb-16 lg:px-8">
          <div className="mx-auto max-w-content">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="group flex flex-col gap-3 rounded-lg border border-brand-gray-mid bg-brand-gray-dark p-4 transition-all hover:border-brand-yellow hover:bg-brand-gray-mid"
                >
                  {"imageUrl" in cat && cat.imageUrl ? (
                    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-brand-black">
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  ) : (
                    <span className="text-4xl transition-transform group-hover:scale-110" aria-hidden="true">
                      {cat.icon}
                    </span>
                  )}
                  <div>
                    <h2 className="text-base font-semibold text-white group-hover:text-brand-yellow transition-colors">
                      {cat.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            {displayCategories.length === 0 && (
              <div className="rounded-lg border border-dashed border-brand-gray-light p-12 text-center">
                <p className="text-gray-500">Nenhuma categoria cadastrada ainda.</p>
                <p className="mt-2 text-sm text-gray-600">Em breve nosso catálogo completo estará disponível.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
