import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { WeekSchedule } from "@/lib/business-hours";

export interface StoreSettingsData {
  store_name: string;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state_abbr: string | null;
  business_hours_schedule: WeekSchedule | null;
}

const DEFAULT: StoreSettingsData = {
  store_name: "Norte Tecnologia",
  whatsapp_number: null,
  email: null,
  address: null,
  city: null,
  state_abbr: "PA",
  business_hours_schedule: null,
};

// cache() deduplicates calls within a single render pass (request-level)
export const getStoreSettings = cache(async (): Promise<StoreSettingsData> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("store_settings")
      .select(
        "store_name, whatsapp_number, email, address, city, state_abbr, business_hours_schedule"
      )
      .single();

    if (error || !data) return DEFAULT;
    return data as StoreSettingsData;
  } catch {
    return DEFAULT;
  }
});

export function buildWhatsAppUrl(number: string | null): string {
  if (!number) return "https://wa.me/";
  const digits = number.replace(/\D/g, "");
  if (digits.length < 10) return "https://wa.me/";
  return `https://wa.me/${digits}`;
}
