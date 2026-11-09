-- Analytics: eventos de clique em produtos (anonimizado, sem dados pessoais)
CREATE TABLE IF NOT EXISTS analytics_events (
  id          BIGSERIAL PRIMARY KEY,
  event_type  TEXT NOT NULL,          -- 'product_view' | 'product_click'
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  product_slug TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analytics: pesquisas realizadas (anonimizado, sem dados pessoais)
CREATE TABLE IF NOT EXISTS search_queries (
  id            BIGSERIAL PRIMARY KEY,
  query         TEXT NOT NULL,
  results_count INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para relatórios
CREATE INDEX IF NOT EXISTS idx_analytics_events_product_id ON analytics_events(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created ON analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_queries_query ON search_queries(query);
CREATE INDEX IF NOT EXISTS idx_search_queries_created ON search_queries(created_at DESC);

-- RLS: apenas service_role pode ler/escrever (admin usa service_role, público não acessa)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries   ENABLE ROW LEVEL SECURITY;

-- Nenhuma policy = somente service_role tem acesso (default)
-- O tracking é feito via Server Action (service_role), nunca pelo cliente diretamente
