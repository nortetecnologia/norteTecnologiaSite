"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient, logAdminError } from "@/lib/supabase/admin";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export type ProductActionResult = { success?: boolean; error?: string };

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
  const {
    data: { user },
    error,
  } = await anonClient.auth.getUser();
  if (error || !user) {
    console.error("[admin/produtos] Auth falhou:", error?.message ?? "sem usuário");
    throw new Error("Não autorizado.");
  }
  return createAdminClient();
}

function revalidate() {
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function createProduct(
  formData: FormData
): Promise<ProductActionResult> {
  try {
    const supabase = await getAuthClient();

    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "O nome do produto é obrigatório." };

    const priceRaw = (formData.get("price") as string)?.replace(",", ".");
    const price = parseFloat(priceRaw);
    if (isNaN(price) || price < 0)
      return { error: "Informe um preço válido (≥ 0)." };

    const stockRaw = parseInt(formData.get("stock") as string, 10);
    if (isNaN(stockRaw) || stockRaw < 0)
      return { error: "O estoque deve ser um número inteiro não negativo." };

    const description = (formData.get("description") as string)?.trim() || null;
    const brand = (formData.get("brand") as string)?.trim() || null;
    const sku = (formData.get("sku") as string)?.trim() || null;
    const categoryId = (formData.get("category_id") as string) || null;
    const subcategoryId = (formData.get("subcategory_id") as string) || null;
    const imageUrl = (formData.get("image_url") as string)?.trim() || null;
    const rawType = (formData.get("product_type") as string) || "product";
    const productType = rawType === "service" ? "service" : "product";
    const barcode = productType === "product" ? ((formData.get("barcode") as string)?.trim() || null) : null;
    const internalCode = (formData.get("internal_code") as string)?.trim() || null;

    const priceMaxRaw = (formData.get("price_max") as string)?.replace(",", ".");
    const priceMax = productType === "service" && priceMaxRaw ? parseFloat(priceMaxRaw) : null;
    if (priceMax !== null && (isNaN(priceMax) || priceMax < price)) {
      return { error: "O preço máximo deve ser maior ou igual ao preço mínimo." };
    }

    // Gerar slug único
    const baseSlug = toSlug(name);
    let slug = baseSlug;
    for (let i = 1; i <= 10; i++) {
      const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("slug", slug);
      if (!count) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        brand,
        sku: sku || null,
        barcode,
        internal_code: internalCode,
        price,
        price_max: priceMax,
        stock: stockRaw,
        category_id: categoryId || null,
        subcategory_id: subcategoryId || null,
        product_type: productType,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      if (insertError.code === "23505")
        return { error: "Já existe um produto com esse SKU ou nome." };
      return { error: logAdminError("createProduct", insertError) };
    }

    if (imageUrl && product?.id) {
      await supabase.from("product_images").insert({
        product_id: product.id,
        url: imageUrl,
        alt: name,
        is_primary: true,
        position: 0,
      });
    }

    revalidate();
    return { success: true };
  } catch (e) {
    console.error("[admin/produtos] createProduct exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function updateProduct(
  id: string,
  formData: FormData
): Promise<ProductActionResult> {
  try {
    const supabase = await getAuthClient();

    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "O nome do produto é obrigatório." };

    const priceRaw = (formData.get("price") as string)?.replace(",", ".");
    const price = parseFloat(priceRaw);
    if (isNaN(price) || price < 0)
      return { error: "Informe um preço válido (≥ 0)." };

    const stockRaw = parseInt(formData.get("stock") as string, 10);
    if (isNaN(stockRaw) || stockRaw < 0)
      return { error: "O estoque deve ser um número inteiro não negativo." };

    const description = (formData.get("description") as string)?.trim() || null;
    const brand = (formData.get("brand") as string)?.trim() || null;
    const sku = (formData.get("sku") as string)?.trim() || null;
    const categoryId = (formData.get("category_id") as string) || null;
    const subcategoryId = (formData.get("subcategory_id") as string) || null;
    const imageUrl = (formData.get("image_url") as string)?.trim() || null;
    const isActive = formData.get("is_active") === "true";
    const rawType = (formData.get("product_type") as string) || "product";
    const productType = rawType === "service" ? "service" : "product";
    const barcode = productType === "product" ? ((formData.get("barcode") as string)?.trim() || null) : null;
    const internalCode = (formData.get("internal_code") as string)?.trim() || null;

    const priceMaxRawU = (formData.get("price_max") as string)?.replace(",", ".");
    const priceMaxU = productType === "service" && priceMaxRawU ? parseFloat(priceMaxRawU) : null;
    if (priceMaxU !== null && (isNaN(priceMaxU) || priceMaxU < price)) {
      return { error: "O preço máximo deve ser maior ou igual ao preço mínimo." };
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        description,
        brand,
        sku: sku || null,
        barcode,
        internal_code: internalCode,
        price,
        price_max: priceMaxU,
        stock: stockRaw,
        category_id: categoryId || null,
        subcategory_id: subcategoryId || null,
        product_type: productType,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      if (updateError.code === "23505")
        return { error: "Já existe um produto com esse SKU." };
      return { error: logAdminError("updateProduct", updateError) };
    }

    // Atualizar imagem principal
    if (imageUrl) {
      const { data: existing } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", id)
        .eq("is_primary", true)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("product_images")
          .update({ url: imageUrl, alt: name })
          .eq("id", existing.id);
      } else {
        await supabase.from("product_images").insert({
          product_id: id,
          url: imageUrl,
          alt: name,
          is_primary: true,
          position: 0,
        });
      }
    } else {
      await supabase
        .from("product_images")
        .delete()
        .eq("product_id", id)
        .eq("is_primary", true);
    }

    revalidate();
    return { success: true };
  } catch (e) {
    console.error("[admin/produtos] updateProduct exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function deleteProduct(
  id: string
): Promise<ProductActionResult> {
  try {
    const supabase = await getAuthClient();

    // Regra de negócio: verificar vínculos em vitrines antes de excluir
    const { count: vitrineCount, error: vitrineErr } = await supabase
      .from("vitrine_products")
      .select("id", { count: "exact", head: true })
      .eq("product_id", id);

    if (vitrineErr) return { error: logAdminError("deleteProduct/vitrinecheck", vitrineErr) };

    if (vitrineCount && vitrineCount > 0) {
      return {
        error: `Este produto está em ${vitrineCount} vitrine(s). Remova das vitrines antes de excluir.`,
      };
    }

    const { data: product } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) return { error: logAdminError("deleteProduct", error) };

    if (product?.image_url) await deleteCloudinaryImage(product.image_url);

    revalidate();
    return { success: true };
  } catch (e) {
    console.error("[admin/produtos] deleteProduct exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}

export async function toggleProductActive(
  id: string,
  isActive: boolean
): Promise<ProductActionResult> {
  try {
    const supabase = await getAuthClient();

    const { error } = await supabase
      .from("products")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: logAdminError("toggleProductActive", error) };

    revalidate();
    return { success: true };
  } catch (e) {
    console.error("[admin/produtos] toggleProductActive exception:", e);
    return { error: e instanceof Error ? e.message : "Erro inesperado." };
  }
}
