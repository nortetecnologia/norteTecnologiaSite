import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("promotions")
    .select("title, subtitle")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (!data) return { title: "Promoção — Norte Tecnologia" };
  return { title: `${data.title} — Norte Tecnologia`, description: data.subtitle ?? undefined };
}

export default async function PromoPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: promo } = await supabase
    .from("promotions")
    .select("id, title, subtitle, discount_percent, cover_image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!promo) notFound();

  const { data: links } = await supabase
    .from("promotion_products")
    .select("product_id, position")
    .eq("promotion_id", promo.id)
    .order("position", { ascending: true });

  const productIds = (links ?? []).map((l) => l.product_id);
  let products: { id: string; name: string; slug: string; price: number; primaryImageUrl: string | null }[] = [];

  if (productIds.length > 0) {
    const { data: rawProducts } = await supabase
      .from("products")
      .select("id, name, slug, price, product_images(url, is_primary)")
      .in("id", productIds)
      .eq("is_active", true);

    type PRow = { id: string; name: string; slug: string; price: number; product_images: { url: string; is_primary: boolean }[] };
    const map = new Map<string, PRow>();
    for (const p of (rawProducts ?? []) as PRow[]) map.set(p.id, p);

    products = productIds
      .map((pid) => {
        const p = map.get(pid);
        if (!p) return null;
        const primary = p.product_images?.find((i) => i.is_primary)?.url ?? p.product_images?.[0]?.url ?? null;
        return { id: p.id, name: p.name, slug: p.slug, price: p.price, primaryImageUrl: primary };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-black">
        {/* Banner */}
        <section className="bg-[#0a0a0a]">
          {promo.cover_image_url && (
            <div className="relative w-full overflow-hidden">
              <Image
                src={promo.cover_image_url}
                alt={promo.title}
                width={1920}
                height={640}
                className="block w-full h-auto"
                priority
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}
          <div className="px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-content">
              {promo.discount_percent && (
                <span className="mb-3 inline-block rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  -{promo.discount_percent}% OFF
                </span>
              )}
              <h1 className="text-3xl font-extrabold text-white lg:text-5xl">{promo.title}</h1>
              {promo.subtitle && (
                <p className="mt-2 text-base text-gray-300 lg:text-lg">{promo.subtitle}</p>
              )}
            </div>
          </div>
        </section>

        {/* Produtos */}
        <section className="px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-content">
            {products.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-gray-400">
                  {products.length} produto{products.length !== 1 ? "s" : ""} nesta promoção
                </p>
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
              </>
            ) : (
              <p className="text-center text-gray-500">Nenhum produto nesta promoção ainda.</p>
            )}

            <div className="mt-10 text-center">
              <Link href="/" className="text-sm font-medium text-brand-yellow hover:underline">
                ← Voltar para a loja
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
