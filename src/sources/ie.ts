import type { SourceConfig } from '@/types'

export const ieSource: SourceConfig = {
  countryCode: 'ie',
  countryName: 'Irlanda',
  primaryLanguage: 'en',
  acceptableLanguages: ['en'],

  urls: [
    {
      url: 'https://www.irishimmigration.ie/coming-to-work-in-ireland/',
      contentType: 'visa-overview',
      promptHint:
        'Portal oficial de imigracao da Irlanda para quem quer vir trabalhar. Liste todos os tipos de permissao de trabalho e visto relevantes para brasileiros. Destaque Critical Skills Employment Permit, General Employment Permit e se ha algum tratamento especial para falantes de ingles ou cidadaos de paises especificos.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/types-of-employment-permits/',
      contentType: 'visa-requirements',
      promptHint:
        'Tipos de Employment Permit na Irlanda. Para cada tipo extraia: elegibilidade, salario anual minimo em EUR, setores qualificados e nao-qualificados, se ha restricao de nacionalidade, e como solicitar. O Critical Skills e o General Employment Permit sao os mais relevantes para brasileiros.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-remunerated-occupations-critical-skills-employment-permit/',
      contentType: 'visa-requirements',
      promptHint:
        'Lista de ocupacoes elegíveis para o Critical Skills Employment Permit irlandes e seus salarios minimos. Extraia o salario minimo anual em EUR para a categoria geral e para ocupacoes especificas. Verifique se TI/tecnologia esta na lista e qual o valor exato.',
      fetchFrequency: 'monthly',
    },
    {
      url: 'https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-types/',
      contentType: 'visa-requirements',
      promptHint:
        'Tipos de permissao de imigracao irlandesa (stamps). Extraia o que cada stamp permite: trabalhar, estudar, trazer familia. Foque em Stamp 1 (employment permit holder) e Stamp 4 (direitos expandidos apos 5 anos).',
      fetchFrequency: 'monthly',
    },
    {
      url: 'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/current-application-processing-dates-and-fees/',
      contentType: 'fees',
      promptHint:
        'Taxas e tempo de processamento de Employment Permits na Irlanda. Extraia os valores em EUR de cada tipo de permissao e o tempo medio de processamento atual. Registre a data de atualizacao da tabela.',
      fetchFrequency: 'biweekly',
    },
  ],

  glossary: {
    'Employment Permit': 'Permissao de trabalho',
    'Critical Skills Employment Permit': 'Permissao de trabalho para habilidades criticas',
    'General Employment Permit': 'Permissao de trabalho geral',
    'Stamp 1': 'Autorizacao de residencia para portadores de employment permit',
    'Stamp 1A': 'Autorizacao para trainee accountants e outros estagiarios',
    'Stamp 4': 'Autorizacao de residencia com direitos expandidos (apos criterios)',
    'IRP': 'Irish Residence Permit (cartao de residente)',
    'GNIB': 'Garda National Immigration Bureau (equivalente antigo do IRP)',
    'PPS Number': 'Personal Public Service Number (equivalente ao CPF)',
    'Revenue': 'Autoridade fiscal irlandesa (Receita Federal)',
    'DETE': 'Department of Enterprise, Trade and Employment',
    'INIS': 'Irish Naturalisation and Immigration Service',
    'Trusted Partner': 'Empregador cadastrado com processo simplificado',
    'Labour Market Needs Test': 'Comprovacao de que nao ha candidatos locais para a vaga',
  },
}
