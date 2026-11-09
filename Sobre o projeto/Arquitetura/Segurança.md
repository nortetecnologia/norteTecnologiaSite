

## 1. Objetivo e princípios

Este documento estabelece os requisitos de segurança da aplicação Norte Tecnologia, abrangendo frontend, backend, banco de dados, autenticação, painel administrativo, integrações externas e futuras funcionalidades financeiras.

A segurança deverá ser considerada desde o início do desenvolvimento, não sendo tratada como uma funcionalidade isolada ou implementada somente quando surgirem problemas.

O projeto deverá seguir os seguintes princípios:

- **Security by Design:** considerar segurança durante todas as etapas de desenvolvimento.
    
- **Defesa em profundidade:** utilizar diferentes camadas de proteção, evitando depender de um único mecanismo.
    
- **Privilégio mínimo:** cada usuário, serviço e componente deverá possuir somente as permissões necessárias.
    
- **Negação por padrão:** acessos não explicitamente autorizados deverão ser negados.
    
- **Validação no servidor:** nenhuma validação realizada exclusivamente no frontend deverá ser considerada suficiente.
    
- **Separação de responsabilidades:** autenticação, autorização, regras de negócio e acesso aos dados deverão possuir responsabilidades bem definidas.
    
- **Escalabilidade:** os mecanismos de segurança deverão funcionar corretamente em ambientes distribuídos e com múltiplas instâncias da aplicação.
    

A aplicação deverá ser desenvolvida considerando a possibilidade de crescimento do catálogo, quantidade de acessos, usuários administrativos, integrações e funcionalidades.

## 2. Autenticação administrativa

**Status:** ✅ Implementada. Supabase Auth via e-mail/senha. Middleware Next.js protege todas as rotas `/admin`. Verificação in-page adicionada como defesa em profundidade em 2026-11-09.

A autenticação dos usuários administrativos será realizada pelo Supabase Auth, utilizando e-mail e senha.

### 2.1. Acesso administrativo

- Todas as rotas administrativas deverão exigir autenticação.
    
- A autenticação deverá ser verificada no servidor.
    
- Usuários não autenticados deverão ser redirecionados para a tela de login.
    
- A autorização deverá ser verificada individualmente nas operações administrativas.
    
- Não deverá existir cadastro público de administradores.
    
- A criação de usuários administrativos deverá ser restrita a um procedimento controlado.
    
- A aplicação deverá permitir futuramente diferentes níveis de acesso administrativo, como administrador e operador.
    
- Usuários desativados ou sem autorização deverão perder acesso às funcionalidades administrativas.
    

A proteção não deverá depender apenas da ocultação de páginas, botões ou menus. Todas as operações sensíveis deverão possuir verificações próprias no servidor.

### 2.2. Senhas

- Utilizar os mecanismos de armazenamento e verificação de senhas do Supabase Auth.
    
- Nunca armazenar senhas em tabelas próprias da aplicação.
    
- Nunca registrar senhas em logs.
    
- Nunca transmitir senhas por parâmetros de URL.
    
- Não implementar algoritmos próprios de criptografia ou armazenamento de senhas.
    
- Utilizar as políticas de senha disponibilizadas pelo Supabase e exigir senhas fortes.
    
- Permitir recuperação de senha por procedimento seguro, com links de uso limitado e validade controlada.
    

### 2.3. Autenticação multifator

A arquitetura deverá permitir a implementação de autenticação multifator (MFA).

Recomenda-se utilizar MFA por aplicativo autenticador (TOTP) para usuários administrativos, especialmente para contas com permissões elevadas.

A implementação deverá ser considerada obrigatória antes de ampliar a quantidade de usuários administrativos ou conceder permissões críticas.

### 2.4. Sessões

- Utilizar o gerenciamento de sessões do Supabase Auth.
    
- Proteger os cookies de autenticação com as configurações de segurança adequadas, incluindo HttpOnly, Secure e SameSite quando aplicável à implementação.
    
- Não armazenar tokens de autenticação em locais acessíveis desnecessariamente ao JavaScript.
    
- Implementar renovação e expiração de sessões.
    
- Encerrar sessões após logout.
    
- Permitir revogação de sessões quando houver suspeita de comprometimento de uma conta.
    
- Exigir nova autenticação para operações administrativas especialmente sensíveis, quando aplicável.
    

## 3. Rate limiting e proteção contra força bruta

**Status:** ✅ Implementado (2026-11-09). Rate limiting sliding window em `src/lib/rateLimit.ts`. Login: 10 tentativas/15 min por IP. Ver seção 3.3 para limitação de instância única.

O login administrativo será uma das principais superfícies de ataque da aplicação. Deverá existir proteção específica contra tentativas automatizadas de descoberta de senhas (brute force), abuso de requisições e ataques de credenciais.

### 3.1. Controle de tentativas

Implementar rate limiting no endpoint responsável pela autenticação administrativa.

O controle deverá considerar:

- Endereço IP de origem.
    
- Identificador da conta, utilizando e-mail normalizado.
    
- Quantidade de tentativas em determinado intervalo.
    
- Tentativas repetidas em diferentes intervalos.
    
- Padrões de comportamento suspeitos.
    

Os limites deverão ser configuráveis, permitindo ajustes sem necessidade de modificar a lógica principal da aplicação.

Valores iniciais sugeridos para implementação e posterior ajuste:

- Até 5 tentativas de autenticação por conta em uma janela de 15 minutos.
    
- Limitação adicional por endereço IP, considerando tentativas contra diferentes contas.
    
- Aplicação de bloqueio temporário ou atraso progressivo após sucessivas falhas.
    
- Aumento gradual da proteção em caso de comportamento suspeito.
    

Os limites deverão ser ajustados conforme o uso real, evitando bloqueios indevidos de usuários legítimos.

### 3.2. Bloqueio e recuperação

- Bloqueios deverão ser temporários e possuir expiração automática.
    
- Não implementar bloqueios permanentes baseados exclusivamente em tentativas de login.
    
- O sistema deverá evitar que terceiros consigam bloquear indefinidamente uma conta administrativa.
    
- Tentativas excedentes deverão receber respostas HTTP apropriadas, como 429 (Too Many Requests).
    
- As mensagens de erro não deverão revelar se determinado e-mail está cadastrado.
    
- Após sucessivas tentativas suspeitas, poderá ser exigida uma verificação adicional contra automações, como CAPTCHA.
    

### 3.3. Armazenamento distribuído

> **Situação atual (2026-11-09):** implementação usa `Map` em memória (`src/lib/rateLimit.ts`). Funciona corretamente em instância única. Em produção com múltiplas instâncias Vercel (Hobby plan usa uma instância), os contadores NÃO são compartilhados entre instâncias. Para escalar, substituir por Upstash Redis (`@upstash/ratelimit`). Vercel Firewall pode complementar na camada de rede.

O rate limiting deverá funcionar corretamente na infraestrutura da Vercel.

- Não utilizar exclusivamente variáveis em memória para controlar tentativas.
    
- Utilizar armazenamento compartilhado entre as instâncias da aplicação.
    
- Considerar soluções como Redis ou serviço equivalente.
    
- Garantir que os contadores sejam atualizados de maneira consistente e atômica.
    
- Implementar expiração automática dos registros de tentativas.
    
- Evitar armazenar senhas, tokens ou outras credenciais nesses registros.
    

O rate limiting próprio deverá complementar os limites de autenticação do Supabase, não substituí-los.

### 3.4. Auditoria de autenticação

Registrar eventos relevantes, incluindo:

- Tentativas de login malsucedidas.
    
- Logins bem-sucedidos.
    
- Bloqueios temporários.
    
- Tentativas de acesso não autorizado.
    
- Alterações de senha.
    
- Encerramento e revogação de sessões.
    
- Ativações ou alterações de MFA.
    

Os registros deverão conter informações suficientes para investigação, sem armazenar senhas, tokens ou dados sensíveis desnecessários.

## 4. Autorização e controle de acesso

Autenticação e autorização são mecanismos diferentes e ambos deverão ser implementados.

- Autenticação verifica quem está acessando.
    
- Autorização determina o que esse usuário pode fazer.
    

A aplicação deverá adotar o princípio de negação por padrão.

### 4.1. Proteção das rotas administrativas

Todas as rotas e operações administrativas deverão verificar:

1. Existência de uma sessão válida.
    
2. Identidade do usuário autenticado.
    
3. Permissão necessária para a operação solicitada.
    
4. Validade dos dados recebidos.
    

A verificação deverá acontecer no servidor, inclusive em endpoints de API, Route Handlers e Server Actions.

### 4.2. Níveis de permissão

A arquitetura deverá permitir diferentes níveis de acesso, mesmo que inicialmente exista apenas um administrador.

Exemplos de funções futuras:

- Administrador: acesso completo ao painel.
    
- Operador: gerenciamento de produtos, serviços e estoque.
    
- Gerente: acesso a configurações, relatórios e operações autorizadas.
    

As permissões não deverão depender de informações que o próprio usuário possa modificar livremente, como campos de perfil ou metadados editáveis.

## 5. Segurança do Supabase e banco de dados

**Status:** Obrigatório na primeira versão.

O banco de dados deverá possuir controles próprios de segurança, independentemente das verificações realizadas pela aplicação.

### 5.1. Row Level Security (RLS)

- Habilitar RLS em todas as tabelas expostas pela API do Supabase.
    
- Criar políticas específicas para cada operação: SELECT, INSERT, UPDATE e DELETE.
    
- Conceder somente as permissões necessárias para cada tipo de usuário.
    
- Restringir operações administrativas a usuários devidamente autorizados.
    
- Permitir acesso público somente aos dados necessários para o funcionamento da loja.
    
- Impedir que usuários não autenticados alterem produtos, preços, estoques, vitrines ou configurações.
    
- Testar as políticas para usuários anônimos e autenticados.
    

A existência de uma política RLS não substitui a configuração correta dos privilégios SQL (GRANT e REVOKE).

### 5.2. Chaves e credenciais

- A chave pública do Supabase poderá ser utilizada no frontend conforme as recomendações oficiais.
    
- A chave secreta ou antiga service_role deverá permanecer exclusivamente no servidor.
    
- Nunca incluir chaves privilegiadas em variáveis com prefixo NEXT_PUBLIC_.
    
- Nunca armazenar credenciais diretamente no código-fonte.
    
- Nunca enviar credenciais ao GitHub.
    
- Utilizar variáveis de ambiente separadas para desenvolvimento, preview e produção.
    
- Restringir o uso de credenciais privilegiadas aos componentes que realmente necessitem delas.
    

### 5.3. Proteção dos dados

- Utilizar consultas parametrizadas e mecanismos seguros de acesso ao banco.
    
- Evitar construir consultas SQL por concatenação de valores recebidos do usuário.
    
- Validar dados antes de inserções e atualizações.
    
- Utilizar constraints, relacionamentos e integridade referencial no PostgreSQL.
    
- Evitar exposição de informações administrativas em consultas públicas.
    
- Não permitir que dados enviados pelo frontend determinem diretamente permissões ou privilégios.
    

### 5.4. Migrações e alterações no banco

- Estruturar o banco utilizando migrações versionadas.
    
- Não realizar alterações estruturais diretamente em produção sem registrar a migração correspondente.
    
- Revisar alterações de políticas RLS e permissões antes da publicação.
    
- Manter procedimentos de backup e recuperação.
    
- Testar migrações em ambiente separado antes de aplicá-las em produção.
    

## 6. Segurança das APIs e do backend

Todas as operações que alterem dados ou executem ações administrativas deverão ser protegidas no servidor.

Requisitos:

- Validar todos os dados recebidos.
    
- Verificar autenticação e autorização em cada operação sensível.
    
- Limitar tamanho de requisições e arquivos recebidos.
    
- Validar tipos, formatos e valores permitidos.
    
- Implementar tratamento seguro de erros.
    
- Evitar retornar informações internas, credenciais, consultas SQL ou stack traces ao cliente.
    
- Proteger endpoints contra abuso de requisições.
    
- Utilizar códigos HTTP apropriados.
    
- Não confiar em preços, descontos, estoque ou totais calculados exclusivamente pelo navegador.
    

Os valores de pedidos deverão ser recalculados ou verificados no servidor utilizando os dados válidos do banco.

### 6.1. Proteção contra vulnerabilidades comuns

O desenvolvimento deverá considerar, no mínimo:

- SQL Injection.
    
- Cross-Site Scripting (XSS).
    
- Cross-Site Request Forgery (CSRF).
    
- Server-Side Request Forgery (SSRF).
    
- Insecure Direct Object Reference (IDOR).
    
- Broken Access Control.
    
- Mass Assignment.
    
- Exposição de informações sensíveis.
    
- Upload de arquivos maliciosos.
    
- Abuso de endpoints e automações.
    

Não implementar mecanismos de segurança próprios quando houver soluções consolidadas e adequadas nas tecnologias utilizadas.

## 7. Segurança do frontend e navegador

O frontend deverá ser tratado como ambiente não confiável.

- Não incluir credenciais privilegiadas no bundle do navegador.
    
- Não confiar em campos ocultos, botões desabilitados ou validações visuais como mecanismos de segurança.
    
- Evitar renderização de HTML não confiável.
    
- Sanitizar ou escapar conteúdo dinâmico conforme o contexto.
    
- Configurar Content Security Policy (CSP).
    
- Configurar cabeçalhos de segurança HTTP adequados.
    
- Utilizar HTTPS em toda a aplicação.
    
- Redirecionar requisições HTTP para HTTPS.
    
- Evitar exposição de dados administrativos em código, páginas ou respostas públicas.
    

Os cabeçalhos deverão considerar, entre outros, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy e uma CSP compatível com os serviços utilizados.

## 8. Segurança de uploads e imagens

**Serviço:** Cloudinary.

Os uploads realizados pelo painel administrativo deverão possuir proteção específica.

- Permitir somente formatos de imagem previamente definidos.
    
- Validar extensão, MIME type e conteúdo real do arquivo.
    
- Estabelecer limite máximo de tamanho.
    
- Rejeitar arquivos executáveis e formatos não permitidos.
    
- Utilizar nomes e identificadores controlados pelo sistema.
    
- Não confiar exclusivamente na validação realizada pelo navegador.
    
- Proteger os endpoints responsáveis pela geração de assinaturas de upload.
    
- Permitir uploads somente a administradores autorizados.
    
- Restringir os parâmetros de upload e as pastas permitidas.
    
- Não expor a API Secret do Cloudinary.
    
- Registrar falhas e operações relevantes de upload.
    

A API Secret deverá ser utilizada exclusivamente no servidor. A assinatura de upload deverá ser gerada no backend, permitindo que o navegador envie a imagem diretamente ao Cloudinary sem receber a credencial secreta.

As URLs de imagens externas deverão ser tratadas como conteúdo não confiável. O sistema deverá evitar buscar URLs arbitrárias pelo servidor, prevenindo ataques SSRF.

## 9. Segurança das variáveis de ambiente e infraestrutura

**Serviço:** Vercel.

As credenciais das integrações deverão ser armazenadas nas variáveis de ambiente da Vercel.

Requisitos:

- Separar variáveis de desenvolvimento, preview e produção.
    
- Não utilizar prefixo NEXT_PUBLIC_ em credenciais secretas.
    
- Não incluir arquivos .env com credenciais no Git.
    
- Manter um arquivo .env.example contendo somente os nomes das variáveis, sem valores reais.
    
- Restringir o acesso às configurações e credenciais do projeto.
    
- Não compartilhar credenciais administrativas entre desenvolvedores.
    
- Utilizar autenticação multifator nas contas de infraestrutura.
    
- Revogar e substituir credenciais em caso de suspeita de exposição.
    
- Revisar permissões de acesso ao GitHub, Vercel, Supabase e Cloudinary.
    

Os ambientes de preview não deverão utilizar credenciais ou dados de produção sem uma justificativa e controles específicos.

## 10. Proteção contra abuso e ataques automatizados

Além do rate limiting no login, a aplicação deverá permitir a implementação progressiva de controles para outros endpoints.

Exemplos:

- Endpoints de consulta e pesquisa.
    
- Solicitações de orçamento.
    
- Formulários de contato.
    
- Upload de imagens.
    
- Importação de XML.
    
- Operações administrativas.
    

Os limites deverão considerar o tipo de operação e o comportamento esperado, evitando restrições excessivas para clientes legítimos.

A infraestrutura deverá utilizar as proteções disponíveis na Vercel, incluindo mecanismos de mitigação de tráfego abusivo e regras de firewall quando aplicáveis.

## 11. Logs, auditoria e monitoramento

A aplicação deverá possuir registros que permitam identificar problemas de segurança e investigar operações administrativas.

Eventos relevantes:

- Login e logout.
    
- Tentativas de autenticação malsucedidas.
    
- Bloqueios por rate limiting.
    
- Acessos negados.
    
- Criação, edição e exclusão de produtos.
    
- Alterações de estoque.
    
- Alterações de preços.
    
- Modificações nas configurações da loja.
    
- Importações de XML.
    
- Upload e remoção de imagens.
    
- Alterações nas permissões administrativas.
    

Os registros deverão identificar o usuário responsável, a operação, a data e informações suficientes para rastreabilidade.

Regras:

- Nunca registrar senhas, tokens, chaves secretas ou dados de cartões.
    
- Restringir o acesso aos logs.
    
- Evitar armazenar dados pessoais desnecessários.
    
- Definir política de retenção.
    
- Registrar falhas de operações importantes.
    
- Monitorar comportamentos anormais e erros recorrentes.
    

## 12. Backups e recuperação

O projeto deverá possuir uma estratégia de recuperação de dados.

- Configurar backups do banco de dados.
    
- Definir frequência de backup conforme a importância dos dados.
    
- Conhecer os procedimentos de restauração.
    
- Testar periodicamente a recuperação dos backups.
    
- Proteger os backups contra acesso não autorizado.
    
- Documentar os procedimentos de recuperação.
    
- Não considerar um backup válido sem verificar a possibilidade de restauração.
    

A estratégia deverá evoluir conforme o volume de dados e a importância operacional da loja aumentarem.

## 13. Preparação para futuros pagamentos online

**Status:** Preparação arquitetural obrigatória. Integrações não implementadas.

A aplicação deverá ser estruturada considerando a futura possibilidade de processamento de pagamentos por gateways externos.

Requisitos:

- Separar pedidos de transações financeiras.
    
- Não armazenar dados completos de cartões de crédito ou débito.
    
- Preferir checkout hospedado ou componentes tokenizados disponibilizados pelo gateway.
    
- Utilizar HTTPS em todas as comunicações.
    
- Validar notificações e webhooks recebidos.
    
- Verificar assinaturas e autenticidade dos eventos.
    
- Implementar proteção contra repetição de eventos (idempotência).
    
- Não confiar apenas no retorno do navegador para considerar um pagamento aprovado.
    
- Registrar identificadores das transações e seus respectivos estados.
    
- Restringir o acesso aos dados financeiros.
    
- Manter credenciais dos gateways exclusivamente no servidor.
    
- Registrar eventos financeiros relevantes para auditoria.
    

A arquitetura deverá permitir a integração de diferentes provedores sem acoplamento excessivo às regras de negócio do checkout.

Quando a integração financeira for planejada, deverão ser avaliadas as exigências de segurança e conformidade aplicáveis, incluindo PCI DSS conforme o fluxo de pagamento escolhido.

A preparação arquitetural não significa que a aplicação já estará certificada ou em conformidade com requisitos de segurança de pagamentos.

## 14. Testes de segurança

A segurança deverá ser verificada durante o desenvolvimento e antes de publicações em produção.

Testes obrigatórios:

- Acesso administrativo sem autenticação.
    
- Acesso a endpoints administrativos sem autenticação.
    
- Tentativa de operações com usuário autenticado, mas sem permissão.
    
- Tentativas repetidas de login.
    
- Funcionamento do rate limiting em múltiplas instâncias.
    
- Acesso público indevido a dados administrativos.
    
- Testes de políticas RLS.
    
- Tentativas de alteração de estoque e preços por usuários não autorizados.
    
- Envio de arquivos inválidos.
    
- Tentativas de acesso a recursos de outros usuários.
    
- Validação de dados malformados.
    
- Verificação de exposição de credenciais.
    
- Testes de recuperação de sessão e logout.
    

Ferramentas e referências recomendadas:

- OWASP ASVS para requisitos de verificação de segurança.
    
- OWASP Top 10 para identificação de riscos comuns.
    
- Testes automatizados de autorização e RLS.
    
- Análise de dependências vulneráveis.
    
- Análise estática de código.
    
- Testes de segurança dos endpoints.
    

Nenhuma alteração que enfraqueça mecanismos de segurança deverá ser aceita sem justificativa técnica e aprovação.

## 15. Diretrizes obrigatórias para o agente de desenvolvimento

O Claude Code deverá respeitar as seguintes instruções:

1. Nunca desabilitar autenticação, autorização ou RLS para facilitar o desenvolvimento.
    
2. Nunca expor credenciais, tokens ou chaves secretas.
    
3. Nunca utilizar credenciais de produção em testes locais sem autorização.
    
4. Nunca confiar exclusivamente em validações do frontend.
    
5. Nunca criar endpoints administrativos sem autenticação e autorização.
    
6. Nunca permitir operações privilegiadas somente por meio de verificações visuais.
    
7. Nunca utilizar a chave service_role ou secret key no navegador.
    
8. Sempre verificar as políticas RLS ao criar ou modificar tabelas.
    
9. Sempre avaliar os impactos de segurança antes de adicionar dependências ou integrações.
    
10. Sempre incluir testes para novas permissões e operações sensíveis.
    
11. Sempre atualizar esta documentação quando houver mudanças relevantes na arquitetura de segurança.
    
12. Nunca publicar alterações que comprometam os controles de segurança existentes.
    

Em caso de dúvida sobre uma decisão que possa afetar a segurança, o agente deverá interromper a implementação da parte correspondente e solicitar esclarecimento.

## 16. Evolução da segurança

A segurança deverá acompanhar o crescimento da Norte Tecnologia.

**Fase 1 — Primeira versão**

- Autenticação administrativa com Supabase Auth.
    
- Autorização no servidor.
    
- Rate limiting no login.
    
- Políticas RLS.
    
- Proteção de credenciais e variáveis de ambiente.
    
- HTTPS e cabeçalhos de segurança.
    
- Proteção de uploads.
    
- Logs de operações administrativas.
    
- Backups e testes de acesso.
    

**Fase 2 — Expansão administrativa**

- MFA obrigatório para administradores.
    
- Diferentes níveis de permissão.
    
- Auditoria administrativa mais detalhada.
    
- Rate limiting em outros endpoints.
    
- Monitoramento de atividades suspeitas.
    
- Revisões periódicas de segurança.
    

**Fase 3 — Pagamentos online**

- Integração segura com gateways.
    
- Validação de webhooks.
    
- Idempotência de transações.
    
- Proteção e auditoria de operações financeiras.
    
- Avaliação de requisitos PCI DSS e demais exigências aplicáveis.
    

**Fase 4 — Crescimento da aplicação**

- Revisões periódicas de arquitetura e segurança.
    
- Testes de penetração conforme a exposição e criticidade.
    
- Monitoramento e alertas.
    
- Revisão de permissões e credenciais.
    
- Estratégia de recuperação de desastres.
    
- Avaliação de capacidade e disponibilidade da infraestrutura.
    

---

## 17. Critério de conclusão

Uma funcionalidade administrativa não deverá ser considerada concluída apenas porque funciona visualmente.

Ela deverá possuir:

- Autenticação e autorização adequadas.
    
- Validação de dados no servidor.
    
- Proteção das operações no banco de dados.
    
- Tratamento seguro de erros.
    
- Testes de acesso permitido e negado.
    
- Documentação atualizada.
    

A segurança deverá ser considerada parte dos critérios de aceite de todas as funcionalidades sensíveis.