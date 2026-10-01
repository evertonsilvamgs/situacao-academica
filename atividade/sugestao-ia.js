// SUGESTÃO DE CÓDIGO PARA A TAREFA (preparada para a oficina)
//
// Use este arquivo se você não estiver usando uma ferramenta de IA agora.
// Ele representa o tipo de resposta que um assistente de IA costuma devolver
// para o pedido descrito em atividade/TAREFA.md.
//
// Como em qualquer código gerado por IA: LEIA e REVISE antes de confiar.
//
// Copie a função abaixo e substitua a função situacaoFinal que está em src/notas.js.
// (Atalho, se travar: node atividade/aplicar-sugestao.js)

export function situacaoFinal(notas, frequencia) {
  if (frequencia < 0 || frequencia > 100) {
    throw new RangeError('A frequência deve estar entre 0 e 100.');
  }

  // Alunos abaixo da frequência mínima são reprovados por falta.
  if (frequencia <= FREQUENCIA_MINIMA) {
    return 'Reprovado por falta';
  }

  const media = calcularMedia(notas);
  return situacaoPorMedia(media);
}
