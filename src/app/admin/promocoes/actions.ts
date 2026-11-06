"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient, logAdminError } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type PromoActionResult = { success?: boolean; error?: string };

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getAuthClient() {
  const anonClient = await createClient();
  const { data: { user }, error } = await anonClient.auth.getUser();
  if (error || !user) {
    console.error("[admin/promocoes] Auth falhou:", error?.message ?? "sem usuário");
    throw new Error("Não autorizado.");
  }
  return createAdminClient();
}

function revalidate() {
  revalidatePath("/admin/promocoes");
  revalidatePath("/", "layout");
  revalidatePath("/promocao", "layout");
}

export async function createPromotion(formData: FormData): Promise<PromoActionResult> {
  try {
    const supabase = await getAuthClient();

    const title = (formData.get("title") as string)?.trim();
    if (!title) return { error: "O título da promoção é obrigatório." };

    const subtitle = (formData.get("subtitle") as string)?.trim() || null;
    const discountRaw = formData.get("discount_percent") as string;
    const discountPercent = discountRaw ? parseInt(discountRaw, 10) : null;
    if (discountPercent !== null && (isNaN(discountPercent) || discountPercent < 1 || discountPercent > 99)) {
      return { error: "O desconto deve ser entre 1 e 99%." };
    }
    const coverImageUrl = (formData.get("cover_image_url") as string)?.trim() || null;

    // Check active promotions limit
    const { count: activeCount } = await supabase
      .from("promotions")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);

    if ((activeCount ?? 0) >= 4) {
      return { error: "Limite de 4 promoções ativas atingido. Desative uma promoção existente antes de criar outra." };
    }

    const baseSlug = toSlug(title);
    let slug = baseSlug;
    for (let i = 1; i <= 10; i++) {
      const { count } = await supabase
        .from("promotions")
        .select("id", { count: "exact", head: true })
        .eq("slug", slug);
      if (!count) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data: promo, error: insertError } = await supabase
      .from("promotions")
      .insert({
        title,
        slug,
        subtitle,
        discount_percent: discountPercent,
        cover_image_url: coverImageUrl,
        is_active: true,
        position: (activeCount ?? 0),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) return { error: logAdminError("createPromotion", insertError) };

    // Vincular produtos selecionados
    const productIds = (formData.get("product_ids") as string)?.split(",").filter(Boolean) ?? [];
    if (productIds.length > 0 && promo?.id) {
      const links = productIds.map((pid, idx) => ({
        promotion_id: promo.id,
        product_id: pid.trim(),
        position: idx,
      }));
      await supabase.from("promotion_products").insert(links);
    }

    revalidate();
    return { success: true };
  } catch (e) {
    console.error("[admin/promocoes] createPromotion exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function updatePromotion(id: string, formData: FormData): Promise<PromoActionResult> {
  try {
    const supabase = await getAuthClient();

    const title = (formData.get("title") as string)?.trim();
    if (!title) return { error: "O título da promoção é obrigatório." };

    const subtitle = (formData.get("subtitle") as string)?.trim() || null;
    const discountRaw = formData.get("discount_percent") as string;
    const discountPercent = discountRaw ? parseInt(discountRaw, 10) : null;
    if (discountPercent !== null && (isNaN(discountPercent) || discountPercent < 1 || discountPercent > 99)) {
      return { error: "O desconto deve ser entre 1 e 99%." };
    }
    const coverImageUrl = (formData.get("cover_image_url") as string)?.trim() || null;
    const isActive = formData.get("is_active") === "true";

    // If activating: check limit
    if (isActive) {
      const { count } = await supabase
        .from("promotions")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .neq("id", id);

      if ((count ?? 0) >= 4) {
        return { error: "Limite de 4 promoções ativas atingido. Desative uma promoção antes de ativar esta." };
      }
    }

    const { error: updateError } = await supabase
      .from("promotions")
      .update({
        title,
        subtitle,
        discount_percent: discountPercent,
        cover_image_url: coverImageUrl,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) return { error: logAdminError("updatePromotion", updateError) };

    // Atualizar produtos vinculados
    await supabase.from("promotion_products").delete().eq("promotion_id", id);
    const productIds = (formData.get("product_ids") as string)?.split(",").filter(Boolean) ?? [];
    if (productIds.length > 0) {
      const links = productIds.map((pid, idx) => ({
        promotion_id: id,
        product_id: pid.trim(),
        position: idx,
      }));
      await supabase.from("promotion_products").insert(links);
    }

    revalidate();
    return { success: true };
  } catch (e) {
    console.error("[admin/promocoes] updatePromotion exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function deletePromotion(id: string): Promise<PromoActionResult> {
  try {
    const supabase = await getAuthClient();
    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) return { error: logAdminError("deletePromotion", error) };
    revalidate();
    return { success: true };
  } catch (e) {
    console.error("[admin/promocoes] deletePromotion exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function togglePromotionActive(id: string, isActive: boolean): Promise<PromoActionResult> {
  try {
    const supabase = await getAuthClient();

    if (isActive) {
      const { count } = await supabase
        .from("promotions")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .neq("id", id);

      if ((count ?? 0) >= 4) {
        return { error: "Limite de 4 promoções ativas atingido." };
      }
    }

    const { error } = await supabase
      .from("promotions")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: logAdminError("togglePromotionActive", error) };
    revalidate();
    return { success: true };
  } catch (e) {
    console.error("[admin/promocoes] togglePromotionActive exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}
