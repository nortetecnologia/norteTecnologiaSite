import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ui/ProductCard";
import { SearchTracker } from "@/components/ui/SearchTracker";
import { sanitizeSearchTerm } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  const safeQuery = sanitizeSearchTerm(query);
  if (!safeQuery) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Digite algo para pesquisar produtos.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, brand, product_images(url, is_primary)")
    .or(`name.ilike.%${safeQuery}%,brand.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%`)
    .eq("is_active", true)
    .order("name", { ascending: true })
    .limit(60);

  type ImgRow = { url: string; is_primary: boolean };
  type ProductRow = {
    id: string;
    name: string;
    slug: string;
    price: number;
    brand: string | null;
    product_images: ImgRow[];
  };

  const rows = (products ?? []) as ProductRow[];

  if (rows.length === 0) {
    return (
      <>
        <SearchTracker query={query} resultsCount={0} />
        <div className="text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mx-auto mb-4 h-12 w-12 text-gray-600"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-300">Nenhum resultado para</p>
          <p className="mt-1 text-brand-yellow font-semibold">&ldquo;{query}&rdquo;</p>
          <p className="mt-3 text-sm text-gray-500">Tente outro termo ou navegue pelas categorias.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SearchTracker query={query} resultsCount={rows.length} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {rows.map((p) => {
          const imgs = p.product_images ?? [];
          const primaryImg = imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null;
          return (
            <ProductCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              name={p.name}
              price={p.price}
              primaryImageUrl={primaryImg}
            />
          );
        })}
      </div>
    </>
  );
}

export default async function BuscaPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-brand-black">
        <div className="mx-auto max-w-content px-4 py-8 lg:px-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">
              {query ? (
                <>
                  Resultados para{" "}
                  <span className="text-brand-yellow">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                "Pesquisar produtos"
              )}
            </h1>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-lg bg-brand-gray-dark"
                    aria-hidden="true"
                  />
                ))}
              </div>
            }
          >
            <SearchResults query={query} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
