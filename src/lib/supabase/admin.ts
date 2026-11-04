import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com service_role (SUPABASE_SECRET_KEY).
 * Usado exclusivamente em Server Actions e Route Handlers após verificação de auth.
 * Bypassa RLS para garantir que operações admin funcionem independente das políticas.
 * NUNCA usar no cliente (browser) nem expor a chave para o frontend.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Configuração de banco de dados ausente. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY nas variáveis de ambiente."
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
