import { createClient } from "@/lib/supabase/server";
import {
  VitrinasClient,
  type VitrineData,
  type ProductOption,
} from "./VitrinasClient";

export default async function AdminVitrinesPage() {
  let vitrines: VitrineData[] = [];
  let products: ProductOption[] = [];

  try {
    const supabase = await createClient();

    // Buscar vitrines com seus produtos
    const { data: vitrinesRaw } = await supabase
      .from("vitrines")
      .select(
        "id, slug, title, display_type, is_active, position, vitrine_products(id, product_id, position)"
      )
      .order("position", { ascending: true });

    // Buscar todos os produtos ativos com imagens
    const { data: productsRaw } = await supabase
      .from("products")
      .select("id, name, price, stock, product_images(url, is_primary)")
      .eq("is_active", true)
      .order("name", { ascending: true });

    type ImageRow = { url: string; is_primary: boolean };
    type ProductRaw = {
      id: string;
      name: string;
      price: number;
      stock: number;
      product_images: ImageRow[];
    };

    // Montar lookup de produtos para enriquecer vitrine_products
    const productMap = new Map<string, ProductRaw>();
    for (const p of (productsRaw ?? []) as ProductRaw[]) {
      productMap.set(p.id, p);
    }

    function getPrimaryImage(imgs: ImageRow[]): string | null {
      return imgs?.find((i) => i.is_primary)?.url ?? imgs?.[0]?.url ?? null;
    }

    type VitrineProductRaw = { id: string; product_id: string; position: number };
    type VitrineRaw = {
      id: string;
      slug: string;
      title: string;
      display_type: string;
      is_active: boolean;
      position: number;
      vitrine_products: VitrineProductRaw[];
    };

    vitrines = ((vitrinesRaw ?? []) as VitrineRaw[]).map((v) => ({
      id: v.id,
      slug: v.slug,
      title: v.title,
      display_type: v.display_type as VitrineData["display_type"],
      is_active: v.is_active,
      position: v.position,
      products: (v.vitrine_products ?? []).map((vp) => {
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
    }));

    products = ((productsRaw ?? []) as ProductRaw[]).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      primary_image_url: getPrimaryImage(p.product_images),
    }));
  } catch {
    // Migration não aplicada ou banco indisponível — renderiza estado vazio
  }

  return <VitrinasClient vitrines={vitrines} products={products} />;
}
