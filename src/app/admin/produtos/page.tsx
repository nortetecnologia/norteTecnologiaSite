import { createClient } from "@/lib/supabase/server";
import { ProdutosClient, type ProductData, type CategoryOption } from "./ProdutosClient";

export default async function AdminProdutosPage() {
  let products: ProductData[] = [];
  let categories: CategoryOption[] = [];

  try {
    const supabase = await createClient();

    // Buscar produtos com imagens
    const { data: productsRaw } = await supabase
      .from("products")
      .select(
        "id, name, description, brand, sku, barcode, internal_code, price, stock, category_id, subcategory_id, is_active, product_type, product_images(url, is_primary)"
      )
      .order("created_at", { ascending: false });

    // Buscar categorias com subcategorias
    const { data: categoriesRaw } = await supabase
      .from("categories")
      .select("id, name, subcategories(id, name)")
      .order("name", { ascending: true });

    // Montar mapa de categorias/subcategorias para lookup
    type SubcategoryRow = { id: string; name: string };
    type CategoryRow = {
      id: string;
      name: string;
      subcategories: SubcategoryRow[];
    };

    const catMap = new Map<string, { name: string; subs: Map<string, string> }>();
    for (const c of (categoriesRaw ?? []) as CategoryRow[]) {
      const subs = new Map<string, string>();
      for (const s of c.subcategories ?? []) {
        subs.set(s.id, s.name);
      }
      catMap.set(c.id, { name: c.name, subs });
    }

    // Normalizar produtos
    type ImageRow = { url: string; is_primary: boolean };
    type ProductRow = {
      id: string;
      name: string;
      description: string | null;
      brand: string | null;
      sku: string | null;
      barcode: string | null;
      internal_code: string | null;
      price: number;
      stock: number;
      category_id: string | null;
      subcategory_id: string | null;
      is_active: boolean;
      product_type: string | null;
      product_images: ImageRow[];
    };

    products = ((productsRaw ?? []) as ProductRow[]).map((p) => {
      const primaryImg =
        p.product_images?.find((img) => img.is_primary)?.url ??
        p.product_images?.[0]?.url ??
        null;

      const catEntry = p.category_id ? catMap.get(p.category_id) : undefined;
      const subcategoryName =
        catEntry && p.subcategory_id
          ? catEntry.subs.get(p.subcategory_id) ?? null
          : null;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        brand: p.brand,
        sku: p.sku,
        barcode: p.barcode,
        internal_code: p.internal_code,
        price: p.price,
        stock: p.stock,
        category_id: p.category_id,
        subcategory_id: p.subcategory_id,
        is_active: p.is_active,
        product_type: (p.product_type === "service" ? "service" : "product") as "product" | "service",
        primary_image_url: primaryImg,
        category_name: catEntry?.name ?? null,
        subcategory_name: subcategoryName,
      };
    });

    categories = ((categoriesRaw ?? []) as CategoryRow[]).map((c) => ({
      id: c.id,
      name: c.name,
      subcategories: c.subcategories ?? [],
    }));
  } catch {
    // Migration não aplicada ou banco indisponível — renderiza estado vazio
  }

  return <ProdutosClient products={products} categories={categories} />;
}
