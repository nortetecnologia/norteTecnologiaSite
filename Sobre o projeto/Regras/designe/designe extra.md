# Padronização Visual, Estrutural e de Componentes

## 1. Objetivo

Estabelecer um padrão visual, estrutural e funcional para todo o sistema da Norte Tecnologia, abrangendo tanto a loja virtual (frontend público) quanto o painel administrativo.

Todas as páginas devem transmitir a sensação de pertencer ao mesmo sistema. A navegação, os componentes, os espaçamentos, a tipografia, os formulários, os botões e os comportamentos devem seguir padrões consistentes.

**O Claude Code não deve desenvolver páginas isoladas com estilos e estruturas próprios quando já existir um padrão ou componente reutilizável no projeto.**

A padronização deve ser mantida durante todo o desenvolvimento e em futuras atualizações.

---

## 2. Abrangência

A padronização se aplica a todas as áreas do sistema.

### 2.1. Loja virtual

Inclui:

- Página inicial.
    
- Páginas de categorias e subcategorias.
    
- Páginas de produtos.
    
- Páginas de serviços.
    
- Carrinho.
    
- Checkout.
    
- Páginas institucionais.
    
- Páginas de contato.
    
- Política de Privacidade.
    
- Termos de Uso.
    
- Páginas de resultados de pesquisa.
    
- Páginas de erro e estados vazios.
    

### 2.2. Painel administrativo

Inclui:

- Login administrativo.
    
- Dashboard.
    
- Gerenciamento de produtos.
    
- Gerenciamento de serviços.
    
- Categorias e subcategorias.
    
- Vitrines.
    
- Estoque.
    
- Histórico de movimentações.
    
- Importação XML.
    
- Pedidos e solicitações.
    
- Avaliações.
    
- Relatórios.
    
- Configurações.
    
- Informações da empresa.
    
- Backup e restauração.
    
- Todas as futuras funcionalidades administrativas.
    

O painel administrativo pode ter uma identidade visual própria, adequada à produtividade e ao gerenciamento, mas deve seguir o mesmo sistema de design, os mesmos critérios de consistência e os mesmos padrões de componentes.

---

## 3. Sistema de design centralizado

Antes de criar novas páginas, estabelecer um sistema de design centralizado.

Esse sistema deve definir:

- Paleta de cores.
    
- Tipografia.
    
- Escala de tamanhos de fonte.
    
- Espaçamentos.
    
- Bordas.
    
- Raios de borda.
    
- Sombras.
    
- Larguras máximas de conteúdo.
    
- Alturas de elementos recorrentes.
    
- Breakpoints responsivos.
    
- Estados visuais.
    
- Padrões de ícones.
    
- Comportamento de componentes interativos.
    

Sempre que possível, utilizar variáveis e tokens de design centralizados, evitando valores arbitrários espalhados pelo código.

### 3.1. Identidade visual

A identidade visual da Norte Tecnologia deve respeitar as referências fornecidas para a empresa.

Cores principais:

- Amarelo.
    
- Azul.
    
- Preto.
    

As cores devem ser utilizadas de forma consistente, respeitando contraste, hierarquia visual e legibilidade.

A loja pública e o painel administrativo podem utilizar combinações diferentes dessas cores, desde que permaneçam visualmente relacionados à identidade da empresa.

Não introduzir novas cores principais sem necessidade ou justificativa.

### 3.2. Tipografia

Definir uma família tipográfica principal e uma escala consistente de tamanhos e pesos.

Padronizar:

- Títulos principais.
    
- Subtítulos.
    
- Títulos de seções.
    
- Textos comuns.
    
- Textos auxiliares.
    
- Legendas.
    
- Labels de formulários.
    
- Mensagens de erro e sucesso.
    

Não utilizar tamanhos e pesos diferentes arbitrariamente entre páginas equivalentes.

---

## 4. Estrutura compartilhada das páginas

As páginas devem utilizar estruturas reutilizáveis sempre que houver semelhança de finalidade e comportamento.

### 4.1. Loja virtual

Manter consistência entre:

- Cabeçalho.
    
- Logotipo.
    
- Menu de navegação.
    
- Campo de pesquisa.
    
- Ícone e acesso ao carrinho.
    
- Área principal de conteúdo.
    
- Breadcrumbs.
    
- Rodapé.
    
- Botões de contato e WhatsApp.
    

O cabeçalho deve ser compartilhado entre as páginas públicas, evitando versões diferentes para cada rota.

O footer também deve ser compartilhado, com informações institucionais e localização configuradas dinamicamente pelo administrador.

### 4.2. Painel administrativo

Criar uma estrutura administrativa compartilhada contendo:

- Menu lateral ou navegação administrativa.
    
- Cabeçalho administrativo.
    
- Identificação da seção atual.
    
- Área de conteúdo.
    
- Breadcrumbs, quando úteis.
    
- Área de ações principais.
    
- Padrão de notificações.
    
- Estados de carregamento.
    
- Estados de erro.
    
- Estados vazios.
    

Todas as páginas administrativas devem respeitar a mesma estrutura de navegação.

O menu, o cabeçalho e a área de conteúdo não devem ser reconstruídos individualmente em cada tela.

### 4.3. Layouts específicos

Podem existir layouts específicos quando a finalidade da página exigir, como:

- Login administrativo.
    
- Checkout.
    
- Páginas de erro.
    
- Visualizações em tela cheia.
    

Essas exceções devem ser justificadas e ainda respeitar os tokens, tipografia, componentes e padrões gerais do sistema.

---

## 5. Biblioteca de componentes reutilizáveis

Criar e manter uma biblioteca de componentes compartilhados.

Exemplos:

### 5.1. Componentes gerais

- Botões.
    
- Links.
    
- Ícones.
    
- Cards.
    
- Badges.
    
- Modais.
    
- Popovers.
    
- Tooltips.
    
- Breadcrumbs.
    
- Paginação.
    
- Abas.
    
- Menus.
    
- Dropdowns.
    
- Alertas.
    
- Notificações.
    
- Skeletons de carregamento.
    

### 5.2. Componentes de formulário

- Campos de texto.
    
- Campos numéricos.
    
- Campos monetários.
    
- Campos de telefone.
    
- Campos de pesquisa.
    
- Seletores.
    
- Seletores múltiplos.
    
- Checkboxes.
    
- Radio buttons.
    
- Upload de imagens.
    
- Seletores de arquivos.
    
- Campos de descrição.
    
- Validação e mensagens de erro.
    

### 5.3. Componentes da loja

- Card de produto.
    
- Card de serviço.
    
- Card de categoria.
    
- Card de vitrine.
    
- Seletor de variações.
    
- Indicador de estoque.
    
- Exibição de preço.
    
- Botão de adicionar ao carrinho.
    
- Botão de WhatsApp.
    
- Galeria de imagens.
    
- Avaliações.
    

### 5.4. Componentes administrativos

- Tabelas.
    
- Filtros.
    
- Barra de pesquisa.
    
- Formulários de cadastro e edição.
    
- Cabeçalhos de seção.
    
- Cards de indicadores.
    
- Menus de ações.
    
- Confirmação de exclusão.
    
- Histórico de alterações.
    
- Indicadores de status.
    
- Componentes de importação.
    
- Componentes de backup.
    

Componentes equivalentes devem compartilhar a mesma implementação sempre que isso não prejudicar sua finalidade.

---

## 6. Padronização de botões e ações

Os botões devem seguir uma hierarquia visual consistente.

Definir variantes, por exemplo:

- Primário: ação principal da página.
    
- Secundário: ação complementar.
    
- Terciário ou textual: ação de menor destaque.
    
- Perigo: exclusão ou ação destrutiva.
    
- Desabilitado: ação indisponível.
    

Padronizar:

- Altura.
    
- Espaçamento interno.
    
- Tipografia.
    
- Bordas.
    
- Ícones.
    
- Estados de hover.
    
- Estados de foco.
    
- Estados de carregamento.
    
- Estados desabilitados.
    

A mesma ação deve ter aparência e comportamento semelhantes em todo o sistema.

Exemplo: os botões de "Salvar" em cadastro de produto, serviço e categoria devem seguir o mesmo padrão.

Ações destrutivas devem possuir confirmação quando houver risco de perda de dados.

---

## 7. Padronização de formulários

Todos os formulários devem seguir uma estrutura consistente.

- Labels acima dos campos, salvo justificativa de usabilidade.
    
- Indicação clara de campos obrigatórios.
    
- Placeholders apenas como exemplos ou orientações complementares.
    
- Mensagens de erro próximas ao campo correspondente.
    
- Validação consistente.
    
- Agrupamento lógico de campos relacionados.
    
- Botões de salvar e cancelar em posições previsíveis.
    
- Indicação de carregamento durante operações.
    
- Feedback claro após sucesso ou falha.
    

Não utilizar mensagens de erro diferentes para o mesmo tipo de problema em formulários distintos.

Os formulários devem ser responsivos e acessíveis.

---

## 8. Padronização de tabelas e listagens administrativas

As páginas de gerenciamento devem utilizar um padrão comum de listagem.

Sempre que aplicável, apresentar:

- Título da seção.
    
- Descrição breve.
    
- Botão de ação principal.
    
- Pesquisa.
    
- Filtros.
    
- Tabela ou listagem.
    
- Paginação.
    
- Indicadores de status.
    
- Ações por registro.
    
- Estado vazio.
    
- Estado de carregamento.
    
- Mensagens de erro.
    

Exemplo: produtos, serviços, categorias e pedidos devem compartilhar a mesma lógica de navegação e apresentação de registros, mesmo quando suas colunas forem diferentes.

Não criar tabelas com comportamentos completamente diferentes sem uma necessidade funcional.

---

## 9. Estados e feedback visual

Todas as páginas devem tratar os estados da aplicação de forma consistente.

### 9.1. Carregamento

- Utilizar skeletons ou indicadores de carregamento adequados.
    
- Evitar telas vazias enquanto os dados estão sendo carregados.
    
- Impedir envios duplicados quando uma operação estiver em andamento.
    

### 9.2. Sucesso

- Apresentar confirmação clara após operações concluídas.
    
- Utilizar notificações padronizadas.
    
- Não exibir mensagens de sucesso antes da confirmação real do servidor.
    

### 9.3. Erros

- Apresentar mensagens compreensíveis.
    
- Não expor stack traces, SQL, credenciais ou detalhes internos.
    
- Manter detalhes técnicos nos logs apropriados.
    
- Permitir nova tentativa quando fizer sentido.
    

### 9.4. Estado vazio

Quando não houver dados, explicar o motivo e, quando possível, apresentar uma ação útil.

Exemplos:

- Nenhum produto cadastrado.
    
- Nenhum resultado encontrado.
    
- Nenhum pedido recebido.
    
- Nenhuma avaliação disponível.
    

### 9.5. Confirmações

Padronizar diálogos de confirmação para ações como:

- Excluir produto.
    
- Excluir categoria.
    
- Remover imagem.
    
- Cancelar operação.
    
- Restaurar backup.
    
- Executar importação de dados.
    

A mensagem deve explicar claramente o efeito da ação.

---

## 10. Responsividade

A padronização também deve ser mantida entre diferentes tamanhos de tela.

O sistema deve funcionar adequadamente em:

- Celulares.
    
- Tablets.
    
- Notebooks.
    
- Monitores de diferentes resoluções.
    

Regras:

- Não criar uma versão visualmente independente para cada dispositivo.
    
- Adaptar os mesmos componentes conforme o espaço disponível.
    
- Manter hierarquia visual e identidade.
    
- Evitar rolagem horizontal desnecessária.
    
- Adaptar tabelas administrativas para telas menores.
    
- Garantir que menus e formulários sejam utilizáveis por toque.
    
- Manter botões e áreas interativas com dimensões adequadas.
    

O painel administrativo também precisa ser responsivo, não apenas a loja pública.

---

## 11. Acessibilidade

Os padrões de componentes devem considerar acessibilidade desde sua criação.

- Contraste adequado.
    
- Navegação por teclado.
    
- Foco visível.
    
- Labels associados aos campos.
    
- Textos alternativos para imagens relevantes.
    
- Semântica HTML adequada.
    
- Identificação acessível de botões e ícones.
    
- Compatibilidade com leitores de tela.
    
- Mensagens de erro compreensíveis.
    
- Não depender exclusivamente de cores para comunicar estados.
    

Um componente reutilizável deve ser acessível por padrão, evitando corrigir o mesmo problema em cada página.

---

## 12. Organização e implementação no código

O Claude Code deve organizar os componentes de maneira clara e escalável.

Exemplo conceitual de organização:

- `components/ui/`: componentes genéricos e reutilizáveis.
    
- `components/layout/`: estruturas compartilhadas de layout.
    
- `components/store/`: componentes específicos da loja.
    
- `components/admin/`: componentes específicos do painel.
    
- `styles/` ou configuração central de tokens: padrões visuais globais.
    

A estrutura final deve respeitar a organização real do projeto. Não reorganizar todo o código sem necessidade.

### 12.1. Princípios de implementação

- Evitar duplicação de código.
    
- Priorizar composição e reutilização.
    
- Separar componentes genéricos de componentes específicos de domínio.
    
- Evitar componentes excessivamente grandes.
    
- Não criar abstrações desnecessárias.
    
- Manter responsabilidades bem definidas.
    
- Centralizar estilos recorrentes.
    
- Manter consistência nos nomes e nas propriedades dos componentes.
    

A reutilização deve facilitar a manutenção, e não tornar o código excessivamente complexo.

---

## 13. Regras para criação de novas páginas

Antes de criar uma página, o Claude Code deve:

1. Identificar se já existe uma página com finalidade semelhante.
    
2. Verificar quais layouts e componentes compartilhados podem ser reutilizados.
    
3. Consultar os tokens e padrões visuais existentes.
    
4. Identificar se a nova funcionalidade exige um componente reutilizável.
    
5. Seguir a hierarquia de navegação existente.
    
6. Garantir responsividade e acessibilidade.
    
7. Verificar consistência com páginas equivalentes.
    

Não desenvolver uma página do zero quando a estrutura necessária já existir no projeto.

Se uma página realmente precisar de um padrão diferente, justificar a exceção e documentar a decisão.

---

## 14. Regras para alterações globais

Alterações em elementos compartilhados podem afetar várias páginas.

Antes de alterar um componente global, o Claude Code deve:

- Identificar todas as páginas que utilizam o componente.
    
- Avaliar possíveis impactos.
    
- Verificar se a alteração atende aos diferentes contextos.
    
- Evitar quebrar funcionalidades existentes.
    
- Testar os principais locais de utilização.
    
- Atualizar a documentação quando o padrão mudar.
    

Não modificar o cabeçalho, footer, menu administrativo, botões globais ou tokens sem avaliar o impacto no restante do sistema.

---

## 15. Consistência visual durante o desenvolvimento

O desenvolvimento deve ser incremental e visualmente consistente.

Após implementar uma página ou funcionalidade:

1. Verificar sua aparência.
    
2. Comparar com páginas equivalentes.
    
3. Corrigir diferenças desnecessárias.
    
4. Verificar os estados de carregamento, erro, sucesso e vazio.
    
5. Testar em diferentes resoluções.
    
6. Conferir o comportamento dos componentes reutilizados.
    

Não considerar uma funcionalidade concluída apenas porque está funcionando tecnicamente. Ela também deve respeitar o padrão visual e de experiência do sistema.

O desenvolvimento deve permitir que o responsável pela empresa acompanhe a evolução visual das páginas e identifique inconsistências antes da conclusão de grandes etapas.

---

## 16. Checklist obrigatório antes de concluir uma página

- Utiliza o layout compartilhado adequado.
    
- Respeita a identidade visual da Norte Tecnologia.
    
- Utiliza os tokens de design existentes.
    
- Reutiliza componentes disponíveis.
    
- Mantém consistência com páginas equivalentes.
    
- Possui hierarquia visual clara.
    
- Botões seguem os padrões estabelecidos.
    
- Formulários seguem os padrões estabelecidos.
    
- Estados de carregamento, erro, sucesso e vazio foram tratados.
    
- É responsiva.
    
- É acessível.
    
- Não apresenta estilos duplicados ou arbitrários sem justificativa.
    
- Não compromete páginas que compartilham os componentes utilizados.
    

---

## 17. Instruções obrigatórias ao Claude Code

1. Consultar este documento antes de criar ou modificar qualquer página ou componente visual.
    
2. Consultar `identidade-visual.md`, `referencias-visuais.md` e `responsividade-e-acessibilidade.md`.
    
3. Manter a padronização tanto na loja pública quanto no painel administrativo.
    
4. Não criar estilos independentes para páginas que possam compartilhar componentes.
    
5. Priorizar componentes reutilizáveis e layouts compartilhados.
    
6. Centralizar tokens e estilos globais.
    
7. Não alterar padrões globais sem avaliar o impacto nas páginas existentes.
    
8. Não considerar uma página concluída sem verificar sua consistência visual e responsividade.
    
9. Documentar exceções e decisões importantes.
    
10. Atualizar `Contextos/diario.md` após mudanças relevantes na biblioteca de componentes, nos layouts ou no sistema de design.
    

**Regra final:** toda nova página deve parecer parte natural da Norte Tecnologia. A loja e o painel administrativo podem ter necessidades visuais diferentes, mas ambos devem apresentar consistência, organização, previsibilidade e qualidade. A criação de novas funcionalidades nunca deve resultar em um sistema visualmente fragmentado.