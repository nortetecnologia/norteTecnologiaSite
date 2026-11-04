# Norte Tecnologia — Plataforma de E-commerce

Plataforma de comércio eletrônico da **Norte Tecnologia**, desenvolvida com Next.js 15, TypeScript e Tailwind CSS.

Permite que clientes conheçam produtos e serviços de informática, montem pedidos e entrem em contato com a empresa via WhatsApp para finalizar a compra ou solicitar um atendimento técnico.

---

## Stack Tecnológica

| Camada         | Tecnologia                      |
|----------------|---------------------------------|
| Frontend       | Next.js 15 + TypeScript         |
| Estilo         | Tailwind CSS                    |
| Banco de Dados | Supabase (PostgreSQL)           |
| Autenticação   | Supabase Auth                   |
| Imagens        | Cloudinary                      |
| Hospedagem     | Vercel                          |

---

## Funcionalidades Planejadas

### Loja Pública
- Catálogo de produtos e serviços com categorias e subcategorias
- Vitrines configuráveis na página inicial
- Página individual de produto com galeria de imagens e variações
- Carrinho de compras com persistência
- Checkout com encaminhamento automático para WhatsApp
- Busca inteligente com correspondência parcial
- Avaliações de produtos

### Painel Administrativo (`/admin`)
- Gestão de produtos, serviços, categorias e vitrines
- Controle de estoque com histórico de movimentações
- Importação de XML para sincronização com o CRM
- Upload de imagens via Cloudinary
- Relatórios e métricas de desempenho
- Configurações gerais da loja (WhatsApp, formas de pagamento, etc.)
- Backup e restauração de dados

---

## Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Página inicial
│   ├── globals.css         # Estilos globais e tokens CSS
│   ├── categoria/          # Páginas de categorias
│   ├── produto/            # Páginas de produtos
│   ├── carrinho/           # Carrinho de compras
│   ├── checkout/           # Fluxo de checkout
│   └── admin/              # Painel administrativo (protegido)
│
├── components/
│   ├── ui/                 # Componentes genéricos reutilizáveis
│   ├── layout/             # Header, Footer e estruturas compartilhadas
│   ├── store/              # Componentes da loja (card de produto, vitrine, etc.)
│   └── admin/              # Componentes exclusivos do painel
│
├── lib/
│   ├── supabase/           # Cliente Supabase e queries
│   ├── cloudinary/         # Integração com Cloudinary
│   └── utils.ts            # Funções utilitárias
│
└── types/
    └── index.ts            # Tipos TypeScript do domínio
```

---

## Identidade Visual

| Token              | Valor     | Uso                         |
|--------------------|-----------|-----------------------------|
| `brand-yellow`     | `#FFD600` | CTA primário, destaques      |
| `brand-blue`       | `#1E4FA0` | Seções, acento secundário    |
| `brand-black`      | `#0A0A0A` | Fundo principal              |
| `brand-gray-dark`  | `#1A1A1A` | Fundo de seções alternadas   |
| `brand-gray-mid`   | `#2A2A2A` | Bordas, separadores          |

---

## Configuração do Ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha as variáveis:

```bash
cp .env.example .env.local
```

| Variável                       | Descrição                         |
|--------------------------------|-----------------------------------|
| `NEXT_PUBLIC_SITE_URL`         | URL pública da aplicação          |
| `NEXT_PUBLIC_SUPABASE_URL`     | URL do projeto Supabase           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Chave pública (anon) do Supabase  |
| `SUPABASE_SECRET_KEY`          | Chave secreta (service_role)      |
| `CLOUDINARY_CLOUD_NAME`        | Nome do cloud no Cloudinary       |
| `CLOUDINARY_API_KEY`           | Chave pública da API Cloudinary   |
| `CLOUDINARY_API_SECRET`        | Chave secreta da API Cloudinary   |

> **Nunca** inclua `.env.local` no Git. O arquivo `.env.example` contém apenas os nomes das variáveis, sem valores reais.

---

## Executando Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Verificação de tipos
npx tsc --noEmit

# Lint
npm run lint
```

O servidor de desenvolvimento estará disponível em [http://localhost:3000](http://localhost:3000).

---

## Documentação do Projeto

A documentação completa fica em [`Sobre o projeto/`](./Sobre%20o%20projeto/):

| Documento | Conteúdo |
|-----------|----------|
| [`Contextos/Sobre o projeto`](./Sobre%20o%20projeto/Contextos/Sobre%20o%20projeto%20-%20Norte%20Tecnologia.md) | Apresentação, objetivos e regras do agente |
| [`Arquitetura/STACK`](./Sobre%20o%20projeto/Arquitetura/STACK.md) | Stack tecnológica e diretrizes arquiteturais |
| [`Arquitetura/Rotas`](./Sobre%20o%20projeto/Arquitetura/Rotas.md) | Mapa de rotas públicas e administrativas |
| [`Arquitetura/Segurança`](./Sobre%20o%20projeto/Arquitetura/Segurança.md) | Requisitos de segurança por fase |
| [`Contextos/Regras de Negócio`](./Sobre%20o%20projeto/Contextos/Regras%20de%20Negócio%20-%20%20Norte%20Tecnologia.md) | Regras de produtos, serviços, estoque e carrinho |
| [`Regras/designe`](./Sobre%20o%20projeto/Regras/designe/designe%20extra.md) | Padrões visuais e biblioteca de componentes |
| [`Contextos/Diário`](./Sobre%20o%20projeto/Contextos/Diário.md) | Histórico de desenvolvimento |

---

## Estado Atual

> **Fase:** Estrutura inicial criada. Sem banco de dados nem autenticação configurados ainda.

A homepage exibe o layout base com identidade visual da marca, categorias e serviços como placeholders.
As próximas etapas envolvem a integração com Supabase, criação do schema do banco e implementação do catálogo real.

---

## Regras de Contribuição

- Consultar `Sobre o projeto/Contextos/Diário.md` antes de iniciar qualquer tarefa
- Seguir os padrões de código documentados
- Nunca expor credenciais no repositório
- Nunca fazer merge ou deploy em produção sem autorização
- Atualizar o Diário após cada implementação relevante

---

**Domínio:** `nortetecnologia.com` (configurado na Vercel)
