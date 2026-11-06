-- =============================================================================
-- Migration 009: Ajustes de schema
--   • image_url na tabela categories (upload de imagem de categoria)
--   • barcode e internal_code na tabela products (já usados pelo admin)
-- Executar no Supabase SQL Editor: https://app.supabase.com
-- Pré-requisito: migrations 001–008 já aplicadas
-- =============================================================================

-- Coluna de imagem para categorias
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Colunas de código para produtos (caso ainda não existam — idempotente)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS barcode TEXT;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS internal_code TEXT;
