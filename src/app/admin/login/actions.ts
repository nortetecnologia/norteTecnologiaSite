"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getClientIP, slidingWindow } from "@/lib/rateLimit";

export async function login(
  formData: FormData
): Promise<{ error: string } | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Preencha todos os campos." };
  }

  const ip = await getClientIP();
  if (!slidingWindow(`login:${ip}`, 10, 15 * 60_000)) {
    return { error: "Muitas tentativas de login. Aguarde 15 minutos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email ou senha inválidos." };
  }

  redirect("/admin");
}
