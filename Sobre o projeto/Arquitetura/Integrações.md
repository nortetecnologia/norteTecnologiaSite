

Este documento define os serviços externos utilizados pelo sistema Norte Tecnologia, suas responsabilidades e regras de integração.

## 1. WhatsApp

**Status:** Ativo na primeira versão.

O WhatsApp será o principal meio de comunicação entre a loja e os clientes, sendo utilizado para dar continuidade às solicitações de compra de produtos e contratação de serviços.

- O número oficial do WhatsApp deverá ser configurável pelo painel administrativo.
    
- O sistema deverá utilizar o número configurado para gerar os links de direcionamento ao WhatsApp.
    
- As mensagens deverão ser preenchidas automaticamente com as informações selecionadas pelo cliente durante o processo de compra ou solicitação de serviço.
    
- A alteração do número deverá ser refletida automaticamente em todos os pontos do site que utilizam o WhatsApp.
    

## 2. Supabase

**Status:** Ativo na primeira versão.

O Supabase será utilizado como serviço de banco de dados e autenticação do sistema.

### Banco de dados

Será utilizado o PostgreSQL disponibilizado pelo Supabase para armazenar e gerenciar os dados da aplicação, incluindo:

- Produtos e serviços.
    
- Categorias e subcategorias.
    
- Estoque.
    
- Pedidos e solicitações.
    
- Vitrines.
    
- Configurações da loja.
    
- Informações necessárias ao painel administrativo.
    

### Autenticação administrativa

O Supabase Auth será responsável pela autenticação dos usuários do painel administrativo.

- Os usuários administrativos deverão acessar o sistema utilizando e-mail e senha.
    
- A autenticação e a verificação das credenciais serão realizadas pelo Supabase.
    
- O acesso às funcionalidades administrativas deverá ser restrito a usuários devidamente autenticados e autorizados.
    
- As permissões deverão ser verificadas também no servidor e nas políticas de segurança do banco de dados, não apenas na interface.
    

## 3. Vercel

**Status:** Ativo na primeira versão.

A Vercel será utilizada para hospedagem e publicação da aplicação.

Responsabilidades:

- Hospedar a aplicação Next.js.
    
- Gerenciar os ambientes de desenvolvimento e produção.
    
- Realizar deploys a partir do repositório GitHub, conforme as configurações do projeto.
    
- Gerenciar as variáveis de ambiente necessárias à aplicação.
    
- Hospedar o domínio oficial da loja: `nortetecnologia.com`.
    

### Variáveis de ambiente

As credenciais necessárias para as integrações deverão ser configuradas nas variáveis de ambiente da Vercel.

As chaves privadas não poderão ser expostas no frontend, incluídas no repositório ou disponibilizadas publicamente.

## 4. Cloudinary

**Status:** Ativo na primeira versão.

O Cloudinary será utilizado para armazenamento, gerenciamento e disponibilização das imagens utilizadas no site.

As imagens poderão ser cadastradas pelo painel administrativo de duas maneiras:

- **Por link:** o administrador informa a URL de uma imagem já hospedada externamente.
    
- **Por upload:** o administrador seleciona uma imagem do dispositivo. O sistema deverá enviá-la automaticamente ao Cloudinary, sem exigir etapas manuais adicionais.
    

### Upload de imagens

- O upload deverá ser realizado automaticamente após a seleção do arquivo pelo administrador.
    
- A aplicação deverá enviar a imagem ao Cloudinary por meio de uma integração segura.
    
- Após o envio bem-sucedido, a URL retornada pelo Cloudinary deverá ser utilizada no cadastro ou na edição correspondente.
    
- O sistema deverá apresentar estados de carregamento, sucesso e erro durante o processo.
    
- Caso o upload falhe, o administrador deverá receber uma mensagem informando o problema.
    
- As imagens deverão ser armazenadas no Cloudinary, evitando armazená-las diretamente no banco de dados.
    
- O banco de dados deverá guardar as URLs e, quando necessário, os identificadores públicos dos arquivos no Cloudinary.
    

### Credenciais e segurança

A integração deverá utilizar as credenciais fornecidas pelo Cloudinary, configuradas nas variáveis de ambiente da Vercel.

As credenciais deverão ser protegidas, respeitando as seguintes regras:

- A API Secret do Cloudinary nunca poderá ser exposta no frontend.
    
- Operações que necessitem de credenciais privilegiadas deverão ser realizadas no servidor.
    
- As chaves não poderão ser armazenadas diretamente no código-fonte ou no repositório GitHub.
    

### Pré-visualização de imagens

O painel administrativo deverá oferecer pré-visualização em tempo real das imagens antes de finalizar o cadastro ou a edição.

A pré-visualização deverá permitir visualizar como a imagem ficará nos componentes correspondentes do site, especialmente:

- Página de detalhes do produto.
    
- Cards de produtos.
    
- Vitrines da página inicial.
    

A pré-visualização deverá considerar as dimensões, proporções, cortes e comportamentos visuais utilizados no site.

Ao informar uma URL ou selecionar um arquivo para upload, o administrador deverá conseguir visualizar o resultado antes de salvar definitivamente as alterações do cadastro.

## 5. Configurações e informações da loja

**Origem:** Painel administrativo e banco de dados Supabase.

As informações institucionais e de contato deverão ser gerenciadas pelo painel administrativo, sem necessidade de alterações diretamente no código-fonte.

Informações configuráveis:

- Número oficial do WhatsApp.
    
- E-mail de contato.
    
- Informações institucionais da empresa.
    
- Endereço e informações de localização.
    
- Demais informações exibidas no rodapé (footer) do site.
    

As informações deverão ser armazenadas no banco de dados e carregadas dinamicamente pela aplicação.

Alterações realizadas no painel administrativo deverão ser refletidas nos componentes correspondentes do site, incluindo cabeçalho, rodapé e áreas de contato, conforme aplicável.

## 6. Integrações futuras

**Status:** Não implementadas.

A arquitetura deverá permitir a adição de novas integrações sem exigir grandes alterações na estrutura existente.

Possíveis integrações futuras:

- Gateways de pagamento online.
    
- APIs de frete e cálculo de entrega.
    
- Serviços de envio de e-mail.
    
- Outras integrações necessárias à operação da loja.
    

Nenhuma integração futura deverá ser implementada sem definição e autorização.