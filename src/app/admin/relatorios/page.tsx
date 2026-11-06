import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Relatórios | Admin — Norte Tecnologia",
};

interface CategoryStat {
  id: string;
  name: string;
  slug: string;
  total: number;
  active: number;
  out_of_stock: number;
}

interface VitrineStat {
  id: string;
  title: string;
  display_type: string;
  is_active: boolean;
  product_count: number;
}

interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stock: number;
  category_name: string | null;
}

interface NoImageProduct {
  id: string;
  name: string;
  slug: string;
  category_name: string | null;
}

export default async function AdminRelatoriosPage() {
  const supabase = createAdminClient();

  const [
    productsResult,
    categoriesResult,
    vitrinesResult,
    lowStockResult,
    noImageResult,
  ] = await Promise.all([
    supabase.from("products").select("id, is_active, stock"),
    supabase
      .from("categories")
      .select("id, name, slug, products(id, is_active, stock)")
      .order("name"),
    supabase
      .from("vitrines")
      .select("id, title, display_type, is_active, vitrine_products(id)")
      .order("display_order"),
    supabase
      .from("products")
      .select("id, name, slug, stock, category:categories(name)")
      .eq("is_active", true)
      .lte("stock", 5)
      .order("stock", { ascending: true })
      .limit(20),
    supabase
      .from("products")
      .select("id, name, slug, category:categories(name), product_images(id)")
      .eq("is_active", true)
      .order("name")
      .limit(20),
  ]);

  // Summary counts
  const allProducts = productsResult.data ?? [];
  const totalProducts = allProducts.length;
  const activeProducts = allProducts.filter((p) => p.is_active).length;

  // Category stats
  type RawCategory = {
    id: string;
    name: string;
    slug: string;
    products: { id: string; is_active: boolean; stock: number }[] | null;
  };
  const categoryStats: CategoryStat[] = ((categoriesResult.data ?? []) as unknown as RawCategory[]).map((cat) => {
    const prods = cat.products ?? [];
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      total: prods.length,
      active: prods.filter((p) => p.is_active).length,
      out_of_stock: prods.filter((p) => p.is_active && p.stock === 0).length,
    };
  });
  const totalCategories = categoryStats.length;

  // Vitrine stats
  type RawVitrine = {
    id: string;
    title: string;
    display_type: string;
    is_active: boolean;
    vitrine_products: { id: string }[] | null;
  };
  const vitrineStats: VitrineStat[] = ((vitrinesResult.data ?? []) as unknown as RawVitrine[]).map((v) => ({
    id: v.id,
    title: v.title,
    display_type: v.display_type,
    is_active: v.is_active,
    product_count: (v.vitrine_products ?? []).length,
  }));
  const activeVitrines = vitrineStats.filter((v) => v.is_active).length;

  // Low stock products
  type RawProduct = { id: string; name: string; slug: string; stock: number; category: { name: string } | null };
  const lowStockProducts: LowStockProduct[] = ((lowStockResult.data ?? []) as unknown as RawProduct[]).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    stock: p.stock,
    category_name: p.category?.name ?? null,
  }));

  const outOfStock = lowStockProducts.filter((p) => p.stock === 0);
  const criticalStock = lowStockProducts.filter((p) => p.stock > 0 && p.stock <= 5);

  // Products without images
  type RawProductImg = { id: string; name: string; slug: string; category: { name: string } | null; product_images: { id: string }[] | null };
  const noImageProducts: NoImageProduct[] = ((noImageResult.data ?? []) as unknown as RawProductImg[])
    .filter((p) => !p.product_images || p.product_images.length === 0)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category_name: p.category?.name ?? null,
    }));

  const displayTypeLabel: Record<string, string> = {
    carousel: "Carrossel",
    grid: "Grade",
    row: "Linha",
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Relatórios</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Indicadores com base nos dados registrados na loja.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-900/20 text-green-400 text-xs font-medium border border-green-800/30">
          Dados em tempo real
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total de Produtos", value: totalProducts, href: "/admin/produtos", color: "text-white" },
          { label: "Produtos Ativos", value: activeProducts, href: "/admin/produtos", color: "text-green-400" },
          { label: "Categorias", value: totalCategories, href: "/admin/categorias", color: "text-brand-yellow" },
          { label: "Vitrines Ativas", value: activeVitrines, href: "/admin/vitrines", color: "text-brand-yellow" },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#ffd600]/30 transition-colors"
          >
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[#6b7280] text-sm mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Stock alerts */}
      {(outOfStock.length > 0 || criticalStock.length > 0) && (
        <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
            <span className="text-red-400">⚠</span>
            Alertas de Estoque
          </h2>

          {outOfStock.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-red-400 uppercase tracking-wider mb-2">
                Sem estoque ({outOfStock.length})
              </p>
              <div className="space-y-1.5">
                {outOfStock.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 rounded-lg bg-red-900/10 border border-red-900/20 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/produto/${p.slug}`}
                        target="_blank"
                        className="text-sm text-white hover:text-[#ffd600] transition-colors truncate block"
                      >
                        {p.name}
                      </Link>
                      {p.category_name && (
                        <span className="text-xs text-[#6b7280]">{p.category_name}</span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-red-400 bg-red-900/20 px-2 py-0.5 rounded-full">
                      Estoque: 0
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {criticalStock.length > 0 && (
            <div>
              <p className="text-xs font-medium text-yellow-400 uppercase tracking-wider mb-2">
                Estoque baixo — 1 a 5 unidades ({criticalStock.length})
              </p>
              <div className="space-y-1.5">
                {criticalStock.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 rounded-lg bg-yellow-900/10 border border-yellow-900/20 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/produto/${p.slug}`}
                        target="_blank"
                        className="text-sm text-white hover:text-[#ffd600] transition-colors truncate block"
                      >
                        {p.name}
                      </Link>
                      {p.category_name && (
                        <span className="text-xs text-[#6b7280]">{p.category_name}</span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-yellow-400 bg-yellow-900/20 px-2 py-0.5 rounded-full">
                      Estoque: {p.stock}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outOfStock.length === 0 && criticalStock.length === 0 && (
            <p className="text-[#6b7280] text-sm">Nenhum alerta de estoque no momento.</p>
          )}
        </section>
      )}

      {/* Category breakdown */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5">Catálogo por Categoria</h2>
        {categoryStats.length === 0 ? (
          <p className="text-[#6b7280] text-sm">Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left text-[#6b7280] font-medium pb-3 pr-4">Categoria</th>
                  <th className="text-right text-[#6b7280] font-medium pb-3 px-4">Total</th>
                  <th className="text-right text-[#6b7280] font-medium pb-3 px-4">Ativos</th>
                  <th className="text-right text-[#6b7280] font-medium pb-3 pl-4">Sem estoque</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {categoryStats.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#1f1f1f] transition-colors">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/categoria/${cat.slug}`}
                        target="_blank"
                        className="text-white hover:text-[#ffd600] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-right text-[#9ca3af]">{cat.total}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cat.active > 0 ? "text-green-400" : "text-[#6b7280]"}>
                        {cat.active}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      {cat.out_of_stock > 0 ? (
                        <span className="text-red-400">{cat.out_of_stock}</span>
                      ) : (
                        <span className="text-[#6b7280]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Vitrines status */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-5">Situação das Vitrines</h2>
        {vitrineStats.length === 0 ? (
          <p className="text-[#6b7280] text-sm">Nenhuma vitrine cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {vitrineStats.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-[#2a2a2a] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{v.title}</p>
                  <p className="text-xs text-[#6b7280]">
                    {displayTypeLabel[v.display_type] ?? v.display_type} · {v.product_count} produto{v.product_count !== 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    v.is_active
                      ? "bg-green-900/20 text-green-400 border border-green-800/30"
                      : "bg-[#2a2a2a] text-[#6b7280] border border-[#3a3a3a]"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${v.is_active ? "bg-green-400" : "bg-[#4b5563]"}`}
                    aria-hidden="true"
                  />
                  {v.is_active ? "Ativa" : "Inativa"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Products without images */}
      {noImageProducts.length > 0 && (
        <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Produtos Sem Imagem</h2>
          <p className="text-[#6b7280] text-xs mb-5">
            Produtos ativos sem nenhuma imagem cadastrada — podem afetar a experiência do cliente.
          </p>
          <div className="space-y-1.5">
            {noImageProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-[#2a2a2a] px-3 py-2"
              >
                <div className="min-w-0">
                  <span className="text-sm text-white truncate block">{p.name}</span>
                  {p.category_name && (
                    <span className="text-xs text-[#6b7280]">{p.category_name}</span>
                  )}
                </div>
                <Link
                  href="/admin/produtos"
                  className="shrink-0 text-xs text-[#ffd600] hover:underline"
                >
                  Editar →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Notice about future metrics */}
      <div className="bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-6 text-center">
        <p className="text-[#4b5563] text-sm">
          Métricas de comportamento do cliente (visualizações, pesquisas, cliques) serão adicionadas
          conforme o sistema de eventos for implementado.
        </p>
      </div>
    </div>
  );
}
