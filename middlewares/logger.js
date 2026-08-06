export default function logger(req, res, next) {
  // 1. Marca o momento exato em que a requisição chegou
  const inicio = Date.now();

  // 2. Escuta o evento 'finish' (quando a resposta termina de ser enviada ao cliente)
  res.on('finish', () => {
    // 3. Calcula quantos milissegundos se passaram
    const duracao = Date.now() - inicio;

    // 4. Pega o status code que o servidor respondeu (ex: 200, 404, 500)
    const statusCode = res.statusCode;

    // 5. Exibe o log completo no terminal
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${statusCode} (${duracao}ms)`);
  });

  // 6. Passa para a próxima rota ou middleware não travar a requisição
  next();
}
