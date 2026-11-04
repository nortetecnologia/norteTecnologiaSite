# Diário de Desenvolvimento — Norte Tecnologia

> Registro contínuo das implementações, decisões, pendências e próximas etapas do projeto.
> 
> **Regra:** consultar este documento antes de iniciar qualquer tarefa e atualizá-lo após cada etapa relevante.

---

## 1. Estado atual do projeto

- **Estágio:** Admin totalmente funcional com autenticação real. Primeira funcionalidade admin real implementada: página de Configurações com CRUD de `store_settings`. WhatsApp carregado dinamicamente do banco em todo o site.
- **Última atividade:** Implementação de `store_settings` (migration + Server Action + formulário admin + WhatsApp dinâmico no site público).
- **Situação geral:** Deploy funcional na Vercel. Variáveis de ambiente configuradas. Admin acessível. **Pendente:** aplicar as migrations 001 e 002 no Supabase SQL Editor para ativar banco de dados. Após isso, configurar WhatsApp em `/admin/configuracoes` e os botões do site público atualizarão automaticamente.
- **Próxima etapa:** Usuário aplica as migrations no Supabase SQL Editor → implementar admin de categorias → implementar admin de produtos.

---

## 2. Última atualização

- **Data:** 2026-11-04
- **Atividade:** Tabela `store_settings`, página `/admin/configuracoes` funcional, e WhatsApp dinâmico em todo o site.
- **Resultado:** Migration `002_store_settings.sql` criada. `src/lib/store-settings.ts` com `getStoreSettings()` (React `cache()`) e `buildWhatsAppUrl()`. Formulário admin com `useActionState` e Server Action para salvar. Header, Footer e homepage.tsx carregam o WhatsApp do banco (fallback para `https://wa.me/`). Build passou (11 páginas, tsc OK, lint OK).
- **Situação:** Código concluído. Aguarda aplicação da migration no Supabase SQL Editor (001 + 002).

---

## 3. Implementações concluídas

### 2026-11-04 — Configurações da loja (store_settings) + WhatsApp dinâmico

- **Objetivo:** Criar a primeira funcionalidade admin real: gerenciamento das configurações da loja, com WhatsApp carregado dinamicamente do banco em todo o site.
- **Implementação:**
  - Criado `supabase/migrations/002_store_settings.sql` — tabela `store_settings` com linha única (single-row), RLS (leitura pública, escrita somente admin autenticado). Dados padrão inseridos via `ON CONFLICT DO NOTHING`.
  - Criado `src/lib/store-settings.ts` — `getStoreSettings()` com `cache()` do React (deduplicação de chamadas por requisição) e `buildWhatsAppUrl()` com sanitização de dígitos.
  - Criado `src/app/admin/configuracoes/actions.ts` — Server Action `saveStoreSettings()` com verificação de autenticação, validação do número de WhatsApp (mín. 12 dígitos), e `revalidatePath("/", "layout")` para atualizar todo o site após salvar.
  - Criado `src/app/admin/configuracoes/ConfiguracoesForm.tsx` — Client Component com `useActionState` (Next.js 15 / React 19). Formulário em 3 seções: informações da loja, WhatsApp, horário. Feedback de sucesso/erro inline.
  - Atualizado `src/app/admin/configuracoes/page.tsx` — Server Component async que carrega as configurações e renderiza o formulário pré-preenchido.
  - Atualizado `src/components/layout/Header.tsx` — async Server Component, chama `getStoreSettings()`.
  - Atualizado `src/components/layout/Footer.tsx` — async Server Component, chama `getStoreSettings()`.
  - Atualizado `src/app/page.tsx` — async Server Component, chama `getStoreSettings()`. Os 3 links WhatsApp hardcoded (`https://wa.me/55`) substituídos por `{whatsappUrl}` dinâmico.
- **Decisões técnicas:**
  - `cache()` do React garante 1 chamada ao banco por request, mesmo com Header + Footer + page chamando `getStoreSettings()`.
  - Fallback seguro: se banco não disponível ou migration não aplicada, retorna dados padrão sem quebrar o site.
  - `useActionState` ao invés de `useState` manual — padrão Next.js 15 para formulários com Server Actions.
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npm run lint` — OK (sem erros ou warnings)
  - `npm run build` — OK (11 páginas, exit 0)
- **Arquivos criados:** `supabase/migrations/002_store_settings.sql`, `src/lib/store-settings.ts`, `src/app/admin/configuracoes/actions.ts`, `src/app/admin/configuracoes/ConfiguracoesForm.tsx`
- **Arquivos modificados:** `src/app/admin/configuracoes/page.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/app/page.tsx`
- **Pendência:** Migration 002 não aplicada no Supabase ainda (aguarda ação do usuário no SQL Editor).

### 2026-11-04 — Correção do formulário de login (Server Action)

- **Objetivo:** Corrigir o login que não fazia nada ao submeter email e senha.
- **Causa raiz:** A página usava `createBrowserClient` (client-side) + `router.push("/admin") + router.refresh()`. Após `signInWithPassword` no cliente, o `router.push` inicia uma navegação client-side, mas o `router.refresh()` chamado em seguida re-renderiza a página atual, podendo cancelar a navegação. O servidor também pode não enxergar os cookies de sessão recém-definidos em tempo hábil para a requisição RSC.
- **Correção:**
  - Criado `src/app/admin/login/actions.ts` — Server Action `login(formData)` que usa `createClient()` (server-side), chama `signInWithPassword` no servidor e então `redirect("/admin")`. Os cookies de sessão são definidos server-side, garantindo que o middleware e o layout os enxerguem imediatamente na requisição seguinte.
  - Atualizado `src/app/admin/login/page.tsx` — removido `useRouter` e `createClient` client-side. Formulário agora chama a Server Action via `await login(formData)`. Se a action retornar `{ error }`, exibe a mensagem. Se `redirect()` for chamado no servidor, a navegação ocorre automaticamente.
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npm run build` — OK (11 páginas, exit 0)
- **Arquivos modificados:** `src/app/admin/login/actions.ts` (novo), `src/app/admin/login/page.tsx`
- **Commit:** `5f5925d`
- **Merge para main:** `9056d9a`

### 2026-11-04 — Correção do loop infinito no layout admin

- **Objetivo:** Corrigir `Application error` ao acessar `/admin/login`.
- **Causa raiz:** `src/app/admin/layout.tsx` aplicava-se a todas as rotas `/admin/*`, incluindo `/admin/login`. Quando não havia usuário autenticado, o layout chamava `redirect("/admin/login")`, que renderizava o mesmo layout novamente — loop infinito.
- **Correção:**
  - Removida a chamada `redirect()` do layout.
  - Sem usuário autenticado: layout renderiza apenas `{children}` (a tela de login sem shell).
  - Com usuário autenticado: renderiza a shell completa (`AdminLayoutClient` com sidebar e header).
  - Adicionado try-catch para robustez.
- **Responsabilidade de cada camada:**
  - Middleware: redireciona rotas protegidas para `/admin/login` se não autenticado.
  - Layout: exibe a shell admin apenas para usuários autenticados.
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK
  - `npm run build` — OK (11 páginas, exit 0)
- **Arquivo modificado:** `src/app/admin/layout.tsx`
- **Commit:** `a7f4339`

### 2026-11-04 — Correção do middleware e criação das rotas admin

- **Objetivo:** Corrigir erro `500 MIDDLEWARE_INVOCATION_FAILED` que impedia o acesso à rota `/admin`.
- **Causa raiz:** Middleware sem tratamento de erros — se `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` não estivessem definidas, ou se `createServerClient()` / `auth.getUser()` lançassem exceção, o middleware propagava o erro como 500.
- **Correções aplicadas:**
  - `src/middleware.ts` — adicionada guarda de env vars (`!supabaseUrl || !supabaseKey`) e `try-catch` em torno de toda a inicialização do Supabase e verificação de sessão. Comportamento fail-secure: qualquer falha redireciona para `/admin/login` em vez de retornar 500.
  - `.env.example` — corrigido nome da variável: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **Sub-rotas criadas (stub "em desenvolvimento"):**
  - `src/app/admin/produtos/page.tsx`
  - `src/app/admin/categorias/page.tsx`
  - `src/app/admin/vitrines/page.tsx`
  - `src/app/admin/configuracoes/page.tsx`
  - `src/app/admin/relatorios/page.tsx`
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npm run lint` — OK (sem warnings ou erros)
  - `npm run build` — OK (11 páginas geradas, middleware 95.3 kB, sem erros)
- **Commits:** `bdfb5f6` (sub-rotas + tipos Vitrine), `32cb0cd` (fix middleware)
- **Merge para main:** `d30bce5` → `e3ce048` (merge + fix)
- **Observações:** Para acessar o painel, ainda é necessário criar um usuário no Supabase Auth Dashboard.

### 2026-11-04 — Painel administrativo (Supabase Auth)

- **Objetivo:** Implementar painel admin acessível em `/admin` com autenticação via Supabase Auth.
- **Implementação:**
  - Instalado `@supabase/supabase-js@^2.119.0` e `@supabase/ssr@^0.12.7`.
  - Criado `src/lib/supabase/client.ts` — client-side Supabase client para uso em Client Components.
  - Criado `src/lib/supabase/server.ts` — server-side Supabase client para Server Components e Actions.
  - Criado `src/middleware.ts` — protege todas as rotas `/admin/*`, redireciona não-autenticados para `/admin/login` e autenticados que acessam `/admin/login` para `/admin`.
  - Criado `src/app/admin/login/page.tsx` — página de login com email/password, estado de loading/erro, design sistema escuro com CTA amarelo.
  - Criado `src/app/admin/actions.ts` — Server Action `logout()` para encerrar sessão e redirecionar para `/admin/login`.
  - Criado `src/app/admin/layout.tsx` — Server Component que verifica autenticação e renderiza layout.
  - Criado `src/app/admin/AdminLayoutClient.tsx` — Client Component com sidebar desktop fixa, overlay mobile para sidebar, header fixo.
  - Criado `src/components/admin/AdminSidebar.tsx` — sidebar com links destacados (ativo = amarelo), ícones SVG inline para: Dashboard, Produtos, Categorias, Vitrines, Configurações, Relatórios.
  - Criado `src/components/admin/AdminHeader.tsx` — exibe email do usuário e botão de logout.
  - Criado `src/app/admin/page.tsx` — dashboard com saudação personalizada e cards de acesso rápido.
  - Atualizado `.eslintrc.json` com `"root": true` para evitar conflito com config do diretório pai (issue de worktree).
- **Arquivos criados:**
  - `src/lib/supabase/client.ts`
  - `src/lib/supabase/server.ts`
  - `src/middleware.ts`
  - `src/app/admin/login/page.tsx`
  - `src/app/admin/actions.ts`
  - `src/app/admin/layout.tsx`
  - `src/app/admin/AdminLayoutClient.tsx`
  - `src/app/admin/page.tsx`
  - `src/components/admin/AdminSidebar.tsx`
  - `src/components/admin/AdminHeader.tsx`
- **Variável de ambiente:** Usa `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (novo nome Supabase, equivalente ao antigo `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (sem erros de tipo)
  - `npm run lint` — OK (sem warnings ou erros ESLint)
  - `npm run build` — OK (`/admin` e `/admin/login` gerados como rotas dinâmicas, middleware 92.9 kB)
- **Observações:** Para acessar o painel, é necessário criar um usuário no Supabase Auth Dashboard (Authentication → Users → Add User).

### 2026-11-04 — Correções no pipeline de deploy (Vercel)

- **Objetivo:** Desbloquear o deploy automático na Vercel após a estrutura inicial.
- **Problemas resolvidos:**
  1. **Co-Authored-By bloqueando deploy:** Reescrita do histórico do main via `git push --force` para remover a linha `Co-Authored-By: Claude Sonnet 4.6`. Commit limpo `cc17ee4`.
  2. **Repositório privado bloqueando Hobby Plan:** Repositório tornado público em `github.com/nortetecnologia/norteTecnologiaSite`.
  3. **UTF-8 BOM no package.json:** Arquivo reescrito sem BOM via PowerShell. Commit `73ac52a`.
  4. **Vulnerabilidade de segurança no Next.js:** Versão atualizada de `15.0.3` para `15.5.29`. Commit `67c4786`.
- **Regra crítica estabelecida:** Nunca adicionar `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` neste projeto — bloqueia deploy na Vercel Hobby Plan.
- **Resultado:** Pipeline Vercel funcional. Build passando com 4 páginas estáticas.

### 2026-11-04 — Estrutura inicial do projeto

- **Objetivo:** Criar a estrutura base do projeto Next.js para corrigir o erro de deploy na Vercel e estabelecer os fundamentos visuais e arquiteturais.
- **Implementação:**
  - Criado `package.json` com Next.js 15, TypeScript, Tailwind CSS.
  - Criado `next.config.ts` com configuração de imagens remotas (Cloudinary).
  - Criado `tsconfig.json` com paths `@/*` apontando para `src/`.
  - Criado `tailwind.config.ts` com tokens de cores da marca (yellow, blue, black).
  - Criado `postcss.config.mjs`.
  - Criado `src/app/globals.css` com variáveis CSS do sistema de design.
  - Criado `src/app/layout.tsx` com fonte Inter e metadata base.
  - Criado `src/app/page.tsx` — homepage com seções: hero, diferenciais, categorias, vitrine placeholder, serviços e CTA.
  - Criado `src/app/not-found.tsx` — página 404 com identidade visual.
  - Criado `src/components/layout/Header.tsx` — header responsivo com logo, nav e botão WhatsApp.
  - Criado `src/components/layout/Footer.tsx` — footer com links de categorias, serviços e contato.
  - Criado `src/lib/utils.ts` — funções `cn()` e `formatCurrency()`.
  - Criado `src/types/index.ts` — tipos TypeScript para Product, Category, Service, Cart, StoreSettings.
  - Copiado logo para `public/logo.png`.
  - Atualizado `README.md` com documentação completa do projeto.
  - Atualizado `.env.example` com todas as variáveis de ambiente necessárias.
- **Arquivos criados:**
  - `package.json`
  - `next.config.ts`
  - `tsconfig.json`
  - `tailwind.config.ts`
  - `postcss.config.mjs`
  - `.eslintrc.json`
  - `src/app/globals.css`
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/not-found.tsx`
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Footer.tsx`
  - `src/lib/utils.ts`
  - `src/types/index.ts`
  - `public/logo.png`
- **Arquivos modificados:**
  - `README.md`
  - `.env.example`
- **Decisões técnicas:**
  - Next.js 15 com App Router (conforme documentação STACK.md).
  - Tailwind CSS 3.x (versão estável, compatível com toda a stack).
  - Fundo preto `#0A0A0A`, amarelo `#FFD600` como CTA primário, azul `#1E4FA0` como acento (conforme fachada da loja e design.md).
  - Tokens CSS em `:root` para consistência global.
  - Estrutura `src/` com `app/`, `components/`, `lib/`, `types/` conforme diretrizes do projeto.
  - Homepage com seções reais mas vitrine com skeleton placeholder (banco ainda não configurado).
- **Verificações executadas:**
  - `npm install` — OK (exit code 0)
  - `npx tsc --noEmit` — OK (sem erros de tipo)
  - `npm run build` — OK (build de produção gerado com sucesso, 4 páginas estáticas)
  - `npm run lint` — OK (sem warnings ou erros ESLint)
- **Observações:** WhatsApp number está como `https://wa.me/55` — deve ser atualizado com o número real nas configurações da loja assim que o Supabase for configurado.

---

## 4. Implementações em andamento

_(nenhuma tarefa em andamento no momento)_

---

## 5. Pendências e problemas conhecidos

- **Migrations não aplicadas:** `supabase/migrations/001_vitrines.sql` e `002_store_settings.sql` criadas mas NÃO aplicadas ao projeto Supabase. Aplicar no Supabase SQL Editor (001 primeiro, depois 002).
- **WhatsApp não configurado:** Após aplicar as migrations, acessar `/admin/configuracoes` e preencher o número do WhatsApp (formato: 5591999999999).
- **Cloudinary não configurado:** Variáveis `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` ainda pendentes para upload de imagens.
- **Sub-rotas admin ainda são stubs:** `/admin/produtos`, `/admin/categorias`, `/admin/vitrines`, `/admin/relatorios` — aguardam banco de dados configurado e implementação.
- **Links de loja 404:** `/categoria`, `/produto/[slug]`, `/carrinho`, `/checkout` não implementados ainda.

---

## 6. Próximas etapas

1. **Aplicar migrations no Supabase SQL Editor:** Executar `001_vitrines.sql` e depois `002_store_settings.sql`. Acesse supabase.com → SQL Editor → New Query.
2. **Configurar WhatsApp:** Acessar `/admin/configuracoes` e preencher o número com código do país (ex: 5591999887766).
3. **Implementar `/admin/categorias`:** CRUD de categorias com Supabase (depende da migration 001).
4. **Implementar `/admin/produtos`:** CRUD de produtos com upload Cloudinary (depende de categorias + Cloudinary).
5. **Implementar páginas públicas:** `/categoria/[slug]` e `/produto/[slug]`.
6. **Implementar carrinho e checkout WhatsApp.**
8. **Integrar Cloudinary:** Upload de imagens de produtos no painel admin.
9. **Implementar carrinho:** Funcionalidade de carrinho com persistência (localStorage ou banco).
10. **Implementar checkout:** Fluxo de finalização com mensagem automática para WhatsApp.

---

## 7. Decisões recentes

- **2026-11-04 — Fundo preto como padrão:** Baseado em `designe.md` que instrui "o branco deve ser preto". A loja terá tema escuro com amarelo como cor primária de destaque.
  - **Documentação relacionada:** `Regras/designe/designe.md`.
- **2026-11-04 — Next.js 15 App Router:** Escolhido conforme `STACK.md`. Sem Pages Router.
  - **Documentação relacionada:** `Arquitetura/STACK.md`.
- **2026-11-04 — WhatsApp como único canal inicial:** Sem gateway de pagamento. Checkout redireciona para WhatsApp conforme `Sobre o projeto - Norte Tecnologia.md`.
  - **Documentação relacionada:** `Contextos/Sobre o projeto - Norte Tecnologia.md`.

---

_Este documento deve ser atualizado continuamente pelo agente de desenvolvimento. Não preencher informações de implementação sem verificar o estado real do projeto._
