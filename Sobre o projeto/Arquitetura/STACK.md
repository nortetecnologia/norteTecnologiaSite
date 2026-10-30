# Stack Tecnológica e Diretrizes Arquiteturais

## 1. Objetivo arquitetural

O projeto Norte Tecnologia deverá ser desenvolvido utilizando uma arquitetura moderna, segura, escalável e de fácil manutenção.

A escolha das tecnologias e a organização do código deverão considerar não apenas as necessidades da primeira versão, mas também o crescimento futuro da aplicação, incluindo aumento do catálogo de produtos, quantidade de acessos, usuários administrativos, integrações externas e possíveis funcionalidades comerciais.

O sistema deverá ser estruturado para permitir a expansão de funcionalidades sem exigir grandes refatorações ou comprometer os recursos já existentes.

### Princípios obrigatórios

- **Escalabilidade:** permitir o crescimento da aplicação, do banco de dados e das funcionalidades sem exigir mudanças estruturais desnecessárias.
    
- **Segurança:** aplicar proteção em todas as camadas, especialmente na autenticação, autorização, banco de dados e operações administrativas.
    
- **Manutenibilidade:** manter o código organizado, modular e de fácil compreensão.
    
- **Baixo acoplamento:** evitar dependências desnecessárias entre módulos e serviços externos.
    
- **Reutilização:** priorizar componentes, serviços e funções reutilizáveis.
    
- **Separação de responsabilidades:** manter frontend, regras de negócio, acesso aos dados e integrações devidamente organizados.
    
- **Evolução arquitetural:** permitir a adição de novas funcionalidades e tecnologias sem comprometer a estrutura existente.
    
- **Desempenho:** priorizar carregamento rápido, consultas eficientes e utilização adequada dos recursos da infraestrutura.
    

A arquitetura deverá evitar soluções improvisadas ou simplificações que comprometam a segurança e a escalabilidade futura.

## 2. Stack tecnológica

### Frontend

**Tecnologias:**

- Next.js
    
- TypeScript
    
- Tailwind CSS
    

**Responsabilidades:**

Desenvolvimento da interface pública da loja e do painel administrativo.

Diretrizes:

- Utilizar arquitetura de componentes reutilizáveis.
    
- Priorizar componentes modulares e desacoplados.
    
- Utilizar TypeScript para tipagem e redução de erros.
    
- Desenvolver interfaces responsivas para dispositivos móveis, tablets e desktops.
    
- Separar componentes de apresentação das regras de negócio.
    
- Priorizar renderização e estratégias de carregamento adequadas ao Next.js.
    
- Implementar estados de carregamento, erro, sucesso e ausência de dados.
    
- Não confiar em validações realizadas exclusivamente no frontend para proteger operações ou dados.
    

### Backend

**Tecnologias:**

- JavaScript com Node.js.
    
- Recursos de backend disponibilizados pelo Next.js, quando apropriado.
    

**Responsabilidades:**

Implementação das regras de negócio, validações, operações administrativas e comunicação segura com serviços externos.

Diretrizes:

- Centralizar no servidor as operações que necessitem de privilégios ou credenciais secretas.
    
- Separar regras de negócio da camada de apresentação.
    
- Implementar validações e autorização no servidor.
    
- Organizar serviços e módulos por responsabilidade.
    
- Evitar duplicação de lógica.
    
- Implementar tratamento padronizado de erros.
    
- Utilizar operações assíncronas de maneira adequada.
    
- Preparar a aplicação para futuras integrações sem acoplamento excessivo.
    

O backend deverá funcionar adequadamente na infraestrutura serverless da Vercel, evitando dependência de armazenamento local persistente ou estado em memória entre requisições.

### Banco de dados e armazenamento

**Tecnologias:**

- Supabase — PostgreSQL.
    
- Cloudinary — armazenamento e gerenciamento de imagens.
    

#### Supabase — PostgreSQL

Será responsável pelo armazenamento e gerenciamento dos dados estruturados da aplicação, incluindo:

- Usuários e informações administrativas.
    
- Produtos e serviços.
    
- Categorias e subcategorias.
    
- Estoque.
    
- Pedidos e solicitações.
    
- Vitrines.
    
- Configurações da loja.
    
- Informações necessárias aos relatórios.
    
- Referências e URLs das imagens armazenadas no Cloudinary.
    

Diretrizes:

- Utilizar estrutura de dados normalizada e relacionamentos adequados.
    
- Implementar índices conforme as necessidades de consulta.
    
- Utilizar migrações versionadas.
    
- Aplicar Row Level Security (RLS) nas tabelas expostas.
    
- Restringir operações conforme autenticação e permissões.
    
- Evitar consultas ineficientes e exposição desnecessária de dados.
    
- Implementar estratégias de backup e recuperação.
    
- Preparar a estrutura para crescimento do catálogo e volume de dados.
    

#### Supabase Auth — Autenticação

Será utilizado para autenticação dos usuários administrativos por e-mail e senha.

A autorização deverá ser implementada separadamente da autenticação, permitindo diferentes níveis de permissão administrativa no futuro.

O acesso administrativo deverá ser protegido no servidor e no banco de dados.

#### Cloudinary — Imagens

Será responsável pelo armazenamento, gerenciamento e disponibilização das imagens utilizadas no site.

Diretrizes:

- Permitir cadastro de imagens por URL ou upload.
    
- Realizar upload automático para o Cloudinary quando o administrador selecionar um arquivo.
    
- Armazenar no PostgreSQL as referências necessárias às imagens, e não os arquivos propriamente ditos.
    
- Utilizar credenciais protegidas por variáveis de ambiente.
    
- Realizar operações privilegiadas de upload por mecanismos seguros no servidor.
    
- Permitir pré-visualização em tempo real das imagens nos contextos em que serão utilizadas.
    
- Considerar otimização, formatos e dimensões adequados para melhorar o desempenho.
    

### Hospedagem e infraestrutura

**Tecnologia:**

- Vercel.
    

Será responsável pela hospedagem e publicação da aplicação Next.js.

Diretrizes:

- Utilizar integração com GitHub para gerenciamento de código e deploy.
    
- Separar ambientes de desenvolvimento, preview e produção.
    
- Configurar variáveis de ambiente individualmente para cada ambiente.
    
- Não armazenar credenciais diretamente no código-fonte.
    
- Utilizar HTTPS.
    
- Configurar domínio oficial: `nortetecnologia.com`.
    
- Considerar as características de execução serverless da infraestrutura.
    
- Evitar dependência de arquivos locais persistentes e estado em memória.
    
- Preparar a infraestrutura para aumento de tráfego e volume de requisições.
    

## 3. Arquitetura, segurança e escalabilidade

A aplicação deverá seguir uma arquitetura modular, com separação clara entre interface, regras de negócio, acesso aos dados e integrações externas.

### Segurança

A segurança deverá ser considerada requisito obrigatório em todas as etapas do desenvolvimento.

Requisitos principais:

- Autenticação e autorização administrativa.
    
- Rate limiting no login administrativo.
    
- Proteção contra tentativas automatizadas de acesso.
    
- Políticas RLS no PostgreSQL.
    
- Validação de dados no servidor.
    
- Proteção de rotas e endpoints administrativos.
    
- Proteção de credenciais e variáveis de ambiente.
    
- Proteção contra vulnerabilidades comuns em aplicações web.
    
- Logs e auditoria de operações administrativas.
    
- Backups e procedimentos de recuperação.
    
- MFA para usuários administrativos conforme a política de segurança definida.
    

Nenhuma operação sensível deverá depender exclusivamente de verificações no frontend.

As diretrizes completas deverão seguir o documento `seguranca.md`.

### Escalabilidade

A aplicação deverá ser preparada para crescer sem exigir grandes refatorações.

Requisitos:

- Modularização das funcionalidades.
    
- Baixo acoplamento entre componentes e serviços.
    
- Separação entre regras de negócio e provedores externos.
    
- Estrutura adequada para crescimento do banco de dados.
    
- Consultas e operações otimizadas.
    
- Utilização adequada de cache quando necessário.
    
- Rate limiting com armazenamento compartilhado, compatível com múltiplas instâncias.
    
- Processamento adequado de operações demoradas.
    
- Possibilidade de adicionar novas integrações e funcionalidades sem comprometer os módulos existentes.
    

Não antecipar complexidade desnecessária, como microsserviços, quando uma arquitetura modular bem organizada atender às necessidades atuais. A evolução deverá ocorrer conforme a demanda real do sistema.

## 4. Pagamentos

**Funcionamento inicial:**

Não serão utilizados gateways de pagamento online na primeira versão.

O pagamento ocorrerá presencialmente na loja ou no momento da entrega do produto.

O site deverá direcionar o cliente ao WhatsApp da empresa, com uma mensagem automaticamente preenchida contendo os produtos ou serviços solicitados e as informações selecionadas no checkout.

Também deverá ser possível realizar o pagamento diretamente na loja.

**Preparação para o futuro:**

A arquitetura deverá permitir a integração posterior com gateways de pagamento, sem necessidade de grandes refatorações.

Para isso:

- Separar pedidos de transações financeiras.
    
- Não acoplar as regras do checkout a um provedor específico.
    
- Prever estados de pagamento e acompanhamento de transações.
    
- Permitir integração futura com diferentes gateways.
    
- Considerar webhooks, idempotência e validação de notificações.
    
- Nunca armazenar dados completos de cartões na aplicação.
    

A implementação de pagamentos online dependerá de uma definição e autorização futura.

## 5. Integrações externas

As integrações deverão ser implementadas de forma modular, evitando dependência excessiva de fornecedores específicos.

Integrações previstas:

- WhatsApp: comunicação e continuidade dos pedidos.
    
- Supabase: banco de dados e autenticação.
    
- Cloudinary: armazenamento e gerenciamento de imagens.
    
- Vercel: hospedagem e infraestrutura.
    
- CRM da empresa: importação de XML para atualização de produtos e estoque.
    

Futuras integrações, como gateways de pagamento e serviços de entrega, deverão ser adicionadas sem comprometer a arquitetura principal.

## 6. Diretrizes para o agente de desenvolvimento

O agente deverá respeitar integralmente as tecnologias, decisões arquiteturais e requisitos definidos neste documento.

Antes de iniciar qualquer implementação:

1. Consultar os contextos relacionados à tarefa.
    
2. Verificar a estrutura e os padrões existentes no projeto.
    
3. Avaliar os impactos arquiteturais e de segurança da alteração.
    
4. Evitar introduzir dependências desnecessárias.
    
5. Não substituir tecnologias ou decisões estabelecidas sem autorização.
    

Durante e após o desenvolvimento:

- Manter o código modular e organizado.
    
- Priorizar segurança, escalabilidade e manutenibilidade.
    
- Atualizar a documentação afetada.
    
- Executar testes e verificações pertinentes.
    
- Registrar decisões arquiteturais importantes.
    
- Não realizar alterações incompatíveis com os requisitos de segurança.
    

Toda decisão técnica deverá considerar tanto o funcionamento atual quanto a possibilidade de evolução futura da Norte Tecnologia.