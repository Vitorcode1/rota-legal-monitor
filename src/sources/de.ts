import type { SourceConfig } from '@/types'

export const deSource: SourceConfig = {
  countryCode: 'de',
  countryName: 'Alemanha',
  primaryLanguage: 'en',
  acceptableLanguages: ['en', 'de'],

  urls: [
    {
      url: 'https://www.make-it-in-germany.com/en/visa-residence/types',
      contentType: 'visa-overview',
      promptHint:
        'Portal oficial do governo alemao sobre tipos de visto e permissao de residencia para trabalhadores qualificados. Liste todos os tipos relevantes para brasileiros que querem trabalhar na Alemanha. Destaque Skilled Worker visa, Opportunity Card (Chancenkarte) e EU Blue Card.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://www.make-it-in-germany.com/en/visa-residence/types/work-qualified-professionals',
      contentType: 'visa-requirements',
      promptHint:
        'Visto de trabalho para profissionais qualificados na Alemanha (Fachkrafteeinwanderungsgesetz). Extraia: reconhecimento de diploma exigido, nivel de idioma alemao, salario minimo, passos do processo e tempo medio de processamento.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://www.make-it-in-germany.com/en/visa-residence/types/opportunity-card',
      contentType: 'visa-requirements',
      promptHint:
        'Opportunity Card (Chancenkarte) da Alemanha para busca de emprego. Extraia: sistema de pontos necessarios, criterios de elegibilidade (diploma, experiencia, idioma, idade), duracao do visto, restricoes de trabalho durante a busca e como converter para visto de trabalho.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card',
      contentType: 'visa-requirements',
      promptHint:
        'EU Blue Card para a Alemanha. Extraia: salario bruto anual minimo exigido (valor exato em EUR), areas de escassez com salario reduzido, reconhecimento de diploma e vantagens sobre visto padrao.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://www.bamf.de/EN/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/Fachkraeftezuwanderung/fachkraeftezuwanderung-node.html',
      contentType: 'visa-overview',
      promptHint:
        'Pagina do BAMF sobre imigração de trabalhadores qualificados de paises fora da UE. Extraia atualizacoes recentes de politica, requisitos de reconhecimento de qualificacoes e links para procedimentos de reconhecimento de diploma estrangeiro.',
      fetchFrequency: 'monthly',
    },
  ],

  glossary: {
    'Aufenthaltstitel': 'Autorizacao de residencia',
    'Aufenthaltserlaubnis': 'Permissao de residencia temporaria',
    'Niederlassungserlaubnis': 'Permissao de residencia permanente',
    'Chancenkarte': 'Opportunity Card para busca de emprego',
    'Blaue Karte EU': 'EU Blue Card (visto para altamente qualificados)',
    'Fachkraft': 'Trabalhador qualificado',
    'Fachkrafteeinwanderungsgesetz': 'Lei de Imigracao de Trabalhadores Qualificados',
    'BAMF': 'Escritorio Federal para Migracao e Refugiados',
    'Auslanderbehorde': 'Autoridade de estrangeiros local',
    'Anerkennungsberatung': 'Consultoria de reconhecimento de diplomas',
    'anabin': 'Base de dados de reconhecimento de diplomas estrangeiros',
    'MINT': 'Matematica, Informatica, Ciencias Naturais e Tecnologia (STEM)',
    'Zustimmung': 'Aprovacao da Agencia Federal de Emprego (BA)',
    'Bundesagentur fur Arbeit': 'Agencia Federal de Emprego (BA)',
    'Voranerkennungsbescheid': 'Decisao preliminar de reconhecimento de diploma',
  },
}
