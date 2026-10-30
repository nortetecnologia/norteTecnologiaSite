

## 1. Objetivo

Este documento define as regras de negócio e os comportamentos esperados da plataforma de comércio eletrônico da Norte Tecnologia.

Todas as funcionalidades relacionadas a produtos, serviços, estoque, categorias, vitrines, carrinho, relatórios, avaliações, backups e experiência do cliente deverão respeitar estas regras.

O agente de desenvolvimento deverá consultar este documento antes de implementar ou modificar funcionalidades relacionadas a essas áreas.

As regras aqui descritas representam o comportamento esperado do sistema e não deverão ser alteradas por decisões técnicas tomadas unilateralmente pelo agente.

---

## 2. Gestão de produtos

### 2.1. Cadastro de produtos

O painel administrativo deverá permitir cadastrar, editar, consultar, ativar, desativar e excluir produtos.

O cadastro deverá permitir informar:

- Nome do produto.
    
- Descrição comercial.
    
- Informações técnicas e especificações.
    
- Marca e modelo, quando aplicável.
    
- Categoria.
    
- Subcategoria.
    
- Preço.
    
- Quantidade em estoque.
    
- Imagens.
    
- Variações disponíveis.
    
- Outras características relevantes para o tipo de produto.
    

A estrutura deverá ser flexível para atender diferentes tipos de produtos de informática, como computadores, SSDs, memórias, impressoras, periféricos, monitores e acessórios.

Não deverá existir uma estrutura rígida que obrigue todos os produtos a possuírem exatamente os mesmos atributos técnicos.

### 2.2. Categorias e subcategorias

O administrador deverá poder criar, editar e excluir categorias e subcategorias.

Um produto poderá estar associado simultaneamente a uma categoria e a uma subcategoria pertencente a essa categoria.

Exemplo:

- Categoria: Armazenamento.
    
- Subcategoria: SSD.
    
- Produto: SSD Kingston 480 GB.
    

O sistema deverá preservar a integridade desses relacionamentos.

Não deverá ser possível excluir uma categoria ou subcategoria de maneira que deixe produtos associados a referências inexistentes. Antes da exclusão, o sistema deverá verificar os vínculos e exigir uma ação adequada do administrador.

### 2.3. Produtos sem estoque

Produtos sem estoque não deverão aparecer nas vitrines da página inicial da loja.

A disponibilidade deverá ser consultada com base na quantidade registrada no estoque.

Regras:

- Produtos com estoque igual a zero não deverão ser exibidos nas vitrines da página inicial.
    
- Produtos sem estoque não poderão ser adicionados ao carrinho.
    
- Produtos sem estoque não poderão ser comprados.
    
- O sistema deverá impedir que uma quantidade indisponível seja solicitada.
    
- Quando aplicável, a página individual do produto poderá continuar acessível, informando claramente que o item está indisponível.
    

A indisponibilidade de um produto não deverá apagar seu cadastro ou histórico.

---

## 3. Variações de produtos

### 3.1. Objetivo

O sistema deverá permitir cadastrar produtos com diferentes variações, sem obrigar o administrador a criar cadastros completamente independentes para cada combinação.

As variações deverão representar características que diferenciam versões de um mesmo produto.

Exemplos:

- Cor: preto, branco, azul.
    
- Armazenamento: 256 GB, 512 GB, 1 TB.
    
- Memória: 8 GB, 16 GB, 32 GB.
    
- Tamanho: pequeno, médio, grande.
    
- Outras características específicas de cada produto.
    

### 3.2. Gerenciamento das variações

O administrador deverá conseguir:

- Criar variações.
    
- Editar variações.
    
- Excluir variações.
    
- Definir os valores disponíveis de cada variação.
    
- Associar estoque a cada versão comercializável.
    
- Associar preços diferentes às variações, quando necessário.
    
- Definir imagens específicas para determinadas variações, quando aplicável.
    

As variações deverão ser flexíveis. Nem todo produto utilizará todas as características disponíveis.

Exemplos:

**SSD Kingston**

- 256 GB.
    
- 512 GB.
    
- 1 TB.
    

**Mouse**

- Preto.
    
- Branco.
    
- Azul.
    

**Memória RAM**

- 8 GB.
    
- 16 GB.
    
- 32 GB.
    

### 3.3. Estoque por variação

Quando uma variação representar uma versão comercializável diferente, ela deverá possuir seu próprio controle de estoque.

Exemplo:

|Produto|Variação|Estoque|
|---|---|---|
|Mouse Gamer|Preto|5|
|Mouse Gamer|Branco|2|
|Mouse Gamer|Azul|0|

Nesse cenário, a indisponibilidade da versão azul não deverá impedir a compra das versões preta e branca.

O sistema deverá identificar corretamente a combinação selecionada pelo cliente e utilizar o estoque correspondente.

Não deverá permitir que o cliente selecione uma combinação inexistente ou indisponível.

---

## 4. Gestão de serviços

### 4.1. Cadastro de serviços

O painel administrativo deverá permitir cadastrar, editar, consultar, ativar, desativar e excluir serviços.

O cadastro deverá permitir:

- Nome do serviço.
    
- Descrição.
    
- Informações técnicas ou condições de atendimento.
    
- Categoria e subcategoria, quando aplicável.
    
- Imagens ilustrativas, quando necessárias.
    
- Preço ou faixa de preço.
    
- Variações do serviço.
    
- Modalidades de atendimento.
    

### 4.2. Variações de serviços

A lógica de variações dos serviços deverá ser semelhante à dos produtos.

O administrador poderá criar diferentes modalidades ou versões de um mesmo serviço.

Exemplos:

**Manutenção de computador**

- Manutenção simples.
    
- Manutenção completa.
    

**Instalação**

- Instalação básica.
    
- Instalação avançada.
    

As variações deverão poder ser criadas, editadas e excluídas pelo painel administrativo.

### 4.3. Preços de serviços

Os serviços poderão possuir preços fixos ou faixas de preço.

Exemplo:

- Manutenção simples: R$ 40,00.
    
- Manutenção completa: R$ 70,00.
    
- Diagnóstico: de R$ 40,00 a R$ 70,00.
    

Quando houver uma faixa de preço, o site deverá apresentá-la de maneira clara, sem induzir o cliente a acreditar que o valor mínimo representa necessariamente o preço final.

O valor definitivo poderá depender da avaliação técnica ou do atendimento realizado pela empresa.

### 4.4. Solicitação de serviços

O cliente deverá conseguir adicionar serviços ao carrinho e solicitar atendimento pelo WhatsApp.

A solicitação deverá permitir informar:

- Serviço desejado.
    
- Variação selecionada.
    
- Modalidade de atendimento.
    
- Descrição do problema ou necessidade.
    
- Informações adicionais.
    
- Forma de pagamento escolhida, conforme as opções disponíveis.
    

As modalidades de atendimento deverão contemplar:

- Atendimento remoto.
    
- Atendimento no endereço do cliente.
    
- Atendimento presencial na loja.
    

A mensagem encaminhada ao WhatsApp deverá apresentar as informações necessárias para a equipe compreender a solicitação.

Serviços não deverão utilizar o controle de estoque de produtos físicos, salvo se futuramente existir uma regra específica para recursos ou materiais limitados.

---

## 5. Controle de estoque

### 5.1. Modelo inicial

Inicialmente, o estoque será controlado manualmente pelo painel administrativo.

O administrador deverá conseguir consultar e alterar as quantidades disponíveis de produtos e de suas variações.

O sistema deverá refletir as alterações no site.

### 5.2. Limite de quantidade no carrinho

O cliente não poderá adicionar ou solicitar uma quantidade superior à quantidade disponível em estoque.

Exemplo:

Se um produto possui 3 unidades disponíveis, o cliente poderá selecionar no máximo 3 unidades.

O sistema deverá validar essa regra:

- Ao adicionar o produto ao carrinho.
    
- Ao aumentar sua quantidade no carrinho.
    
- Ao selecionar uma variação.
    
- Ao iniciar o checkout.
    
- Novamente no servidor antes de registrar a solicitação do pedido.
    

A validação não deverá depender exclusivamente do frontend.

### 5.3. Histórico de movimentações

O painel administrativo deverá possuir uma área específica para consultar o histórico de alterações no estoque.

O histórico deverá registrar:

- Produto movimentado.
    
- Variação movimentada, quando aplicável.
    
- Quantidade anterior.
    
- Quantidade alterada.
    
- Quantidade final.
    
- Tipo de movimentação.
    
- Data e horário.
    
- Nome do responsável.
    
- E-mail do responsável.
    
- Origem da movimentação.
    

As origens deverão permitir identificar, no mínimo:

- Alteração manual pelo administrador.
    
- Importação ou atualização via XML.
    
- Outros tipos de movimentação que sejam implementados futuramente.
    

O histórico deverá permitir identificar quem realizou cada alteração.

Os registros de auditoria não deverão ser editáveis ou removíveis por operações administrativas comuns.

### 5.4. Consistência

As atualizações de estoque deverão evitar inconsistências decorrentes de operações simultâneas.

O sistema deverá garantir que uma atualização não sobrescreva indevidamente outra movimentação e que a quantidade disponível não fique negativa.

---

## 6. Atualização de preços e estoque por XML

### 6.1. Atualização de preços

Os preços dos produtos poderão ser atualizados por meio da importação de XML, conforme as informações disponíveis no arquivo fornecido pelo CRM.

A importação deverá permitir identificar os produtos existentes e atualizar os campos autorizados.

### 6.2. Estrutura do XML

A estrutura definitiva do XML ainda não está disponível, pois a empresa está testando um novo sistema.

Portanto, não deverá ser criada uma estrutura fictícia ou presumida.

Quando um arquivo real estiver disponível, sua estrutura deverá ser analisada e documentada.

### 6.3. Adaptação do XML com auxílio de IA

Poderá ser utilizado um serviço externo de inteligência artificial para auxiliar na adaptação do XML original do CRM ao formato esperado pela plataforma.

Esse recurso deverá ser utilizado como ferramenta de interpretação e transformação dos dados, não como autoridade para atualizar o banco de dados.

O fluxo esperado será:

1. Administrador envia o XML original.
    
2. Sistema identifica a estrutura e os dados disponíveis.
    
3. Quando necessário, um serviço externo de IA auxilia no mapeamento e na adaptação dos campos.
    
4. O resultado é convertido para um formato estruturado e validável.
    
5. O sistema verifica identificadores, preços, quantidades e demais campos autorizados.
    
6. É apresentada uma prévia das alterações.
    
7. O administrador revisa e confirma a operação.
    
8. Somente após a confirmação os dados são atualizados.
    

A IA não deverá decidir autonomamente quais produtos correspondem a quais registros quando não houver identificação confiável.

Dados ambíguos deverão ser apresentados para revisão humana.

### 6.4. Segurança da importação

A importação deverá possuir:

- Validação de estrutura e conteúdo.
    
- Limites de tamanho.
    
- Proteção contra XML malicioso e XXE.
    
- Verificação dos identificadores dos produtos.
    
- Prevenção contra duplicidade.
    
- Prévia antes da confirmação.
    
- Registro de erros.
    
- Histórico de importações.
    
- Identificação do administrador responsável.
    

Uma falha durante a importação não deverá deixar os dados em um estado parcialmente inconsistente.

---

## 7. Carrinho e solicitação pelo WhatsApp

### 7.1. Carrinho único

O site deverá possuir um carrinho que permita ao cliente reunir vários produtos e serviços em uma única solicitação.

O cliente não deverá precisar enviar uma mensagem separada para cada item.

O carrinho deverá permitir:

- Adicionar produtos.
    
- Adicionar serviços.
    
- Alterar quantidades de produtos.
    
- Selecionar e modificar variações.
    
- Remover itens.
    
- Consultar preços.
    
- Consultar subtotais.
    
- Visualizar o total, quando os preços forem definidos.
    
- Continuar navegando sem perder os itens adicionados.
    

### 7.2. Finalização

Ao finalizar, o cliente deverá escolher as informações necessárias para o atendimento, incluindo forma de pagamento e modalidade de recebimento para produtos.

Para serviços, deverão ser consideradas as modalidades de atendimento e demais informações específicas.

O site deverá montar uma única mensagem contendo todos os itens e suas respectivas informações e encaminhá-la ao WhatsApp oficial da Norte Tecnologia.

### 7.3. Conteúdo da mensagem

A mensagem deverá conter, conforme aplicável:

- Produtos e serviços selecionados.
    
- Quantidades.
    
- Variações.
    
- Valores unitários.
    
- Subtotais.
    
- Total do pedido, quando calculável.
    
- Forma de pagamento.
    
- Entrega ou retirada na loja.
    
- Modalidade de atendimento dos serviços.
    
- Observações adicionais.
    

O número oficial deverá ser obtido das configurações da loja.

O sistema deverá preservar o carrinho caso o cliente não conclua o contato pelo WhatsApp.

O redirecionamento não deverá ser interpretado como confirmação de venda ou pagamento.

---

## 8. Vitrines da página inicial

### 8.1. Organização

A página inicial terá vitrines previamente definidas na estrutura visual do site.

O painel administrativo deverá permitir escolher quais produtos serão exibidos em cada vitrine e definir os títulos dessas vitrines.

Não será necessário criar toda a estrutura visual das vitrines pelo painel administrativo.

A administração será responsável principalmente pelo conteúdo e pela organização dos produtos exibidos.

### 8.2. Marcadores internos

A associação dos produtos às vitrines será realizada por meio de marcadores internos, não exibidos ao cliente.

Exemplo:

|Marcador administrativo|Destino|
|---|---|
|`vitrine_principal`|Vitrine principal da página inicial.|
|`vitrine_2`|Segunda vitrine.|
|`vitrine_3`|Terceira vitrine.|

Os marcadores serão utilizados pelo sistema para determinar em qual vitrine cada produto deverá aparecer.

### 8.3. Administração das vitrines

O administrador deverá conseguir:

- Associar produtos a uma vitrine.
    
- Remover produtos de uma vitrine.
    
- Definir a ordem dos produtos.
    
- Alterar o título de cada vitrine.
    
- Ativar ou desativar a exibição, quando permitido pela estrutura do site.
    

Um produto poderá participar de mais de uma vitrine, caso essa associação seja permitida pela configuração administrativa.

### 8.4. Disponibilidade

Produtos sem estoque não deverão aparecer nas vitrines da página inicial, mesmo que possuam o marcador correspondente.

A regra de disponibilidade deverá prevalecer sobre a associação à vitrine.

---

## 9. Busca de produtos e serviços

O site deverá possuir um sistema de busca eficiente, capaz de identificar o que o cliente procura mesmo quando a pesquisa contém abreviações, fragmentos de palavras ou erros simples de digitação.

Exemplos:

- Pesquisa por `comp` deverá encontrar `computador`.
    
- Pesquisa por `tador` deverá encontrar `computador`.
    
- Pesquisa por `puta` poderá encontrar `computador`, quando a correspondência for suficientemente confiável.
    

A busca deverá considerar, conforme aplicável:

- Nome do produto ou serviço.
    
- Marca.
    
- Modelo.
    
- Categoria.
    
- Subcategoria.
    
- Descrição.
    
- Características técnicas.
    
- Termos relacionados.
    

A implementação poderá utilizar normalização de texto, busca parcial, correspondência aproximada (_fuzzy search_) e outros recursos adequados.

A busca deverá evitar resultados irrelevantes causados por correspondências excessivamente amplas.

Produtos indisponíveis não deverão ser apresentados como disponíveis para compra.

Os resultados deverão ser organizados de maneira clara e com bom desempenho, inclusive em catálogos maiores.

---

## 10. Relatórios e métricas

### 10.1. Objetivo inicial

Inicialmente, os relatórios deverão priorizar a análise do interesse dos visitantes pelos produtos, serviços e categorias da loja.

O objetivo é identificar o que os clientes mais procuram e quais áreas do site despertam maior interesse.

### 10.2. Métricas obrigatórias

O sistema deverá registrar e permitir consultar:

- Produtos mais visualizados.
    
- Serviços mais visualizados.
    
- Categorias mais acessadas.
    
- Subcategorias mais acessadas.
    
- Termos mais pesquisados.
    
- Produtos mais pesquisados.
    
- Serviços mais pesquisados.
    
- Quantidade de cliques em botões de WhatsApp.
    
- Produtos que mais geram cliques para o WhatsApp.
    
- Serviços que mais geram cliques para o WhatsApp.
    
- Vitrines que mais recebem interações.
    

### 10.3. Registro de pesquisas

O sistema deverá registrar os termos pesquisados pelos clientes para identificar demandas e oportunidades comerciais.

As pesquisas deverão ser armazenadas de maneira que permitam análises por período e frequência.

Deverão ser evitados registros desnecessários de informações pessoais ou dados sensíveis inseridos acidentalmente na busca.

### 10.4. Registro de cliques

Deverá ser possível identificar cliques em áreas específicas do site, especialmente:

- Produtos.
    
- Serviços.
    
- Categorias.
    
- Subcategorias.
    
- Vitrines.
    
- Botões de contato pelo WhatsApp.
    

As métricas deverão ser baseadas em eventos efetivamente registrados.

Um clique no WhatsApp não deverá ser contabilizado como venda concluída.

### 10.5. Evolução dos relatórios

A estrutura deverá permitir a inclusão futura de outros indicadores, como conversões, pedidos confirmados e produtos mais vendidos, desde que existam dados confiáveis para calculá-los.

---

## 11. Avaliações de produtos

### 11.1. Área de avaliações

As páginas dos produtos deverão possuir uma área para que os clientes possam registrar avaliações.

O formulário deverá permitir:

- Informar uma nota.
    
- Escrever um comentário.
    
- Informar o nome que será exibido junto à avaliação.
    

O nome deverá ser opcional ou obrigatório conforme a configuração definida pela empresa. A implementação inicial deverá permitir que o cliente escolha se deseja exibi-lo.

### 11.2. Moderação

O painel administrativo deverá permitir consultar e remover avaliações inadequadas.

A empresa deverá poder remover avaliações que contenham:

- Ofensas.
    
- Ameaças.
    
- Discurso de ódio.
    
- Conteúdo discriminatório.
    
- Spam.
    
- Informações pessoais expostas indevidamente.
    
- Conteúdo ilegal ou extremamente nocivo.
    
- Outros conteúdos incompatíveis com as regras de utilização do site.
    

A moderação deverá ser realizada pelo painel administrativo, com registro da ação e do responsável.

### 11.3. Integridade das avaliações

A exclusão de uma avaliação deverá preservar, quando necessário, o registro administrativo da moderação, sem continuar exibindo o conteúdo removido publicamente.

O sistema deverá prever mecanismos contra spam e avaliações automatizadas.

As avaliações deverão ser associadas ao produto correto.

---

## 12. Backup e restauração

### 12.1. Backup administrativo

O painel administrativo deverá possuir uma funcionalidade para gerar backups das informações e configurações do sistema.

O backup deverá contemplar:

- Produtos.
    
- Variações de produtos.
    
- Categorias e subcategorias.
    
- Preços.
    
- Quantidades de estoque.
    
- Histórico de movimentações de estoque.
    
- Serviços e suas variações.
    
- Configurações da loja.
    
- Configurações das vitrines.
    
- Pedidos e solicitações registrados.
    
- Avaliações, respeitando as informações disponíveis.
    
- Usuários e informações administrativas permitidas.
    
- Demais dados necessários para reconstruir a configuração funcional da plataforma.
    

### 12.2. Imagens

Os arquivos de imagem não precisarão ser incluídos no arquivo de backup.

Entretanto, deverão ser preservadas as referências necessárias para identificar as imagens armazenadas no Cloudinary, como URLs e identificadores públicos dos arquivos.

### 12.3. Restauração

O planejamento deverá considerar não apenas a geração do backup, mas também a possibilidade de restaurar os dados.

A restauração deverá ser protegida por autorização administrativa e exigir confirmação antes de substituir informações existentes.

O sistema deverá validar o arquivo antes da restauração e evitar importações incompatíveis ou incompletas.

### 12.4. Segurança

Os backups deverão ser protegidos contra acesso público não autorizado.

Credenciais, senhas em texto puro, tokens e segredos de integração não deverão ser incluídos nos arquivos exportados.

A recuperação de usuários e permissões deverá respeitar os mecanismos seguros de autenticação e autorização.

---

## 13. Experiência do cliente

A experiência do cliente deverá ser uma prioridade durante todo o desenvolvimento.

O site deverá ser fácil de utilizar, apresentar informações claras e funcionar adequadamente em diferentes dispositivos.

### 13.1. Responsividade

Todas as páginas e funcionalidades deverão ser avaliadas em:

- Celulares.
    
- Tablets.
    
- Computadores.
    

A interface deverá se adaptar aos diferentes tamanhos de tela sem comprometer a navegação, a leitura ou as funcionalidades.

### 13.2. Acessibilidade

O desenvolvimento deverá considerar boas práticas de acessibilidade, incluindo:

- Contraste adequado.
    
- Textos legíveis.
    
- Navegação por teclado.
    
- Identificação clara dos campos.
    
- Textos alternativos para imagens relevantes.
    
- Estados visuais compreensíveis.
    
- Compatibilidade com tecnologias assistivas.
    
- Uso adequado de elementos semânticos.
    

### 13.3. Mensagens de erro

O cliente não deverá receber mensagens técnicas específicas, rastreamentos de erro ou informações internas do sistema.

Quando ocorrer um problema, deverá ser apresentada uma mensagem amigável, explicando o que aconteceu e, quando possível, orientando o cliente sobre como continuar.

Exemplo:

Em vez de exibir um erro técnico do banco de dados, apresentar:

"Não foi possível carregar os produtos neste momento. Tente novamente em alguns instantes."

Os erros detalhados deverão ser registrados internamente para diagnóstico e manutenção, sem expor informações sensíveis ao visitante.

### 13.4. Desempenho

O site deverá ser otimizado para apresentar imagens com boa qualidade e manter tempos de carregamento adequados.

Deverão ser consideradas:

- Otimização e redimensionamento de imagens.
    
- Formatos modernos de imagem, quando compatíveis.
    
- Carregamento sob demanda (_lazy loading_).
    
- Tamanhos adequados para cada contexto.
    
- Cache de recursos.
    
- Carregamento eficiente das vitrines e dos catálogos.
    
- Redução de recursos desnecessários.
    
- Otimização das consultas ao banco de dados.
    

A qualidade visual não deverá ser comprometida por compressão excessiva, mas imagens muito grandes também não deverão ser carregadas desnecessariamente.

---

## 14. Regras gerais de implementação

1. O agente deverá consultar este documento antes de implementar ou alterar funcionalidades relacionadas às regras aqui descritas.
    
2. O sistema deverá validar informações importantes no servidor, não apenas no frontend.
    
3. Nenhuma operação administrativa deverá depender exclusivamente da ocultação de elementos na interface.
    
4. Alterações importantes deverão ser documentadas nos arquivos de contexto.
    
5. Funcionalidades deverão ser desenvolvidas de maneira modular e preparada para evolução.
    
6. O agente não deverá inventar regras comerciais quando uma decisão ainda estiver pendente.
    
7. Quando uma regra não estiver suficientemente definida, deverá registrar a dúvida e solicitar esclarecimento.
    
8. A implementação deverá respeitar os requisitos de segurança, acessibilidade, responsividade e desempenho.
    
9. Dados históricos importantes deverão ser preservados sempre que possível.
    
10. Toda alteração deverá ser testada de acordo com sua relevância e impacto.
    

---

## 15. Decisões pendentes

Os seguintes pontos ainda precisarão de definição antes ou durante a implementação:

- Se o nome nas avaliações será opcional ou obrigatório.
    
- Se avaliações poderão ser publicadas imediatamente ou precisarão de aprovação.
    
- Quais critérios serão utilizados para identificar correspondências aproximadas na busca.
    
- Se produtos poderão possuir múltiplas combinações de variações, como cor e armazenamento simultaneamente.
    
- Como será definido o preço final de serviços com faixa de valores.
    
- Quais campos do XML poderão ser atualizados além de preço e estoque.
    
- Como será feita a restauração de backups e quem terá permissão para executá-la.
    
- Se produtos poderão pertencer a mais de uma categoria ou somente a uma categoria e uma subcategoria.
    
- Como serão tratadas reservas ou alterações de estoque durante a finalização de pedidos pelo WhatsApp.
    

As decisões deverão ser registradas neste documento ou nos documentos de contexto específicos, conforme sua natureza.

---

## 16. Princípio final

A plataforma deverá facilitar a operação da Norte Tecnologia, reduzir tarefas manuais, organizar os produtos e serviços e proporcionar uma experiência de compra simples e eficiente.

As regras de negócio deverão ser respeitadas em todas as camadas do sistema, garantindo que o comportamento apresentado ao cliente corresponda às informações armazenadas e às operações realizadas no painel administrativo.