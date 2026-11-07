-- Migration 011: location_url em store_settings + price_max em products
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS location_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_max NUMERIC(10,2);
