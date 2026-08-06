import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// GET /mensagens — lista todas as mensagens (mais recentes primeiro, com dados do autor)
export async function listarMensagens(req, res, next) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      orderBy: { criadoEm: 'desc' },  // mais recente primeiro
      include: {
        autor: {                      // traz dados do autor junto
          select: {
            nome: true,               // nome do autor
            fotoUrl: true,            // foto do autor
          },
        },
      },
    });

    res.json(mensagens); // retorna a lista com autor embutido
  } catch (erro) {
    next(erro);
  }
}


// --- Stubs para o desafio do aluno ---


// 🎯 POST /mensagens — cria uma nova mensagem
// Siga o mesmo padrão do criarAluno
// Valide que texto não está vazio (400 se faltar)
export async function criarMensagem(req, res, next) {
  try {
    const { texto, imagemUrl, autorId } = req.body;

    if (!texto) {
      return res.status(400).json({ erro: 'O campo texto é obrigatório' });
    }

    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,
        autorId: Number(autorId)
      }
    });

    return res.status(201).json(novaMensagem);
  } catch (erro) {
    next(erro);
  }
}


// 🎯 DELETE /mensagens/:id — deleta uma mensagem
export async function deletarMensagem(req, res, next) {
  const { id } = req.params;

  try {
    await prisma.mensagem.delete({
      where: { id: Number(id) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ erro: 'Mensagem não encontrada' });
  }
}
