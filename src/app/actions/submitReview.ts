"use server";

import { createClient } from "@/lib/supabase/server";

export type ReviewSubmitResult = { success?: boolean; error?: string };

export async function submitReview(
  _prevState: ReviewSubmitResult | null,
  formData: FormData
): Promise<ReviewSubmitResult> {
  const productId = (formData.get("product_id") as string)?.trim();
  const name = (formData.get("name") as string)?.trim() || null;
  const ratingRaw = formData.get("rating") as string;
  const message = (formData.get("message") as string)?.trim();

  if (!productId) return { error: "Produto não identificado." };

  const rating = parseInt(ratingRaw, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Selecione uma avaliação de 1 a 5 estrelas." };
  }

  if (!message || message.length < 5) {
    return { error: "O comentário deve ter pelo menos 5 caracteres." };
  }
  if (message.length > 2000) {
    return { error: "O comentário não pode ter mais de 2000 caracteres." };
  }

  if (name && name.length > 80) {
    return { error: "O nome não pode ter mais de 80 caracteres." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      name: name || null,
      rating,
      message,
    });

    if (error) {
      console.error("[submitReview]", error);
      return { error: "Não foi possível enviar sua avaliação. Tente novamente." };
    }

    return { success: true };
  } catch {
    return { error: "Erro inesperado. Tente novamente." };
  }
}
