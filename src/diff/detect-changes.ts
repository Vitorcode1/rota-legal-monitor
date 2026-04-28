import type { CountryData, VisaType, MoneyAmount } from '@/extractors/schema'

export type Relevance = 'high' | 'medium' | 'low'

export interface FieldChange {
  path: string
  before: unknown
  after: unknown
  relevance: Relevance
}

export interface ChangeSummary {
  country: string
  snapshotDate: string
  hasChanges: boolean
  high: FieldChange[]
  medium: FieldChange[]
  low: FieldChange[]
  markdown: string
}

// ---- relevance rules -------------------------------------------------------

function moneyChanged(a: MoneyAmount | null, b: MoneyAmount | null): boolean {
  if (a === null && b === null) return false
  if (a === null || b === null) return true
  return a.amount !== b.amount || a.currency !== b.currency
}

function isHighRelevance(path: string): boolean {
  // Money fields
  if (path.includes('.incomeRequirement')) return true
  if (path.includes('.fees')) return true
  if (path.includes('.minimumCoverage')) return true
  if (path.includes('.proofOfFunds')) return true
  // Structural changes
  if (path === 'visaTypes.added' || path === 'visaTypes.removed') return true
  if (path === 'forBrazilians.workPermitNeeded') return true
  if (path === 'forBrazilians.maxStayDaysAsTourist') return true
  if (path === 'forBrazilians.schengenVisaFree') return true
  if (path.includes('recentChanges') && path.includes('major')) return true
  return false
}

function isMediumRelevance(path: string): boolean {
  if (path.includes('description')) return true
  if (path.includes('notes')) return true
  if (path.includes('estimatedDuration')) return true
  if (path.includes('requirements.documents')) return true
  if (path.includes('eligibility')) return true
  if (path.includes('steps')) return true
  if (path.includes('rights')) return true
  if (path.includes('recentChanges')) return true
  if (path.includes('forBrazilians')) return true
  if (path.includes('generalRequirements')) return true
  return false
}

function classify(path: string): Relevance {
  if (isHighRelevance(path)) return 'high'
  if (isMediumRelevance(path)) return 'medium'
  return 'low'
}

// ---- deep comparison -------------------------------------------------------

function jsonEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function compareValues(
  path: string,
  before: unknown,
  after: unknown,
  changes: FieldChange[],
): void {
  if (jsonEqual(before, after)) return
  changes.push({ path, before, after, relevance: classify(path) })
}

function compareVisaTypes(
  before: VisaType[],
  after: VisaType[],
  changes: FieldChange[],
): void {
  const beforeById = new Map(before.map((v) => [v.id, v]))
  const afterById = new Map(after.map((v) => [v.id, v]))

  for (const [id, visa] of afterById) {
    if (!beforeById.has(id)) {
      changes.push({
        path: 'visaTypes.added',
        before: null,
        after: visa.name,
        relevance: 'high',
      })
    }
  }

  for (const [id, visa] of beforeById) {
    if (!afterById.has(id)) {
      changes.push({
        path: 'visaTypes.removed',
        before: visa.name,
        after: null,
        relevance: 'high',
      })
    }
  }

  for (const [id, afterVisa] of afterById) {
    const beforeVisa = beforeById.get(id)
    if (!beforeVisa) continue

    const prefix = `visaTypes[${id}]`
    compareValues(`${prefix}.name`, beforeVisa.name, afterVisa.name, changes)
    compareValues(`${prefix}.description`, beforeVisa.description, afterVisa.description, changes)
    compareValues(
      `${prefix}.requirements.incomeRequirement`,
      beforeVisa.requirements.incomeRequirement,
      afterVisa.requirements.incomeRequirement,
      changes,
    )
    compareValues(
      `${prefix}.requirements.documents`,
      beforeVisa.requirements.documents,
      afterVisa.requirements.documents,
      changes,
    )
    compareValues(`${prefix}.process.fees`, beforeVisa.process.fees, afterVisa.process.fees, changes)
    compareValues(
      `${prefix}.process.estimatedDuration`,
      beforeVisa.process.estimatedDuration,
      afterVisa.process.estimatedDuration,
      changes,
    )
    compareValues(`${prefix}.process.steps`, beforeVisa.process.steps, afterVisa.process.steps, changes)
    compareValues(`${prefix}.rights`, beforeVisa.rights, afterVisa.rights, changes)
    compareValues(`${prefix}.eligibility`, beforeVisa.eligibility, afterVisa.eligibility, changes)
    compareValues(`${prefix}.notes`, beforeVisa.notes, afterVisa.notes, changes)
  }
}

// ---- top-level diff --------------------------------------------------------

export function diffSnapshots(before: CountryData, after: CountryData): ChangeSummary {
  const all: FieldChange[] = []

  // forBrazilians
  const fb = 'forBrazilians'
  compareValues(`${fb}.schengenVisaFree`, before.forBrazilians.schengenVisaFree, after.forBrazilians.schengenVisaFree, all)
  compareValues(`${fb}.maxStayDaysAsTourist`, before.forBrazilians.maxStayDaysAsTourist, after.forBrazilians.maxStayDaysAsTourist, all)
  compareValues(`${fb}.workPermitNeeded`, before.forBrazilians.workPermitNeeded, after.forBrazilians.workPermitNeeded, all)
  compareValues(`${fb}.specialAgreements`, before.forBrazilians.specialAgreements, after.forBrazilians.specialAgreements, all)
  compareValues(`${fb}.notes`, before.forBrazilians.notes, after.forBrazilians.notes, all)

  // visaTypes
  compareVisaTypes(before.visaTypes, after.visaTypes, all)

  // generalRequirements
  const gr = 'generalRequirements'
  compareValues(`${gr}.passportValidity`, before.generalRequirements.passportValidity, after.generalRequirements.passportValidity, all)
  compareValues(`${gr}.proofOfFunds`, before.generalRequirements.proofOfFunds, after.generalRequirements.proofOfFunds, all)
  compareValues(`${gr}.healthInsurance`, before.generalRequirements.healthInsurance, after.generalRequirements.healthInsurance, all)
  compareValues(`${gr}.cleanCriminalRecord`, before.generalRequirements.cleanCriminalRecord, after.generalRequirements.cleanCriminalRecord, all)

  // recentChanges: only flag additions
  const beforeKeys = new Set(before.recentChanges.map((c) => `${c.date}|${c.title}`))
  for (const change of after.recentChanges) {
    const key = `${change.date}|${change.title}`
    if (!beforeKeys.has(key)) {
      all.push({
        path: `recentChanges.new.${change.severity}`,
        before: null,
        after: `${change.date}: ${change.title}`,
        relevance: change.severity === 'major' ? 'high' : 'medium',
      })
    }
  }

  const high = all.filter((c) => c.relevance === 'high')
  const medium = all.filter((c) => c.relevance === 'medium')
  const low = all.filter((c) => c.relevance === 'low')

  return {
    country: after.meta.country,
    snapshotDate: after.meta.lastUpdated,
    hasChanges: all.length > 0,
    high,
    medium,
    low,
    markdown: buildMarkdown(after.meta.country, high, medium, low),
  }
}

function formatChange(c: FieldChange): string {
  const before = c.before === null ? '(nenhum)' : JSON.stringify(c.before)
  const after = c.after === null ? '(removido)' : JSON.stringify(c.after)
  return `- \`${c.path}\`: ${before} → ${after}`
}

function buildMarkdown(
  country: string,
  high: FieldChange[],
  medium: FieldChange[],
  low: FieldChange[],
): string {
  const lines: string[] = [`## Mudancas detectadas: ${country.toUpperCase()}`]

  if (high.length > 0) {
    lines.push('', '### Alta relevancia')
    lines.push(...high.map(formatChange))
  }
  if (medium.length > 0) {
    lines.push('', '### Media relevancia')
    lines.push(...medium.map(formatChange))
  }
  if (low.length > 0) {
    lines.push('', '### Baixa relevancia')
    lines.push(...low.map(formatChange))
  }
  if (high.length === 0 && medium.length === 0 && low.length === 0) {
    lines.push('', 'Nenhuma mudanca detectada.')
  }

  return lines.join('\n')
}
