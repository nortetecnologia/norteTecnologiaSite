import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ slug: string; subcategoria: string }>;
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
}

interface SubcategoryRow {
  id: string;
  name: string;
  slug: string;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  product_images: { url: string; is_primary: boolean }[];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, subcategoria } = await params;
  try {
    const supabase = await createClient();
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    if (!catData) return { title: "Subcategoria | Norte Tecnologia" };

    const { data: subData } = await supabase
      .from("subcategories")
      .select("name")
      .eq("slug", subcategoria)
      .eq("category_id", catData.id)
      .eq("is_active", true)
      .single();

    if (subData) {
      return {
        title: `${subData.name} — ${catData.name} | Norte Tecnologia`,
        description: `Produtos de ${subData.name} na categoria ${catData.name} da Norte Tecnologia.`,
      };
    }
  } catch {
    // fallback
  }
  return { title: "Subcategoria | Norte Tecnologia" };
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug, subcategoria } = await params;

  let category: CategoryRow | null = null;
  let subcategory: SubcategoryRow | null = null;
  let products: { id: string; name: string; slug: string; price: number; primaryImageUrl: string | null }[] = [];

  try {
    const supabase = await createClient();

    const { data: catData } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (!catData) notFound();
    category = catData as CategoryRow;

    const { data: subData } = await supabase
      .from("subcategories")
      .select("id, name, slug")
      .eq("slug", subcategoria)
      .eq("category_id", category.id)
      .eq("is_active", true)
      .single();

    if (!subData) notFound();
    subcategory = subData as SubcategoryRow;

    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, slug, price, product_images(url, is_primary)")
      .eq("subcategory_id", subcategory.id)
      .eq("is_active", true)
      .order("name", { ascending: true });

    products = ((productsData ?? []) as ProductRow[]).map((p) => {
      const primary =
        p.product_images?.find((i) => i.is_primary)?.url ??
        p.product_images?.[0]?.url ??
        null;
      return { id: p.id, name: p.name, slug: p.slug, price: p.price, primaryImageUrl: primary };
    });
  } catch {
    notFound();
  }

  if (!category || !subcategory) notFound();

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-brand-gray-mid bg-brand-gray-dark px-4 py-3 lg:px-8">
          <div className="mx-auto max-w-content">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link href="/categoria" className="hover:text-white transition-colors">
                Categorias
              </Link>
              <span>/</span>
              <Link href={`/categoria/${category.slug}`} className="hover:text-white transition-colors">
                {category.name}
              </Link>
              <span>/</span>
              <span className="text-white">{subcategory.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <p className="mb-1 text-sm font-medium text-brand-yellow">
              {category.name}
            </p>
            <h1 className="mb-2 text-3xl font-bold text-white lg:text-4xl">{subcategory.name}</h1>
            <p className="text-gray-400">
              {products.length > 0
                ? `${products.length} produto${products.length === 1 ? "" : "s"} encontrado${products.length === 1 ? "" : "s"}`
                : "Nenhum produto disponível no momento"}
            </p>
          </div>
        </section>

        {/* Products grid */}
        <section className="px-4 pb-16 lg:px-8">
          <div className="mx-auto max-w-content">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    slug={p.slug}
                    name={p.name}
                    price={p.price}
                    primaryImageUrl={p.primaryImageUrl}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-brand-gray-light p-12 text-center">
                <p className="text-gray-500">Nenhum produto disponível nesta subcategoria no momento.</p>
                <p className="mt-2 text-sm text-gray-600">
                  Entre em contato pelo WhatsApp para verificar disponibilidade.
                </p>
                <Link
                  href={`/categoria/${category.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-brand-yellow hover:underline"
                >
                  ← Ver todos os produtos de {category.name}
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
