import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { ReviewForm } from "@/components/ui/ReviewForm";
import { ReviewsList } from "@/components/ui/ReviewsList";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  price_max: number | null;
  stock: number;
  category: { name: string; slug: string } | null;
  product_images: { url: string; is_primary: boolean }[];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("name, description")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    if (data) {
      return {
        title: `${data.name} | Norte Tecnologia`,
        description: data.description ?? `Compre ${data.name} na Norte Tecnologia.`,
      };
    }
  } catch {
    // fallback
  }
  return { title: "Produto | Norte Tecnologia" };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  let product: ProductDetail | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(
        "id, name, slug, description, price, price_max, stock, category:categories(name, slug), product_images(url, is_primary)"
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (!data) notFound();
    product = data as unknown as ProductDetail;
  } catch {
    notFound();
  }

  if (!product) notFound();

  const sortedImages = [...(product.product_images ?? [])].sort((a, b) =>
    a.is_primary === b.is_primary ? 0 : a.is_primary ? -1 : 1
  );
  const primaryImage = sortedImages[0]?.url ?? null;



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
              {product.category && (
                <>
                  <span>/</span>
                  <Link
                    href={`/categoria/${product.category.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="line-clamp-1 text-white">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product detail */}
        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <div className="grid gap-10 lg:grid-cols-2">
              {/* Gallery */}
              <ProductGallery images={sortedImages} name={product.name} />

              {/* Info */}
              <div className="flex flex-col">
                {product.category && (
                  <Link
                    href={`/categoria/${product.category.slug}`}
                    className="mb-3 inline-block text-sm font-medium text-brand-yellow hover:underline"
                  >
                    {product.category.name}
                  </Link>
                )}

                <h1 className="mb-4 text-2xl font-bold text-white lg:text-3xl">{product.name}</h1>

                <p className="mb-6 text-3xl font-extrabold text-brand-yellow">
                  {product.price_max && product.price_max > product.price
                    ? `${formatCurrency(product.price)} a ${formatCurrency(product.price_max)}`
                    : formatCurrency(product.price)}
                </p>

                {product.description && (
                  <p className="mb-6 text-sm leading-relaxed text-gray-400">{product.description}</p>
                )}

                <div className="mb-6">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-900/40 px-3 py-1 text-xs font-medium text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
                      Em estoque
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-900/40 px-3 py-1 text-xs font-medium text-red-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" aria-hidden="true" />
                      Fora de estoque
                    </span>
                  )}
                </div>

                <AddToCartButton
                  product={{
                    product_id: product.id,
                    slug: product.slug,
                    product_name: product.name,
                    unit_price: product.price,
                    image_url: primaryImage,
                  }}
                />
              </div>
            </div>

          </div>
        </section>

        {/* Avaliações */}
        <section className="border-t border-brand-gray-mid px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <div className="grid gap-10 lg:grid-cols-2">
              {/* Lista de avaliações */}
              <div>
                <h2 className="mb-6 text-xl font-bold text-white lg:text-2xl">Avaliações</h2>
                <Suspense fallback={<p className="text-sm text-gray-500">Carregando avaliações…</p>}>
                  <ReviewsList productId={product.id} />
                </Suspense>
              </div>
              {/* Formulário */}
              <div>
                <h2 className="mb-6 text-xl font-bold text-white lg:text-2xl">Deixe sua avaliação</h2>
                <ReviewForm productId={product.id} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
