import { createClient } from "@/lib/supabase/server";
import {
  VitrinasClient,
  type VitrineData,
  type ProductOption,
  type CategoryOption,
} from "./VitrinasClient";

export default async function AdminVitrinesPage() {
  let vitrines: VitrineData[] = [];
  let products: ProductOption[] = [];
  let categories: CategoryOption[] = [];

  try {
    const supabase = await createClient();

    // Buscar vitrines com produtos e categorias vinculadas
    const { data: vitrinesRaw } = await supabase
      .from("vitrines")
      .select(
        "id, slug, title, display_type, is_active, position, content_type, vitrine_products(id, product_id, position), vitrine_categories(id, category_id, position)"
      )
      .order("position", { ascending: true });

    // Buscar todos os produtos ativos com imagens
    const { data: productsRaw } = await supabase
      .from("products")
      .select("id, name, price, stock, product_images(url, is_primary)")
      .eq("is_active", true)
      .order("name", { ascending: true });

    // Buscar todas as categorias ativas
    const { data: categoriesRaw } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("position", { ascending: true });

    type ImageRow = { url: string; is_primary: boolean };
    type ProductRaw = {
      id: string;
      name: string;
      price: number;
      stock: number;
      product_images: ImageRow[];
    };
    type CategoryRaw = { id: string; name: string; slug: string };

    const productMap = new Map<string, ProductRaw>();
    for (const p of (productsRaw ?? []) as ProductRaw[]) {
      productMap.set(p.id, p);
    }

    const categoryMap = new Map<string, CategoryRaw>();
    for (const c of (categoriesRaw ?? []) as CategoryRaw[]) {
      categoryMap.set(c.id, c);
    }

    function getPrimaryImage(imgs: ImageRow[]): string | null {
      return imgs?.find((i) => i.is_primary)?.url ?? imgs?.[0]?.url ?? null;
    }

    type VitrineProductRaw = { id: string; product_id: string; position: number };
    type VitrineCategoryRaw = { id: string; category_id: string; position: number };
    type VitrineRaw = {
      id: string;
      slug: string;
      title: string;
      display_type: string;
      is_active: boolean;
      position: number;
      content_type: string;
      vitrine_products: VitrineProductRaw[];
      vitrine_categories: VitrineCategoryRaw[];
    };

    vitrines = ((vitrinesRaw ?? []) as VitrineRaw[]).map((v) => ({
      id: v.id,
      slug: v.slug,
      title: v.title,
      display_type: v.display_type as VitrineData["display_type"],
      is_active: v.is_active,
      position: v.position,
      content_type: (v.content_type ?? "products") as "products" | "categories",
      products: (v.vitrine_products ?? [])
        .sort((a, b) => a.position - b.position)
        .map((vp) => {
          const prod = productMap.get(vp.product_id);
          return {
            vitrine_product_id: vp.id,
            product_id: vp.product_id,
            product_name: prod?.name ?? "Produto removido",
            position: vp.position,
            price: prod?.price ?? 0,
            stock: prod?.stock ?? 0,
            primary_image_url: prod ? getPrimaryImage(prod.product_images) : null,
          };
        }),
      vitrine_categories: (v.vitrine_categories ?? [])
        .sort((a, b) => a.position - b.position)
        .map((vc) => {
          const cat = categoryMap.get(vc.category_id);
          return {
            vitrine_category_id: vc.id,
            category_id: vc.category_id,
            category_name: cat?.name ?? "Categoria removida",
            category_slug: cat?.slug ?? "",
            position: vc.position,
          };
        }),
    }));

    products = ((productsRaw ?? []) as ProductRaw[]).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      primary_image_url: getPrimaryImage(p.product_images),
    }));

    categories = ((categoriesRaw ?? []) as CategoryRaw[]).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));
  } catch {
    // Migration não aplicada ou banco indisponível — renderiza estado vazio
  }

  return <VitrinasClient vitrines={vitrines} products={products} categories={categories} />;
}
