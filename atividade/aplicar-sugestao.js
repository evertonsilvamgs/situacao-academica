// Atalho para quem travou na edição: copia a função de atividade/sugestao-ia.js
// para dentro de src/notas.js, substituindo a versão "ainda não implementada".
//
// Uso (na pasta do projeto):  node atividade/aplicar-sugestao.js

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const arquivoNotas = join(raiz, 'src', 'notas.js');

const notas = readFileSync(arquivoNotas, 'utf8');
const sugestao = readFileSync(join(raiz, 'atividade', 'sugestao-ia.js'), 'utf8');

const funcaoSugerida = sugestao.slice(sugestao.indexOf('export function situacaoFinal')).trim();
const stub = /export function situacaoFinal\(notas, frequencia\) \{\r?\n\s*throw new Error\('Regra de frequência ainda não implementada\.'\);\r?\n\}/;

if (!stub.test(notas)) {
  console.log('A função situacaoFinal em src/notas.js já foi alterada. Nada foi modificado.');
  console.log('Para voltar ao início, peça ajuda ao apresentador.');
  process.exitCode = 1;
} else {
  writeFileSync(arquivoNotas, notas.replace(stub, funcaoSugerida));
  console.log('Sugestão aplicada em src/notas.js.');
  console.log('Agora revise o código e rode os testes:  node --test');
}
