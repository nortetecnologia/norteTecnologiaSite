import { createClient } from "@/lib/supabase/server";
import { CategoriasClient, type CategoryData } from "./CategoriasClient";

export default async function AdminCategoriasPage() {
  let categories: CategoryData[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select(
        "id, name, slug, is_active, image_url, subcategories(id, name, slug, is_active)"
      )
      .order("name", { ascending: true });

    if (data) {
      categories = data as unknown as CategoryData[];
    }
  } catch {
    // Migration not applied yet — render empty state
  }

  return <CategoriasClient categories={categories} />;
}
