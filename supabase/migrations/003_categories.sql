-- =============================================================================
-- Migration 003: Categorias e Subcategorias
-- Executar no Supabase SQL Editor: https://app.supabase.com
-- Pré-requisito: migrations 001 e 002 já aplicadas
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  position   INTEGER NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subcategories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  position    INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para buscas por categoria
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);

-- RLS
ALTER TABLE public.categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Leitura pública: o site público exibe categorias ativas no menu e filtros
CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT USING (is_active = true);

CREATE POLICY "subcategories_public_read"
  ON public.subcategories FOR SELECT USING (is_active = true);

-- Escrita apenas para admin autenticado
CREATE POLICY "categories_admin_all"
  ON public.categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "subcategories_admin_all"
  ON public.subcategories FOR ALL USING (auth.role() = 'authenticated');
