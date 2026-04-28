# Data Schema

Definição completa do formato dos dados extraídos. Este documento e o arquivo `src/extractors/schema.ts` são gêmeos: alterar um sem o outro é bug garantido.

## Versionamento

`schemaVersion` segue semver. Mudanças que adicionam campos opcionais são minor. Mudanças que removem campos ou alteram tipos são major. A v1.0 é a definida abaixo.

Quando o schema mudar de major:

1. Atualizar `src/extractors/schema.ts`
2. Atualizar este documento
3. Migrar todos os JSONs em `data/current/` (script ou rerun completo)
4. Bumpar `schemaVersion` em todos
5. Documentar a mudança no `CHANGELOG.md`

## Estrutura raiz

Cada `data/current/{cc}.json` segue:

```typescript
interface CountryData {
  meta: Meta
  forBrazilians: ForBrazilians
  visaTypes: VisaType[]
  generalRequirements: GeneralRequirements
  recentChanges: PolicyChange[]
  reliability: Reliability
}
```

## `meta`

Metadados da extração.

```typescript
interface Meta {
  country: string              // ISO 3166-1 alpha-2 minusculo. exemplo: "nl"
  countryName: string          // nome em PT-BR. exemplo: "Holanda"
  lastUpdated: string          // ISO 8601 com timezone. exemplo: "2026-04-28T06:32:11Z"
  schemaVersion: string        // semver. exemplo: "1.0.0"
  sources: SourceRef[]         // urls efetivamente consultadas nesta execucao
}

interface SourceRef {
  url: string
  fetchedAt: string            // ISO 8601
  status: 'ok' | 'partial' | 'failed'
  contentLanguage: 'en' | 'pt' | 'de' | 'es' | 'nl' | 'fr' | 'it'
}
```

## `forBrazilians`

Visão consolidada da situação para um cidadão brasileiro. Este é o campo mais importante para a UI da ferramenta web.

```typescript
interface ForBrazilians {
  schengenVisaFree: boolean             // pode entrar sem visto de turismo
  maxStayDaysAsTourist: number          // tipicamente 90 para Schengen
  workPermitNeeded: boolean             // precisa de permissao de trabalho
  specialAgreements: SpecialAgreement[] // CPLP, acordos bilaterais
  notes: string                         // observacoes em PT-BR, max 500 chars
}

interface SpecialAgreement {
  name: string                          // exemplo: "CPLP"
  fullName: string                      // exemplo: "Comunidade dos Paises de Lingua Portuguesa"
  benefits: string[]                    // lista curta de vantagens em PT-BR
  appliesToWork: boolean                // o acordo facilita o trabalho legal
}
```

## `visaTypes`

Lista de vistos relevantes para alguém que pretende trabalhar como entregador. Filtramos categorias irrelevantes (estudante, investidor, aposentado).

```typescript
interface VisaType {
  id: string                            // slug estavel. exemplo: "highly-skilled-migrant"
  name: string                          // nome em PT-BR
  nameOriginal: string                  // nome no idioma do pais
  description: string                   // 1 a 3 frases em PT-BR
  
  eligibility: string[]                 // criterios em PT-BR, max 5 items
  
  requirements: VisaRequirements
  process: VisaProcess
  rights: VisaRights
  
  relevanceForDelivery: 'direct' | 'indirect' | 'low'
  // direct = visto e usado por entregadores na pratica
  // indirect = serve como porta de entrada e depois muda para outro
  // low = listado por completude mas nao recomendado para o caso
  
  notes: string | null                  // observacoes adicionais em PT-BR
}

interface VisaRequirements {
  documents: DocumentRequirement[]
  incomeRequirement: MoneyAmount | null // renda minima exigida
  qualificationsRequired: string[]      // certificacoes, diplomas
  languageRequired: LanguageRequirement | null
}

interface DocumentRequirement {
  name: string                          // nome em PT-BR
  description: string
  isCritical: boolean                   // sem ele, nao adianta tentar
}

interface LanguageRequirement {
  language: string                      // exemplo: "alemao"
  level: string                         // CEFR ou descricao. exemplo: "B1"
  testsAccepted: string[]               // exemplo: ["Goethe-Zertifikat B1"]
}

interface VisaProcess {
  steps: ProcessStep[]
  estimatedDuration: string             // exemplo: "8 a 12 semanas"
  fees: MoneyAmount[]
  applicationLocation: 'origem' | 'destino' | 'ambos'
}

interface ProcessStep {
  order: number
  name: string                          // PT-BR
  description: string
  estimatedDays: number | null
}

interface VisaRights {
  canWork: boolean
  canBringFamily: boolean
  canChangeEmployer: boolean
  pathToResidency: PathInfo | null
  pathToCitizenship: PathInfo | null
}

interface PathInfo {
  yearsRequired: number
  conditions: string[]                  // PT-BR
}
```

## `generalRequirements`

Requisitos gerais que tipicamente se aplicam a qualquer visto do país.

```typescript
interface GeneralRequirements {
  passportValidity: string              // PT-BR. exemplo: "minimo 6 meses apos a entrada"
  proofOfFunds: MoneyAmount | null      // valor exigido como reserva
  healthInsurance: HealthInsuranceReq
  cleanCriminalRecord: boolean
  vaccinations: string[]                // lista de vacinas exigidas
}

interface HealthInsuranceReq {
  required: boolean
  mustBeLocal: boolean                  // tem que ser do pais de destino
  minimumCoverage: MoneyAmount | null
  notes: string
}
```

## `recentChanges`

Mudanças de política dos últimos 6 meses, extraídas de seções de news ou updates.

```typescript
interface PolicyChange {
  date: string                          // ISO 8601, data da publicacao oficial
  title: string                         // PT-BR
  summary: string                       // PT-BR, 1 a 3 frases
  severity: 'major' | 'minor'
  affects: string[]                     // ids de visaTypes afetados
  sourceUrl: string                     // link direto para o anuncio oficial
}
```

## `reliability`

Metadata sobre a qualidade da extração desta semana.

```typescript
interface Reliability {
  extractedBy: 'llm' | 'manual'
  extractionConfidence: 'high' | 'medium' | 'low'
  humanReviewedAt: string | null        // ISO 8601 ou null se nunca foi revisado por humano
  knownIssues: string[]                 // problemas que o monitor detectou nesta extracao
}
```

## Tipos auxiliares

```typescript
interface MoneyAmount {
  amount: number                        // numero, sem separador. exemplo: 5688
  currency: 'EUR' | 'USD' | 'BRL'
  period: 'one-time' | 'monthly' | 'yearly' | null
  notes: string | null                  // exemplo: "antes de impostos"
}
```

## Regras de validação

Algumas regras vão além do tipo TypeScript e são checadas no Zod:

- `meta.lastUpdated` deve ser anterior ou igual a "agora"
- `visaTypes` deve ter pelo menos 1 item se `forBrazilians.workPermitNeeded` for true
- `MoneyAmount.amount` deve ser maior que 0
- `recentChanges` ordenado por data desc
- `visaTypes[].id` único dentro do mesmo país
- `process.steps` ordenado por `order` ascendente sem gaps

## Exemplo mínimo válido

Arquivo `data/current/example.json` (encurtado para ilustrar):

```json
{
  "meta": {
    "country": "nl",
    "countryName": "Holanda",
    "lastUpdated": "2026-04-28T06:32:11Z",
    "schemaVersion": "1.0.0",
    "sources": [
      {
        "url": "https://ind.nl/en/highly-skilled-migrant",
        "fetchedAt": "2026-04-28T06:30:02Z",
        "status": "ok",
        "contentLanguage": "en"
      }
    ]
  },
  "forBrazilians": {
    "schengenVisaFree": true,
    "maxStayDaysAsTourist": 90,
    "workPermitNeeded": true,
    "specialAgreements": [],
    "notes": "Brasileiros entram sem visto de turismo, mas precisam de autorizacao especifica para trabalhar."
  },
  "visaTypes": [
    {
      "id": "highly-skilled-migrant",
      "name": "Trabalhador Altamente Qualificado",
      "nameOriginal": "Highly Skilled Migrant",
      "description": "Visto para profissionais com oferta de trabalho de empregador reconhecido pela IND.",
      "eligibility": ["Oferta de emprego de empresa reconhecida", "Salario acima do limite minimo"],
      "requirements": {
        "documents": [],
        "incomeRequirement": {
          "amount": 5688,
          "currency": "EUR",
          "period": "monthly",
          "notes": "Valor para 2026, profissionais acima de 30 anos"
        },
        "qualificationsRequired": [],
        "languageRequired": null
      },
      "process": {
        "steps": [],
        "estimatedDuration": "2 a 4 semanas",
        "fees": [{"amount": 380, "currency": "EUR", "period": "one-time", "notes": null}],
        "applicationLocation": "destino"
      },
      "rights": {
        "canWork": true,
        "canBringFamily": true,
        "canChangeEmployer": false,
        "pathToResidency": {"yearsRequired": 5, "conditions": []},
        "pathToCitizenship": {"yearsRequired": 5, "conditions": []}
      },
      "relevanceForDelivery": "low",
      "notes": "Pouco usado por entregadores, listado por completude."
    }
  ],
  "generalRequirements": {
    "passportValidity": "Minimo 6 meses apos a data de entrada",
    "proofOfFunds": null,
    "healthInsurance": {
      "required": true,
      "mustBeLocal": true,
      "minimumCoverage": null,
      "notes": "Zorgverzekering basica e obrigatoria"
    },
    "cleanCriminalRecord": true,
    "vaccinations": []
  },
  "recentChanges": [],
  "reliability": {
    "extractedBy": "llm",
    "extractionConfidence": "high",
    "humanReviewedAt": null,
    "knownIssues": []
  }
}
```
