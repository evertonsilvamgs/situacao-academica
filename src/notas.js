// Regras acadêmicas usadas na oficina.
// São regras simplificadas, criadas apenas para fins didáticos.

export const NOTA_MINIMA = 0;
export const NOTA_MAXIMA = 10;
export const MEDIA_APROVACAO = 7;
export const MEDIA_RECUPERACAO = 4;
export const FREQUENCIA_MINIMA = 75; // em porcentagem (%)

/**
 * Calcula a média aritmética de uma lista de notas (0 a 10).
 */
export function calcularMedia(notas) {
  if (!Array.isArray(notas) || notas.length === 0) {
    throw new TypeError('Informe ao menos uma nota.');
  }

  for (const nota of notas) {
    if (typeof nota !== 'number' || Number.isNaN(nota) || nota < NOTA_MINIMA || nota > NOTA_MAXIMA) {
      throw new RangeError(`Nota inválida: ${nota}. Use valores de 0 a 10.`);
    }
  }

  const soma = notas.reduce((total, nota) => total + nota, 0);
  return soma / notas.length;
}

/**
 * Situação do aluno considerando apenas a média.
 */
export function situacaoPorMedia(media) {
  if (media >= MEDIA_APROVACAO) return 'Aprovado';
  if (media >= MEDIA_RECUPERACAO) return 'Recuperação';
  return 'Reprovado';
}

/**
 * TAREFA DA OFICINA (ainda não implementada)
 *
 * Situação final do aluno considerando notas E frequência:
 *  - frequência fora do intervalo de 0 a 100 deve gerar um RangeError;
 *  - frequência menor que 75% resulta em "Reprovado por falta",
 *    independentemente da média;
 *  - caso contrário, vale a situação pela média.
 */
export function situacaoFinal(notas, frequencia) {
  if (frequencia < 0 || frequencia > 100) {
    throw new RangeError('A frequência deve estar entre 0 e 100.');
  }

  // Alunos abaixo da frequência mínima são reprovados por falta.
  if (frequencia < FREQUENCIA_MINIMA) {
    return 'Reprovado por falta';
  }

  const media = calcularMedia(notas);
  return situacaoPorMedia(media);
}
