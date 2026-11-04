-- =============================================================================
-- Migration 001: Vitrines e Produtos
-- Executar no Supabase SQL Editor: https://app.supabase.com
-- =============================================================================

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stock       INTEGER NOT NULL DEFAULT 0,
  category_id UUID,
  subcategory_id UUID,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de imagens de produtos
CREATE TABLE IF NOT EXISTS product_images (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id           UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url                  TEXT NOT NULL,
  alt                  TEXT,
  is_primary           BOOLEAN NOT NULL DEFAULT false,
  cloudinary_public_id TEXT,
  position             INTEGER NOT NULL DEFAULT 0
);

-- Tabela de vitrines
CREATE TABLE IF NOT EXISTS vitrines (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,        -- 'vitrine_principal', 'vitrine_2', 'vitrine_3'
  title        TEXT NOT NULL,
  display_type TEXT NOT NULL DEFAULT 'grid' CHECK (display_type IN ('carousel', 'grid', 'row')),
  is_active    BOOLEAN NOT NULL DEFAULT true,
  position     INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produtos por vitrine (N:N)
CREATE TABLE IF NOT EXISTS vitrine_products (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vitrine_id UUID NOT NULL REFERENCES vitrines(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position   INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vitrine_id, product_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_vitrine_products_vitrine_id ON vitrine_products(vitrine_id);
CREATE INDEX IF NOT EXISTS idx_vitrine_products_product_id ON vitrine_products(product_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active_stock    ON products(is_active, stock);

-- Dados iniciais das vitrines
INSERT INTO vitrines (slug, title, display_type, position) VALUES
  ('vitrine_principal', 'Produtos em Destaque', 'carousel', 0),
  ('vitrine_2',         'Mais Vendidos',         'grid',     1),
  ('vitrine_3',         'Lançamentos',           'grid',     2)
ON CONFLICT (slug) DO NOTHING;

-- RLS: habilitar segurança de linha
ALTER TABLE vitrines         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitrine_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images   ENABLE ROW LEVEL SECURITY;

-- Políticas: leitura pública para dados ativos
CREATE POLICY "Vitrines ativas sao publicas" ON vitrines
  FOR SELECT USING (is_active = true);

CREATE POLICY "Produtos das vitrines sao publicos" ON vitrine_products
  FOR SELECT USING (true);

CREATE POLICY "Produtos ativos com estoque sao publicos" ON products
  FOR SELECT USING (is_active = true AND stock > 0);

CREATE POLICY "Imagens de produtos sao publicas" ON product_images
  FOR SELECT USING (true);

-- Políticas: escrita apenas para usuários autenticados (admin)
CREATE POLICY "Admin pode gerenciar vitrines" ON vitrines
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode gerenciar vitrine_products" ON vitrine_products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode gerenciar produtos" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode gerenciar imagens" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');
