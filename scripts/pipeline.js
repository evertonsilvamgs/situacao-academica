// Pipeline local: executa, em ordem, as mesmas etapas que o GitHub Actions executa.
// Se uma etapa falhar, as seguintes não são executadas.
//
// Uso (na pasta do projeto):  node scripts/pipeline.js

import { spawnSync } from 'node:child_process';
import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const usarCores = process.stdout.isTTY && !process.env.NO_COLOR;
const cor = (codigo, texto) => (usarCores ? `\x1b[${codigo}m${texto}\x1b[0m` : texto);
const verde = (t) => cor('32', t);
const vermelho = (t) => cor('31', t);
const negrito = (t) => cor('1', t);

function arquivosJs(pasta) {
  const caminho = join(raiz, pasta);
  if (!existsSync(caminho)) return [];
  return readdirSync(caminho, { recursive: true })
    .filter((nome) => nome.endsWith('.js'))
    .map((nome) => join(caminho, nome));
}

function verificarSintaxe() {
  const arquivos = [...arquivosJs('src'), ...arquivosJs('tests'), ...arquivosJs('scripts')];
  for (const arquivo of arquivos) {
    const r = spawnSync(process.execPath, ['--check', arquivo], { encoding: 'utf8' });
    if (r.status !== 0) {
      console.log(r.stderr);
      throw new Error(`erro de sintaxe em ${relative(raiz, arquivo)}`);
    }
  }
  return `${arquivos.length} arquivos verificados`;
}

function rodarTestes() {
  const r = spawnSync(process.execPath, ['--test'], { cwd: raiz, stdio: 'inherit' });
  if (r.status !== 0) throw new Error('há testes falhando (veja os detalhes acima)');
  return 'todos os testes passaram';
}

function versaoDoBuild() {
  let commit = process.env.GITHUB_SHA;
  if (!commit) {
    const r = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: raiz, encoding: 'utf8' });
    commit = r.status === 0 ? r.stdout.trim() : 'sem-commit';
  }
  const data = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  return `build de ${data} · commit ${commit.slice(0, 7)}`;
}

function gerarBuild() {
  const dist = join(raiz, 'dist');
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(dist);
  cpSync(join(raiz, 'src'), join(dist, 'src'), { recursive: true });
  cpSync(join(raiz, 'style.css'), join(dist, 'style.css'));

  const versao = versaoDoBuild();
  const html = readFileSync(join(raiz, 'index.html'), 'utf8').replace('versão local (sem build)', versao);
  writeFileSync(join(dist, 'index.html'), html);
  return `site gerado em dist/ (${versao})`;
}

const etapas = [
  { nome: 'Verificar sintaxe', executar: verificarSintaxe },
  { nome: 'Testes automatizados', executar: rodarTestes },
  { nome: 'Gerar build (dist/)', executar: gerarBuild },
];

const resumo = [];
console.log(negrito('\n=== PIPELINE: Situação Acadêmica ===\n'));

let falhou = false;
for (const [indice, etapa] of etapas.entries()) {
  const titulo = `Etapa ${indice + 1}/${etapas.length}: ${etapa.nome}`;
  console.log(negrito(`>> ${titulo}`));
  const inicio = Date.now();
  try {
    const detalhe = etapa.executar();
    const segundos = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(verde(`[OK] ${etapa.nome} — ${detalhe} (${segundos}s)\n`));
    resumo.push(`| ${etapa.nome} | ✅ aprovada | ${detalhe} |`);
  } catch (erro) {
    console.log(vermelho(`[FALHOU] ${etapa.nome} — ${erro.message}\n`));
    resumo.push(`| ${etapa.nome} | ❌ falhou | ${erro.message} |`);
    falhou = true;
    break;
  }
}

if (falhou) {
  console.log(vermelho(negrito('PIPELINE REPROVADO: corrija o problema e execute novamente.\n')));
} else {
  console.log(verde(negrito('PIPELINE APROVADO: o código está pronto para ser entregue.\n')));
}

// No GitHub Actions, escreve um resumo que aparece na página da execução.
if (process.env.GITHUB_STEP_SUMMARY) {
  const tabela = ['## Resultado do pipeline', '', '| Etapa | Situação | Detalhe |', '|---|---|---|', ...resumo, ''];
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, tabela.join('\n'));
}

process.exitCode = falhou ? 1 : 0;
