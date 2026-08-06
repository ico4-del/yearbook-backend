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

export async function listarAlunos(req, res, next) { // adicione next aos parâmetros
    try {
        const alunos = await prisma.aluno.findMany({
            select: selectSemSenha,
        });
        res.json(alunos);
    } catch (erro) {
        next(erro); // passa o erro para o middleware global
    }
}

export async function buscarAluno(req, res, next) {
    try {
        const { id } = req.params;

        const aluno = await prisma.aluno.findUnique({
            where: { id: Number(id) },
            select: selectSemSenha
        });

        if (!aluno) {
            return res.status(404).json({ erro: 'Aluno não encontrado' });
        }

        res.json(aluno);
    } catch (erro) {
        next(erro);
    }
}

// --- Stubs para o desafio do aluno ---

// 🎯 POST /alunos — cria um novo aluno
// Dica: use prisma.aluno.create({ data: { ... }, select: selectSemSenha })
// Dica: os dados do aluno vêm de req.body (nome, email, senhaHash, cidade, frase, planosFuturos)
// Dica: retorne status 201 com o aluno criado
export async function criarAluno(req, res, next) {
    try {
        const novoAluno = await prisma.aluno.create({
            data: req.body,
            select: selectSemSenha,
        });

        return res.status(201).json(novoAluno);
    } catch (erro) {
        next(erro);
    }
}

// 🎯 PUT /alunos/:id — atualiza um aluno existente
export async function atualizarAluno(req, res, next) {
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
export async function deletarAluno(req, res, next) {
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