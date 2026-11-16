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

  const rawEmail = (formData.get("email") as string)?.trim() || null;
  if (rawEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
    return { error: "Email de contato inválido." };
  }

  const locationUrl = (formData.get("location_url") as string)?.trim() || null;
  if (locationUrl) {
    try {
      const parsed = new URL(locationUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return { error: "URL de localização deve começar com http:// ou https://." };
      }
    } catch {
      return { error: "URL de localização inválida." };
    }
  }

  // Telefone fixo/comercial (separado do WhatsApp). Guardado como foi digitado.
  const phoneRaw = (formData.get("phone_number") as string)?.trim() || null;
  if (phoneRaw && phoneRaw.replace(/\D/g, "").length < 8) {
    return { error: "Telefone inválido. Informe DDD + número ou deixe em branco." };
  }

  // CNPJ (opcional). Aceita com ou sem máscara; valida 14 dígitos quando preenchido.
  const cnpjRaw = (formData.get("cnpj") as string)?.trim() || null;
  if (cnpjRaw && cnpjRaw.replace(/\D/g, "").length !== 14) {
    return { error: "CNPJ inválido. Deve ter 14 dígitos ou ficar em branco." };
  }

  const payload = {
    store_name:
      (formData.get("store_name") as string)?.trim() || "Norte Tecnologia",
    whatsapp_number: whatsappDigits || null,
    phone_number: phoneRaw,
    cnpj: cnpjRaw,
    email: rawEmail,
    address: (formData.get("address") as string)?.trim() || null,
    city: (formData.get("city") as string)?.trim() || null,
    state_abbr: (formData.get("state_abbr") as string)?.trim() || "PA",
    business_hours_schedule: businessHoursSchedule,
    payment_methods: paymentMethods,
    location_url: locationUrl,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("store_settings")
    .update(payload)
    .eq("id", 1);

  if (error) {
    return { error: logAdminError("saveStoreSettings", error) };
  }

  // Sincroniza a tabela relacional payment_methods (compartilhada com o ERP).
  // store_settings.payment_methods continua sendo a fonte de verdade do site;
  // esta sincronização é best-effort para o ERP não ficar com métodos defasados.
  // Nunca deleta linhas (FK ON DELETE RESTRICT em erp_pdv_sale_payments): apenas
  // marca tudo inativo e faz upsert dos ativos.
  await syncPaymentMethods(supabase, paymentMethods);

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracoes");
  return { success: true };
}

function slugifyMethod(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function syncPaymentMethods(
  supabase: ReturnType<typeof createAdminClient>,
  labels: string[]
): Promise<void> {
  try {
    // Dedupe por name: dois rótulos distintos podem gerar o mesmo slug, o que
    // quebraria o upsert (onConflict não pode afetar a mesma linha duas vezes).
    const byName = new Map<string, { name: string; label: string; is_active: boolean; position: number }>();
    labels.forEach((label, i) => {
      const name = slugifyMethod(label) || `metodo_${i}`;
      if (!byName.has(name)) byName.set(name, { name, label, is_active: true, position: i });
    });
    const active = Array.from(byName.values());
    if (active.length === 0) return;

    // Marca todos inativos; o upsert restaura os ativos (sem deletar).
    await supabase.from("payment_methods").update({ is_active: false }).gt("id", 0);
    await supabase.from("payment_methods").upsert(active, { onConflict: "name" });
  } catch (e) {
    console.error("[saveStoreSettings] sync payment_methods falhou:", e);
  }
}
