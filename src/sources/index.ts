import type { SourceConfig } from '@/types'
import { nlSource } from './nl'
import { ptSource } from './pt'
import { deSource } from './de'
import { esSource } from './es'
import { ieSource } from './ie'

export const sources: Record<string, SourceConfig> = {
  nl: nlSource,
  pt: ptSource,
  de: deSource,
  es: esSource,
  ie: ieSource,
}
