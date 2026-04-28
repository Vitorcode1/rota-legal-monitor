import type { SourceConfig } from '@/types'
import { nlSource } from './nl'

export const sources: Record<string, SourceConfig> = {
  nl: nlSource,
}
