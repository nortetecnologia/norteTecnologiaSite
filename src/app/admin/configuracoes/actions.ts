"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SettingsActionState = {
  success?: boolean;
  error?: string;
} | null;

export async function saveStoreSettings(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Não autorizado." };
  }

  const whatsappRaw = (formData.get("whatsapp_number") as string) ?? "";
  const whatsappDigits = whatsappRaw.replace(/\D/g, "");

  if (whatsappDigits && whatsappDigits.length < 12) {
    return {
      error:
        "Número de WhatsApp inválido. Use com código do país: 5591999999999.",
    };
  }

  const payload = {
    store_name:
      (formData.get("store_name") as string)?.trim() || "Norte Tecnologia",
    whatsapp_number: whatsappDigits || null,
    email: (formData.get("email") as string)?.trim() || null,
    address: (formData.get("address") as string)?.trim() || null,
    city: (formData.get("city") as string)?.trim() || null,
    state_abbr: (formData.get("state_abbr") as string)?.trim() || "PA",
    business_hours: (formData.get("business_hours") as string)?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("store_settings")
    .update(payload)
    .eq("id", 1);

  if (error) {
    return { error: "Erro ao salvar. Tente novamente." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracoes");
  return { success: true };
}
