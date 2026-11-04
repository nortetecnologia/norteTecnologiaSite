"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CategoryActionResult = { success?: boolean; error?: string };

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  revalidatePath("/admin/categorias");
}

// ── Categorias ────────────────────────────────────────────────────────────────

export async function createCategory(
  name: string
): Promise<CategoryActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "O nome da categoria é obrigatório." };

  try {
    const supabase = await getAuthClient();
    const slug = toSlug(trimmed);

    const { error } = await supabase
      .from("categories")
      .insert({ name: trimmed, slug });

    if (error) {
      if (error.code === "23505")
        return { error: "Já existe uma categoria com esse nome." };
      return { error: "Erro ao criar categoria. Tente novamente." };
    }

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function updateCategory(
  id: string,
  name: string
): Promise<CategoryActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "O nome da categoria é obrigatório." };

  try {
    const supabase = await getAuthClient();
    const slug = toSlug(trimmed);

    const { error } = await supabase
      .from("categories")
      .update({ name: trimmed, slug, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      if (error.code === "23505")
        return { error: "Já existe uma categoria com esse nome." };
      return { error: "Erro ao atualizar categoria. Tente novamente." };
    }

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function deleteCategory(
  id: string
): Promise<CategoryActionResult> {
  try {
    const supabase = await getAuthClient();

    // Regra de negócio: não excluir categoria com subcategorias vinculadas
    const { count: subCount, error: subErr } = await supabase
      .from("subcategories")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (subErr) return { error: "Erro ao verificar subcategorias." };

    if (subCount && subCount > 0) {
      return {
        error: `Esta categoria possui ${subCount} subcategoria(s). Exclua as subcategorias antes de remover a categoria.`,
      };
    }

    // Regra de negócio: não excluir categoria com produtos vinculados
    const { count: prodCount, error: prodErr } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (prodErr) return { error: "Erro ao verificar produtos vinculados." };

    if (prodCount && prodCount > 0) {
      return {
        error: `Esta categoria possui ${prodCount} produto(s) vinculado(s). Desvincule os produtos antes de excluir.`,
      };
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) return { error: "Erro ao excluir categoria. Tente novamente." };

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

// ── Subcategorias ─────────────────────────────────────────────────────────────

export async function createSubcategory(
  categoryId: string,
  name: string
): Promise<CategoryActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "O nome da subcategoria é obrigatório." };

  try {
    const supabase = await getAuthClient();
    const slug = toSlug(trimmed);

    const { error } = await supabase
      .from("subcategories")
      .insert({ category_id: categoryId, name: trimmed, slug });

    if (error) {
      if (error.code === "23505")
        return { error: "Já existe uma subcategoria com esse nome." };
      return { error: "Erro ao criar subcategoria. Tente novamente." };
    }

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function updateSubcategory(
  id: string,
  name: string
): Promise<CategoryActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "O nome da subcategoria é obrigatório." };

  try {
    const supabase = await getAuthClient();
    const slug = toSlug(trimmed);

    const { error } = await supabase
      .from("subcategories")
      .update({ name: trimmed, slug, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      if (error.code === "23505")
        return { error: "Já existe uma subcategoria com esse nome." };
      return { error: "Erro ao atualizar subcategoria. Tente novamente." };
    }

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function deleteSubcategory(
  id: string
): Promise<CategoryActionResult> {
  try {
    const supabase = await getAuthClient();

    // Regra de negócio: não excluir subcategoria com produtos vinculados
    const { count, error: countErr } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("subcategory_id", id);

    if (countErr) return { error: "Erro ao verificar produtos vinculados." };

    if (count && count > 0) {
      return {
        error: `Esta subcategoria possui ${count} produto(s) vinculado(s). Desvincule os produtos antes de excluir.`,
      };
    }

    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id);

    if (error)
      return { error: "Erro ao excluir subcategoria. Tente novamente." };

    revalidate();
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}
