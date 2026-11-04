import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getStoreSettings, buildWhatsAppUrl } from "@/lib/store-settings";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

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
  const settings = await getStoreSettings();

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(
        "id, name, slug, description, price, stock, category:categories(name, slug), product_images(url, is_primary)"
      )
      .eq("slug", slug)
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

  const whatsappMessage = `Olá! Tenho interesse no produto:\n\n*${product.name}*\nPreço: ${formatCurrency(product.price)}\n\nPoderia me passar mais informações?`;
  const whatsappUrl = `${buildWhatsAppUrl(settings.whatsapp_number)}&text=${encodeURIComponent(whatsappMessage)}`;

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

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-yellow px-6 py-4 text-base font-bold text-brand-black transition-colors hover:bg-brand-yellow-dark sm:w-auto"
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
                  Pedir pelo WhatsApp
                </a>

                <p className="mt-3 text-xs text-gray-500">
                  Clique para abrir o WhatsApp com as informações do produto preenchidas.
                </p>
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
