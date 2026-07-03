import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// select que omite senhaHash — reutilizado em todas as queries de alunos
const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
  // senhaHash NÃO está aqui — nunca retornado pela API
};

// GET /alunos — lista todos os alunos
export async function listarAlunos(req, res) {
  const alunos = await prisma.aluno.findMany({
    select: selectSemSenha, // retorna todos os campos EXCETO senhaHash
  });
  res.json(alunos); // responde com o array de alunos em JSON
}

// GET /alunos/:id — busca um aluno pelo ID
export async function buscarAluno(req, res) {
  const { id } = req.params; // extrai o :id da URL
  const aluno = await prisma.aluno.findUnique({
    where: { id: Number(id) }, // converte string → number
    select: selectSemSenha,    // omite senhaHash
  });

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' }); // null → 404
  }

  res.json(aluno); // retorna o aluno encontrado
}

// --- Stubs para o desafio do aluno ---

// 🎯 POST /alunos — cria um novo aluno
// Dica: use prisma.aluno.create({ data: { ... }, select: selectSemSenha })
// Dica: os dados do aluno vêm de req.body (nome, email, senhaHash, cidade, frase, planosFuturos)
// Dica: retorne status 201 com o aluno criado
export async function criarAluno(req, res) {
  try {
    // 1. Desestruturar os dados recebidos no corpo da requisição
    const { nome, email, senhaHash, cidade, frase, planosFuturos } = req.body;

    // 2. Criar o aluno no banco de dados utilizando o Prisma
    const novoAluno = await prisma.aluno.create({
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos,
      },
      // Garante que a senha ou dados sensíveis não retornem na resposta
      select: selectSemSenha, 
    });

    // 3. Retornar o status 201 (Created) com o objeto do aluno criado
    return res.status(201).json(novoAluno);

  } catch (error) {
    // Tratamento de erro básico para evitar que a aplicação trave
    console.error("Erro ao criar aluno:", error);
    return res.status(500).json({ error: "Erro interno ao criar o aluno." });
  }
}

// 🎯 PUT /alunos/:id — atualiza um aluno existente
export async function atualizarAluno(req, res) {
  // 1. Extraia o id de req.params
  const { id } = req.params;

  // 2. Extraia os dados de req.body
  const dados = req.body;

  // 3. Use try/catch:
  try {
    // - No try: prisma.aluno.update() e retorne o aluno atualizado
    const alunoAtualizado = await prisma.aluno.update({
      where: { id: Number(id) },
      data: dados,
      select: selectSemSenha
    });

    return res.status(200).json(alunoAtualizado);
  } catch (error) {
    // - No catch: retorne status 404 com { erro: 'Aluno não encontrado' }
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}

// 🎯 DELETE /alunos/:id — deleta um aluno
export async function deletarAluno(req, res) {
  // 1. Extraia o id de req.params
  const { id } = req.params;

  // 2. Use try/catch:
  try {
    // - No try: prisma.aluno.delete() e retorne res.status(204).end()
    await prisma.aluno.delete({
      where: { id: Number(id) }
    });

    return res.status(204).end();
  } catch (error) {
    // - No catch: retorne status 404 com { erro: 'Aluno não encontrado' }
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}