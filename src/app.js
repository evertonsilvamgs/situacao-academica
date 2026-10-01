// Interface da página: lê o formulário e mostra o resultado.
// As regras ficam em notas.js, que é o arquivo testado automaticamente.

import { calcularMedia, situacaoFinal } from './notas.js';

const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const campoMedia = document.querySelector('#media');
const campoSituacao = document.querySelector('#situacao');
const campoErro = document.querySelector('#erro');

function classeDaSituacao(situacao) {
  if (situacao === 'Aprovado') return 'aprovado';
  if (situacao === 'Recuperação') return 'recuperacao';
  return 'reprovado';
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const notas = [
    Number(document.querySelector('#nota1').value),
    Number(document.querySelector('#nota2').value),
  ];
  const frequencia = Number(document.querySelector('#frequencia').value);

  try {
    const media = calcularMedia(notas);
    const situacao = situacaoFinal(notas, frequencia);

    campoMedia.textContent = media.toFixed(1);
    campoSituacao.textContent = situacao;
    campoSituacao.className = classeDaSituacao(situacao);
    resultado.hidden = false;
    campoErro.hidden = true;
  } catch (erro) {
    campoErro.textContent = `Atenção: ${erro.message}`;
    campoErro.hidden = false;
    resultado.hidden = true;
  }
});
