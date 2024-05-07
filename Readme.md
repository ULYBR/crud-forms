

## Instruções para Execução da Aplicação:

### Requisitos:

1. **Node.js e npm**:
   - Certifique-se de ter o Node.js e o npm instalados em sua máquina. Você pode baixá-los e instalá-los a partir do [site oficial do Node.js](https://nodejs.org/).

### Configuração Inicial:

1. **Download e Descompactação**:
   - Baixe o arquivo da aplicação e descompacte-o em um diretório de sua escolha.

2. **Instalação de Dependências**:
   - Abra o terminal e navegue até o diretório onde a aplicação foi descompactada.
   - Execute o seguinte comando para instalar todas as dependências necessárias:
     ```
     npm install
     ```

### Configuração do Banco de Dados:

1. **String de Conexão**:
   - Abra o arquivo `src/db.ts`.
   - Dentro deste arquivo, localize a variável `databaseUrl` e defina a string de conexão do seu banco de dados NoSQL MongoDB.

### Execução da Aplicação:

1. **Ambiente de Desenvolvimento**:
   - Após configurar a string de conexão do banco de dados, execute o seguinte comando para iniciar a aplicação em modo de desenvolvimento:
     ```
     npm run dev
     ```

2. **Acesso à Aplicação**:
   - Com a aplicação em execução, você poderá acessá-la em seu navegador digitando o seguinte endereço:
     ```
     http://localhost:3000
     ```

### Rotas Mapeadas:

- **POST /pessoa**:
  - Cria uma nova pessoa no banco de dados.
  - Aceita um objeto JSON no corpo da requisição com os seguintes campos:
    - `email` (String): O email da pessoa (deve ser único).
    - `nome` (String): O nome da pessoa.
    - `idade` (Number): A idade da pessoa.
    - `endereco` (Object): Um objeto contendo os campos `rua`, `cidade` e `estado`.
  - Retorna o objeto JSON da pessoa recém-criada ou uma mensagem de erro em caso de falha.

- **GET /pessoa/:id**:
  - Busca uma pessoa no banco de dados pelo ID.
  - Retorna o objeto JSON da pessoa encontrada ou uma mensagem de erro em caso de falha.

- **GET /pessoa**:
  - Retorna uma lista paginada de pessoas do banco de dados.
  - Aceita parâmetros de consulta opcionais: `page` (Número da Página) e `pageSize` (Tamanho da Página).
  - Retorna um array de objetos JSON das pessoas encontradas ou uma mensagem de erro em caso de falha.

- **DELETE /pessoa/:id**:
  - Deleta uma pessoa do banco de dados pelo ID.
  - Retorna uma mensagem de sucesso ou uma mensagem de erro em caso de falha.

- **PUT /pessoa/:id**:
  - Atualiza uma pessoa no banco de dados pelo ID.
  - Aceita um objeto JSON no corpo da requisição com os campos que deseja atualizar.
  - Retorna o objeto JSON atualizado da pessoa ou uma mensagem de erro em caso de falha.

