import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { AddToCartButton } from "@/components/ui/AddToCartButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
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
        "id, name, slug, description, price, stock, category:categories(name, slug), product_images(url, is_primary)"
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
              {/* Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-black">
                {primaryImage ? (
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg
                      className="h-24 w-24 text-brand-gray-light"
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
                  {formatCurrency(product.price)}
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

            {/* Thumbnail gallery */}
            {sortedImages.length > 1 && (
              <div className="mt-8">
                <h2 className="mb-4 text-sm font-medium text-gray-400">Mais fotos</h2>
                <div className="flex flex-wrap gap-3">
                  {sortedImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative h-20 w-20 overflow-hidden rounded-md border border-brand-gray-mid bg-brand-black"
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} foto ${i + 1}`}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
