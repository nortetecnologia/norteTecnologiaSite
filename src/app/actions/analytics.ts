"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function trackProductClick(productId: string, productSlug: string): Promise<void> {
  if (!productId || !productSlug) return;
  try {
    const supabase = createAdminClient();
    await supabase.from("analytics_events").insert({
      event_type: "product_click",
      product_id: productId,
      product_slug: productSlug,
    });
  } catch {}
}

export async function trackSearch(query: string, resultsCount: number): Promise<void> {
  const q = query?.trim();
  if (!q || q.length < 2) return;
  try {
    const supabase = createAdminClient();
    await supabase.from("search_queries").insert({
      query: q.toLowerCase(),
      results_count: resultsCount,
    });
  } catch {}
}
