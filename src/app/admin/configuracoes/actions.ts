"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient, logAdminError } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type SettingsActionState = {
  success?: boolean;
  error?: string;
} | null;

export async function saveStoreSettings(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const anonClient = await createClient();

  const {
    data: { user },
    error: authError,
  } = await anonClient.auth.getUser();

  if (authError || !user) {
    return { error: "Não autorizado." };
  }

  const supabase = createAdminClient();

  const whatsappRaw = (formData.get("whatsapp_number") as string) ?? "";
  const whatsappDigits = whatsappRaw.replace(/\D/g, "");

  if (whatsappDigits && whatsappDigits.length < 12) {
    return {
      error:
        "Número de WhatsApp inválido. Use com código do país: 5591999999999.",
    };
  }

  let businessHoursSchedule: unknown = null;
  const scheduleRaw = formData.get("business_hours_schedule") as string;
  if (scheduleRaw) {
    try {
      businessHoursSchedule = JSON.parse(scheduleRaw);
    } catch {
      return { error: "Dados de horário inválidos. Recarregue a página." };
    }
  }

  let paymentMethods: string[] = ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito"];
  const paymentMethodsRaw = formData.get("payment_methods") as string;
  if (paymentMethodsRaw) {
    try {
      const parsed = JSON.parse(paymentMethodsRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        paymentMethods = parsed
          .map((m: unknown) => (typeof m === "string" ? m.trim() : ""))
          .filter(Boolean)
          .slice(0, 10);
      }
    } catch {
      return { error: "Dados de formas de pagamento inválidos. Recarregue a página." };
    }
  }

  if (paymentMethods.length === 0) {
    return { error: "É necessário ao menos uma forma de pagamento." };
  }

  const payload = {
    store_name:
      (formData.get("store_name") as string)?.trim() || "Norte Tecnologia",
    whatsapp_number: whatsappDigits || null,
    email: (formData.get("email") as string)?.trim() || null,
    address: (formData.get("address") as string)?.trim() || null,
    city: (formData.get("city") as string)?.trim() || null,
    state_abbr: (formData.get("state_abbr") as string)?.trim() || "PA",
    business_hours_schedule: businessHoursSchedule,
    payment_methods: paymentMethods,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("store_settings")
    .update(payload)
    .eq("id", 1);

  if (error) {
    return { error: logAdminError("saveStoreSettings", error) };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracoes");
  return { success: true };
}
