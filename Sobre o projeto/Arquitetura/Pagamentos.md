

## 1. Funcionamento atual

**Status:** Sem integração com gateways de pagamento online.

Na primeira versão do Norte Tecnologia, não serão utilizados gateways de pagamento online. O site será responsável por organizar a solicitação de compra e direcionar o cliente ao WhatsApp da loja para dar continuidade ao atendimento.

O pagamento será realizado presencialmente, podendo ocorrer de duas formas:

- **Retirada na loja:** o cliente realiza o pagamento diretamente na loja.
    
- **Entrega:** o cliente realiza o pagamento no momento do recebimento do produto.
    

O checkout deverá permitir que o cliente selecione a modalidade de recebimento e a forma de pagamento desejada, conforme as opções disponibilizadas pela loja.

As informações selecionadas deverão ser incluídas automaticamente na mensagem enviada ao WhatsApp, juntamente com os produtos, quantidades, valores e demais informações do pedido.

O site não deverá processar transações financeiras nem solicitar dados bancários ou informações de cartões dos clientes nessa primeira versão.

## 2. Preparação para futuras integrações

**Status:** Planejado para implementação futura.

Embora não sejam utilizados gateways de pagamento online inicialmente, a arquitetura do sistema deverá ser desenvolvida considerando a possibilidade de integração futura com provedores de pagamento.

Essa preparação deverá evitar grandes refatorações na aplicação quando a empresa decidir disponibilizar pagamentos online.

A arquitetura deverá:

- Separar as regras de negócio do checkout da lógica específica de processamento de pagamentos.
    
- Evitar acoplamento direto com um fornecedor específico de pagamento.
    
- Permitir a integração futura com diferentes gateways.
    
- Prever o registro e acompanhamento do status dos pagamentos.
    
- Permitir a associação entre pedidos e suas respectivas transações financeiras.
    
- Considerar notificações de confirmação de pagamento por mecanismos como webhooks.
    
- Permitir que os métodos de pagamento disponíveis sejam ampliados conforme novas integrações forem implementadas.
    

A implementação futura poderá contemplar gateways como Mercado Pago, PagBank, Pagar.me ou outros fornecedores escolhidos pela empresa.

## 3. Diretriz arquitetural

O pedido e o pagamento deverão ser tratados como responsabilidades distintas dentro do sistema.

A criação de um pedido não deverá depender obrigatoriamente da existência de uma transação financeira online.

Dessa forma, o sistema deverá suportar inicialmente pedidos com pagamento presencial ou no momento da entrega e, futuramente, pedidos com pagamentos processados por gateways online.

A inclusão de qualquer gateway deverá ocorrer por meio de uma integração específica, preservando as regras de negócio e a estrutura principal do checkout.