import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { getStoreSettings, buildWhatsAppUrl } from "@/lib/store-settings";
import { createClient } from "@/lib/supabase/server";

const STATIC_CATEGORIES = [
  { name: "Computadores", icon: "🖥️", slug: "computadores" },
  { name: "Notebooks", icon: "💻", slug: "notebooks" },
  { name: "Periféricos", icon: "🖱️", slug: "perifericos" },
  { name: "Impressoras", icon: "🖨️", slug: "impressoras" },
  { name: "Componentes", icon: "⚙️", slug: "componentes" },
  { name: "Acessórios", icon: "🎧", slug: "acessorios" },
];

const services = [
  {
    name: "Manutenção de Computadores",
    description: "Diagnóstico, limpeza e reparo de desktops e notebooks.",
    icon: "🔧",
  },
  {
    name: "Manutenção de Impressoras",
    description: "Desentupimento de cabeça de impressão, troca de peças e calibração.",
    icon: "🖨️",
  },
  {
    name: "Montagem de Computadores",
    description: "Monte o PC ideal para o seu perfil com componentes de qualidade.",
    icon: "🔩",
  },
  {
    name: "Instalação e Configuração",
    description: "Instalação de sistemas operacionais, programas e redes.",
    icon: "⚡",
  },
];

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

  let dbCategories: { name: string; slug: string }[] = [];
  const vitrineSections: VitrineSection[] = [];

  try {
    const supabase = await createClient();

    const [categoriesResult, vitrinesResult] = await Promise.all([
      supabase
        .from("categories")
        .select("name, slug")
        .order("position", { ascending: true }),
      supabase
        .from("vitrines")
        .select("id, title, position, vitrine_products(product_id, position)")
        .eq("is_active", true)
        .order("position", { ascending: true }),
    ]);

    if (categoriesResult.data && categoriesResult.data.length > 0) {
      dbCategories = categoriesResult.data as { name: string; slug: string }[];
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
  } catch {
    // DB não disponível — usa fallback estático
  }

  const displayCategories = dbCategories.length > 0
    ? dbCategories.map((c) => ({ name: c.name, slug: c.slug, icon: "📦" }))
    : STATIC_CATEGORIES;

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-black px-4 py-20 lg:px-8 lg:py-32">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, #FFD600 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1E4FA0 0%, transparent 50%)",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-content text-center">
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo.png"
                alt="Norte Tecnologia"
                width={120}
                height={120}
                className="h-24 w-24 object-contain lg:h-32 lg:w-32"
                priority
              />
            </div>

            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white lg:text-6xl">
              Norte{" "}
              <span className="text-brand-yellow">Tecnologia</span>
            </h1>

            <p className="mx-auto mb-2 max-w-2xl text-lg text-gray-400 lg:text-xl">
              Produtos de informática e serviços técnicos especializados.
            </p>
            <p className="mx-auto mb-10 max-w-xl text-base text-gray-500">
              Atendimento presencial e pelo WhatsApp.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/categoria"
                className="inline-flex items-center gap-2 rounded-md bg-brand-yellow px-6 py-3 text-base font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
              >
                Ver Produtos
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-brand-gray-mid bg-brand-gray-dark px-6 py-3 text-base font-semibold text-white transition-colors hover:border-brand-yellow hover:text-brand-yellow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar pelo WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="border-y border-brand-gray-mid bg-brand-gray-dark px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-content">
            <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
              {[
                { icon: "🏪", label: "Atendimento Presencial" },
                { icon: "📱", label: "Pedidos pelo WhatsApp" },
                { icon: "🔧", label: "Suporte Técnico" },
                { icon: "✅", label: "Produtos Originais" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-content">
            <h2 className="mb-2 text-2xl font-bold text-white lg:text-3xl">Categorias</h2>
            <p className="mb-8 text-gray-400">Encontre o produto certo para a sua necessidade.</p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-lg border border-brand-gray-mid bg-brand-gray-dark p-4 text-center transition-all hover:border-brand-yellow hover:bg-brand-gray-mid"
                >
                  <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Vitrines dinâmicas */}
        {vitrineSections.length > 0 ? (
          vitrineSections.map((vitrine) => (
            <section key={vitrine.id} className="bg-brand-gray-dark px-4 py-16 lg:px-8">
              <div className="mx-auto max-w-content">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white lg:text-3xl">{vitrine.title}</h2>
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
        ) : (
          <section className="bg-brand-gray-dark px-4 py-16 lg:px-8">
            <div className="mx-auto max-w-content">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white lg:text-3xl">Produtos em Destaque</h2>
                  <p className="mt-1 text-gray-400">Em breve nosso catálogo completo.</p>
                </div>
                <Link href="/categoria" className="text-sm font-medium text-brand-yellow hover:underline">
                  Ver todos →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-brand-gray-mid bg-brand-black p-4" aria-hidden="true">
                    <div className="mb-3 h-36 animate-pulse rounded-md bg-brand-gray-mid" />
                    <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-brand-gray-mid" />
                    <div className="mb-3 h-3 w-1/2 animate-pulse rounded bg-brand-gray-mid" />
                    <div className="h-6 w-1/3 animate-pulse rounded bg-brand-gray-mid" />
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-lg border border-dashed border-brand-gray-light p-8 text-center">
                <p className="text-sm text-gray-500">
                  🚀 Estamos preparando nosso catálogo completo. Em breve todos os produtos estarão disponíveis aqui.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Serviços */}
        <section className="px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-content">
            <h2 className="mb-2 text-2xl font-bold text-white lg:text-3xl">Nossos Serviços</h2>
            <p className="mb-8 text-gray-400">Serviços técnicos especializados com atendimento personalizado.</p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="rounded-lg border border-brand-gray-mid bg-brand-gray-dark p-6 transition-colors hover:border-brand-yellow"
                >
                  <span className="mb-4 block text-3xl" aria-hidden="true">{service.icon}</span>
                  <h3 className="mb-2 text-base font-semibold text-white">{service.name}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{service.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-brand-yellow px-6 py-3 text-base font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
              >
                Solicitar Serviço pelo WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-brand-blue px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-content text-center">
            <h2 className="mb-4 text-2xl font-bold text-white lg:text-3xl">Precisa de ajuda?</h2>
            <p className="mb-8 text-blue-100">
              Fale diretamente com nossa equipe pelo WhatsApp e receba atendimento personalizado.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-brand-yellow px-8 py-4 text-lg font-bold text-brand-black transition-colors hover:bg-brand-yellow-dark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar com a Norte Tecnologia
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
