# Situação Acadêmica

Projeto didático da oficina **Do prompt ao pipeline: IA, testes e integração contínua na prática**.

Calcula a média de um aluno e informa a situação final (Aprovado, Recuperação, Reprovado ou
Reprovado por falta). Não usa bibliotecas externas: só precisa de **Node.js** e **Git**.

## Comandos (executar na pasta do projeto)

| Comando | O que faz |
|---|---|
| `node --test` | Roda os testes automatizados (pasta `tests/`) |
| `node scripts/pipeline.js` | Pipeline local: sintaxe → testes → build em `dist/` |
| `node scripts/servidor.js` | Abre a página do projeto em `http://127.0.0.1:3000` |
| `node scripts/servidor.js dist` | Abre o site gerado pelo pipeline |
| `node scripts/verificar-ambiente.js` | Confere se a máquina está pronta para a oficina |

Se preferir, os mesmos comandos existem como scripts do npm: `npm test`, `npm run pipeline`,
`npm start` e `npm run verificar`.

## Estrutura

```
situacao-academica/
├── index.html, style.css     interface da página
├── src/notas.js              regras (o código que será alterado e testado)
├── src/app.js                liga a página às regras
├── tests/                    testes automatizados (node:test)
├── scripts/                  pipeline, servidor local e verificação do ambiente
├── atividade/                instruções e sugestão de código para a atividade
└── .github/workflows/ci.yml  pipeline de CI/CD no GitHub Actions
```

## Regras (simplificadas, apenas para fins didáticos)

- Notas de 0 a 10; média aritmética.
- Média ≥ 7: Aprovado. Média ≥ 4: Recuperação. Abaixo de 4: Reprovado.
- Frequência abaixo de 75%: Reprovado por falta (requisito da atividade).
