# Atividade: do prompt ao pipeline

## Cenário

Você faz parte da equipe que mantém o sistema **Situação Acadêmica**. O sistema já calcula a média
e diz se o aluno está Aprovado, em Recuperação ou Reprovado.

Chegou um **novo requisito**:

> Se a frequência do aluno for **menor que 75%**, a situação deve ser **"Reprovado por falta"**,
> independentemente da média. Frequência fora do intervalo de 0 a 100 é inválida.

A equipe já escreveu os **testes** desse requisito (`tests/frequencia.test.js`).
Sua missão: implementar a regra com ajuda de IA, **provar** que ela funciona e entregá-la pelo pipeline.

Trabalhe em dupla: uma pessoa digita, a outra lê as instruções e revisa. Troquem no meio.

---

## Passo 1 — Veja o estado atual (2 min)

Abra o terminal na pasta do projeto (no VS Code: menu **Terminal > Novo Terminal**) e rode:

```
node --test
```

**Esperado:** 9 testes passam e 6 falham. Os 6 que falham são do novo requisito, que ainda não existe.
Vermelho aqui é normal: o teste está dizendo o que falta fazer.

## Passo 2 — Peça o código à IA (4 min)

Escolha um caminho:

- **Caminho A — com ferramenta de IA** (se você tiver acesso agora): envie o pedido abaixo, junto com o
  conteúdo de `src/notas.js`.

  > Tenho um projeto JavaScript (ES modules). No arquivo src/notas.js abaixo, implemente a função
  > situacaoFinal(notas, frequencia) conforme o comentário dela: frequência fora de 0 a 100 gera RangeError;
  > frequência menor que 75% retorna "Reprovado por falta"; caso contrário, retorna
  > situacaoPorMedia(calcularMedia(notas)). Use as constantes que já existem e devolva só a função.

- **Caminho B — sem ferramenta de IA**: abra `atividade/sugestao-ia.js`. Ele traz uma sugestão de código
  no estilo das respostas de assistentes de IA.

Copie a função sugerida e **substitua** a função `situacaoFinal` em `src/notas.js`. Salve (Ctrl+S).

> Travou na edição? Rode `node atividade/aplicar-sugestao.js` e siga para o Passo 3.

## Passo 3 — Revise antes de confiar (3 min)

Leia a função com a sua dupla e responda:

1. Ela faz **exatamente** o que o requisito pede?
2. O que acontece **no limite**: frequência de exatamente 75%?
3. Ela alterou alguma coisa que **não** foi pedida?
4. Vocês entendem **cada linha**? Se não, o que perguntariam à IA?

## Passo 4 — Rode os testes e corrija (5 min)

```
node --test
```

Se algum teste falhar, leia a mensagem: ela mostra o nome do teste, o valor **esperado** e o valor
**obtido**. Encontre a causa em `src/notas.js`, corrija, salve e rode os testes de novo.

**Esperado ao final:** 15 testes passando, nenhum falhando.

## Passo 5 — Registre a alteração com Git (3 min)

```
git status
git diff
git add src/notas.js
git commit -m "Implementa reprovação por frequência"
git log --oneline
```

**Esperado:** o seu commit aparece no topo do histórico.

## Passo 6 — Rode o pipeline (2 min)

```
node scripts/pipeline.js
```

O pipeline executa, em ordem: verificação de sintaxe, testes automatizados e geração do site (build).

**Esperado:** `PIPELINE APROVADO`. É o mesmo comando que o servidor do GitHub Actions executa a cada envio.

## Passo 7 (opcional) — Veja o site gerado

```
node scripts/servidor.js dist
```

Abra no navegador o endereço exibido no terminal (por exemplo, `http://127.0.0.1:3000`).
Teste notas 8 e 8 com frequência 75. Para encerrar o servidor: **Ctrl+C**.

---

## Concluiu?

A atividade está concluída quando você tem:

- [ ] 15 testes passando;
- [ ] um commit seu no `git log`;
- [ ] `PIPELINE APROVADO` no terminal.

## Desafio extra (para quem terminou antes)

O que acontece se a frequência não for um número (`NaN`)? Escreva um teste em `tests/frequencia.test.js`
que espere um `RangeError` nesse caso, veja o teste falhar e depois corrija o código (com ou sem IA).
