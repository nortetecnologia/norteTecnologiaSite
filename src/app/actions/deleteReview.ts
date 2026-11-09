"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteReview(reviewId: string): Promise<{ error?: string }> {
  if (!reviewId) return { error: "ID inválido." };

  const anonClient = await createClient();
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) return { error: "Não autorizado." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("product_reviews").delete().eq("id", reviewId);

  if (error) return { error: error.message };

  revalidatePath("/admin/relatorios");
  return {};
}
