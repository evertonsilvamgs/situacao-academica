// Verifica se esta máquina está pronta para a oficina.
// Uso (na pasta do projeto):  node scripts/verificar-ambiente.js
//
// Resultado esperado em uma máquina preparada: todas as linhas com [OK].

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const resultados = [];

function registrar(ok, item, detalhe) {
  resultados.push({ ok, item, detalhe });
  console.log(`${ok ? '[OK]    ' : '[FALHOU]'} ${item}${detalhe ? ` — ${detalhe}` : ''}`);
}

function git(...args) {
  const r = spawnSync('git', args, { cwd: raiz, encoding: 'utf8' });
  return { ok: r.status === 0, saida: (r.stdout ?? '').trim(), erro: (r.stderr ?? '').trim() || r.error?.message };
}

function nodeTest(arquivo) {
  return spawnSync(process.execPath, ['--test', arquivo], { cwd: raiz, encoding: 'utf8' }).status === 0;
}

function portaLivre(porta) {
  return new Promise((resolve) => {
    const s = createServer();
    s.once('error', () => resolve(false));
    s.listen(porta, '127.0.0.1', () => s.close(() => resolve(true)));
  });
}

console.log('\n=== Verificação do ambiente da oficina ===\n');

// 1. Node.js
const maior = Number(process.versions.node.split('.')[0]);
registrar(maior >= 20, 'Node.js 20 ou superior', `versão ${process.version}${maior < 22 ? ' (recomendado: LTS atual)' : ''}`);

// 2. Git
const versaoGit = git('--version');
registrar(versaoGit.ok, 'Git instalado', versaoGit.ok ? versaoGit.saida : 'comando "git" não encontrado no PATH');

// 3. Arquivos do projeto
const essenciais = ['package.json', 'index.html', 'src/notas.js', 'tests/media.test.js', 'tests/frequencia.test.js', 'scripts/pipeline.js', 'atividade/TAREFA.md', 'atividade/sugestao-ia.js'];
const faltando = essenciais.filter((f) => !existsSync(join(raiz, f)));
registrar(faltando.length === 0, 'Arquivos do projeto presentes', faltando.length ? `faltando: ${faltando.join(', ')}` : `${essenciais.length} arquivos`);

// 4. Repositório Git preparado
if (versaoGit.ok) {
  const repo = git('rev-parse', '--is-inside-work-tree');
  registrar(repo.ok && repo.saida === 'true', 'Pasta é um repositório Git', repo.ok ? '' : repo.erro);

  const nome = git('config', 'user.name');
  const email = git('config', 'user.email');
  registrar(nome.ok && email.ok, 'Identidade do Git configurada', nome.ok ? `${nome.saida} <${email.saida}>` : 'execute o script de preparação');

  const tag = git('rev-parse', '--verify', '--quiet', 'inicio');
  registrar(tag.ok, 'Marcação "inicio" existe (para restauração)', tag.ok ? tag.saida.slice(0, 7) : 'tag ausente');

  const limpo = git('status', '--porcelain');
  registrar(limpo.ok && limpo.saida === '', 'Nenhuma alteração pendente', limpo.saida ? 'há arquivos modificados: restaure o estado inicial' : '');

  const head = git('rev-parse', 'HEAD');
  registrar(tag.ok && head.ok && head.saida === tag.saida, 'Projeto está no estado inicial', head.saida === tag.saida ? '' : 'HEAD diferente da tag "inicio"');
}

// 5. Testes no estado esperado para o início da atividade
registrar(nodeTest('tests/media.test.js'), 'Testes existentes passam (media.test.js)');
registrar(!nodeTest('tests/frequencia.test.js'), 'Testes do novo requisito falham, como esperado no início', 'eles passarão após a atividade');

// 6. Porta do servidor local
registrar(await portaLivre(3000), 'Porta 3000 livre para a página local', 'se ocupada, o servidor tenta 3001–3004');

const falhas = resultados.filter((r) => !r.ok).length;
console.log(falhas === 0
  ? '\nMÁQUINA PRONTA para a oficina.\n'
  : `\nATENÇÃO: ${falhas} item(ns) com problema. Consulte o plano de contingência.\n`);
process.exitCode = falhas === 0 ? 0 : 1;
