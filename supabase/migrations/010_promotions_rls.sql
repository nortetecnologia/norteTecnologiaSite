-- Migration 010: Políticas RLS para leitura pública de promoções ativas
-- Executar no Supabase SQL Editor

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_products ENABLE ROW LEVEL SECURITY;

-- Leitura pública: apenas promoções ativas (homepage e página de promoção)
CREATE POLICY "public_read_active_promotions"
  ON promotions FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Leitura dos produtos vinculados a promoções ativas
CREATE POLICY "public_read_promotion_products"
  ON promotion_products FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM promotions p
      WHERE p.id = promotion_products.promotion_id
        AND p.is_active = true
    )
  );
