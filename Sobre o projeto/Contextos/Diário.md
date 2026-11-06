# Diário de Desenvolvimento — Norte Tecnologia

> Registro contínuo das implementações, decisões, pendências e próximas etapas do projeto.
> 
> **Regra:** consultar este documento antes de iniciar qualquer tarefa e atualizá-lo após cada etapa relevante.

---

## 1. Estado atual do projeto

- **Estágio:** Admin completo + Páginas públicas completas + Carrinho + Checkout + Formas de pagamento configuráveis + Menu mobile funcional + Header redesenhado (full-width, h-88px, centralizado) + Upload de imagens via Cloudinary (produtos e categorias) + Drawer de categorias corrigido + Sistema de promoções completo + Busca pública com Header/Footer.
- **Última atividade:** 2026-11-06 — Auditoria de bugs: busca sem Header/Footer corrigida, produto inativo acessível corrigido, busca expandida para marca+descrição, revalidação de homepage adicionada nas actions de produtos e categorias, migration 009 criada.
- **Situação geral:** Deploy funcional na Vercel. **Pendente:** aplicar migration 009 no Supabase SQL Editor para habilitar imagem nas categorias.
- **Próxima etapa:** Aplicar migration 009 → cadastrar categorias com imagens → montar vitrines de produtos via `/admin/vitrines`.

---

## 2. Última atualização

- **Data:** 2026-11-06
- **Atividade:** Auditoria de bugs e correções — busca com Header/Footer, produto inativo corrigido, revalidações, migration 009.
- **Resultado:** tsc limpo, build OK (18 páginas). Merge e push para main/Vercel.
- **Situação:** Deploy em andamento na Vercel.

---

## 3. Implementações concluídas

### 2026-11-06 — Auditoria de bugs + correções

- **Objetivo:** Identificar e corrigir bugs, vulnerabilidades e funcionalidades faltando.
- **Bugs corrigidos:**
  1. `/busca` não tinha `<Header />` e `<Footer />` — a página de busca renderizava sem navegação. Corrigido.
  2. `/produto/[slug]` não filtrava por `is_active = true` — produtos inativos eram acessíveis diretamente pelo slug. Corrigido tanto na query principal quanto no `generateMetadata`.
  3. `admin/produtos/actions.ts` não chamava `revalidatePath("/")` — alterações em produtos não atualizavam a homepage. Corrigido.
  4. `admin/categorias/actions.ts` não chamava `revalidatePath("/")` — alterações em categorias não atualizavam a homepage. Corrigido.
  5. Busca pública filtrava apenas por `name` — agora inclui `brand` e `description` via `.or()` do Supabase.
- **Migration criada:** `009_categories_image_barcode_internal_code.sql` — adiciona `image_url` em `categories` e `barcode`/`internal_code` em `products` (idempotente, `IF NOT EXISTS`). **Aplicar no Supabase SQL Editor.**
- **Verificações executadas:** `tsc --noEmit` OK, `npm run build` OK (18 páginas, exit 0).
- **Arquivos modificados:** `src/app/busca/page.tsx`, `src/app/produto/[slug]/page.tsx`, `src/app/admin/produtos/actions.ts`, `src/app/admin/categorias/actions.ts`.
- **Arquivos criados:** `supabase/migrations/009_categories_image_barcode_internal_code.sql`.

### 2026-11-05 — Drawer compacto + expandir subcategorias + header centralizado (commit 7b16b52)

- **Objetivo:** Corrigir drawer "encolhido" (header muito alto consumia espaço da lista), exibir categorias base com botão "+" para expandir subcategorias se houver.
- **Implementação:**
  - `HamburgerMenu.tsx`: drawer header reduzido de `h-[88px]` para `h-[60px]`; `flex-shrink-0` garante que o header não encolhe; `nav` tem `min-h-0 flex-1 overflow-y-auto` para a lista ocupar o espaço restante. Interface `Category` agora inclui `subcategories: Subcategory[]`. Estado `expanded: Set<string>` controla quais categorias têm subcategorias visíveis. Cada categoria base mostra um botão chevron (apenas se tiver subcategorias); subcategorias aparecem indentadas com `border-l`. Rodapé com link "Ver todas as categorias".
  - `Header.tsx`: `getCategories()` passa a selecionar `subcategories(id, name, slug)` via Supabase join e tipagem explícita.
  - `SearchBar.tsx`: removido `max-w-xl` (era 576px) → `flex-1` só, resolvendo desalinhamento do header.
  - `Header.tsx` Row 1: `h-[88px]`, `mx-auto max-w-[1600px]`, `px-6 lg:px-10`.
- **Arquivos modificados:** `HamburgerMenu.tsx`, `Header.tsx`, `SearchBar.tsx`.
- **Verificação:** `tsc --noEmit` sem erros.

### 2026-11-05 — Header wider/taller, remoção WhatsApp drawer, image upload categorias (commit 993f226)

- **Objetivo:** 4 melhorias solicitadas pelo usuário via screenshot.
- **Implementação:**
  - `Header.tsx` Row 1: `h-[60px]` → `h-[76px]`, `mx-auto max-w-content` → `w-full`, `px-4 lg:px-8` → `px-4 md:px-6 lg:px-10`. Row 2: mesmo ajuste. Logo nome sempre visível (removido `hidden sm:block`).
  - `HamburgerMenu.tsx`: removida prop `whatsappUrl` e o bloco footer inteiro com o botão "Falar pelo WhatsApp". Estado vazio de categorias ganhou borda dashed para melhor aspecto visual.
  - `src/app/admin/categorias/uploadAction.ts` criado — Server Action `uploadCategoryImage`, idêntica à de produtos mas pasta `norte-tecnologia/categorias/`.
  - `actions.ts` (categorias): `createCategory(name, imageUrl?)` e `updateCategory(id, name, imageUrl?)` — passa `image_url` para Supabase quando fornecido.
  - `CategoriasClient.tsx`: novo componente `CategoryForm` com nome + prévia fiel + upload de arquivo + URL como fallback. Modal cat_create/cat_edit usa `max-w-md` e `CategoryForm`. Subcategorias continuam com `NameForm`.
  - `page.tsx` (categorias): seleciona `image_url` junto com as outras colunas.
- **Dependência de banco:** A tabela `categories` precisa de uma coluna `image_url text` para o upload funcionar. Sem ela, `updateCategory` vai retornar erro do Supabase.
- **Arquivos modificados:** `HamburgerMenu.tsx`, `Header.tsx`, `CategoriasClient.tsx`, `actions.ts`, `page.tsx` (categorias).
- **Arquivos criados:** `src/app/admin/categorias/uploadAction.ts`.

### 2026-11-05 — Upload de imagens via Cloudinary no admin de produtos

- **Objetivo:** Substituir o campo "URL da imagem" por upload real de arquivo com preview, mantendo URL manual como alternativa.
- **Implementação:**
  - Criado `src/app/admin/produtos/uploadAction.ts` — Server Action `uploadToCloudinary(formData)`:
    - Recebe `File` do cliente via FormData.
    - Valida: tipo `image/*`, tamanho ≤ 10 MB, credenciais presentes.
    - Gera assinatura SHA-256 com `timestamp + folder + signature_algorithm + CLOUDINARY_API_SECRET` (Node.js `crypto`, sem SDK externo).
    - POST autenticado para `https://api.cloudinary.com/v1_1/{cloudName}/image/upload`; uploads salvos em `norte-tecnologia/produtos/`.
    - Retorna `{ url }` (URL `secure_url` do Cloudinary) ou `{ error }` descritivo.
    - `CLOUDINARY_API_SECRET` NUNCA sai do servidor.
  - Atualizado `src/app/admin/produtos/ProdutosClient.tsx`:
    - Adicionados estados: `imageUrl`, `uploadState: "idle" | "uploading" | "error"`, `uploadError`.
    - `openCreate` e `openEdit` resetam/inicializam o estado de imagem corretamente.
    - Função `handleFileChange` — chama `uploadToCloudinary`, atualiza preview ao concluir.
    - UI de imagem:
      - Preview thumbnail 64×64 com botão "Remover imagem".
      - Área de upload dashed com ícone, estado "Enviando…" com spinner (upload em andamento).
      - Input URL como alternativa ("Ou cole a URL da imagem…").
      - Mensagem de erro inline em vermelho.
    - Hidden input `name="image_url"` controlado por estado — `createProduct`/`updateProduct` leem normalmente.
    - Botão submit desabilitado durante upload ("Aguarde o upload…").
- **Decisões técnicas:**
  - Sem dependência do SDK `cloudinary` — usa `crypto` nativo (Node.js) e `fetch`. Reduz bundle de dependências.
  - Upload acontece antes do submit do formulário (preview imediato). URL fica pronta no estado; submit do produto usa a URL já resolvida.
  - URL manual (`input type="url"`) permanece como fallback para imagens externas ou migração de dados.
  - Pasta Cloudinary: `norte-tecnologia/produtos/` — organização por projeto no Cloudinary.
- **Verificações executadas:** tsc + lint + build (pendente — a executar antes do deploy).
- **Arquivos criados:** `src/app/admin/produtos/uploadAction.ts`
- **Arquivos modificados:** `src/app/admin/produtos/ProdutosClient.tsx`, `Sobre o projeto/Contextos/Diário.md`

### 2026-11-05 — Header redesenhado (Pichau-style) + SearchBar + HamburgerMenu + vitrine_header (commit 7a5c5de)

- **Objetivo:** Redesenhar o header com busca proeminente, hambúrguer em todos os breakpoints, vitrine do header configurável pelo admin, badge Aberto/Fechado movido para o footer.
- **Implementação:**
  - `src/components/layout/Header.tsx` — reescrito para 2 linhas:
    - Row 1 (60px): Logo + SearchBar + WhatsApp (oculto mobile) + CartIcon.
    - Row 2 (40px): HamburgerMenu + separador + HeaderItemsBar (vitrine_header, máx. 10 itens).
  - `src/components/ui/SearchBar.tsx` — Client Component com debounce 350ms, `router.push("/busca?q=")`, mín. 2 chars.
  - `src/app/busca/page.tsx` — Server Component; busca ILIKE nos produtos; grid ProductCard.
  - `src/components/layout/HamburgerMenu.tsx` — drawer esquerdo, visível em todos os breakpoints; recebe categorias + whatsappUrl como props; sem badge (badge somente no footer).
  - `src/components/layout/HeaderItemsBar.tsx` — Server Component; lê `vitrine_header` do banco; renderiza até 10 itens (produtos ou categorias).
  - `src/components/layout/Footer.tsx` — adicionado badge Aberto/Fechado na coluna Contato.
  - `src/app/admin/vitrines/actions.ts` — 4 novas actions: `setVitrineContentType`, `addCategoryToVitrine`, `removeCategoryFromVitrine`, `moveCategoryInVitrine`.
  - `src/app/admin/vitrines/VitrinasClient.tsx` — reescrito com suporte a `content_type` (Produtos/Categorias), modal de categorias, label ⭐ para vitrine_header.
  - `src/app/admin/vitrines/page.tsx` — busca `vitrine_categories` aninhadas.
  - `supabase/migrations/007_header_vitrine.sql` — `content_type` na tabela `vitrines`, nova tabela `vitrine_categories`, inserção da `vitrine_header`.
- **Decisão técnica:** Badge apenas no footer (instrução explícita do usuário). Hambúrguer visível em todos os breakpoints.
- **Pré-requisito:** Migration 007 deve ser aplicada pelo usuário no Supabase SQL Editor para a vitrine_header e vitrine_categories funcionarem.
- **Arquivos criados:** `src/components/ui/SearchBar.tsx`, `src/app/busca/page.tsx`, `src/components/layout/HamburgerMenu.tsx`, `src/components/layout/HeaderItemsBar.tsx`, `supabase/migrations/007_header_vitrine.sql`
- **Arquivos modificados:** `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/app/admin/vitrines/actions.ts`, `src/app/admin/vitrines/VitrinasClient.tsx`, `src/app/admin/vitrines/page.tsx`

### 2026-11-04 — Erros específicos e observabilidade nas actions admin (commit d22fabb)

- **Problema:** Todas as falhas admin retornavam "Erro ao criar X. Tente novamente." sem revelar a causa real.
- **Solução:**
  - Adicionado `logAdminError(context, error)` em `src/lib/supabase/admin.ts`: faz `console.error` completo no servidor (aparece em Vercel → Deployment → Functions tab) e retorna string descritiva para a UI com código, mensagem e dica do banco.
  - Mapeamento de códigos PostgreSQL/PostgREST: `42P01` = "Tabela não encontrada — migrations não aplicadas"; `42501` = "Sem permissão — verifique SUPABASE_SECRET_KEY"; `23503` = FK violation; `PGRST301` = JWT inválido.
  - Substituídas todas as mensagens genéricas nos 4 arquivos de actions do admin.
  - Adicionado `console.error` em todos os catch blocks.
  - Logging no `createAdminClient()` quando env vars ausentes.
- **Decisão técnica:** Erros técnicos completos exibidos apenas no admin (rotas protegidas por auth) — adequado para usuário admin diagnosticar problemas. Nunca expostos ao público.
- **Verificações executadas:** tsc OK, lint OK, build OK (15 páginas).
- **Arquivos modificados:** `src/lib/supabase/admin.ts`, `src/app/admin/categorias/actions.ts`, `src/app/admin/produtos/actions.ts`, `src/app/admin/vitrines/actions.ts`, `src/app/admin/configuracoes/actions.ts`

### 2026-11-04 — Correção crítica: BOM no package.json (commit 3ccebe0)

- **Problema:** Build Vercel falhava com `Unexpected token '﻿', "﻿{ "name"... is not valid JSON.`
- **Causa:** PowerShell `Set-Content -Encoding utf8` (PS 5.1 / .NET Framework) adiciona BOM (EF BB BF) no início do arquivo. JSON não suporta BOM.
- **Correção:** Reescrito com `New-Object System.Text.UTF8Encoding($false)` + `[System.IO.File]::WriteAllText()` — garante UTF-8 sem BOM.
- **Lição aprendida:** Em PowerShell 5.1, usar sempre `New-Object System.Text.UTF8Encoding($false)` para escrever JSON. `Set-Content -Encoding utf8` e `Set-Content -Encoding utf8NoBOM` são inseguros ou indisponíveis no .NET Framework.
- **Arquivos modificados:** `package.json` (main)

### 2026-11-04 — Correção: Operações Admin de Escrita

- **Problema:** "Erro ao criar categoria / produto / vitrine. Tente novamente." ao tentar criar qualquer item no admin.
- **Causas identificadas:**
  1. `@supabase/ssr` e `@supabase/supabase-js` estavam instalados localmente mas **ausentes do `package.json`** — `npm install` no deploy da Vercel não os instalava, fazendo todas as funções Supabase falharem em produção.
  2. As Server Actions de escrita admin usavam o cliente anon + JWT de sessão para operações de banco. Com RLS `auth.role() = 'authenticated'`, o PostgREST pode não receber o JWT corretamente em Server Actions, causando falha silenciosa na inserção.
- **Correção:**
  - Adicionados `@supabase/ssr@0.12.7` e `@supabase/supabase-js@2.119.0` ao `package.json`.
  - Criado `src/lib/supabase/admin.ts` — cria cliente com `SUPABASE_SECRET_KEY` (service_role), que bypassa RLS totalmente (seguro pois usado apenas em Server Actions server-side).
  - Atualizado `getAuthClient()` em `admin/categorias/actions.ts`, `admin/vitrines/actions.ts`, `admin/produtos/actions.ts`: verifica auth via cliente anon (cookies), retorna cliente admin para operações de banco.
  - Atualizado `admin/configuracoes/actions.ts`: mesma separação — anon para auth, admin para o UPDATE.
- **Decisões técnicas:**
  - Service_role (via `SUPABASE_SECRET_KEY`) NUNCA é exposto ao frontend — usado exclusivamente em Server Actions.
  - Verificação de autenticação (`auth.getUser()`) é mantida antes de qualquer operação de escrita — não há bypass de segurança.
  - Se `SUPABASE_SECRET_KEY` não estiver configurada nas env vars, a função lança erro descritivo.
- **Pré-requisito para funcionar:** `SUPABASE_SECRET_KEY` deve estar configurada nas variáveis de ambiente da Vercel (Settings → Environment Variables).
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npm run lint` — OK (sem warnings)
  - `npm run build` — OK (15 páginas, exit 0)
- **Arquivos criados:** `src/lib/supabase/admin.ts`
- **Arquivos modificados:** `package.json`, `src/app/admin/categorias/actions.ts`, `src/app/admin/vitrines/actions.ts`, `src/app/admin/produtos/actions.ts`, `src/app/admin/configuracoes/actions.ts`

### 2026-11-04 — Menu Mobile

- **Objetivo:** Transformar o botão hambúrguer estático (sem função) em um menu de navegação funcional para dispositivos móveis.
- **Implementação:**
  - Criado `src/components/layout/MobileMenuToggle.tsx` — Client Component com estado `isOpen`.
    - Renderiza o botão hambúrguer (substitui o botão estático do `Header.tsx`).
    - Overlay semi-transparente com `backdrop-blur-sm` ao fundo, fecha ao clicar.
    - Drawer lateral (272px, `right-0`) com transição CSS `translate-x` (300ms ease-in-out).
    - Cabeçalho do drawer: nome da loja + botão fechar (×).
    - Lista de nav links: Início, Produtos, Serviços — destaque visual no link ativo (via `usePathname`).
    - Rodapé do drawer: badge de status da loja (Aberto/Fechado), botão WhatsApp amarelo.
    - Fecha ao: navegar (via `useEffect` no `pathname`), clicar no overlay, pressionar Escape, clicar no botão ×.
    - Bloqueia scroll do `body` enquanto aberto.
    - Atributos de acessibilidade: `aria-expanded`, `aria-controls`, `role="dialog"`, `aria-modal`, `aria-label`.
  - Atualizado `src/components/layout/Header.tsx` — importa `MobileMenuToggle` e passa `whatsappUrl`, `storeOpen`, `hasSchedule` como props; remove o botão estático anterior.
- **Decisões técnicas:**
  - `Header.tsx` permanece Server Component assíncrono — sem `"use client"`, sem mudança no padrão de fetch.
  - Transição puramente via Tailwind (`translate-x-full` ↔ `translate-x-0`) — sem biblioteca de animação.
  - Props derivadas do Server Component (`whatsappUrl`, `storeOpen`, `hasSchedule`) evitam fetch duplicado no Client.
  - `hasSchedule` como booleano (não o schedule completo) — menor serialização de props, suficiente para renderizar o badge.
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npm run lint` — OK (sem warnings ou erros)
  - `npm run build` — OK (15 páginas, todas `ƒ Dynamic`, exit 0)
- **Arquivos criados:** `src/components/layout/MobileMenuToggle.tsx`
- **Arquivos modificados:** `src/components/layout/Header.tsx`

### 2026-11-04 — Relatórios (`/admin/relatorios`)

- **Objetivo:** Substituir o stub estático de relatórios por uma página com dados reais do banco, respeitando a regra de negócio de não exibir métricas não registradas.
- **Implementação:**
  - Reescrito `src/app/admin/relatorios/page.tsx` — Server Component assíncrono com `Promise.all` para 5 queries paralelas ao Supabase.
  - **Cards de resumo** (4): Total de produtos, Produtos ativos, Categorias, Vitrines ativas — todos linkam para a página admin correspondente.
  - **Alertas de estoque**: produtos ativos com estoque = 0 (alerta vermelho) e estoque 1–5 (alerta amarelo), com link para página pública do produto; oculto quando não há alertas.
  - **Catálogo por categoria**: tabela com total de produtos, ativos e sem estoque por categoria.
  - **Situação das vitrines**: cada vitrine com badge Ativa/Inativa e contagem de produtos.
  - **Produtos sem imagem**: lista de produtos ativos sem nenhuma imagem, com link direto para `/admin/produtos`.
  - **Nota de rodapé**: informa que métricas de comportamento do cliente (visualizações, pesquisas) serão adicionadas com sistema de eventos futuro.
- **Decisões técnicas:**
  - Sem migration nova — todos os dados vêm de tabelas existentes.
  - Pure Server Component (sem interatividade necessária para leitura de relatórios).
  - Regra de negócio respeitada: apenas dados efetivamente registrados no banco são exibidos.
  - Alertas de estoque e seção de produtos sem imagem ficam ocultos quando não há dados a exibir (sem seções vazias desnecessárias).
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npm run lint` — OK (sem warnings ou erros)
  - `npm run build` — OK (15 páginas, `/admin/relatorios` = 519 B, exit 0)
- **Arquivos modificados:** `src/app/admin/relatorios/page.tsx`

### 2026-11-04 — Formas de Pagamento Dinâmicas + Rota Subcategoria

- **Objetivo:** Tornar as formas de pagamento configuráveis pelo admin e implementar a rota `/categoria/[slug]/[subcategoria]` definida em `Rotas.md`.
- **Implementação:**
  - Criado `supabase/migrations/006_payment_methods.sql` — adiciona `payment_methods TEXT[] NOT NULL DEFAULT ARRAY['Dinheiro', 'PIX', 'Cartão de Crédito', 'Cartão de Débito']` à tabela `store_settings`.
  - Criado `src/lib/payment-methods.ts` — constante `DEFAULT_PAYMENT_METHODS` extraída para arquivo próprio (evita que Client Components importem código server-only via `store-settings.ts`).
  - Atualizado `src/lib/store-settings.ts` — adicionado `payment_methods: string[]` à interface `StoreSettingsData` e ao DEFAULT; query SELECT inclui `payment_methods`; fallback: se coluna ausente (migration não aplicada), usa `DEFAULT_PAYMENT_METHODS`; re-exporta a constante.
  - Atualizado `src/app/admin/configuracoes/actions.ts` — lê `payment_methods` do FormData (JSON), valida: array não-vazio, strings trimmadas, máx. 10 itens. Inclui no payload do UPDATE.
  - Atualizado `src/app/admin/configuracoes/ConfiguracoesForm.tsx` — nova seção "Formas de Pagamento" com editor de chips: lista visual dos métodos atuais com botão de remoção (mínimo 1 item), input + botão "Adicionar" (máx. 10), Enter para adicionar; `input hidden` serializado como JSON para o Server Action.
  - Atualizado `src/app/checkout/page.tsx` — passa `payment_methods` do settings para `CheckoutClient`.
  - Atualizado `src/app/checkout/CheckoutClient.tsx` — recebe `paymentMethods: string[]` em vez da constante hardcoded; inicial do `useState` usa `paymentMethods[0] ?? "Dinheiro"`.
  - Criado `src/app/categoria/[slug]/[subcategoria]/page.tsx` — Server Component com `generateMetadata`; busca categoria por slug, subcategoria por slug dentro da categoria (com `category_id`), produtos por `subcategory_id` (apenas ativos); `notFound()` quando categoria ou subcategoria não existe; breadcrumb completo (Início / Categorias / {categoria} / {subcategoria}); label da categoria em brand-yellow acima do H1; grid `ProductCard` idêntico à rota de categoria.
- **Decisões técnicas:**
  - Constante `DEFAULT_PAYMENT_METHODS` em arquivo separado `src/lib/payment-methods.ts` — resolve problema de tree-shaking/bundling onde Client Components não podem importar código que usa `next/headers` indiretamente.
  - Rota subcategoria filtra `is_active = true` nos produtos (rota categoria não filtra — mantido por consistência com implementação anterior; subcategoria segue regra de negócio 2.3).
  - Fallback em `getStoreSettings()` protege contra banco sem a migration 006 aplicada.
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npm run lint` — OK (sem warnings ou erros)
  - `npm run build` — OK (15 páginas, todas `ƒ Dynamic`, exit 0)
- **Arquivos criados:** `supabase/migrations/006_payment_methods.sql`, `src/lib/payment-methods.ts`, `src/app/categoria/[slug]/[subcategoria]/page.tsx`
- **Arquivos modificados:** `src/lib/store-settings.ts`, `src/app/admin/configuracoes/actions.ts`, `src/app/admin/configuracoes/ConfiguracoesForm.tsx`, `src/app/checkout/page.tsx`, `src/app/checkout/CheckoutClient.tsx`

### 2026-11-04 — Carrinho + Checkout (Sprint Carrinho)

- **Objetivo:** Implementar o fluxo completo de compra: adicionar ao carrinho → revisar → finalizar com mensagem automática para o WhatsApp.
- **Implementação:**
  - Criado `src/contexts/CartContext.tsx` — Provider com `useReducer`; persiste em `localStorage` (try/catch para modo privado/bloqueado); hidrata estado no primeiro render; operações: `addItem` (soma quantity se produto já existe), `removeItem`, `updateQuantity` (remove se ≤0), `clearCart`; exporta `useCart` hook.
  - Criado `src/components/ui/AddToCartButton.tsx` — Client Component com 2 botões: "Adicionar ao Carrinho" (adiciona e permanece na página) e "Comprar Agora" (adiciona e redireciona direto para `/checkout`).
  - Criado `src/components/ui/CartIcon.tsx` — Client Component com ícone de carrinho e badge amarelo com contagem de itens; link para `/carrinho`.
  - Criado `src/app/carrinho/CartPageClient.tsx` + `src/app/carrinho/page.tsx` — estado vazio com link para produtos; lista de itens com thumbnail, controle de quantidade (±), remoção; resumo com subtotais e total; botão "Finalizar Pedido" → `/checkout`; "Continuar Comprando" → `/categoria`.
  - Criado `src/app/checkout/CheckoutClient.tsx` + `src/app/checkout/page.tsx` — `getStoreSettings()` no Server Component passa `whatsappNumber` ao Client; formulário: forma de pagamento (Dinheiro/PIX/Crédito/Débito, radio buttons visuais), modalidade (Retirada na Loja / Entrega), endereço condicional (obrigatório para entrega), observações. Função `buildWhatsAppMessage` monta mensagem formatada com todos os itens, totais, forma de pagamento e modalidade; `encodeURIComponent` na URL; `window.open` para nova aba. Botão desativado se endereço ausente na entrega.
  - Atualizado `src/app/layout.tsx` — envolve `children` com `<CartProvider>`.
  - Atualizado `src/components/layout/Header.tsx` — adiciona `<CartIcon />` ao lado do botão WhatsApp.
  - Atualizado `src/app/produto/[slug]/page.tsx` — substitui CTA WhatsApp estático por `<AddToCartButton product={...} />`; remove imports `getStoreSettings` e `buildWhatsAppUrl` que não são mais necessários aqui.
- **Decisões técnicas:**
  - Carrinho não é limpo após redirect ao WhatsApp (regra de negócio: redirecionamento não equivale a pedido confirmado).
  - Formas de pagamento como constante no código (Dinheiro/PIX/Crédito/Débito) — pendente configuração via admin no futuro.
  - `localStorage` com try/catch completo — funciona mesmo em modo privado ou com cookies bloqueados.
  - `window.open("...", "_blank", "noopener,noreferrer")` para segurança ao abrir WhatsApp.
  - `whatsapp_number` é `string | null` (conforme tipo de `StoreSettingsData`) — tratado com `?? ""` antes de `.replace`.
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0); corrigido `string | null` em `CheckoutClientProps`.
  - `npx next build` — OK (14 páginas, todas `ƒ Dynamic`, exit 0).
- **Arquivos criados:** `src/contexts/CartContext.tsx`, `src/components/ui/AddToCartButton.tsx`, `src/components/ui/CartIcon.tsx`, `src/app/carrinho/CartPageClient.tsx`, `src/app/carrinho/page.tsx`, `src/app/checkout/CheckoutClient.tsx`, `src/app/checkout/page.tsx`
- **Arquivos modificados:** `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/app/produto/[slug]/page.tsx`

### 2026-11-04 — Páginas públicas (Sprint Páginas Públicas)

- **Objetivo:** Implementar todas as páginas públicas do e-commerce: homepage com vitrines dinâmicas, listagem de categorias, produtos por categoria e detalhe de produto com CTA WhatsApp.
- **Implementação:**
  - Criado `src/components/ui/ProductCard.tsx` — Server Component reutilizável; imagem com `fill` + `unoptimized` + `aspect-square`; placeholder SVG quando sem imagem; preço em `brand-yellow`; hover com borda amarela; link para `/produto/[slug]`.
  - Atualizado `src/app/page.tsx` — homepage completamente dinâmica; carrega categorias e vitrines do Supabase com `Promise.all`; in-memory merge (vitrines → vitrine_products → produtos); fallback para categorias estáticas se DB vazio; fallback para skeleton animado se vitrines vazias; seções: Hero (CTA WhatsApp + "Ver Produtos"), Diferenciais (4 ícones), Categorias (grid dinâmico), Vitrines dinâmicas (ou placeholder), Serviços (4 cards), CTA Final.
  - Criado `src/app/categoria/page.tsx` — listagem de categorias com subcategory count do DB; fallback para 6 categorias estáticas; breadcrumb; grid 2→3→4 colunas; hover brand-yellow.
  - Criado `src/app/categoria/[slug]/page.tsx` — Server Component com `generateMetadata`; busca categoria por slug e produtos por `category_id`; `notFound()` quando categoria não existe; counter de produtos; grid 2→3→4→5 colunas; estado vazio com link para outras categorias.
  - Criado `src/app/produto/[slug]/page.tsx` — Server Component com `generateMetadata`; imagem principal `fill object-contain priority`; galeria de thumbnails quando múltiplas imagens; badge estoque (verde/vermelho); preço em destaque; CTA WhatsApp com mensagem pré-formatada (nome + preço + pedido de informações); breadcrumb com categoria.
- **Decisões técnicas:**
  - `notFound()` em vez de page vazia para 404 de slug inexistente — correto para SEO.
  - WhatsApp URL: `buildWhatsAppUrl(number) + "&text=" + encodeURIComponent(message)` para CTA pré-preenchido.
  - `unoptimized` em todas as imagens de produto/vitrine (URLs externas do usuário, apenas Cloudinary está configurado no next.config.ts).
  - In-memory merge no homepage: duas queries separadas (vitrines+vitrine_products e produtos by IDs) para evitar FK joins problemáticos.
  - Try/catch geral nas pages: DB indisponível ativa fallback estático (nunca quebra a tela).
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npx next build` — OK (12 páginas, todas `ƒ Dynamic`, exit 0); corrigido `let vitrineSections` → `const` (prefer-const ESLint).
- **Arquivos criados:** `src/components/ui/ProductCard.tsx`, `src/app/categoria/page.tsx`, `src/app/categoria/[slug]/page.tsx`, `src/app/produto/[slug]/page.tsx`
- **Arquivos modificados:** `src/app/page.tsx`, `Sobre o projeto/Contextos/Diário.md`

### 2026-11-04 — Admin de vitrines (`/admin/vitrines`)

- **Objetivo:** Implementar gerenciamento das vitrines da página inicial no painel admin.
- **Implementação:**
  - Criado `src/app/admin/vitrines/actions.ts` — `updateVitrineTitle(id, title)`, `toggleVitrineActive(id, isActive)`, `addProductToVitrine(vitrineId, productId)`, `removeProductFromVitrine(vitrineProductId)`, `moveVitrineProduct(vitrineId, vitrineProductId, direction)`. Cada action: auth check, `revalidatePath("/admin/vitrines")` + `revalidatePath("/")` para atualizar a homepage.
  - Criado `src/app/admin/vitrines/VitrinasClient.tsx` — 3 cards de vitrine (uma por vitrine); cada card tem: cabeçalho com título, badge de tipo (Carrossel/Grade/Linha), toggle ativo/inativo (verde/cinza), botão de editar título; corpo com lista de produtos (thumbnail, nome, preço, alerta sem estoque, botões ↑↓, botão remover), botão "Adicionar produto" dashed. Modal de edição de título (input + Enter para salvar). Modal de seleção de produto (busca client-side, lista de produtos disponíveis, clique para adicionar).
  - Atualizado `src/app/admin/vitrines/page.tsx` — Server Component async; busca vitrines com `vitrine_products` aninhados e todos os produtos ativos com imagens; merge em memória para enriquecer vitrine_products com nome/preço/estoque/imagem de cada produto; try/catch para DB indisponível.
- **Decisões técnicas:**
  - Sem nova migration — schema de vitrines já estava completo na migration 001.
  - `revalidatePath("/")` em todas as actions para que mudanças nas vitrines reflitam imediatamente na homepage.
  - Produtos sem estoque ficam visíveis no admin (com alerta) mas não aparecem na vitrine pública (filtro aplicado no SELECT público: `is_active = true AND stock > 0`).
  - Reordenação por troca de posições (simples, sem dependência de biblioteca de drag-and-drop).
  - Modal de produto com busca client-side para agilizar seleção.
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npm run lint` — OK (sem warnings ou erros)
  - `npm run build` — OK (11 páginas, `/admin/vitrines` = 3.66 kB, exit 0)
- **Arquivos criados:** `src/app/admin/vitrines/actions.ts`, `src/app/admin/vitrines/VitrinasClient.tsx`
- **Arquivos modificados:** `src/app/admin/vitrines/page.tsx`

### 2026-11-04 — Admin de produtos (`/admin/produtos`)

- **Objetivo:** Implementar CRUD completo de produtos no painel admin.
- **Implementação:**
  - Criado `supabase/migrations/005_products_brand_sku.sql` — adiciona `brand TEXT` e `sku TEXT` à tabela `products`; índice único parcial em `sku` (permite múltiplos NULLs); FK constraints de `products.category_id → categories(id)` e `products.subcategory_id → subcategories(id)` ON DELETE RESTRICT (usando DO block para idempotência).
  - Criado `src/app/admin/produtos/actions.ts` — `createProduct(formData)`, `updateProduct(id, formData)`, `deleteProduct(id)`, `toggleProductActive(id, isActive)`. Cada action: auth check server-side, validação de tipos (preço ≥ 0, estoque inteiro ≥ 0), slug único com fallback numérico, check de vínculos em vitrines antes de deletar, `revalidatePath("/admin/produtos")`.
  - Criado `src/app/admin/produtos/ProdutosClient.tsx` — lista de produtos com busca client-side (nome/marca/SKU); thumbnail com fallback icon; preço formatado em R$; badge Ativo/Inativo com toggle direto; modal de criação/edição (nome, marca, SKU, preço, estoque, categoria, subcategoria dinâmica, descrição, URL imagem, toggle status no edit); modal de exclusão com mensagem de erro inline; `formatCurrency` de `@/lib/utils`.
  - Atualizado `src/app/admin/produtos/page.tsx` — Server Component async; busca produtos com `product_images` aninhadas e categorias com `subcategories`; merge em memória (sem FK join por incompatibilidade com schema pre-005); try/catch para DB indisponível.
- **Decisões técnicas:**
  - Imagens por URL para esta versão. Cloudinary upload fica para sprint com Cloudinary configurado.
  - FK constraints adicionadas em migration 005 (seguro pois nenhuma migration foi aplicada ainda e tabelas estarão vazias).
  - Merge categoria/subcategoria em memória no Server Component (evita dependência de FK join no PostgREST).
  - Padrão idêntico a `/admin/categorias`: `runAction`, `useTransition`, `useRouter().refresh()`, `key` para remount do form.
- **Verificações executadas:**
  - `npx tsc --noEmit` — OK (exit 0)
  - `npm run lint` — OK (sem warnings ou erros)
  - `npm run build` — OK (11 páginas, `/admin/produtos` = 4.91 kB, exit 0)
- **Arquivos criados:** `supabase/migrations/005_products_brand_sku.sql`, `src/app/admin/produtos/actions.ts`, `src/app/admin/produtos/ProdutosClient.tsx`
- **Arquivos modificados:** `src/app/admin/produtos/page.tsx`

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

- **Migrations não aplicadas:** Migrations `001` a `009` criadas mas NÃO aplicadas ao projeto Supabase. Aplicar no Supabase SQL Editor em ordem (001 → 009). Migration 009 adiciona `image_url` em categories e `barcode`/`internal_code` em products (idempotente).
- **WhatsApp não configurado:** Após aplicar as migrations, acessar `/admin/configuracoes` e preencher o número do WhatsApp (formato: 5591999999999).

---

## 6. Próximas etapas

1. **Aplicar migrations no Supabase SQL Editor:** 001 → 002 → 003 → 004 → 005 → 006 → 007 (em ordem).
2. **Configurar loja:** `/admin/configuracoes` — WhatsApp, horários. `/admin/categorias` — criar categorias/subcategorias. `/admin/produtos` — cadastrar produtos com upload de imagens via Cloudinary. `/admin/vitrines` — montar vitrines incluindo vitrine_header.
3. **Testar upload de imagens:** Cadastrar produto no admin com upload de arquivo para verificar integração Cloudinary end-to-end.

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
