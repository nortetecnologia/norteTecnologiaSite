"use server";

import { createClient } from "@/lib/supabase/server";

export type FeedbackSubmitResult = { success?: boolean; error?: string };

export async function submitFeedback(
  _prevState: FeedbackSubmitResult | null,
  formData: FormData
): Promise<FeedbackSubmitResult> {
  const message = (formData.get("message") as string)?.trim();
  if (!message || message.length < 5) {
    return { error: "A mensagem deve ter pelo menos 5 caracteres." };
  }
  if (message.length > 2000) {
    return { error: "A mensagem não pode ultrapassar 2000 caracteres." };
  }

  const consent = formData.get("consent_given") === "on";
  if (!consent) {
    return { error: "É necessário aceitar os termos para enviar o feedback." };
  }

  const name = (formData.get("name") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Informe um e-mail válido ou deixe em branco." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("feedback").insert({
      name,
      email,
      message,
      consent_given: true,
    });

    if (error) {
      console.error("[submitFeedback] Supabase error:", error.message);
      return { error: "Não foi possível enviar. Tente novamente." };
    }

    return { success: true };
  } catch (e) {
    console.error("[submitFeedback] exception:", e);
    return { error: "Erro inesperado. Tente novamente." };
  }
}
