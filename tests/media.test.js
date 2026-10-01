import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularMedia, situacaoPorMedia } from '../src/notas.js';

describe('Cálculo da média', () => {
  test('calcula a média de duas notas', () => {
    assert.equal(calcularMedia([6, 8]), 7);
  });

  test('aceita uma única nota', () => {
    assert.equal(calcularMedia([9]), 9);
  });

  test('recusa lista de notas vazia', () => {
    assert.throws(() => calcularMedia([]), TypeError);
  });

  test('recusa nota maior que 10', () => {
    assert.throws(() => calcularMedia([11, 8]), RangeError);
  });

  test('recusa nota negativa', () => {
    assert.throws(() => calcularMedia([-1, 8]), RangeError);
  });
});

describe('Situação pela média', () => {
  test('média 7 (exatamente o mínimo) é Aprovado', () => {
    assert.equal(situacaoPorMedia(7), 'Aprovado');
  });

  test('média 6.9 é Recuperação', () => {
    assert.equal(situacaoPorMedia(6.9), 'Recuperação');
  });

  test('média 4 (exatamente o mínimo da recuperação) é Recuperação', () => {
    assert.equal(situacaoPorMedia(4), 'Recuperação');
  });

  test('média 3.9 é Reprovado', () => {
    assert.equal(situacaoPorMedia(3.9), 'Reprovado');
  });
});
