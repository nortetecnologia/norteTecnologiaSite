import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  categoryName: string | null;
  categorySlug: string | null;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, product_images(url, is_primary), category:categories(name, slug)")
    .or(`name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`)
    .eq("is_active", true)
    .limit(6);

  type RawImg = { url: string; is_primary: boolean };
  type RawCat = { name: string; slug: string } | null;
  type RawRow = {
    id: string;
    name: string;
    slug: string;
    price: number;
    product_images: RawImg[] | null;
    category: RawCat;
  };

  const results: SearchSuggestion[] = ((data ?? []) as unknown as RawRow[]).map((p) => {
    const imgs = p.product_images ?? [];
    const imageUrl = imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      imageUrl,
      categoryName: p.category?.name ?? null,
      categorySlug: p.category?.slug ?? null,
    };
  });

  return NextResponse.json(results);
}
