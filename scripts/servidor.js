// Servidor local mínimo para abrir a página no navegador (sem dependências).
// Navegadores bloqueiam módulos JavaScript abertos direto do disco (file://),
// por isso a página precisa ser servida por HTTP.
//
// Uso (na pasta do projeto):  node scripts/servidor.js         -> serve o projeto
//                             node scripts/servidor.js dist    -> serve o build

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const raizProjeto = join(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = join(raizProjeto, process.argv[2] ?? '.');
const host = '127.0.0.1';
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const servidor = createServer(async (req, res) => {
  const caminhoUrl = decodeURIComponent(new URL(req.url, `http://${host}`).pathname);
  const arquivo = normalize(join(pasta, caminhoUrl === '/' ? 'index.html' : caminhoUrl));

  if (!arquivo.startsWith(pasta + sep) && arquivo !== pasta) {
    res.writeHead(403).end('Acesso negado');
    return;
  }

  try {
    const conteudo = await readFile(arquivo);
    res.writeHead(200, { 'Content-Type': tipos[extname(arquivo)] ?? 'application/octet-stream' });
    res.end(conteudo);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Arquivo não encontrado');
  }
});

function iniciar(porta, tentativas = 5) {
  servidor.once('error', (erro) => {
    if (erro.code === 'EADDRINUSE' && tentativas > 1) {
      iniciar(porta + 1, tentativas - 1);
    } else {
      console.error(`Não foi possível iniciar o servidor: ${erro.message}`);
      process.exitCode = 1;
    }
  });
  servidor.listen(porta, host, () => {
    console.log(`Página disponível em http://${host}:${porta}`);
    console.log('Para encerrar, pressione Ctrl+C.');
  });
}

iniciar(Number(process.env.PORT) || 3000);
