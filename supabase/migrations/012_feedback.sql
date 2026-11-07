-- Migration 012: tabela de feedback dos clientes (LGPD)
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Clientes (anon) podem enviar feedback apenas com consentimento explícito
CREATE POLICY "anon_insert_feedback" ON feedback
  FOR INSERT TO anon, authenticated
  WITH CHECK (consent_given = true AND message IS NOT NULL AND length(trim(message)) >= 5);

-- Admins leem e excluem via service_role (createAdminClient bypasses RLS)
-- Nenhuma política SELECT/DELETE para anon é necessária
