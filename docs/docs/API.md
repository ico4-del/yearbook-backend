# API do Yearbook — Documentação de Endpoints

    Base URL (produção): `https://yearbook-backend.vercel.app`

    ## Convenções

    - Todas as respostas são em JSON
    - Rotas protegidas exigem header `Authorization: Bearer <token>`
    - O campo `senhaHash` nunca é retornado em nenhuma resposta
    - Erros seguem o formato `{ "erro": "mensagem descritiva" }`

    ## Auth

    ### POST /auth/register

    Cria uma nova conta de aluno.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "senha": "minhasenha123",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG"
    }
    ```

    - **Resposta de sucesso:** `201 Created`

    ```json
    {
      "id": 1,
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG",
      "fotoUrl": null,
      "role": "USER",
      "criadoEm": "2026-04-03T10:30:00.000Z"
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes
      - `409` — Email já cadastrado

      ### POST /auth/login

    Autentica um aluno e retorna um token JWT.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "email": "maria@email.com",
      "senha": "minhasenha123"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

    - **Erros:**
      - `401` — Credenciais inválidas (email não existe ou senha incorreta)

    ## Alunos

    ### GET /alunos
    Retorna a lista de todos os alunos cadastrados.

    - **Autenticação:** Não
    - **Body:** Nenhum
    - **Resposta de sucesso:** `200 OK`
    ```json
    [
    {
        "id": 1,
        "nome": "Isabelle Cardoso",
        "email": "bell@email.com",
        "cidade": "Taiobeiras",
        "frase": "Stray Kids Everywhere All Around The World",
        "planosFuturos": "Cursar alguma coisa na UFMG",
        "fotoUrl": null,
        "role": "USER",
        "criadoEm": "2026-05-12T10:30:00.000Z"
    }
    ]
    ```

    ### GET /alunos/:id
    Busca os detalhes de um aluno específico pelo ID.

    - **Autenticação:** Não
    - **Resposta de sucesso:** `200 OK` (Objeto único do aluno)
    - **Erros:** 
    - `404 Not Found` — Aluno não encontrado.

    ### PUT /alunos/:id
    Atualiza as informações do perfil do aluno autenticado.

    - **Autenticação:** Bearer token
    - **Body (campos opcionais):**
    ```json
    {
    "nome": "Raquel Abóbora",
    "cidade": "Lagoa Seca",
    "frase": "You Make Stray Kids STAY",
    "planosFuturos": "Estudar letras na USP",
    "fotoUrl": "https://imgur.com"
    }
    ```
    - **Erros:** 
    - `401 Unauthorized` — Token ausente ou inválido.
    - `403 Forbidden` — Tentativa de editar o perfil de outro usuário.

    ### DELETE /alunos/:id
    Remove um aluno da base de dados.

    - **Autenticação:** Bearer token (Admin)
    - **Resposta de sucesso:** `204 No Content`
    - **Erros:** 
    - `403 Forbidden` — Acesso restrito a administradores.

    ---

    ## Mensagens

    ### GET /mensagens
    Retorna o mural de mensagens com os dados de seus autores.

    - **Autenticação:** Não
    - **Resposta de sucesso:** `200 OK`
    ```json
    [
    {
        "id": 10,
        "texto": "Parabéns!",
        "imagemUrl": null,
        "autorId": 1,
        "criadoEm": "2026-05-12T11:00:00.000Z",
        "autor": {
        "id": 1,
        "nome": "Isabelle Cardoso",
        "fotoUrl": null
        }
    }
    ]
    ```

    ### POST /mensagens
    Publica uma nova mensagem no mural.

    - **Autenticação:** Bearer token
    - **Body:**
    ```json
    {
    "texto": "Stray Kids everywhere all around the world!",
    "imagemUrl": "https://link.com"
    }
    ```
    - **Resposta de sucesso:** `201 Created`
    - **Atenção:** O `autorId` é vinculado automaticamente via token JWT.

    ### DELETE /mensagens/:id
    Remove uma mensagem específica do mural.

    - **Autenticação:** Bearer token
    - **Erros:** 
    - `403 Forbidden` — Somente o autor da mensagem ou um administrador pode realizar esta ação.