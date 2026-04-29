# Rota Legal Monitor

> Monitor quinzenal automatizado das condições de imigração legal em países europeus para brasileiros que pretendem trabalhar como entregadores de delivery.

Parte do ecossistema **HenryZuka**. Este repositório alimenta de dados frescos a ferramenta web *Rota Legal* e fornece a fonte de verdade que o e-book *Rota Holanda* referencia.

---

## O que este projeto faz

Duas vezes por mês (dias 1 e 15), automaticamente:

1. Visita as páginas oficiais de imigração de 5 países europeus (Holanda, Portugal, Alemanha, Espanha, Irlanda)
2. Extrai dados estruturados sobre vistos, requisitos, taxas, prazos e mudanças recentes usando a API da Anthropic
3. Valida os dados contra um schema Zod
4. Salva um snapshot em JSON no diretório `data/current/`
5. Comita o histórico no `data/history/` para rastrear mudanças ao longo do tempo
6. Abre uma issue no GitHub se detectar mudança significativa

O resultado é um conjunto de arquivos JSON estáticos que o frontend consome via CDN do GitHub, sem precisar de servidor próprio.

## Por que isso importa

A maioria dos guias de imigração para brasileiros envelhece em meses. Requisitos de renda mudam, valores de taxa sobem, novos vistos são criados. Manter conteúdo manual atualizado é caro e propenso a falhas.

Com este monitor:

- O e-book pode dizer "consulte a versão atual em rotalegal.app"
- A ferramenta web sempre mostra dados frescos com data da última verificação
- O usuário confia mais no produto porque vê quando foi atualizado
- Concorrentes que vendem PDF estático ficam visivelmente desatualizados

## Arquitetura em 30 segundos

```
GitHub Actions (cron quinzenal)
        ↓
  fetcher (httpx + Playwright fallback)
        ↓
  extractor (Anthropic API + schema Zod)
        ↓
  validator (rejeita output inválido)
        ↓
  storage (JSON em data/current/)
        ↓
  diff (compara com snapshot anterior)
        ↓
  notify (issue no GitHub se mudou)
        ↓
  commit + push (histórico em data/history/)
```

Detalhe completo em [`docs/architecture.md`](docs/architecture.md).

## Quickstart

Pré-requisitos: Bun 1.1+ ou Node 20+, uma API key da Anthropic.

```bash
# clonar e instalar
git clone https://github.com/SEU_USER/rota-legal-monitor
cd rota-legal-monitor
bun install

# configurar
cp .env.example .env
# editar .env e colar sua ANTHROPIC_API_KEY

# rodar uma extração local (Holanda)
bun run extract:nl

# rodar todos os países
bun run extract

# verificar diff entre snapshot atual e anterior
bun run diff
```

O resultado fica em `data/current/{country}.json`.

## Estrutura do repositório

```
rota-legal-monitor/
├── README.md                    voce esta aqui
├── CLAUDE.md                    instrucoes para Claude Code
├── PLAN.md                      roadmap de implementacao em 7 fases
├── spec.md                      especificacao tecnica completa
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
│
├── docs/
│   ├── architecture.md          design do sistema
│   ├── sources.md               registro das fontes oficiais
│   ├── data-schema.md           contratos TypeScript
│   ├── extraction-strategy.md   como funciona a extracao via LLM
│   ├── workflow.md              fluxo quinzenal passo a passo
│   └── adding-countries.md      como adicionar novo pais
│
├── src/
│   ├── cli/                     comandos executaveis
│   ├── sources/                 config por pais (urls, seletores)
│   ├── extractors/              fetch + LLM + validacao
│   ├── storage/                 leitura e escrita de snapshots
│   ├── diff/                    deteccao de mudancas
│   └── notify/                  alertas via GitHub Issues
│
├── data/
│   ├── current/                 ultimo snapshot por pais
│   └── history/                 snapshots quinzenais arquivados
│
└── .github/
    └── workflows/
        └── biweekly-update.yml  cron quinzenal
```

## Consumindo os dados

Os snapshots JSON ficam disponíveis publicamente via GitHub Pages, sem autenticação e com CORS habilitado:

```
https://SEU_USER.github.io/rota-legal-monitor/{cc}.json
https://SEU_USER.github.io/rota-legal-monitor/index.json
```

Exemplos:

```
https://SEU_USER.github.io/rota-legal-monitor/nl.json   # Holanda
https://SEU_USER.github.io/rota-legal-monitor/pt.json   # Portugal
https://SEU_USER.github.io/rota-legal-monitor/de.json   # Alemanha
https://SEU_USER.github.io/rota-legal-monitor/es.json   # Espanha
https://SEU_USER.github.io/rota-legal-monitor/ie.json   # Irlanda
```

O `index.json` lista todos os países disponíveis com metadados (última atualização, número de tipos de visto, nível de confiança). Use-o para descobrir quais países têm dados antes de buscar o JSON completo.

Substitua `SEU_USER` pelo seu nome de usuário do GitHub. Configure o GitHub Pages apontando para o branch `gh-pages` nas configurações do repositório.

## Status dos países

| País | Código | Prioridade | Status |
|------|--------|------------|--------|
| Holanda | `nl` | P0 | ativo |
| Portugal | `pt` | P1 | ativo |
| Alemanha | `de` | P2 | ativo |
| Espanha | `es` | P3 | ativo (CI) |
| Irlanda | `ie` | P4 | ativo |

Cada país é uma config isolada em `src/sources/{cc}.ts`. Adicionar país novo é seguir [`docs/adding-countries.md`](docs/adding-countries.md).

> Espanha: o snapshot é gerado no CI (Ubuntu). Localmente no Windows o Playwright não consegue iniciar o chromium headless, mas todas as URLs espanholas respondem corretamente no Linux.

## Como começar a desenvolver

Se você é o Claude Code lendo isso pela primeira vez, vá direto para [`CLAUDE.md`](CLAUDE.md). Depois leia [`PLAN.md`](PLAN.md) e execute as fases na ordem.

Se você é humano, leia [`spec.md`](spec.md) para a visão completa.

## Custo estimado de operação

- GitHub Actions: gratuito (free tier cobre folgadamente um cron quinzenal)
- Hospedagem dos JSON: gratuita (raw.githubusercontent.com ou GitHub Pages)
- API da Anthropic: estimativa de USD 7 a 21 por ano com 5 países (detalhe em `docs/cost-and-billing.md`)
- Domínio: opcional, custa o que você quiser pagar

Ou seja: o sistema todo roda por uns USD 10 a 25 por ano.

## Licença

A definir. Provavelmente MIT para o código e CC BY-SA para os dados extraídos.

---

Projeto em desenvolvimento ativo. Última atualização desta documentação: abril de 2026.
