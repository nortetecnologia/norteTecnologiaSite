-- =============================================================================
-- Migration 004: Horário de Funcionamento Detalhado
-- Adiciona coluna JSONB para configuração por dia da semana
-- Executar no Supabase SQL Editor: https://app.supabase.com
-- Pré-requisito: migrations 001, 002 e 003 já aplicadas
-- =============================================================================

ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS business_hours_schedule JSONB;

-- Estrutura esperada (exemplo):
-- {
--   "monday":    { "open": true,  "openTime": "08:00", "closeTime": "18:00", "hasLunch": true,  "lunchStart": "12:00", "lunchEnd": "13:00" },
--   "tuesday":   { "open": true,  "openTime": "08:00", "closeTime": "18:00", "hasLunch": true,  "lunchStart": "12:00", "lunchEnd": "13:00" },
--   "wednesday": { "open": true,  "openTime": "08:00", "closeTime": "18:00", "hasLunch": true,  "lunchStart": "12:00", "lunchEnd": "13:00" },
--   "thursday":  { "open": true,  "openTime": "08:00", "closeTime": "18:00", "hasLunch": true,  "lunchStart": "12:00", "lunchEnd": "13:00" },
--   "friday":    { "open": true,  "openTime": "08:00", "closeTime": "18:00", "hasLunch": true,  "lunchStart": "12:00", "lunchEnd": "13:00" },
--   "saturday":  { "open": true,  "openTime": "08:00", "closeTime": "13:00", "hasLunch": false, "lunchStart": "12:00", "lunchEnd": "13:00" },
--   "sunday":    { "open": false, "openTime": "08:00", "closeTime": "18:00", "hasLunch": false, "lunchStart": "12:00", "lunchEnd": "13:00" }
-- }
