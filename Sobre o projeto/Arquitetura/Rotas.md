# Rotas e Navegação do Sistema

## 1. Objetivo

Este documento define a estrutura de rotas do site da Norte Tecnologia, incluindo as páginas públicas destinadas aos clientes e as páginas administrativas.

A navegação deve ser organizada, intuitiva, responsiva e preparada para futuras expansões do sistema.

O domínio principal será:

`https://nortetecnologia.com` podendo ser inicialmente o domínio do vercel com slug da loja.

A página inicial corresponde à rota `/`.

## 2. Rotas públicas

As rotas públicas são acessíveis aos visitantes e clientes da loja.

|Rota|Funcionalidade|
|---|---|
|`/`|Página inicial da loja. Exibe vitrines, categorias, produtos em destaque e informações institucionais.|
|`/categoria/[slug]`|Exibe os produtos de uma categoria específica.|
|`/categoria/[slug]/[subcategoria]`|Exibe os produtos de uma subcategoria.|
|`/produto/[slug]`|Página de detalhes de um produto ou serviço.|
|`/carrinho`|Exibe os produtos adicionados, quantidades, configurações selecionadas e valores.|
|`/checkout`|Etapa de finalização do pedido, com escolha de pagamento e modalidade de recebimento.|

Os segmentos entre colchetes representam parâmetros dinâmicos. Por exemplo, `/categoria/informatica` e `/produto/notebook-dell`.

## 3. Checkout e finalização de pedidos

**Regra fundamental:** inicialmente, o site não terá integração com gateways de pagamento online.

O checkout será uma etapa de organização e confirmação das informações do pedido. O pagamento será combinado com a loja por meio do WhatsApp ou realizado presencialmente, conforme a opção escolhida.

### 3.1. Opções de recebimento

O cliente deverá escolher entre:

- **Entrega:** o cliente informa ou confirma os dados necessários para receber o pedido.
    
- **Retirada na loja:** o cliente escolhe retirar o pedido presencialmente no estabelecimento.
    

### 3.2. Opções de pagamento

O cliente deverá selecionar uma das formas de pagamento disponibilizadas pela loja, conforme as configurações administrativas.

O sistema não deverá solicitar dados de cartão, senhas bancárias ou outras informações financeiras sensíveis.

### 3.3. Encaminhamento pelo WhatsApp

Após preencher as informações necessárias, o cliente será direcionado ao WhatsApp oficial da Norte Tecnologia, com uma mensagem previamente preenchida contendo os dados do pedido.

A mensagem deverá incluir, conforme aplicável:

- Nome dos produtos ou serviços.
    
- Quantidade de cada item.
    
- Preço unitário e subtotal.
    
- Variações e configurações selecionadas.
    
- Valor total do pedido.
    
- Forma de pagamento escolhida.
    
- Modalidade de recebimento: entrega ou retirada na loja.
    
- Endereço e informações adicionais para entrega, quando necessário.
    
- Observações fornecidas pelo cliente.
    

O número do WhatsApp deverá ser obtido das configurações da loja, sem ficar fixo no código-fonte.

O sistema deverá montar a mensagem de forma segura, codificando corretamente seu conteúdo para a URL do WhatsApp. Também deverá suportar pedidos com vários produtos e mensagens extensas.

### 3.4. Comprar agora

A página de produto deverá oferecer a opção **Comprar agora**.

Ao selecionar essa opção, o cliente deverá seguir diretamente para o checkout, sem precisar acessar manualmente o carrinho.

O produto, a quantidade e todas as configurações selecionadas deverão ser preservados e encaminhados corretamente.

### 3.5. Comportamento do carrinho

O carrinho deverá preservar os itens e suas configurações enquanto o cliente navega pelo site ou retorna de uma tentativa de finalização não concluída.

O redirecionamento para o WhatsApp não deverá apagar automaticamente o carrinho.

O sistema não deverá considerar que um pedido foi confirmado ou pago apenas porque o cliente foi direcionado ao WhatsApp. A confirmação deverá seguir um processo próprio, definido pela operação da loja.

## 4. Rotas administrativas

As rotas administrativas não são públicas. Todas as páginas e operações deverão exigir autenticação e autorização adequadas.

Esconder uma rota da navegação não é uma medida de segurança suficiente. A proteção deverá ser aplicada também no servidor e no banco de dados.

|Rota|Funcionalidade|
|---|---|
|`/admin/login`|Tela de autenticação administrativa.|
|`/admin`|Painel inicial administrativo, com resumo das informações da loja.|
|`/admin/produtos`|Adicionar, editar, consultar e gerenciar produtos e serviços.|
|`/admin/categorias`|Adicionar, editar e gerenciar categorias e subcategorias.|
|`/admin/vitrines`|Criar, editar, organizar e ordenar as vitrines exibidas na página inicial.|
|`/admin/configuracoes`|Configurações gerais do sistema e da loja.|
|`/admin/configuracoes/informacoes`|Gerenciar informações institucionais, contatos, endereço, WhatsApp e demais dados da loja.|
|`/admin/relatorios`|Consultar relatórios e indicadores de desempenho da loja.|

## 5. Funcionalidades administrativas

### 5.1. Produtos e serviços

O administrador deverá conseguir cadastrar e editar produtos e serviços, incluindo informações comerciais, imagens, preços, categorias, estoque e demais características necessárias.

### 5.2. Categorias

Permitir a criação, edição, organização e exclusão de categorias e subcategorias, respeitando os vínculos com os produtos cadastrados.

### 5.3. Vitrines

Permitir criar e gerenciar as vitrines da página inicial, incluindo:

- Nome e identificação da vitrine.
    
- Seleção dos produtos exibidos.
    
- Ordem de exibição.
    
- Ativação e desativação.
    
- Organização das vitrines na página inicial.
    

A página inicial deverá refletir dinamicamente as alterações realizadas pelo administrador.

### 5.4. Configurações e informações da loja

O administrador deverá conseguir atualizar informações como:

- Número oficial do WhatsApp.
    
- E-mail de contato.
    
- Endereço físico.
    
- Horário de funcionamento.
    
- Informações institucionais.
    
- Dados exibidos no rodapé.
    
- Formas de pagamento disponíveis.
    
- Informações e condições de entrega e retirada.
    

Essas informações deverão ser armazenadas no banco de dados e carregadas dinamicamente pelo site.

### 5.5. Relatórios

O painel deverá oferecer indicadores que ajudem a compreender o desempenho da loja, como:

- Produtos mais visualizados.
    
- Produtos mais procurados ou adicionados ao carrinho.
    
- Categorias mais acessadas.
    
- Produtos mais avaliados.
    
- Quantidade de pedidos registrados.
    
- Desempenho das vitrines.
    
- Outros indicadores relevantes que possam ser adicionados futuramente.
    

Os relatórios deverão utilizar eventos e dados efetivamente registrados pelo sistema. Não apresentar métricas como vendas concluídas ou pagamentos realizados quando houver apenas cliques ou redirecionamentos para o WhatsApp.

## 6. Diretrizes para implementação

1. Manter separação clara entre rotas públicas e administrativas.
    
2. Utilizar parâmetros dinâmicos para categorias, subcategorias e produtos.
    
3. Proteger todas as rotas e operações administrativas no servidor.
    
4. Não fixar informações comerciais, como WhatsApp e endereço, diretamente no código.
    
5. Manter o checkout desacoplado de provedores de pagamento, permitindo integração futura com gateways sem reconstruir o fluxo de pedidos.
    
6. Preservar os dados do carrinho e as configurações selecionadas durante a navegação.
    
7. Garantir que o fluxo de compra funcione tanto pelo carrinho quanto pela opção Comprar agora.
    
8. Não considerar o redirecionamento ao WhatsApp como confirmação automática de pedido ou pagamento.
    
9. Manter a estrutura preparada para novas funcionalidades e rotas sem comprometer a arquitetura existente.
    

**Orientação ao agente de desenvolvimento:** antes de implementar ou modificar rotas, consulte este documento e os demais arquivos de contexto relacionados. Não altere regras de negócio por conta própria. Caso uma funcionalidade dependa de uma decisão ainda não documentada, registre a pendência e solicite esclarecimento.