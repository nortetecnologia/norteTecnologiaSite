

## 1. Objetivo

Este documento estabelece as regras obrigatórias para versionamento, auditoria, documentação, revisão e publicação de alterações no projeto da Norte Tecnologia.

O objetivo é manter o código organizado, rastreável, seguro e estável, evitando que alterações não revisadas ou incompatíveis com a arquitetura cheguem ao ambiente de produção.

Estas regras devem ser seguidas pelo agente de desenvolvimento em todas as etapas do projeto.

## 2. Consulta obrigatória aos contextos

Antes de iniciar qualquer alteração no projeto, o agente deverá:

1. Consultar os arquivos de contexto relacionados à funcionalidade que será modificada.
    
2. Verificar as regras de negócio e decisões arquiteturais já documentadas.
    
3. Analisar a estrutura atual do projeto antes de propor ou realizar mudanças.
    
4. Identificar possíveis impactos em funcionalidades existentes.
    
5. Verificar se existem decisões pendentes que possam afetar a implementação.
    

**Regra:** nunca iniciar uma alteração importante sem antes consultar os contextos pertinentes.

Caso exista conflito entre o comportamento atual do código e uma regra documentada, o agente deverá identificar o conflito e solicitar esclarecimento quando a decisão não estiver definida.

## 3. Atualização obrigatória da documentação

A documentação deverá ser atualizada antes de realizar commit e push.

O agente deverá verificar se as alterações realizadas exigem atualização de algum arquivo em `Contextos/`.

Exemplos:

- Alterações na arquitetura: atualizar `arquitetura/`.
    
- Alterações nas rotas: atualizar `rotas-e-navegacao.md`.
    
- Alterações nas regras comerciais: atualizar `regras-de-negocio.md`.
    
- Alterações na segurança: atualizar `seguranca.md`.
    
- Alterações nas integrações: atualizar `integracoes.md`.
    
- Alterações nas funcionalidades: atualizar o documento correspondente.
    
- Novas decisões arquiteturais: registrar em `decisoes/decisoes-arquiteturais.md`.
    

Alterações grandes ou que impactem o funcionamento geral do sistema deverão ser registradas nos contextos, deixando histórico suficiente para que outros desenvolvedores e agentes compreendam o que foi modificado e por quê.

Não atualizar a documentação apenas por formalidade. Ela deve refletir o comportamento real do sistema.

## 4. Commits

Os commits deverão representar alterações coerentes e bem delimitadas.

Regras:

1. Não realizar commit de código sem antes revisar as alterações.
    
2. Atualizar a documentação pertinente antes do commit.
    
3. Não incluir arquivos temporários, credenciais, tokens, senhas ou arquivos de ambiente com informações sensíveis.
    
4. Evitar misturar alterações independentes em um único commit.
    
5. Utilizar mensagens claras, que descrevam objetivamente o que foi realizado.
    

Exemplos:

- `feat: adiciona gerenciamento de categorias`
    
- `fix: corrige cálculo do subtotal do carrinho`
    
- `refactor: reorganiza módulo de produtos`
    
- `docs: atualiza documentação das rotas`
    
- `security: restringe acesso às operações administrativas`
    

## 5. Push e branches

O projeto deverá utilizar branches para organizar o desenvolvimento e a integração de alterações.

Regras:

1. Não realizar push diretamente na branch de produção.
    
2. Desenvolver funcionalidades em branches próprias.
    
3. Antes do push, verificar os arquivos que serão enviados e garantir que não existam informações sensíveis.
    
4. Atualizar a documentação pertinente antes de enviar as alterações.
    
5. Enviar as alterações para a branch de desenvolvimento ou funcionalidade correspondente.
    
6. Utilizar Pull Requests para propor a integração com a branch de produção.
    

A branch de produção deverá permanecer protegida contra alterações diretas.

## 6. Auditoria obrigatória antes do Pull Request

Antes de abrir um Pull Request destinado à branch de produção, o agente deverá realizar uma auditoria das alterações.

A auditoria deverá contemplar:

### 6.1. Código e arquitetura

- Verificar todos os arquivos modificados.
    
- Identificar alterações desnecessárias ou duplicações.
    
- Verificar se a implementação respeita a arquitetura existente.
    
- Verificar se as regras de negócio foram preservadas.
    
- Identificar possíveis impactos em funcionalidades existentes.
    
- Verificar se não foram introduzidas dependências desnecessárias.
    

### 6.2. Segurança

- Verificar se não existem credenciais ou segredos expostos.
    
- Verificar autenticação e autorização nas funcionalidades administrativas.
    
- Verificar validações realizadas no servidor.
    
- Verificar políticas de segurança e acesso ao banco de dados.
    
- Verificar se informações sensíveis não estão sendo expostas ao frontend.
    
- Verificar possíveis vulnerabilidades introduzidas pelas alterações.
    

### 6.3. Qualidade e funcionamento

- Executar os testes pertinentes.
    
- Executar verificações de TypeScript e lint, quando aplicáveis.
    
- Verificar o build da aplicação.
    
- Corrigir erros identificados.
    
- Verificar se as funcionalidades relacionadas continuam funcionando.
    
- Avaliar o comportamento responsivo quando houver alterações visuais.
    

### 6.4. Documentação

- Confirmar que os arquivos de contexto foram atualizados.
    
- Verificar se as novas funcionalidades estão documentadas.
    
- Registrar decisões importantes e limitações conhecidas.
    
- Verificar se a documentação não contradiz o comportamento implementado.
    

**Regra:** não abrir Pull Request para produção enquanto houver erros conhecidos relevantes, falhas de segurança não resolvidas ou documentação desatualizada relacionada à alteração.

## 7. Pull Requests (PR)

Todo Pull Request destinado à branch de produção deverá apresentar:

- Resumo das alterações realizadas.
    
- Motivo da alteração.
    
- Funcionalidades afetadas.
    
- Arquivos de documentação atualizados.
    
- Testes e verificações executados.
    
- Riscos conhecidos ou pontos que exigem atenção.
    
- Evidências visuais, quando houver alterações na interface.
    

O PR deverá ser revisado antes de sua aprovação.

Sempre que possível, utilizar revisão por outra pessoa, além da auditoria automatizada ou realizada pelo agente.

## 8. Merge e deploy em produção

O merge na branch de produção e o deploy de produção são etapas controladas.

Regras:

1. Não realizar merge em produção sem autorização explícita.
    
2. Não executar deploy manual de produção sem autorização explícita.
    
3. Verificar se o Pull Request foi revisado e aprovado.
    
4. Confirmar que os testes e verificações foram concluídos.
    
5. Verificar se as variáveis de ambiente e configurações necessárias estão corretas.
    
6. Considerar possíveis impactos em banco de dados, integrações e dados existentes.
    
7. Garantir que migrations e alterações de estrutura do banco estejam preparadas para implantação.
    
8. Após o deploy autorizado, verificar se a aplicação está funcionando corretamente.
    

A integração com a Vercel e o GitHub poderá automatizar etapas de preview e deploy, mas isso não elimina a necessidade de revisão e autorização para produção.

## 9. Preview e validação visual

Quando houver alterações na interface, o agente deverá disponibilizar uma forma de visualizar o resultado antes da publicação em produção.

Preferencialmente, utilizar os Preview Deployments da Vercel associados aos Pull Requests.

O objetivo é permitir a validação visual das páginas, componentes, responsividade e fluxos de navegação antes da publicação definitiva.

## 10. Histórico de alterações importantes

Alterações relevantes deverão ser registradas nos arquivos de contexto.

O registro deverá conter, conforme aplicável:

- Data da alteração.
    
- Funcionalidade ou módulo afetado.
    
- Descrição do que foi modificado.
    
- Motivo da mudança.
    
- Decisões técnicas tomadas.
    
- Impactos em outras partes do sistema.
    
- Novas dependências ou integrações.
    
- Pendências e limitações conhecidas.
    

Não é necessário registrar cada pequena correção em um documento arquitetural. O histórico deverá priorizar mudanças estruturais, decisões importantes e alterações que afetem o funcionamento do sistema.

## 11. Fluxo obrigatório de trabalho

O fluxo padrão para alterações destinadas à produção será:

1. **Consultar:** ler os contextos e entender a arquitetura atual.
    
2. **Planejar:** identificar o escopo, os riscos e os arquivos afetados.
    
3. **Desenvolver:** implementar em uma branch apropriada.
    
4. **Validar:** executar testes e verificar o funcionamento.
    
5. **Documentar:** atualizar os arquivos de contexto pertinentes.
    
6. **Revisar:** auditar todas as alterações e verificar a segurança.
    
7. **Commit:** registrar as alterações em commits organizados.
    
8. **Push:** enviar a branch para o repositório remoto.
    
9. **Pull Request:** abrir PR com descrição e evidências da auditoria.
    
10. **Aprovar:** aguardar revisão e autorização para integração.
    
11. **Merge e deploy:** realizar a publicação somente após autorização.
    
12. **Verificar:** validar o funcionamento do ambiente de produção após a publicação.
    

## 12. Instruções obrigatórias ao agente de desenvolvimento

- Nunca iniciar alterações sem consultar os contextos pertinentes.
    
- Nunca realizar commit ou push antes de atualizar a documentação necessária.
    
- Nunca abrir PR para produção sem auditoria das alterações.
    
- Nunca realizar merge ou deploy de produção sem autorização explícita.
    
- Nunca enviar credenciais, segredos ou arquivos sensíveis ao repositório.
    
- Nunca considerar que testes automatizados substituem uma revisão de código e segurança.
    
- Sempre documentar alterações estruturais e decisões importantes.
    
- Sempre informar quais verificações foram executadas e quais falharam.
    
- Nunca afirmar que uma auditoria, teste, push ou deploy foi concluído sem realmente executar e verificar a etapa correspondente.
    

**Princípio final:** nenhuma alteração deve chegar à produção sem passar por consulta aos contextos, documentação, validação e auditoria. A estabilidade, a segurança e a rastreabilidade do projeto devem ser preservadas durante toda a evolução do sistema.