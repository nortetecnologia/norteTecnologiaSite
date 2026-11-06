-- Migration 008: Área de promoções
-- Executar no Supabase SQL Editor

-- Tabela principal de promoções
CREATE TABLE IF NOT EXISTS promotions (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,
  subtitle        text,
  discount_percent integer CHECK (discount_percent BETWEEN 1 AND 99),
  cover_image_url text,
  is_active       boolean NOT NULL DEFAULT true,
  position        integer NOT NULL DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Tabela de produtos vinculados à promoção
CREATE TABLE IF NOT EXISTS promotion_products (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  promotion_id  uuid NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  product_id    uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position      integer NOT NULL DEFAULT 0,
  UNIQUE(promotion_id, product_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_promotions_active_position
  ON promotions (is_active, position);

CREATE INDEX IF NOT EXISTS idx_promotion_products_promotion_id
  ON promotion_products (promotion_id);
