# Protocolo de Continuidade e Diário de Desenvolvimento

## 1. Objetivo

O arquivo `Contextos/diario.md` será o registro contínuo da evolução do projeto Norte Tecnologia.

Sua finalidade é permitir que o agente de desenvolvimento compreenda o estado atual do projeto, recupere as últimas implementações, identifique pendências e saiba como dar continuidade ao trabalho sem repetir tarefas ou comprometer funcionalidades existentes.

O diário deverá funcionar como uma memória operacional do desenvolvimento, complementando os demais documentos de contexto.

## 2. Consulta obrigatória antes de iniciar qualquer tarefa

**REGRA OBRIGATÓRIA: antes de iniciar qualquer implementação, alteração, correção, refatoração ou planejamento técnico, consulte o arquivo** `**Contextos/diario.md**`**.**

Após consultar o diário, o agente deverá:

1. Identificar a última implementação registrada.
    
2. Verificar quais tarefas foram concluídas.
    
3. Identificar tarefas em andamento ou interrompidas.
    
4. Consultar as próximas etapas planejadas.
    
5. Verificar pendências, problemas conhecidos e decisões ainda não tomadas.
    
6. Consultar os demais arquivos de contexto relacionados à tarefa.
    
7. Analisar o estado atual do código para confirmar se o diário continua refletindo a realidade do projeto.
    

O agente deverá utilizar essas informações para determinar a melhor forma de continuar o desenvolvimento.

**Não presumir que uma tarefa está concluída apenas porque ela aparece como planejada ou iniciada no diário.** Sempre verificar o código e os testes pertinentes.

## 3. Atualização obrigatória do diário

O arquivo `Contextos/diario.md` deverá ser atualizado ao concluir cada etapa relevante do desenvolvimento.

O agente deverá registrar:

- O que foi implementado.
    
- O que foi alterado.
    
- Quais arquivos ou módulos foram afetados.
    
- Qual era o objetivo da implementação.
    
- Quais decisões técnicas foram tomadas.
    
- Quais testes ou verificações foram executados.
    
- Se existem problemas ou limitações conhecidos.
    
- O que ainda precisa ser feito.
    
- Qual deverá ser o próximo passo recomendado.
    

O diário deverá ser atualizado também quando uma implementação for interrompida, quando surgir um bloqueio ou quando uma decisão importante modificar o planejamento.

Não registrar como concluída uma funcionalidade que ainda não foi integralmente implementada ou validada.

## 4. Planejamento das próximas etapas

Ao finalizar uma tarefa, o agente deverá avaliar o estado atual do projeto e indicar as próximas etapas necessárias.

O planejamento deverá respeitar:

1. A arquitetura documentada.
    
2. As regras de negócio da Norte Tecnologia.
    
3. As decisões arquiteturais já tomadas.
    
4. As dependências entre funcionalidades.
    
5. Os requisitos de segurança.
    
6. A estabilidade das funcionalidades existentes.
    

As próximas etapas deverão ser descritas de maneira objetiva, indicando o que precisa ser feito e, quando possível, sua dependência em relação a outras tarefas.

O agente não deverá inventar funcionalidades ou alterar prioridades comerciais sem autorização.

## 5. Estrutura do diário

O arquivo `Contextos/diario.md` deverá manter a seguinte organização:

### Estado atual do projeto

Resumo do estágio atual do desenvolvimento, incluindo funcionalidades implementadas, módulos em construção e situação geral.

### Última atualização

Data da última atualização e descrição resumida da última etapa concluída.

### Implementações concluídas

Histórico cronológico das principais funcionalidades e alterações concluídas.

### Implementações em andamento

Descrição das tarefas que começaram, mas ainda não foram finalizadas.

### Pendências e problemas conhecidos

Registro de erros, limitações, bloqueios técnicos e decisões que aguardam esclarecimento.

### Próximas etapas

Lista priorizada das próximas tarefas recomendadas para dar continuidade ao projeto.

### Decisões recentes

Registro resumido das decisões técnicas e de negócio tomadas durante o desenvolvimento, indicando quando necessário o documento de contexto correspondente.

## 6. Regras para preservar a qualidade do diário

- Manter os registros em ordem cronológica, com os mais recentes em destaque.
    
- Não apagar o histórico anterior sem necessidade.
    
- Evitar registros repetitivos ou excessivamente detalhados.
    
- Registrar informações suficientes para que outro agente ou desenvolvedor consiga continuar o trabalho.
    
- Diferenciar claramente tarefas planejadas, em andamento e concluídas.
    
- Não registrar suposições como fatos.
    
- Não registrar credenciais, senhas, tokens ou outras informações sensíveis.
    
- Não duplicar integralmente informações já documentadas em outros arquivos.
    
- Quando uma alteração modificar uma regra permanente do projeto, atualizar também o documento de contexto correspondente.
    
- Manter o diário atualizado e coerente com o estado real do código.
    

## 7. Continuidade entre sessões

Sempre que uma nova sessão de desenvolvimento for iniciada, o agente deverá consultar o diário e recuperar o contexto da última sessão.

Antes de começar, deverá identificar:

- Qual foi a última tarefa realizada.
    
- Se ela foi concluída ou interrompida.
    
- Quais verificações foram executadas.
    
- Quais pendências permaneceram.
    
- Qual é a próxima etapa recomendada.
    

Se o diário indicar uma tarefa em andamento, o agente deverá primeiro verificar o estado atual dessa implementação antes de continuar.

Se houver divergência entre o diário e o código, o código e as evidências verificáveis deverão ser utilizados para identificar o estado real. A divergência deverá ser corrigida no diário.

## 8. Encerramento de cada etapa de trabalho

Ao terminar uma tarefa relevante, o agente deverá:

1. Verificar o resultado da implementação.
    
2. Executar os testes e verificações pertinentes.
    
3. Atualizar a documentação técnica ou funcional afetada.
    
4. Atualizar o `Contextos/diario.md`.
    
5. Registrar as pendências que permaneceram.
    
6. Indicar a próxima etapa recomendada.
    
7. Informar claramente o que foi concluído e o que ainda não foi concluído.
    

A atualização do diário não deverá depender de um pedido explícito do usuário.

## 9. Instrução principal ao agente

O diário é uma referência obrigatória para a continuidade do desenvolvimento.

**Antes de trabalhar, consulte o diário. Depois de trabalhar, atualize o diário.**

Nunca iniciar uma nova etapa ignorando o histórico recente do projeto.

Nunca considerar o planejamento como implementação concluída.

Nunca encerrar uma tarefa relevante sem registrar seu resultado e as próximas etapas.

O objetivo é garantir continuidade, rastreabilidade e evolução organizada do projeto Norte Tecnologia, mesmo quando o desenvolvimento ocorrer em diferentes sessões ou por diferentes agentes.