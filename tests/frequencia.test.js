// Testes do NOVO requisito: reprovação por frequência.
// Eles foram escritos antes da implementação e descrevem o comportamento esperado.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { situacaoFinal } from '../src/notas.js';

describe('Situação final com frequência', () => {
  test('frequência de 60% reprova por falta, mesmo com média 9', () => {
    assert.equal(situacaoFinal([9, 9], 60), 'Reprovado por falta');
  });

  test('frequência de exatamente 75% NÃO reprova por falta (limite mínimo)', () => {
    assert.equal(situacaoFinal([8, 8], 75), 'Aprovado');
  });

  test('frequência de 90% com média 5 resulta em Recuperação', () => {
    assert.equal(situacaoFinal([5, 5], 90), 'Recuperação');
  });

  test('frequência de 100% com média 2.5 resulta em Reprovado', () => {
    assert.equal(situacaoFinal([2, 3], 100), 'Reprovado');
  });

  test('frequência acima de 100% é inválida', () => {
    assert.throws(() => situacaoFinal([8, 8], 120), RangeError);
  });

  test('frequência negativa é inválida', () => {
    assert.throws(() => situacaoFinal([8, 8], -5), RangeError);
  });
});
