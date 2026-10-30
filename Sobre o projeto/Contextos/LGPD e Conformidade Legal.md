

## 1. Objetivo

Este documento estabelece as diretrizes obrigatórias para que o site e os sistemas da Norte Tecnologia sejam desenvolvidos e operados respeitando a legislação brasileira aplicável à proteção de dados pessoais, privacidade, comércio eletrônico e relações de consumo.

O objetivo é reduzir riscos jurídicos, proteger os clientes, proteger a empresa e garantir que o tratamento de informações seja transparente, seguro, legítimo e documentado.

**A conformidade legal é obrigatória em todas as etapas do projeto.** Não deve ser tratada como uma funcionalidade opcional ou como algo a ser implementado somente depois que o site estiver pronto.

### 1.1. Limite desta documentação

Este documento é uma diretriz técnica e operacional para o desenvolvimento do sistema. Ele não substitui uma análise jurídica profissional.

Nenhum sistema, política ou documento consegue garantir que a empresa jamais será processada ou responsabilizada. A conformidade depende também das práticas reais da empresa, da veracidade das informações publicadas, dos contratos, do atendimento e do cumprimento das obrigações legais.

O Claude Code deve implementar as medidas técnicas descritas aqui, identificar pendências e alertar sobre decisões que dependam de validação jurídica. **Nunca deve inventar informações legais, CNPJ, endereço, prazos, políticas comerciais, consentimentos ou declarações em nome da empresa.**

---

## 2. Legislação e normas aplicáveis

O desenvolvimento e a operação devem considerar, conforme a atividade e o tratamento realizado:

- **Lei nº 13.709/2018 — LGPD:** Lei Geral de Proteção de Dados Pessoais.
    
- **Lei nº 8.078/1990 — Código de Defesa do Consumidor (CDC):** direitos dos consumidores, informações sobre produtos e serviços, ofertas, publicidade, garantias e responsabilidade dos fornecedores.
    
- **Decreto nº 7.962/2013:** regulamentação do comércio eletrônico, incluindo identificação do fornecedor, informações claras, atendimento e direito de arrependimento.
    
- **Lei nº 12.965/2014 — Marco Civil da Internet:** princípios, direitos e deveres relacionados ao uso da internet e aos registros.
    
- Demais normas aplicáveis à atividade comercial, prestação de serviços, emissão fiscal, publicidade, direitos autorais, acessibilidade e relações de consumo.
    

O responsável pelo negócio deve manter a documentação revisada conforme alterações legislativas e regulamentares.

---

## 3. Princípios obrigatórios de proteção de dados

Toda funcionalidade que colete ou utilize dados pessoais deve respeitar os princípios da LGPD:

1. **Finalidade:** coletar dados para objetivos legítimos, específicos e informados.
    
2. **Adequação:** utilizar os dados de maneira compatível com a finalidade informada.
    
3. **Necessidade:** coletar somente o mínimo necessário.
    
4. **Livre acesso:** permitir que o titular consulte informações sobre o tratamento.
    
5. **Qualidade dos dados:** manter informações corretas e atualizadas.
    
6. **Transparência:** explicar de forma clara como os dados são utilizados.
    
7. **Segurança:** proteger os dados contra acessos, perdas, alterações e vazamentos.
    
8. **Prevenção:** adotar medidas para evitar danos.
    
9. **Não discriminação:** não utilizar dados para finalidades discriminatórias ilícitas ou abusivas.
    
10. **Responsabilização e prestação de contas:** manter evidências das medidas adotadas.
    

O sistema deve aplicar o conceito de _Privacy by Design_: privacidade e proteção de dados desde a concepção de cada funcionalidade.

---

## 4. Mapeamento dos dados pessoais

Antes de implementar uma funcionalidade que trate dados pessoais, o agente deve identificar:

- Quais dados serão coletados.
    
- Por que serão coletados.
    
- Qual hipótese legal autoriza o tratamento.
    
- Quem terá acesso.
    
- Onde serão armazenados.
    
- Com quais fornecedores serão compartilhados.
    
- Por quanto tempo serão mantidos.
    
- Como poderão ser corrigidos, exportados ou eliminados.
    
- Quais riscos de segurança existem.
    

Manter um inventário atualizado das operações de tratamento.

### 4.1. Dados que podem ser tratados pelo site

Conforme a funcionalidade efetivamente implementada:

- Nome do cliente.
    
- Telefone e WhatsApp.
    
- E-mail.
    
- Endereço de entrega ou atendimento, quando necessário.
    
- Informações sobre produtos e serviços solicitados.
    
- Itens, quantidades, valores e histórico de pedidos.
    
- Preferências de entrega ou retirada.
    
- Mensagens e descrições de problemas técnicos enviadas pelo cliente.
    
- Avaliações e comentários.
    
- Nome público escolhido para exibição em avaliações.
    
- Dados técnicos de navegação, como endereço IP, registros de acesso e informações do dispositivo, quando aplicável.
    
- Termos de pesquisa utilizados no site, preferencialmente sem associá-los diretamente à identidade do visitante.
    

Não coletar CPF, documentos, dados financeiros ou outras informações pessoais apenas por conveniência. Cada campo deve ter uma justificativa legítima e uma finalidade definida.

**Dados sensíveis:** o sistema não deve solicitar informações sobre saúde, religião, opinião política, origem racial, biometria ou outras categorias sensíveis sem uma necessidade real e uma hipótese legal adequada. Evitar que formulários de manutenção incentivem o envio de informações pessoais desnecessárias.

---

## 5. Bases legais e consentimento

O sistema não deve tratar consentimento como a única base legal possível.

Cada operação precisa utilizar a hipótese legal adequada, como:

- Execução de contrato ou procedimentos preliminares solicitados pelo titular.
    
- Cumprimento de obrigação legal ou regulatória.
    
- Exercício regular de direitos.
    
- Legítimo interesse, quando juridicamente aplicável e após avaliação adequada.
    
- Consentimento, quando necessário.
    

### 5.1. Regras para consentimento

Quando o consentimento for a base legal:

- Deve ser livre, informado, inequívoco e vinculado a uma finalidade específica.
    
- Não pode ser presumido pelo simples uso do site.
    
- Não pode estar escondido em textos confusos.
    
- Não deve ser agrupado artificialmente com finalidades diferentes.
    
- Deve existir uma forma de registrar quando e como foi concedido.
    
- Deve ser possível revogá-lo de maneira simples.
    
- A revogação deve interromper os tratamentos que dependam daquele consentimento, respeitadas as demais hipóteses legais de conservação.
    

Não utilizar caixas previamente marcadas para obter consentimento.

### 5.2. Cookies e tecnologias de rastreamento

- Identificar todos os cookies e tecnologias utilizados.
    
- Classificar por finalidade: necessários, analíticos, funcionais e publicidade, quando existirem.
    
- Não ativar tecnologias não essenciais antes da escolha do usuário, quando o consentimento for exigido.
    
- Disponibilizar opção clara de aceitar, rejeitar e configurar cookies não essenciais.
    
- Permitir alteração posterior das preferências.
    
- Informar quais terceiros recebem dados por meio dessas tecnologias.
    
- Não instalar ferramentas de publicidade ou rastreamento sem avaliar previamente sua conformidade.
    

Cookies estritamente necessários ao funcionamento do site devem ser diferenciados daqueles utilizados para análise, publicidade ou rastreamento.

---

## 6. Política de Privacidade

O site deve possuir uma página pública de Política de Privacidade, acessível pelo rodapé e por outros locais adequados.

O documento deverá ser redigido e validado com base nas operações reais do sistema, contendo no mínimo:

1. Identificação da empresa responsável pelo tratamento.
    
2. Dados de contato para assuntos de privacidade.
    
3. Categorias de dados coletados.
    
4. Finalidades de cada tratamento.
    
5. Bases legais utilizadas.
    
6. Compartilhamento de dados com terceiros.
    
7. Fornecedores e serviços envolvidos.
    
8. Transferências internacionais, se ocorrerem.
    
9. Prazos ou critérios de conservação.
    
10. Medidas gerais de segurança.
    
11. Direitos dos titulares.
    
12. Procedimentos para solicitações e reclamações.
    
13. Informações sobre cookies e tecnologias de rastreamento.
    
14. Data da última atualização.
    

A política deve corresponder ao funcionamento real do site. Não declarar que um dado não é coletado quando ele é efetivamente armazenado por alguma ferramenta ou fornecedor.

O texto deve ser claro, acessível e compreensível para pessoas sem conhecimento técnico.

---

## 7. Direitos dos titulares

O site deve oferecer um canal de contato para solicitações relacionadas aos dados pessoais.

Deve existir procedimento para atender, conforme aplicável, os direitos previstos na LGPD:

- Confirmação da existência de tratamento.
    
- Acesso aos dados.
    
- Correção de dados incompletos, inexatos ou desatualizados.
    
- Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados irregularmente.
    
- Portabilidade, observadas as regras aplicáveis.
    
- Eliminação de dados tratados com consentimento, ressalvadas as hipóteses legais de conservação.
    
- Informação sobre compartilhamento.
    
- Informação sobre a possibilidade de não fornecer consentimento e suas consequências.
    
- Revogação do consentimento, quando aplicável.
    
- Oposição ao tratamento nas hipóteses previstas em lei.
    

### 7.1. Fluxo de atendimento

O processo deverá:

1. Receber a solicitação por canal oficial.
    
2. Registrar a data, o tipo de solicitação e o protocolo.
    
3. Verificar a identidade do solicitante de maneira proporcional, sem coletar documentos desnecessários.
    
4. Identificar os sistemas e fornecedores envolvidos.
    
5. Avaliar a solicitação e as obrigações legais de conservação.
    
6. Executar a providência cabível.
    
7. Registrar a resposta e as ações realizadas.
    
8. Comunicar o resultado ao titular dentro dos prazos legais aplicáveis.
    

Não excluir automaticamente registros que precisem ser mantidos por obrigação legal, regulatória ou para exercício regular de direitos. Quando a exclusão integral não for possível, avaliar bloqueio, anonimização ou limitação de uso, conforme o caso.

---

## 8. WhatsApp, pedidos e solicitações de serviços

O WhatsApp será um dos principais canais de contato da Norte Tecnologia.

O sistema deve considerar que, ao clicar no botão de WhatsApp, o cliente poderá compartilhar informações pessoais e detalhes da solicitação com a empresa e com a plataforma WhatsApp.

Regras obrigatórias:

- Informar ao usuário que ele será direcionado ao WhatsApp.
    
- Enviar somente os dados necessários para identificar a solicitação.
    
- Não incluir dados sensíveis ou informações desnecessárias na mensagem.
    
- Não incluir dados secretos, credenciais ou informações internas.
    
- Não colocar dados pessoais em parâmetros de URL que possam ser expostos em histórico, registros ou ferramentas de análise.
    
- Não interpretar o simples redirecionamento como confirmação de pagamento ou conclusão de venda.
    
- Não enviar mensagens automáticas ou comunicações promocionais sem avaliar a base legal e as regras aplicáveis.
    
- Não utilizar o número do cliente para marketing sem autorização ou outra hipótese legal adequada.
    

Caso a solicitação seja registrada no banco de dados antes do redirecionamento, o registro deve conter apenas os dados necessários e possuir regras de acesso, retenção e exclusão.

---

## 9. Fornecedores e serviços externos

O projeto utiliza ou poderá utilizar:

- Supabase: banco de dados e autenticação.
    
- Cloudinary: armazenamento e entrega de imagens.
    
- Vercel: hospedagem e infraestrutura.
    
- WhatsApp: comunicação com clientes.
    
- Serviços de análise, monitoramento ou outros fornecedores que venham a ser adicionados.
    

Antes de ativar qualquer integração que trate dados pessoais:

1. Identificar quais dados serão enviados.
    
2. Verificar a finalidade do compartilhamento.
    
3. Avaliar os termos, a política de privacidade e as condições contratuais do fornecedor.
    
4. Verificar as medidas de segurança disponíveis.
    
5. Avaliar a localização e eventual transferência internacional de dados.
    
6. Verificar responsabilidades de controlador e operador, conforme a atuação real de cada parte.
    
7. Registrar a integração no inventário de tratamento.
    

Não presumir que a utilização de um fornecedor conhecido torna automaticamente o tratamento compatível com a LGPD.

### 9.1. Uso de inteligência artificial

Se alguma ferramenta de inteligência artificial for utilizada para processar informações de clientes, XMLs, pedidos ou solicitações:

- Não enviar dados pessoais desnecessários.
    
- Não enviar senhas, tokens, chaves, credenciais ou informações confidenciais.
    
- Avaliar as condições de tratamento e retenção do fornecedor.
    
- Não permitir que a IA tome decisões jurídicas ou comerciais definitivas sem validação humana.
    
- Não utilizar dados pessoais para treinamento ou outras finalidades sem base legal e transparência adequadas.
    

---

## 10. Segurança da informação

A segurança deve ser aplicada em todo o sistema, não somente no painel administrativo.

### 10.1. Controle de acesso

- O painel administrativo deve exigir autenticação.
    
- Não deve existir cadastro público de administradores.
    
- Aplicar autorização por função e menor privilégio.
    
- Separar permissões de administradores e operadores, quando houver.
    
- Proteger rotas, APIs, consultas e operações diretamente no servidor.
    
- Aplicar políticas de segurança no banco de dados, incluindo Row Level Security (RLS) no Supabase.
    
- Não confiar apenas na ocultação de botões ou páginas no frontend.
    
- Registrar operações administrativas relevantes.
    

### 10.2. Proteção de credenciais

- Nunca armazenar senhas em texto puro.
    
- Nunca inserir chaves privadas, tokens ou segredos no repositório.
    
- Utilizar variáveis de ambiente.
    
- Manter segredos exclusivamente no ambiente de servidor.
    
- Não expor a chave `service_role` do Supabase no navegador.
    
- Não expor o API Secret do Cloudinary no frontend.
    
- Não retornar credenciais em mensagens de erro.
    
- Aplicar rotação de credenciais quando necessário.
    

### 10.3. Proteção das APIs

- Validar todos os dados recebidos pelo servidor.
    
- Aplicar limites de requisições onde apropriado.
    
- Proteger contra SQL Injection, XSS, CSRF e outras vulnerabilidades pertinentes.
    
- Evitar exposição de informações internas.
    
- Validar permissões em cada operação sensível.
    
- Impedir acesso indevido a pedidos, dados de clientes e registros administrativos.
    
- Proteger operações de upload e importação de arquivos.
    
- Não confiar em valores, preços, quantidades ou permissões enviados pelo navegador.
    

### 10.4. Logs e monitoramento

- Registrar eventos relevantes de autenticação e administração.
    
- Registrar alterações de dados importantes.
    
- Evitar colocar senhas, tokens, dados financeiros ou conteúdo pessoal desnecessário nos logs.
    
- Restringir o acesso aos registros.
    
- Definir prazos de retenção.
    
- Não manter logs indefinidamente sem justificativa.
    

---

## 11. Incidentes e vazamentos de dados

Deve existir um procedimento de resposta a incidentes.

Quando houver suspeita de acesso indevido, vazamento, perda, alteração ou exposição de dados:

1. Registrar o incidente imediatamente.
    
2. Identificar os sistemas e dados potencialmente afetados.
    
3. Conter o problema e impedir novas exposições.
    
4. Preservar evidências e registros técnicos.
    
5. Avaliar os riscos e possíveis danos aos titulares.
    
6. Acionar os responsáveis técnicos e administrativos.
    
7. Avaliar a necessidade de comunicação à ANPD e aos titulares.
    
8. Realizar as comunicações exigidas nos prazos e condições definidos pela regulamentação aplicável.
    
9. Documentar as providências adotadas.
    
10. Corrigir a vulnerabilidade e revisar os controles.
    

Não ocultar incidentes, apagar evidências ou afirmar que não houve exposição sem investigação adequada.

---

## 12. Retenção, exclusão e backup

Cada categoria de dado deve possuir uma regra de retenção baseada na finalidade e nas obrigações legais.

- Não armazenar dados pessoais sem necessidade.
    
- Excluir ou anonimizar dados quando não houver mais finalidade ou obrigação de conservação.
    
- Preservar registros que precisem ser mantidos por obrigação legal ou exercício regular de direitos.
    
- Controlar o acesso aos backups.
    
- Proteger backups contra acesso indevido.
    
- Definir política de retenção e descarte.
    
- Considerar que dados excluídos do sistema principal também podem permanecer temporariamente em backups, conforme a política de ciclo de vida e as obrigações aplicáveis.
    

O recurso de backup administrativo não pode exportar senhas, tokens, chaves privadas ou segredos. Os arquivos de backup devem ser protegidos e acessíveis somente a pessoas autorizadas.

---

## 13. Comércio eletrônico e direitos do consumidor

A conformidade da Norte Tecnologia não se limita à LGPD. O site também deve respeitar as normas de comércio eletrônico e defesa do consumidor.

### 13.1. Identificação da empresa

Disponibilizar de forma clara e acessível as informações obrigatórias do fornecedor, incluindo, conforme aplicável:

- Razão social ou nome empresarial.
    
- CNPJ.
    
- Endereço físico e eletrônico.
    
- Informações de contato.
    
- Demais dados exigidos pela legislação.
    

Essas informações devem ser fornecidas e validadas pelo responsável da empresa. Nunca inventar ou preencher dados fictícios.

### 13.2. Produtos e serviços

- Informar características essenciais dos produtos.
    
- Apresentar preços e condições de pagamento de maneira clara.
    
- Informar disponibilidade de estoque sem induzir o consumidor ao erro.
    
- Descrever corretamente serviços, limitações e condições de atendimento.
    
- Não anunciar características, garantias ou resultados que não possam ser comprovados.
    
- Não utilizar avaliações falsas ou depoimentos fabricados.
    
- Não apresentar preços fictícios ou descontos enganosos.
    
- Informar quando o preço de um serviço depender de avaliação ou orçamento.
    

### 13.3. Atendimento, pedidos e WhatsApp

O site deve deixar claro como o consumidor pode entrar em contato com a empresa e obter informações sobre pedidos, serviços, reclamações e cancelamentos.

O encaminhamento para o WhatsApp não elimina as obrigações legais de atendimento e informação.

### 13.4. Pagamentos e direito de arrependimento

A versão inicial poderá encaminhar pedidos pelo WhatsApp, com pagamento na loja ou na entrega, conforme as opções efetivamente oferecidas.

Mesmo sem pagamento online, a empresa deve cumprir as obrigações legais relativas à oferta, contratação, cancelamento, devolução e direito de arrependimento, quando aplicáveis.

Não implementar regras que restrinjam direitos previstos em lei.

Antes de publicar políticas de troca, devolução, garantia, cancelamento, entrega ou prestação de serviços, solicitar validação do responsável da empresa e, quando necessário, de profissional jurídico.

---

## 14. Avaliações e comentários

O sistema de avaliações deve:

- Permitir comentários relacionados à experiência com produtos ou serviços.
    
- Permitir que o usuário escolha se deseja exibir seu nome publicamente.
    
- Não expor telefone, e-mail ou outros dados pessoais do avaliador.
    
- Oferecer mecanismo de denúncia ou contato para contestação.
    
- Possuir procedimento de moderação.
    
- Registrar ações administrativas de moderação.
    
- Evitar avaliações falsas, manipuladas ou publicadas em nome de terceiros.
    
- Não remover críticas legítimas apenas por serem negativas.
    

A moderação deve se basear em critérios objetivos, como spam, conteúdo ilegal, ameaças, discurso discriminatório, exposição indevida de dados pessoais e conteúdo claramente abusivo.

A política de publicação e moderação deve ser definida e informada aos usuários.

---

## 15. Publicidade, métricas e relatórios

As métricas do site devem respeitar a finalidade informada e a legislação aplicável.

- Coletar somente dados necessários para análise de desempenho.
    
- Preferir estatísticas agregadas ou anonimizadas.
    
- Não associar termos de pesquisa a clientes identificados sem necessidade e justificativa.
    
- Não utilizar dados de pedidos para publicidade sem avaliar a base legal.
    
- Não compartilhar informações de clientes com terceiros para fins incompatíveis com a finalidade original.
    
- Informar sobre ferramentas de análise e rastreamento utilizadas.
    

Cliques em WhatsApp devem ser registrados como cliques ou intenção de contato, nunca como venda confirmada.

---

## 16. Acessibilidade e transparência

O site deve buscar acessibilidade digital e comunicação compreensível.

- Formulários com identificação clara dos campos.
    
- Mensagens de erro compreensíveis.
    
- Navegação por teclado.
    
- Contraste adequado.
    
- Textos alternativos em imagens relevantes.
    
- Estrutura semântica.
    
- Compatibilidade com leitores de tela.
    
- Políticas e informações legais em linguagem acessível.
    

Não utilizar textos jurídicos para esconder limitações ou dificultar o entendimento dos direitos do consumidor.

---

## 17. Responsabilidades e governança

A empresa deve definir quem será responsável por:

- Aprovar a Política de Privacidade.
    
- Responder solicitações de titulares.
    
- Avaliar incidentes.
    
- Gerenciar acessos administrativos.
    
- Aprovar integrações com fornecedores.
    
- Revisar práticas de coleta e retenção.
    
- Manter documentos e políticas atualizados.
    

A empresa deve avaliar a necessidade de indicar um encarregado pelo tratamento de dados pessoais, considerando a LGPD e a regulamentação aplicável da ANPD. A eventual dispensa de indicação não elimina os deveres de transparência e atendimento aos titulares.

Manter registros das decisões, avaliações, incidentes, treinamentos e medidas de segurança.

---

## 18. Configurações administrativas

Quando aplicável, o painel administrativo deverá permitir gerenciar:

- Informações de contato para privacidade.
    
- Política de Privacidade publicada.
    
- Termos de Uso.
    
- Política de cookies.
    
- Informações legais da empresa.
    
- Preferências e categorias de cookies.
    
- Canal para solicitações de titulares.
    

Alterações em documentos legais devem ser registradas com data, responsável e versão.

O painel não deve permitir que um administrador publique automaticamente textos legais gerados por IA sem revisão e aprovação humana.

---

## 19. Checklist obrigatório antes da publicação

O site não deve ser considerado pronto para produção enquanto os pontos aplicáveis abaixo não forem verificados:

- Identificação real da empresa publicada.
    
- Política de Privacidade revisada e aprovada.
    
- Termos de Uso revisados e aprovados.
    
- Política de cookies e mecanismo de preferências implementados, quando aplicáveis.
    
- Canal para solicitações de titulares disponível.
    
- Inventário de dados e finalidades documentado.
    
- Bases legais avaliadas.
    
- Fornecedores e compartilhamentos identificados.
    
- Prazos de retenção definidos.
    
- Controle de acesso administrativo testado.
    
- Políticas RLS verificadas.
    
- Segredos protegidos no servidor.
    
- Formulários e APIs validados.
    
- Logs sem exposição desnecessária de dados pessoais.
    
- Procedimento de incidentes definido.
    
- Regras de atendimento, cancelamento, troca, devolução e garantia revisadas.
    
- Informações de produtos e serviços verificadas.
    
- Avaliações e comentários com regras de moderação.
    
- Integrações de terceiros avaliadas.
    
- Backup e restauração protegidos.
    
- Revisão jurídica das políticas e práticas realizada quando necessária.
    

---

## 20. Instruções obrigatórias ao Claude Code

1. Consultar este documento antes de desenvolver qualquer funcionalidade que envolva dados pessoais, clientes, pedidos, avaliações, rastreamento ou integrações.
    
2. Consultar também `seguranca.md`, `integracoes.md`, `regras-de-negocio.md` e os demais contextos relacionados.
    
3. Aplicar privacidade desde a concepção da funcionalidade.
    
4. Não coletar dados sem finalidade definida.
    
5. Não inventar bases legais, consentimentos ou declarações de conformidade.
    
6. Não criar textos jurídicos fictícios ou afirmar que a empresa está legalmente regular sem validação.
    
7. Identificar e documentar pendências que dependam do responsável da empresa ou de advogado.
    
8. Não publicar políticas legais sem aprovação humana.
    
9. Não implementar rastreamento ou compartilhamento de dados sem avaliação prévia.
    
10. Registrar no `Contextos/diario.md` alterações relevantes e pendências relacionadas à privacidade e conformidade.
    

**Regra final:** em caso de dúvida sobre a legalidade de uma funcionalidade, não presumir que ela é permitida. Documentar a dúvida, explicar o risco e solicitar validação antes de implementar ou publicar.

---

## Referências oficiais

- LGPD — Lei nº 13.709/2018: [https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
    
- Código de Defesa do Consumidor — Lei nº 8.078/1990: [https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm)
    
- Decreto nº 7.962/2013 — Comércio eletrônico: [https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm)
    
- Marco Civil da Internet — Lei nº 12.965/2014: [https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm)
    
- ANPD: [https://www.gov.br/anpd/](https://www.gov.br/anpd/)