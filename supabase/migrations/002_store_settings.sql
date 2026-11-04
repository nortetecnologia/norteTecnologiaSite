-- =============================================================================
-- Migration 002: Configurações da Loja
-- Executar no Supabase SQL Editor: https://app.supabase.com
-- Pré-requisito: migration 001_vitrines.sql já aplicada
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.store_settings (
  id             INTEGER PRIMARY KEY DEFAULT 1,
  store_name     TEXT    NOT NULL DEFAULT 'Norte Tecnologia',
  whatsapp_number TEXT,
  email          TEXT,
  address        TEXT,
  city           TEXT,
  state_abbr     TEXT    NOT NULL DEFAULT 'PA',
  business_hours TEXT,
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Linha padrão (criada uma única vez)
INSERT INTO public.store_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Leitura pública: o site público precisa carregar o número do WhatsApp
CREATE POLICY "store_settings_public_read"
  ON public.store_settings
  FOR SELECT
  USING (true);

-- Escrita apenas para usuários autenticados (admin)
CREATE POLICY "store_settings_admin_update"
  ON public.store_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
