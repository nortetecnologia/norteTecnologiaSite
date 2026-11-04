"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type VitrineActionResult = { success?: boolean; error?: string };

async function getAuthClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autorizado.");
  return supabase;
}

function revalidate() {
  revalidatePath("/admin/vitrines");
  revalidatePath("/");
}

export async function updateVitrineTitle(
  id: string,
  title: string
): Promise<VitrineActionResult> {
  try {
    const supabase = await getAuthClient();

    const trimmed = title.trim();
    if (!trimmed) return { error: "O título não pode estar vazio." };

    const { error } = await supabase
      .from("vitrines")
      .update({ title: trimmed, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: "Erro ao atualizar título da vitrine." };

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function toggleVitrineActive(
  id: string,
  isActive: boolean
): Promise<VitrineActionResult> {
  try {
    const supabase = await getAuthClient();

    const { error } = await supabase
      .from("vitrines")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: "Erro ao atualizar status da vitrine." };

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function addProductToVitrine(
  vitrineId: string,
  productId: string
): Promise<VitrineActionResult> {
  try {
    const supabase = await getAuthClient();

    // Obter posição máxima atual
    const { data: existing } = await supabase
      .from("vitrine_products")
      .select("position")
      .eq("vitrine_id", vitrineId)
      .order("position", { ascending: false })
      .limit(1);

    const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

    const { error } = await supabase.from("vitrine_products").insert({
      vitrine_id: vitrineId,
      product_id: productId,
      position: nextPosition,
    });

    if (error) {
      if (error.code === "23505")
        return { error: "Este produto já está nesta vitrine." };
      return { error: "Erro ao adicionar produto à vitrine." };
    }

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function removeProductFromVitrine(
  vitrineProductId: string
): Promise<VitrineActionResult> {
  try {
    const supabase = await getAuthClient();

    const { error } = await supabase
      .from("vitrine_products")
      .delete()
      .eq("id", vitrineProductId);

    if (error) return { error: "Erro ao remover produto da vitrine." };

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function moveVitrineProduct(
  vitrineId: string,
  vitrineProductId: string,
  direction: "up" | "down"
): Promise<VitrineActionResult> {
  try {
    const supabase = await getAuthClient();

    // Buscar todos os produtos desta vitrine ordenados por posição
    const { data: items, error: fetchError } = await supabase
      .from("vitrine_products")
      .select("id, position")
      .eq("vitrine_id", vitrineId)
      .order("position", { ascending: true });

    if (fetchError || !items) return { error: "Erro ao buscar produtos da vitrine." };

    const index = items.findIndex((item) => item.id === vitrineProductId);
    if (index === -1) return { error: "Produto não encontrado na vitrine." };

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return { success: true };

    const current = items[index];
    const neighbor = items[swapIndex];

    // Trocar posições
    const { error: e1 } = await supabase
      .from("vitrine_products")
      .update({ position: neighbor.position })
      .eq("id", current.id);

    const { error: e2 } = await supabase
      .from("vitrine_products")
      .update({ position: current.position })
      .eq("id", neighbor.id);

    if (e1 || e2) return { error: "Erro ao reordenar produtos." };

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}
