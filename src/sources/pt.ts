import type { SourceConfig } from '@/types'

export const ptSource: SourceConfig = {
  countryCode: 'pt',
  countryName: 'Portugal',
  primaryLanguage: 'pt',
  acceptableLanguages: ['pt', 'en'],

  urls: [
    {
      url: 'https://imigrantes.pt/en/residence-visas/',
      contentType: 'visa-overview',
      promptHint:
        'Pagina hub com todos os tipos de visto de residencia em Portugal. Liste cada categoria e avalie relevancia para trabalhadores brasileiros. Destaque especialmente vistos D1 (empregado), D2 (empreendedor), D3 (altamente qualificado), D8 (nomade digital) e CPLP.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://imigrantes.pt/en/residence-visas/working/',
      contentType: 'visa-requirements',
      promptHint:
        'Vistos de trabalho em Portugal para cidadaos de fora da UE. Extraia requisitos de cada modalidade, documentos necessarios e valores de salario minimo exigidos. Para brasileiros, verifique se o Tratado de Amizade Luso-Brasileiro (1953) confere privilegios especiais e quais sao.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://imigrantes.pt/en/cplp-mobility/',
      contentType: 'visa-requirements',
      promptHint:
        'Visto de mobilidade CPLP para cidadaos de paises de lingua portuguesa, incluindo o Brasil. Extraia: elegibilidade especifica para brasileiros, documentos necessarios, duracao, se permite trabalhar, e como se diferencia do visto de trabalho padrao.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://aima.gov.pt/pt/servicos/taxas',
      contentType: 'fees',
      promptHint:
        'Tabela de taxas da AIMA (Agencia para a Integracao, Migracoes e Asilo) para vistos e autorizacoes de residencia. Registre cada valor exato em EUR por tipo de autorizacao. Nao estime.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://imigrantes.pt/en/useful-information/fees/',
      contentType: 'fees',
      promptHint:
        'Taxas e custos de processos de imigracao em Portugal. Extraia valores em EUR para pedidos de visto, autorizacao de residencia e renovacao.',
      fetchFrequency: 'biweekly',
    },
  ],

  glossary: {
    'Autorização de Residência': 'Autorizacao de Residencia (AR)',
    'SEF': 'Servico de Estrangeiros e Fronteiras (extinto, substituido pela AIMA)',
    'AIMA': 'Agencia para a Integracao, Migracoes e Asilo',
    'NIF': 'Numero de Identificacao Fiscal',
    'NHR': 'Regime Fiscal do Residente Nao Habitual',
    'CPLP': 'Comunidade dos Paises de Lingua Portuguesa',
    'Visto D1': 'Visto de residencia para atividade profissional subordinada',
    'Visto D2': 'Visto de residencia para atividade profissional independente',
    'Visto D3': 'Visto de residencia para profissional altamente qualificado',
    'Visto D7': 'Visto de residencia para pessoas com rendimentos proprios',
    'Visto D8': 'Visto de residencia para nomades digitais',
    'Visto CPLP': 'Visto de mobilidade para cidadaos da CPLP',
    'Tratado de Amizade': 'Tratado de Amizade, Cooperacao e Consulta Brasil-Portugal (2000)',
    'SNS': 'Servico Nacional de Saude portugues',
    'IEFP': 'Instituto do Emprego e Formacao Profissional',
  },
}
