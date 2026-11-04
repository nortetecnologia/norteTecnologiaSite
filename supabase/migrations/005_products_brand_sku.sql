-- =============================================================================
-- Migration 005: Extend products with brand, sku, and FK constraints
-- Executar no Supabase SQL Editor: https://app.supabase.com
-- Pré-requisito: migrations 001, 002, 003, 004 já aplicadas
-- =============================================================================

-- Adicionar campos brand e sku ao schema de produtos
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku   TEXT;

-- Índice único parcial para SKU (permite múltiplos NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku)
  WHERE sku IS NOT NULL;

-- Adicionar FK de products para categories (integridade referencial)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_products_category'
      AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT fk_products_category
      FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- Adicionar FK de products para subcategories
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_products_subcategory'
      AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT fk_products_subcategory
      FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id) ON DELETE RESTRICT;
  END IF;
END $$;
