# Diário de Desenvolvimento — Norte Tecnologia

> Registro contínuo das implementações, decisões, pendências e próximas etapas do projeto.
> 
> **Regra:** consultar este documento antes de iniciar qualquer tarefa e atualizá-lo após cada etapa relevante.

---

## 1. Estado atual do projeto

- **Estágio:** Estrutura inicial em produção na Vercel. Next.js 15.5.29. Sem banco de dados configurado.
- **Última atividade:** Atualização de segurança do Next.js (15.0.3 → 15.5.29) e correção do UTF-8 BOM no package.json.
- **Situação geral:** Deploy funcional na Vercel (repositório público, sem Co-Authored-By, sem BOM). Homepage estática com layout base visível em produção. Aguardando criação do projeto Supabase e conta Cloudinary para avançar com funcionalidades reais.
- **Próxima etapa:** Criar projeto no Supabase, obter credenciais e configurar variáveis de ambiente na Vercel.

---

## 2. Última atualização

- **Data:** 2026-11-04
- **Atividade:** Atualização do Next.js de 15.0.3 para 15.5.29 (vulnerabilidade de segurança detectada pela Vercel).
- **Resultado:** Commit `67c4786` — `package.json` e `package-lock.json` atualizados. Build de produção passou sem erros. Push realizado para `origin/main`.
- **Situação:** Concluída. Pipeline Vercel desbloqueado e funcional.

---

## 3. Implementações concluídas

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

_(nenhuma tarefa em andamento no momento — aguardando configuração de serviços externos)_

---

## 5. Pendências e problemas conhecidos

- **Variáveis de ambiente não configuradas na Vercel:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — precisam ser adicionadas no painel da Vercel após a criação dos projetos Supabase e Cloudinary.
- **Supabase não configurado:** Projeto não criado. Sem tabelas, sem schema, sem autenticação.
- **Cloudinary não configurado:** Conta não criada. Sem upload de imagens disponível.
- **WhatsApp number hardcoded:** `https://wa.me/55` (placeholder) em Header.tsx, Footer.tsx e page.tsx. Será substituído por dado do banco quando o Supabase estiver configurado.
- **Vitrine placeholder:** Skeletons de carregamento na homepage. Aguarda integração com Supabase.
- **Links de navegação 404:** `/categoria`, `/produto/[slug]`, `/carrinho`, `/checkout` e `/admin` não implementados ainda.

---

## 6. Próximas etapas

1. **Criar projeto no Supabase:** Acessar supabase.com, criar projeto, obter URL e chaves.
2. **Criar conta no Cloudinary:** Acessar cloudinary.com, criar conta, obter Cloud Name, API Key e API Secret.
3. **Configurar variáveis de ambiente na Vercel:** Adicionar todas as variáveis do `.env.example` no painel da Vercel (Settings → Environment Variables).
4. **Definir schema do banco de dados:** Criar tabelas no Supabase (produtos, categorias, vitrines, configurações, pedidos, usuários).
5. **Instalar SDK do Supabase:** `npm install @supabase/supabase-js @supabase/ssr`.
6. **Implementar autenticação e painel admin:** Rota `/admin/login` e layout administrativo com Supabase Auth.
7. **Implementar páginas de categoria e produto:** Rotas `/categoria/[slug]` e `/produto/[slug]`.
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
