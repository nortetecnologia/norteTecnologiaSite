export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { FeedbackForm } from "@/components/ui/FeedbackForm";
import { getStoreSettings, buildWhatsAppUrl } from "@/lib/store-settings";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const STATIC_CATEGORIES = [
  { name: "Computadores", icon: "🖥️", slug: "computadores" },
  { name: "Notebooks", icon: "💻", slug: "notebooks" },
  { name: "Periféricos", icon: "🖱️", slug: "perifericos" },
  { name: "Impressoras", icon: "🖨️", slug: "impressoras" },
  { name: "Componentes", icon: "⚙️", slug: "componentes" },
  { name: "Acessórios", icon: "🎧", slug: "acessorios" },
];


interface PromoRow {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  discount_percent: number | null;
  cover_image_url: string | null;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  product_images: { url: string; is_primary: boolean }[];
}

interface VitrineSection {
  id: string;
  title: string;
  products: { id: string; name: string; slug: string; price: number; primaryImageUrl: string | null }[];
}

export default async function HomePage() {
  const settings = await getStoreSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp_number);

  let dbCategories: { name: string; slug: string; image_url?: string | null }[] = [];
  const vitrineSections: VitrineSection[] = [];
  let activePromotions: PromoRow[] = [];
  let fallbackProducts: VitrineSection["products"] = [];

  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const [categoriesResult, vitrinesResult, promosResult] = await Promise.all([
      supabase
        .from("categories")
        .select("name, slug, image_url")
        .eq("is_active", true)
        .order("position", { ascending: true }),
      supabase
        .from("vitrines")
        .select("id, title, position, vitrine_products(product_id, position)")
        .eq("is_active", true)
        .order("position", { ascending: true }),
      adminClient
        .from("promotions")
        .select("id, title, slug, subtitle, discount_percent, cover_image_url")
        .eq("is_active", true)
        .order("position", { ascending: true })
        .limit(4),
    ]);

    if (promosResult.data && promosResult.data.length > 0) {
      activePromotions = promosResult.data as PromoRow[];
    }

    if (categoriesResult.data && categoriesResult.data.length > 0) {
      dbCategories = categoriesResult.data as { name: string; slug: string; image_url?: string | null }[];
    }

    if (vitrinesResult.data && vitrinesResult.data.length > 0) {
      type VPRaw = { product_id: string; position: number };
      type VitrineRaw = { id: string; title: string; position: number; vitrine_products: VPRaw[] };

      const allProductIds = [
        ...new Set(
          (vitrinesResult.data as VitrineRaw[]).flatMap((v) =>
            v.vitrine_products.map((vp) => vp.product_id)
          )
        ),
      ];

      if (allProductIds.length > 0) {
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, slug, price, product_images(url, is_primary)")
          .in("id", allProductIds);

        const productMap = new Map<string, ProductRow>();
        for (const p of (productsData ?? []) as ProductRow[]) {
          productMap.set(p.id, p);
        }

        for (const vitrine of vitrinesResult.data as VitrineRaw[]) {
          const sorted = [...vitrine.vitrine_products].sort(
            (a, b) => a.position - b.position
          );

          const products = sorted
            .map((vp) => {
              const p = productMap.get(vp.product_id);
              if (!p) return null;
              const primary =
                p.product_images?.find((i) => i.is_primary)?.url ??
                p.product_images?.[0]?.url ??
                null;
              return { id: p.id, name: p.name, slug: p.slug, price: p.price, primaryImageUrl: primary };
            })
            .filter((p): p is NonNullable<typeof p> => p !== null);

          if (products.length > 0) {
            vitrineSections.push({ id: vitrine.id, title: vitrine.title, products });
          }
        }
      }
    }

    // Fallback: se nenhuma vitrine com produtos, busca produtos diretamente
    if (vitrineSections.length === 0) {
      const { data: directProducts } = await supabase
        .from("products")
        .select("id, name, slug, price, product_images(url, is_primary)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(20);

      fallbackProducts = ((directProducts ?? []) as ProductRow[]).map((p) => {
        const primary =
          p.product_images?.find((i) => i.is_primary)?.url ??
          p.product_images?.[0]?.url ??
          null;
        return { id: p.id, name: p.name, slug: p.slug, price: p.price, primaryImageUrl: primary };
      });
    }
  } catch {
    // DB não disponível — usa fallback estático
  }

  const displayCategories = dbCategories.length > 0
    ? dbCategories.map((c) => ({ name: c.name, slug: c.slug, icon: "📦", imageUrl: c.image_url ?? undefined }))
    : STATIC_CATEGORIES.map((c) => ({ ...c, imageUrl: undefined }));

  return (
    <>
      <Header />

      <main className="bg-brand-black min-h-screen">

        {/* Banner de promoções — full width, carrossel */}
        <PromoBanner promotions={activePromotions} />

        {/* Vitrines dinâmicas — logo abaixo do topo */}
        {vitrineSections.length > 0 ? (
          vitrineSections.map((vitrine) => (
            <section key={vitrine.id} className="px-4 py-8 lg:px-8">
              <div className="mx-auto max-w-content">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white lg:text-2xl">{vitrine.title}</h2>
                  <Link href="/categoria" className="text-sm font-medium text-brand-yellow hover:underline">
                    Ver todos →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {vitrine.products.map((p) => (
                    <ProductCard
                      key={p.id}
                      slug={p.slug}
                      name={p.name}
                      price={p.price}
                      primaryImageUrl={p.primaryImageUrl}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))
        ) : fallbackProducts.length > 0 ? (
          /* Fallback: produtos diretos quando não há vitrines configuradas */
          <section className="px-4 py-8 lg:px-8">
            <div className="mx-auto max-w-content">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white lg:text-2xl">Produtos</h2>
                <Link href="/categoria" className="text-sm font-medium text-brand-yellow hover:underline">
                  Ver todos →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {fallbackProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    slug={p.slug}
                    name={p.name}
                    price={p.price}
                    primaryImageUrl={p.primaryImageUrl}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Categorias */}
        <section className="border-t border-brand-gray-mid px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <h2 className="mb-6 text-xl font-bold text-white lg:text-2xl">Categorias</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="group flex flex-col items-center gap-2 rounded-lg border border-brand-gray-mid bg-brand-gray-dark p-3 text-center transition-all hover:border-brand-yellow hover:bg-brand-gray-mid"
                >
                  {cat.imageUrl ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-brand-black">
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                        unoptimized
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <span className="text-2xl transition-transform group-hover:scale-110" aria-hidden="true">
                      {cat.icon}
                    </span>
                  )}
                  <span className="text-xs font-medium text-gray-300 group-hover:text-white leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-brand-blue px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-content text-center">
            <h2 className="mb-3 text-xl font-bold text-white lg:text-2xl">Precisa de ajuda?</h2>
            <p className="mb-6 text-sm text-blue-100">
              Fale diretamente com nossa equipe pelo WhatsApp e receba atendimento personalizado.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-brand-yellow px-7 py-3 text-base font-bold text-brand-black transition-colors hover:bg-brand-yellow-dark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar com a Norte Tecnologia
            </a>
          </div>
        </section>
        {/* Localização e Feedback */}
        <section className="border-t border-brand-gray-mid px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <div className={`grid gap-10 ${settings.location_url?.includes("/maps/embed") ? "lg:grid-cols-2 lg:items-stretch" : ""}`}>

              {/* Google Maps embed — só renderiza com URL de incorporação válida */}
              {settings.location_url && settings.location_url.includes("/maps/embed") && (
                <div className="flex flex-col">
                  <h2 className="mb-4 text-xl font-bold text-white lg:text-2xl">Nossa Localização</h2>
                  <div className="flex-1 overflow-hidden rounded-xl border border-brand-gray-mid min-h-[400px]">
                    <iframe
                      src={settings.location_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0, display: "block" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localização da Norte Tecnologia no Google Maps"
                    />
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div>
                <h2 className="mb-1 text-xl font-bold text-white lg:text-2xl">Envie seu Feedback</h2>
                <p className="mb-5 text-sm text-gray-400">
                  Sugestões, elogios ou dúvidas? Adoramos ouvir nossos clientes.
                </p>
                <FeedbackForm contactEmail={settings.email} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
