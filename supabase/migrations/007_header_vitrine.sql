-- =============================================================================
-- Migration 007: Vitrine Header + content_type em vitrines
-- Executar no Supabase SQL Editor: https://app.supabase.com
-- Pré-requisito: migrations 001–006 já aplicadas
-- =============================================================================

-- Adiciona content_type às vitrines (produtos ou categorias)
ALTER TABLE public.vitrines
  ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'products'
  CHECK (content_type IN ('products', 'categories'));

-- Tabela de categorias vinculadas a vitrines (para content_type = 'categories')
CREATE TABLE IF NOT EXISTS public.vitrine_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vitrine_id  UUID NOT NULL REFERENCES public.vitrines(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vitrine_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_vitrine_categories_vitrine_id ON public.vitrine_categories(vitrine_id);

-- RLS para vitrine_categories
ALTER TABLE public.vitrine_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vitrine_categories_public_read" ON public.vitrine_categories;
CREATE POLICY "vitrine_categories_public_read"
  ON public.vitrine_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "vitrine_categories_admin_all" ON public.vitrine_categories;
CREATE POLICY "vitrine_categories_admin_all"
  ON public.vitrine_categories FOR ALL USING (auth.role() = 'authenticated');

-- Vitrine especial para os destaques do header (Row 2)
INSERT INTO public.vitrines (slug, title, display_type, is_active, position, content_type)
VALUES ('vitrine_header', 'Destaques do Header', 'row', true, 100, 'products')
ON CONFLICT (slug) DO NOTHING;
