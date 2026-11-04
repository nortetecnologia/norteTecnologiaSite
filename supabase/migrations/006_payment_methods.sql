-- Migration 006: Formas de pagamento configuráveis
-- Adiciona coluna payment_methods à tabela store_settings

ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS payment_methods TEXT[] NOT NULL DEFAULT ARRAY['Dinheiro', 'PIX', 'Cartão de Crédito', 'Cartão de Débito'];

-- Atualiza a linha existente com o default caso ela já exista com valor NULL (proteção)
UPDATE store_settings
SET payment_methods = ARRAY['Dinheiro', 'PIX', 'Cartão de Crédito', 'Cartão de Débito']
WHERE payment_methods IS NULL OR array_length(payment_methods, 1) = 0;
