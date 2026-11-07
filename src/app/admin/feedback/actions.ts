"use server";

import { createAdminClient, logAdminError } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type FeedbackActionResult = { success?: boolean; error?: string };

export async function deleteFeedback(id: string): Promise<FeedbackActionResult> {
  try {
    const anonClient = await createClient();
    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) return { error: "Não autorizado." };

    const supabase = createAdminClient();
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) return { error: logAdminError("deleteFeedback", error) };

    revalidatePath("/admin/feedback");
    return { success: true };
  } catch (e) {
    console.error("[admin/feedback] deleteFeedback exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}
