import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { CountryDataSchema } from '@/extractors/schema'
import type { CountryData } from '@/extractors/schema'
import { log } from '@/lib/log'

function currentPath(country: string): string {
  return join('data', 'current', `${country}.json`)
}

function historyDir(country: string): string {
  return join('data', 'history', country)
}

function historyPath(country: string, date: string): string {
  return join(historyDir(country), `${date}.json`)
}

function ensureDir(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}

function sortedJson(obj: unknown, indent = 2): string {
  return JSON.stringify(
    obj,
    (_, val: unknown) => {
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        return Object.fromEntries(
          Object.entries(val as Record<string, unknown>).sort(([a], [b]) =>
            a.localeCompare(b),
          ),
        )
      }
      return val
    },
    indent,
  )
}

export function readCurrent(country: string): CountryData | null {
  const path = currentPath(country)
  if (!existsSync(path)) return null
  try {
    const raw = JSON.parse(readFileSync(path, 'utf-8')) as unknown
    const result = CountryDataSchema.safeParse(raw)
    if (!result.success) {
      log.warn('snapshot atual falhou na validacao', {
        country,
        issues: result.error.issues.length,
      })
      return null
    }
    return result.data
  } catch (err) {
    log.warn('erro ao ler snapshot atual', { country, error: String(err) })
    return null
  }
}

export function writeCurrent(country: string, data: CountryData): void {
  const path = currentPath(country)
  ensureDir(dirname(path))
  writeFileSync(path, sortedJson(data) + '\n', 'utf-8')
  log.info('snapshot escrito', { country, path })
}

export function archiveCurrent(country: string): void {
  const src = currentPath(country)
  if (!existsSync(src)) return
  const date = new Date().toISOString().slice(0, 10)
  const dest = historyPath(country, date)
  ensureDir(historyDir(country))
  copyFileSync(src, dest)
  log.info('snapshot arquivado', { country, dest })
}

export function listHistory(country: string): string[] {
  const dir = historyDir(country)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
    .sort()
}
