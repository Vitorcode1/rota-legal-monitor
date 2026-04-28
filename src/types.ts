export type ContentType =
  | 'visa-overview'
  | 'visa-requirements'
  | 'fees'
  | 'news'
  | 'agreements'

export interface UrlConfig {
  url: string
  contentType: ContentType
  promptHint: string
  fetchFrequency: 'biweekly' | 'monthly'
}

export interface SourceConfig {
  countryCode: string
  countryName: string
  primaryLanguage: string
  acceptableLanguages: string[]
  urls: UrlConfig[]
  glossary: Record<string, string>
}
