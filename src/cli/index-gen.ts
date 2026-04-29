import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { CountryDataSchema } from '@/extractors/schema'
import { log } from '@/lib/log'

const CURRENT_DIR = join(import.meta.dir, '..', '..', 'data', 'current')
const SKIP = new Set(['example.json', 'index.json'])

interface CountryEntry {
  code: string
  name: string
  lastUpdated: string
  schemaVersion: string
  visaTypesCount: number
  confidence: string
}

interface IndexFile {
  generatedAt: string
  schemaVersion: string
  countries: CountryEntry[]
}

function main(): void {
  const files = readdirSync(CURRENT_DIR).filter(
    (f) => f.endsWith('.json') && !SKIP.has(f),
  )

  const countries: CountryEntry[] = []

  for (const file of files.sort()) {
    const raw = JSON.parse(readFileSync(join(CURRENT_DIR, file), 'utf-8'))
    const result = CountryDataSchema.safeParse(raw)
    if (!result.success) {
      log.warn('arquivo ignorado no index (falhou validacao)', { file })
      continue
    }
    const d = result.data
    countries.push({
      code: d.meta.country,
      name: d.meta.countryName,
      lastUpdated: d.meta.lastUpdated,
      schemaVersion: d.meta.schemaVersion,
      visaTypesCount: d.visaTypes.length,
      confidence: d.reliability.extractionConfidence,
    })
  }

  const index: IndexFile = {
    generatedAt: new Date().toISOString(),
    schemaVersion: '1.0.0',
    countries,
  }

  const outPath = join(CURRENT_DIR, 'index.json')
  writeFileSync(outPath, JSON.stringify(index, null, 2) + '\n')
  log.info('index.json gerado', { countries: countries.length, path: outPath })
}

main()
