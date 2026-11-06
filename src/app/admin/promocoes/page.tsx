import { createAdminClient } from "@/lib/supabase/admin";
import { PromocoesClient, type PromotionData, type ProductOption } from "./PromocoesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Promoções — Norte Admin" };

export default async function PromocoesPage() {
  let promotions: PromotionData[] = [];
  let products: ProductOption[] = [];

  try {
    const supabase = createAdminClient();

    const [promosResult, productsResult] = await Promise.all([
      supabase
        .from("promotions")
        .select(`
          id, title, slug, subtitle, discount_percent,
          cover_image_url, is_active, position,
          promotion_products(id)
        `)
        .order("position", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("products")
        .select("id, name, price")
        .eq("is_active", true)
        .order("name", { ascending: true }),
    ]);

    if (promosResult.data) {
      type PromoRaw = typeof promosResult.data[0] & { promotion_products: { id: string }[] };
      promotions = (promosResult.data as PromoRaw[]).map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        subtitle: p.subtitle ?? null,
        discount_percent: p.discount_percent ?? null,
        cover_image_url: p.cover_image_url ?? null,
        is_active: p.is_active,
        position: p.position,
        product_count: p.promotion_products?.length ?? 0,
      }));
    }

    if (productsResult.data) {
      products = productsResult.data as ProductOption[];
    }
  } catch {
    // Fallback: renderiza com listas vazias, mensagem de erro aparece no form
  }

  return (
    <div className="p-6 lg:p-8">
      <PromocoesClient promotions={promotions} products={products} />
    </div>
  );
}
