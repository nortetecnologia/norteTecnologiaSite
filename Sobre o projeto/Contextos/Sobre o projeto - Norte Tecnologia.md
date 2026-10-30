## 1. Apresentação da empresa

A **Norte Tecnologia** é uma empresa que atua no segmento de Tecnologia da Informação (TI), oferecendo produtos e serviços relacionados à informática, manutenção e infraestrutura tecnológica.

A empresa trabalha com a comercialização de equipamentos, acessórios, periféricos e suprimentos de informática, além de prestar serviços técnicos para pessoas e empresas.

### 1.1. Produtos comercializados

O catálogo da loja poderá incluir, entre outros:

- Computadores e notebooks.
    
- Periféricos e acessórios.
    
- Impressoras.
    
- Toners e cartuchos de tinta.
    
- Monitores.
    
- Controles e acessórios para jogos.
    
- Fones de ouvido e headsets.
    
- Cabos de rede e outros cabos.
    
- Gabinetes e componentes de computadores.
    
- Peças e componentes de hardware.
    
- Outros produtos relacionados à Tecnologia da Informação.
    

A estrutura do catálogo deverá permitir a inclusão de novos tipos de produtos e categorias sem exigir alterações estruturais significativas no sistema.

### 1.2. Serviços oferecidos

Além da venda de produtos, a Norte Tecnologia oferece serviços técnicos relacionados à informática, incluindo:

- Manutenção de computadores.
    
- Manutenção de impressoras.
    
- Montagem de computadores.
    
- Diagnóstico e identificação de problemas.
    
- Instalação e configuração de equipamentos.
    
- Outros serviços relacionados à Tecnologia da Informação.
    

O sistema deverá permitir o cadastro e a administração de novos serviços conforme as necessidades comerciais da empresa.

## 2. Objetivo do site

O projeto consiste no desenvolvimento de uma plataforma de comércio eletrônico para a Norte Tecnologia, permitindo que os clientes conheçam os produtos e serviços oferecidos, consultem informações, montem seus pedidos e entrem em contato com a empresa para dar continuidade à compra ou solicitar um serviço.

O site deverá contar com:

- Catálogo organizado de produtos e serviços.
    
- Categorias e subcategorias.
    
- Páginas individuais para produtos e serviços.
    
- Carrinho de compras.
    
- Fluxo de checkout.
    
- Integração com WhatsApp.
    
- Gestão administrativa de produtos, serviços e categorias.
    
- Controle e atualização de estoque.
    
- Importação de XML para integração com o estoque do CRM.
    
- Vitrines e produtos em destaque na página inicial.
    
- Relatórios e indicadores de desempenho.
    
- Configurações administrativas das informações da loja.
    

A plataforma deverá ser desenvolvida com foco em segurança, escalabilidade, desempenho, facilidade de manutenção e possibilidade de expansão futura.

## 3. Funcionamento comercial e pedidos pelo WhatsApp

### 3.1. Modelo inicial de operação

Inicialmente, o site entrará em produção sem integração com gateways de pagamento online.

Não serão implementados, nesta primeira versão, sistemas de processamento de pagamentos por cartão, Pix ou outros meios diretamente dentro do site.

O fluxo comercial será realizado por meio do WhatsApp oficial da Norte Tecnologia ou presencialmente na loja.

Entretanto, o encaminhamento para o WhatsApp não deverá ser um simples redirecionamento. O sistema deverá montar automaticamente uma mensagem com as informações necessárias para que a equipe da empresa consiga identificar e dar continuidade ao atendimento.

### 3.2. Pedidos de produtos

Quando o cliente desejar comprar produtos, o sistema deverá permitir que ele:

1. Selecione os produtos desejados.
    
2. Informe as quantidades.
    
3. Selecione as variações ou configurações disponíveis para cada produto.
    
4. Consulte os valores e o total do pedido.
    
5. Escolha a forma de pagamento disponibilizada pela loja.
    
6. Escolha entre entrega ou retirada presencial na loja.
    
7. Informe os dados adicionais necessários, conforme a modalidade escolhida.
    
8. Finalize o fluxo sendo direcionado ao WhatsApp com uma mensagem preenchida automaticamente.
    

A mensagem deverá conter, conforme aplicável:

- Nome dos produtos.
    
- Quantidade de cada produto.
    
- Variações e configurações selecionadas.
    
- Valor unitário.
    
- Subtotal por produto.
    
- Valor total do pedido.
    
- Forma de pagamento escolhida.
    
- Modalidade de recebimento.
    
- Endereço e informações para entrega, quando necessário.
    
- Observações adicionais fornecidas pelo cliente.
    

O objetivo é evitar que o cliente precise digitar novamente todas as informações do pedido ao entrar em contato com a loja.

### 3.3. Solicitação de serviços

O fluxo de solicitação de serviços deverá ser diferente do fluxo de compra de produtos, pois poderá exigir informações específicas sobre o problema ou atendimento desejado.

O cliente deverá poder selecionar:

- O serviço desejado.
    
- O tipo de atendimento.
    
- A modalidade de execução.
    
- A forma de pagamento, conforme as opções disponibilizadas.
    
- Descrição do problema ou necessidade.
    
- Informações adicionais relevantes.
    

As modalidades de atendimento deverão contemplar:

- **Atendimento remoto:** serviço prestado à distância, quando tecnicamente possível.
    
- **Atendimento no local:** solicitação de atendimento no endereço do cliente.
    
- **Atendimento na loja:** cliente leva o equipamento ou comparece ao estabelecimento.
    

Após preencher as informações, o cliente será direcionado ao WhatsApp com uma mensagem contendo os dados da solicitação.

O sistema deverá permitir que novos tipos de serviços e modalidades sejam cadastrados ou ajustados futuramente.

### 3.4. Configurações comerciais dinâmicas

Informações como número oficial do WhatsApp, formas de pagamento disponíveis, modalidades de entrega e retirada e dados da loja deverão ser administráveis pelo painel administrativo sempre que aplicável.

Essas informações não deverão ficar fixas diretamente no código-fonte.

### 3.5. Separação entre pedido, pagamento e atendimento

O sistema deverá distinguir:

- Pedido de produtos.
    
- Solicitação de serviços.
    
- Forma de pagamento escolhida.
    
- Situação do pedido ou solicitação.
    
- Confirmação de pagamento, quando aplicável.
    

O simples redirecionamento ao WhatsApp não significa que o pedido foi confirmado, que o pagamento foi realizado ou que o serviço foi contratado.

A confirmação e a atualização das situações deverão seguir regras próprias da operação da empresa.

## 4. Banco de dados e gestão de produtos

O banco de dados será responsável por armazenar e disponibilizar as informações estruturadas necessárias para o funcionamento da plataforma.

A integração deverá permitir que o site consulte e atualize os dados de forma consistente, segura e eficiente.

Entre as informações armazenadas estarão:

- Produtos.
    
- Serviços.
    
- Categorias e subcategorias.
    
- Preços.
    
- Estoque.
    
- Variações e configurações dos produtos.
    
- Imagens e referências dos arquivos armazenados externamente.
    
- Pedidos e solicitações.
    
- Configurações da loja.
    
- Usuários administrativos.
    
- Informações necessárias aos relatórios.
    

### 4.1. Gestão manual de estoque

O painel administrativo deverá permitir que usuários autorizados consultem e atualizem manualmente o estoque dos produtos.

Deverá ser possível:

- Consultar a quantidade disponível.
    
- Atualizar quantidades.
    
- Registrar entradas e saídas, conforme o modelo de controle definido.
    
- Identificar produtos sem estoque.
    
- Consultar o histórico de alterações, quando implementado.
    

As alterações deverão ser persistidas no banco de dados e refletidas corretamente no site.

O sistema deverá evitar inconsistências, atualizações concorrentes indevidas e apresentação de quantidades desatualizadas.

## 5. Integração com o CRM por XML

### 5.1. Objetivo

A Norte Tecnologia já utiliza um sistema CRM que possui informações sobre os produtos e o estoque da empresa.

Para evitar o trabalho manual de cadastrar grandes quantidades de produtos que já existem no CRM, o site deverá oferecer uma funcionalidade administrativa para importar arquivos XML e atualizar os dados correspondentes.

O objetivo principal é aproveitar os cadastros existentes no sistema da empresa e utilizar o site para complementar essas informações, principalmente com imagens e conteúdo de apresentação.

### 5.2. Funcionamento esperado

O painel administrativo deverá disponibilizar uma funcionalidade de importação de XML.

O fluxo esperado será:

1. O administrador acessa a área de importação.
    
2. Seleciona e envia o arquivo XML exportado pelo CRM.
    
3. O sistema interpreta os dados do arquivo.
    
4. Identifica os produtos correspondentes aos registros já existentes no site.
    
5. Compara as informações recebidas com os dados atuais.
    
6. Apresenta uma prévia das alterações que serão realizadas.
    
7. O administrador revisa os resultados.
    
8. Após a confirmação, o sistema aplica as atualizações permitidas.
    
9. O sistema apresenta um resumo da importação, incluindo sucessos, falhas e registros não identificados.
    

### 5.3. Correspondência entre produtos

A importação deverá identificar corretamente quais registros do XML correspondem aos produtos cadastrados no site.

Deverá ser definida uma chave de identificação confiável, preferencialmente um SKU ou identificador único compartilhado entre o CRM e a plataforma.

Não utilizar apenas o nome do produto como critério definitivo de correspondência, pois nomes podem ser alterados, repetidos ou apresentados de maneiras diferentes.

Produtos não identificados deverão ser apresentados para análise, sem criar registros duplicados automaticamente.

### 5.4. Atualização de estoque e dados

A prioridade inicial da integração será atualizar o estoque dos produtos já cadastrados no site de acordo com as informações do CRM.

A arquitetura deverá permitir a ampliação da importação para outros campos, como preços e descrições, caso essa necessidade seja definida posteriormente.

O sistema deverá deixar claro quais campos serão atualizados e quais serão preservados.

**Importante:** não sobrescrever imagens, descrições comerciais, configurações ou outros dados cadastrados manualmente sem uma regra de negócio expressamente definida.

### 5.5. Segurança e confiabilidade da importação

A funcionalidade deverá considerar:

- Acesso restrito a usuários administrativos autorizados.
    
- Validação do arquivo recebido.
    
- Verificação do formato e da estrutura XML.
    
- Limites de tamanho do arquivo.
    
- Proteção contra XML malicioso e ataques como XXE.
    
- Validação dos dados antes de atualizar o banco.
    
- Prevenção de registros duplicados.
    
- Tratamento de erros por registro.
    
- Prévia das alterações antes da confirmação.
    
- Registro do histórico de importações.
    
- Possibilidade de identificar quem realizou cada importação.
    
- Proteção contra atualizações parciais que deixem os dados inconsistentes.
    

A importação deverá ser planejada para suportar arquivos com grandes quantidades de registros, sem depender de uma única operação excessivamente longa.

### 5.6. Estrutura XML ainda não definida

O formato exato do XML exportado pelo CRM ainda deverá ser analisado.

Portanto, o agente de desenvolvimento não deverá inventar nomes de campos, estrutura de elementos ou regras de correspondência.

Antes de implementar o processamento definitivo, deverá solicitar um arquivo XML real de exemplo e identificar sua estrutura.

A partir dessa análise, deverão ser documentados os campos disponíveis, as chaves de identificação e as regras de atualização.

## 6. Imagens dos produtos e serviços

O cadastro dos produtos deverá permitir adicionar imagens para complementar as informações já existentes no CRM.

As imagens deverão ser armazenadas em um serviço próprio de armazenamento de mídia, enquanto o banco de dados manterá as referências necessárias para sua utilização.

O painel administrativo deverá permitir:

- Enviar imagens por upload.
    
- Informar imagens por URL externa, quando permitido.
    
- Visualizar uma prévia antes de salvar.
    
- Associar imagens aos produtos.
    
- Definir a imagem principal e imagens adicionais.
    
- Substituir ou remover imagens existentes.
    

A integração deverá garantir que as imagens sejam exibidas corretamente nas páginas de produtos, vitrines, categorias e demais áreas do site.

## 7. Diretrizes de arquitetura e evolução

O sistema deverá ser desenvolvido de maneira modular, com responsabilidades bem definidas e baixo acoplamento entre funcionalidades.

A arquitetura deverá considerar:

- Separação entre interface, regras de negócio e acesso aos dados.
    
- Validação de informações no servidor.
    
- Proteção das operações administrativas.
    
- Consistência dos dados de estoque e pedidos.
    
- Reutilização de componentes.
    
- Facilidade de manutenção e testes.
    
- Integrações desacopladas.
    
- Possibilidade de adicionar gateways de pagamento no futuro.
    
- Possibilidade de ampliar a integração com o CRM.
    
- Capacidade de suportar o crescimento do catálogo e do volume de acessos.
    

A ausência de gateways de pagamento na primeira versão não deverá impedir sua implementação futura. Entretanto, não deverão ser criadas integrações ou fluxos financeiros que ainda não foram aprovados.

## 8. Regras para o agente de desenvolvimento

1. Consultar os arquivos de contexto antes de iniciar alterações.
    
2. Não inventar regras comerciais ou decisões técnicas que ainda não foram definidas.
    
3. Não presumir a estrutura do XML do CRM antes de analisar um arquivo real.
    
4. Priorizar a atualização dos produtos existentes em vez de criar cadastros duplicados.
    
5. Preservar os dados cadastrados manualmente, especialmente imagens e informações comerciais, salvo autorização expressa.
    
6. Não implementar gateways de pagamento na primeira versão.
    
7. Não considerar o redirecionamento ao WhatsApp como confirmação de pedido ou pagamento.
    
8. Garantir que as informações comerciais sejam administráveis e não dependam de valores fixos no código.
    
9. Documentar alterações importantes nos arquivos de contexto.
    
10. Solicitar esclarecimentos sempre que uma decisão de negócio necessária ainda não estiver definida.
    

## 9. Resultado esperado

A Norte Tecnologia deverá possuir uma plataforma própria de apresentação e comercialização de produtos e serviços, com gestão administrativa integrada ao banco de dados e comunicação direta com os clientes pelo WhatsApp.

O sistema deverá reduzir o trabalho manual de cadastro e atualização de estoque por meio da integração com o CRM, permitindo que a empresa aproveite seus dados existentes e concentre seus esforços no enriquecimento do catálogo, principalmente na inclusão de imagens e informações comerciais.

A solução deverá começar com uma estrutura simples de operar, mas tecnicamente organizada para crescer, receber novas integrações e evoluir sem exigir reconstruções desnecessárias.