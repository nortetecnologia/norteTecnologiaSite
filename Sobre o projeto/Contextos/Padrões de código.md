# Padrões de Código, Qualidade e Boas Práticas

## 1. Objetivo

Todo código desenvolvido para a Norte Tecnologia deve seguir padrões profissionais de qualidade, priorizando:

- Código limpo, organizado e legível.
- Segurança desde o início do desenvolvimento.
- Bom desempenho e eficiência.
- Escalabilidade e facilidade de manutenção.
- Baixo acoplamento entre módulos.
- Reutilização de componentes e funções.
- Separação clara de responsabilidades.
- Acessibilidade e boa experiência do usuário.
- Facilidade para testar, identificar e corrigir problemas.

O objetivo não é apenas fazer o sistema funcionar, mas construir uma aplicação confiável, segura e preparada para evoluir.

## 2. Instruções obrigatórias antes de desenvolver

Antes de iniciar qualquer tarefa:

1. Leia o arquivo `CLAUDE.md`.
2. Consulte `Contextos/README.md`.
3. Leia `Contextos/diario.md` para identificar o estado atual do projeto, implementações recentes, pendências e próximos passos.
4. Consulte os documentos de contexto relacionados à tarefa.
5. Analise a estrutura atual do projeto e os códigos existentes.
6. Verifique se já existem componentes, funções, serviços ou soluções que possam ser reutilizados.
7. Identifique possíveis impactos da alteração em outras partes do sistema.

Não desenvolva funcionalidades com base em suposições quando as regras de negócio ou decisões técnicas ainda não estiverem definidas.

Se houver uma decisão importante em aberto, consulte `Contextos/06-decisoes/pendencias-e-decisoes-abertas.md` e solicite esclarecimento quando necessário.

## 3. Código limpo e organização

Siga os princípios de Clean Code e boas práticas de desenvolvimento.

- Utilize nomes claros, descritivos e consistentes para variáveis, funções, classes e arquivos.
- Mantenha funções pequenas, objetivas e com responsabilidades bem definidas.
- Evite duplicação de código (DRY).
- Evite funções excessivamente complexas.
- Evite arquivos muito extensos e difíceis de compreender.
- Separe responsabilidades por módulos e camadas.
- Evite dependências desnecessárias.
- Não crie abstrações complexas sem necessidade real.
- Prefira soluções simples, claras e sustentáveis.
- Utilize tipagem adequada com TypeScript.
- Evite `any` sempre que possível.
- Evite variáveis, funções, imports e dependências sem utilização.
- Não deixe códigos antigos, comentados ou experimentais sem justificativa.
- Utilize comentários para explicar decisões ou comportamentos que não sejam óbvios, e não para descrever cada linha de código.

Não sacrifique a legibilidade em busca de soluções excessivamente curtas ou sofisticadas.

## 4. Arquitetura e separação de responsabilidades

Utilize uma arquitetura modular, organizada e preparada para crescimento.

- Mantenha a interface separada das regras de negócio.
- Centralize operações reutilizáveis em módulos apropriados.
- Separe validações, acesso ao banco de dados, integrações externas e lógica de apresentação.
- Evite colocar regras de negócio diretamente nos componentes visuais.
- Evite consultas ao banco de dados espalhadas desnecessariamente pela aplicação.
- Centralize configurações e constantes compartilhadas.
- Evite dependências circulares.
- Utilize componentes reutilizáveis quando houver benefício real.
- Preserve a consistência arquitetural entre funcionalidades semelhantes.

Prefira uma arquitetura modular e monolítica inicialmente. Não introduza microsserviços ou complexidade arquitetural sem necessidade comprovada.

## 5. Segurança

A segurança deve ser considerada em todas as etapas do desenvolvimento.

### Autenticação e autorização

- Utilize Supabase Auth para autenticação administrativa.
- Implemente autorização no servidor, não apenas na interface.
- Proteja todas as rotas e operações administrativas.
- Não considere uma rota segura apenas porque está oculta ou possui um nome difícil de descobrir.
- Não permita cadastro público de administradores.
- Implemente controle de acesso conforme os papéis e permissões definidos.
- Utilize políticas RLS (Row Level Security) nas tabelas do Supabase.
- Valide as permissões em cada operação sensível.

### Proteção de dados e credenciais

- Nunca exponha senhas, tokens, chaves privadas ou credenciais no código frontend.
- Nunca utilize `SUPABASE_SECRET_KEY` ou `CLOUDINARY_API_SECRET` no navegador.
- Não envie informações sensíveis para logs.
- Não armazene senhas em texto puro.
- Não versione arquivos `.env`, `.env.local` ou outros arquivos com credenciais.
- Utilize variáveis de ambiente para configurações sensíveis.
- Não inclua informações internas do sistema nas mensagens de erro exibidas ao usuário.

### Validação e proteção contra ataques

- Valide os dados recebidos tanto no frontend quanto no backend.
- Nunca confie exclusivamente nas validações realizadas pelo navegador.
- Utilize consultas parametrizadas e mecanismos seguros de acesso ao banco.
- Proteja a aplicação contra SQL Injection, XSS, CSRF e outras vulnerabilidades aplicáveis.
- Implemente proteção contra abuso e tentativas excessivas de login.
- Valide arquivos enviados, incluindo extensão, tipo real, tamanho e conteúdo.
- Proteja integrações externas contra SSRF e requisições indevidas.
- Não permita que operações administrativas sejam executadas sem autorização.
- Utilize HTTPS e configurações seguras de sessão e cookies.
- Considere limites de requisições e proteção contra automação abusiva.

### Segurança do Supabase

- Habilite RLS nas tabelas que precisam de proteção.
- Crie políticas específicas para cada operação e perfil de acesso.
- Não conceda permissões excessivas.
- Utilize chaves privilegiadas exclusivamente no servidor.
- Não confunda autenticação com autorização.
- Não permita que usuários comuns alterem informações administrativas ou dados de outros usuários.

## 6. Desempenho e otimização

Desenvolva pensando em desempenho desde o início.

- Evite consultas desnecessárias ao banco de dados.
- Busque apenas os campos necessários.
- Utilize paginação em listas extensas.
- Crie índices para consultas frequentes, quando justificável.
- Evite processamento repetitivo e desnecessário.
- Evite renderizações desnecessárias no React.
- Utilize carregamento sob demanda quando apropriado.
- Utilize cache de maneira consciente, respeitando a atualização dos dados.
- Otimize imagens com os recursos disponíveis no Next.js e Cloudinary.
- Utilize formatos modernos de imagem e dimensões adequadas ao contexto de exibição.
- Evite carregar imagens e recursos que não estão sendo utilizados.
- Monitore consultas lentas e gargalos.
- Evite dependências pesadas sem necessidade.

A otimização não deve comprometer a segurança, a qualidade visual ou a manutenção do sistema.

## 7. Frontend e experiência do usuário

- Utilize componentes reutilizáveis e padronizados.
- Siga a identidade visual definida nos documentos de contexto.
- Mantenha consistência entre páginas públicas e administrativas.
- Garanta responsividade em celulares, tablets e computadores.
- Utilize HTML semântico.
- Garanta acessibilidade por teclado e leitores de tela.
- Utilize rótulos adequados nos campos de formulário.
- Apresente mensagens claras de sucesso, erro e carregamento.
- Implemente estados vazios, de carregamento e de falha.
- Evite interfaces que apresentem informações incorretas enquanto aguardam respostas do servidor.
- Não dependa exclusivamente de cores para transmitir informações.

## 8. Backend e banco de dados

- Mantenha regras de negócio no ambiente apropriado do servidor.
- Valide os dados antes de realizar operações.
- Utilize transações quando uma operação exigir consistência entre múltiplas alterações.
- Trate falhas de integrações externas.
- Evite operações duplicadas que possam gerar inconsistências.
- Utilize paginação e filtros eficientes.
- Preserve a integridade referencial do banco.
- Defina restrições e índices adequados.
- Crie migrations versionadas para alterações estruturais.
- Não altere manualmente o banco de produção sem autorização e procedimento controlado.
- Não exclua ou modifique dados existentes sem avaliar os impactos.

## 9. Tratamento de erros e logs

- Trate erros de maneira previsível.
- Utilize mensagens compreensíveis para o usuário.
- Registre informações técnicas relevantes em logs internos.
- Não exponha stack traces, consultas SQL, tokens ou detalhes da infraestrutura.
- Evite blocos `try/catch` vazios.
- Não ignore erros silenciosamente.
- Diferencie erros de validação, autorização, conexão, integração e processamento.
- Registre falhas importantes de operações administrativas e integrações.

## 10. Testes e validação

Toda funcionalidade deve ser validada antes de ser considerada concluída.

Utilize testes adequados ao tipo de alteração:

- Testes unitários para funções e regras de negócio.
- Testes de integração para banco de dados e serviços.
- Testes de componentes para interfaces relevantes.
- Testes de ponta a ponta para fluxos críticos.
- Testes de autorização e segurança para operações sensíveis.
- Testes de regressão para evitar que alterações quebrem funcionalidades existentes.

Não considere uma funcionalidade concluída apenas porque a página abriu ou o código compilou.

## 11. Comandos de desenvolvimento e verificação

Antes de utilizar comandos, consulte o `package.json` e identifique os scripts realmente disponíveis. Não presuma que todos existem.

Comandos comuns que devem ser considerados:

### Instalação de dependências

```bash
npm install
```

### Executar ambiente de desenvolvimento

```bash
npm run dev
```

### Verificar erros de TypeScript

```bash
npx tsc --noEmit
```

### Executar o ESLint

```bash
npm run lint
```

Se o script não existir, verifique a configuração do ESLint e utilize o comando apropriado.

### Executar testes

```bash
npm test
```

Se o projeto utilizar outro comando ou framework de testes, siga a configuração existente.

### Gerar build de produção

```bash
npm run build
```

### Verificar alterações no Git

```bash
git status
git diff
```

### Verificar dependências

```bash
npm audit
```

Analise os resultados do comando. Não atualize ou remova dependências automaticamente sem avaliar possíveis incompatibilidades.

### Regras para execução de comandos

- Não execute comandos destrutivos sem compreender seus efeitos.
- Não utilize `--force` ou `--legacy-peer-deps` como solução automática para problemas de dependências.
- Não apague arquivos, dados, tabelas ou migrations sem autorização.
- Não execute comandos diretamente em produção sem autorização explícita.
- Não instale bibliotecas desnecessárias.
- Prefira utilizar dependências já presentes no projeto.
- Explique problemas encontrados e apresente alternativas antes de realizar alterações de risco.

## 12. Git e controle de versões

Siga obrigatoriamente as regras de `Contextos/05-padroes-de-desenvolvimento/git-e-deploy.md`.

- Não desenvolva diretamente na branch `main`.
- Crie branches específicas para cada tarefa.
- Utilize commits pequenos e descritivos.
- Não inclua arquivos secretos nos commits.
- Revise as alterações antes de enviar para o GitHub.
- Atualize a documentação antes do commit e push.
- Abra Pull Requests para integração das alterações.
- Audite o código antes de solicitar aprovação.
- Não faça merge ou deploy em produção sem autorização explícita.

Exemplos de nomes de branches:

```bash
feature/cadastro-produtos
feature/gestao-estoque
fix/erro-no-checkout
refactor/organizacao-dos-servicos
docs/atualizacao-documentacao
```

Exemplos de commits:

```bash
git add .
git commit -m "feat: adiciona cadastro de produtos"
git commit -m "fix: corrige validacao de estoque"
git commit -m "refactor: organiza camada de servicos"
git commit -m "docs: atualiza documentacao da arquitetura"
```

## 13. Documentação e diário de desenvolvimento

A documentação faz parte da implementação e não deve ser tratada como uma atividade opcional.

Após cada tarefa relevante:

- Atualize os documentos de contexto afetados.
- Atualize `Contextos/diario.md`.
- Registre o que foi implementado.
- Registre os arquivos e módulos modificados.
- Registre decisões técnicas relevantes.
- Informe os testes executados e seus resultados.
- Registre problemas conhecidos e pendências.
- Indique o próximo passo recomendado.

Não declare que uma tarefa foi concluída se não verificou sua implementação e seus testes.

## 14. Auditoria obrigatória antes de concluir uma tarefa

Antes de considerar qualquer implementação concluída, verifique:

1. O código está organizado e legível?
2. Existem duplicações desnecessárias?
3. As responsabilidades estão separadas corretamente?
4. Existem vulnerabilidades ou exposição de dados?
5. As permissões e validações estão implementadas no servidor?
6. O desempenho está adequado?
7. A interface funciona em diferentes tamanhos de tela?
8. Os erros são tratados corretamente?
9. Os testes e verificações foram executados?
10. A documentação foi atualizada?
11. O diário foi atualizado?
12. Existem alterações não relacionadas à tarefa?

Se identificar problemas, corrija-os antes de finalizar, respeitando os limites e autorizações do projeto.

## 15. Conduta esperada do Claude Code

- Não implemente soluções improvisadas apenas para concluir uma tarefa rapidamente.
- Não modifique partes não relacionadas sem necessidade.
- Não substitua uma implementação existente sem compreender seu funcionamento.
- Não remova funcionalidades para facilitar uma implementação.
- Não introduza dependências ou tecnologias sem justificativa.
- Não invente regras de negócio.
- Não oculte erros ou limitações.
- Não considere uma implementação segura sem verificar as proteções necessárias.
- Explique decisões arquiteturais importantes.
- Priorize soluções simples, robustas e sustentáveis.

**Princípio fundamental:** cada alteração deve melhorar o projeto sem comprometer sua segurança, estabilidade, desempenho, organização ou capacidade de evolução.