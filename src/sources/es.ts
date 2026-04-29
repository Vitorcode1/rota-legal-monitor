import type { SourceConfig } from '@/types'

export const esSource: SourceConfig = {
  countryCode: 'es',
  countryName: 'Espanha',
  primaryLanguage: 'es',
  acceptableLanguages: ['es', 'en'],

  urls: [
    {
      url: 'https://extranjeros.inclusion.gob.es/en/regimenes_extranjeria/regimen_general/index.html',
      contentType: 'visa-overview',
      promptHint:
        'Portal oficial espanhol sobre autorizacoes de residencia para cidadaos de fora da UE (regime geral). Liste todos os tipos de autorizacao relevantes para brasileiros que querem trabalhar na Espanha: autorizacao inicial de trabalho, trabalho por conta propria, profissionais altamente qualificados, nomade digital.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://extranjeros.inclusion.gob.es/en/regimenes_extranjeria/regimen_general/residencia/trabajadores/index.html',
      contentType: 'visa-requirements',
      promptHint:
        'Autorizacao de residencia e trabalho por conta alheia na Espanha. Extraia: requisitos do empregador, oferta de emprego necessaria, salario minimo, documentos exigidos e tempo de processamento. Verifique se ha tratamento diferenciado para cidadaos ibero-americanos (incluindo brasileiros).',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://www.inclusion.gob.es/web/migraciones/en/trabajadores-extranjeros/altamente-cualificados',
      contentType: 'visa-requirements',
      promptHint:
        'Autorizacao espanhola para profissionais altamente qualificados e EU Blue Card na Espanha. Extraia: salario bruto anual minimo em EUR, qualificacao academica exigida, setores prioritarios e como difere da autorizacao de trabalho padrao.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://extranjeros.inclusion.gob.es/en/regimenes_extranjeria/regimen_general/residencia/nomada_digital/index.html',
      contentType: 'visa-requirements',
      promptHint:
        'Visto de nomade digital espanhol (Lei de Startups 28/2022). Extraia: requisitos de renda minima em EUR, tipo de trabalho aceito (remoto para empresa fora da Espanha), documentacao necessaria, beneficios fiscais (regime BECKHAM) e como solicitar.',
      fetchFrequency: 'biweekly',
    },
    {
      url: 'https://extranjeros.inclusion.gob.es/en/InformacionInteres/tasa.html',
      contentType: 'fees',
      promptHint:
        'Tabela de taxas (modelo 790) para autorizacoes de residencia e trabalho na Espanha. Extraia cada valor em EUR por tipo de autorizacao. Nao estime: use apenas valores explicitamente listados.',
      fetchFrequency: 'biweekly',
    },
  ],

  glossary: {
    'Autorización de Residencia': 'Autorizacao de residencia',
    'Autorización de Trabajo': 'Autorizacao de trabalho',
    'NIE': 'Numero de Identificacion de Extranjero',
    'TIE': 'Tarjeta de Identidad de Extranjero (cartao de residente)',
    'Cuenta propia': 'Trabalho por conta propria (autonomo)',
    'Cuenta ajena': 'Trabalho por conta alheia (empregado)',
    'Arraigo': 'Autorizacao por raizamento (vinculo com Espanha)',
    'Contingente': 'Cota anual de trabalhadores imigrantes',
    'SEPE': 'Servico Publico de Emprego Estatal',
    'Nomada digital': 'Nomade digital (visto da Lei de Startups)',
    'Altamente cualificado': 'Profissional altamente qualificado',
    'Tarjeta azul UE': 'EU Blue Card (permissao para altamente qualificados)',
    'Empadronamiento': 'Registro municipal de residencia',
    'TGSS': 'Tesoreria General de la Seguridad Social',
    'Gestor': 'Despachante / advogado de imigracao',
  },
}
