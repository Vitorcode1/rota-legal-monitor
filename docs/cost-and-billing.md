# Cost and Billing

Guia de custos do Rota Legal Monitor. Atualizado para cadência quinzenal (dias 1 e 15 de cada mês, 24 execuções por ano).

## Estimativa de custo do Rota Legal Monitor

### Premissas técnicas

- 5 países monitorados
- Média de 5 URLs por país, 25 URLs por execução
- Conteúdo limpo por URL: 5 a 15 KB, estimando 8.000 tokens de input por URL
- Output por URL: aproximadamente 1.500 tokens
- Tokens de input por execução: 25 URLs x 8.000 = 200.000 tokens
- Tokens de output por execução: 25 URLs x 1.500 = 37.500 tokens
- Cadência quinzenal: 24 execuções por ano (dias 1 e 15 de cada mês)

### Cenários de custo

| Cenário | Custo por execução | Custo por ano |
|---------|-------------------|---------------|
| Sonnet 4.5 sem otimização | USD 0,86 | USD 21 |
| Sonnet 4.5 com prompt caching | USD ~0,20 | USD 5 |
| Haiku 4.5 sem otimização (recomendado) | USD 0,29 | USD 7 |
| Haiku 4.5 com cache de hash de conteúdo | USD ~0,13 | USD 3 |

A recomendação é começar com Haiku 4.5 quinzenal a USD 7 por ano. Habilitar o cache de hash de conteúdo desde o início reduz para USD 3 a 5 por ano, porque páginas que não mudaram não geram chamada ao LLM.

### Por que Haiku e não Sonnet?

Para extração de dados estruturados com schema bem definido, Haiku entrega qualidade equivalente a Sonnet ao custo de 70% menos. Sonnet justifica o preço quando há alta ambiguidade semântica ou páginas com conteúdo muito denso. Monitorando `extractionConfidence`, se cair abaixo de `medium` com Haiku, considerar subir para Sonnet apenas nos países problemáticos.

## Como começar sem gastar nada

A Anthropic oferece USD 5 de crédito grátis para contas novas.

Com Haiku 4.5, cadência quinzenal e cache de hash de conteúdo ativo (USD ~0,13 por execução, maioria das páginas não muda a cada 15 dias):

- USD 5 de crédito grátis cobre mais de 4 anos de operação quinzenal com Haiku
- Sem cache de hash, USD 5 cobre os primeiros meses

Para começar:

1. Criar conta em [console.anthropic.com](https://console.anthropic.com)
2. O crédito grátis aparece automaticamente
3. Configurar `ANTHROPIC_API_KEY` no repositório como secret
4. Opcional: configurar `ANTHROPIC_MODEL=claude-haiku-4-5` no workflow

## Adicionar crédito quando necessário

Quando o crédito gratuito acabar, recomenda-se comprar USD 15 por ano. Isso cobre:

- Haiku 4.5 quinzenal sem cache: aproximadamente 2 anos de operação
- Haiku 4.5 quinzenal com cache de hash: mais de 5 anos de operação
- Margem para testes manuais, reruns e adição de novos países

Para adicionar crédito: [console.anthropic.com](https://console.anthropic.com) > Settings > Billing > Add Credits.

Spend limit recomendado: USD 25 por ano. Isso protege contra loops acidentais ou bugs que chamem a API repetidamente, sem risco de custo inesperado alto.

## Como reduzir custo se necessário

Em ordem de impacto, do maior para o menor:

1. Habilitar cache de hash de conteúdo: se a página HTML não mudou desde a última execução, reutilizar o JSON anterior sem chamar o LLM. Redução de 50 a 70% do custo total.
2. Trocar para Haiku 4.5 (se ainda usando Sonnet): redução imediata de 70%.
3. Habilitar prompt caching da Anthropic: o system prompt e a tool definition são reutilizados entre chamadas. Redução de 30 a 40% nos tokens de input.
4. Filtrar URLs de baixa prioridade: reduzir de 5 para 3 URLs por país corta 40% do custo sem impacto significativo na cobertura.
5. Reduzir frequência para mensal se a cadência quinzenal estiver dando mais ruído que sinal: mudanças falsas frequentes indicam que o LLM está sendo chamado sem necessidade.

Combinando todas as otimizações, o projeto roda por menos de USD 4 por ano.
