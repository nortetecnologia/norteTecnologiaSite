import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    const missing = [!url && "NEXT_PUBLIC_SUPABASE_URL", !key && "SUPABASE_SECRET_KEY"]
      .filter(Boolean)
      .join(", ");
    console.error(`[admin] Variáveis de ambiente ausentes: ${missing}`);
    throw new Error(
      `Configuração de banco de dados ausente (${missing}). Adicione nas variáveis de ambiente da Vercel e faça um novo deploy.`
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

type SupabaseError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

const PG_CODES: Record<string, string> = {
  "42P01": "Tabela não encontrada — as migrations precisam ser aplicadas no Supabase SQL Editor.",
  "42501": "Sem permissão de escrita — verifique se SUPABASE_SECRET_KEY é a chave service_role correta.",
  "23503": "Violação de chave estrangeira — verifique os IDs relacionados.",
  "PGRST301": "JWT expirado ou inválido — faça login novamente.",
  "PGRST116": "Nenhum registro encontrado.",
};

export function logAdminError(context: string, error: SupabaseError): string {
  console.error(`[admin] ${context}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  if (error.code && PG_CODES[error.code]) {
    return PG_CODES[error.code];
  }

  const parts: string[] = [];
  if (error.message) parts.push(error.message);
  if (error.hint) parts.push(`Dica: ${error.hint}`);
  if (error.code) parts.push(`[${error.code}]`);
  return parts.join(" — ") || "Erro desconhecido no banco de dados.";
}
