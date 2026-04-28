import { describe, it, expect } from "bun:test";
import { diffSnapshots } from "@/diff/detect-changes";
import type { CountryData } from "@/extractors/schema";

function baseSnapshot(): CountryData {
  return {
    meta: {
      country: "nl",
      countryName: "Holanda",
      lastUpdated: "2026-01-01T06:00:00Z",
      schemaVersion: "1.0.0",
      sources: [],
    },
    forBrazilians: {
      schengenVisaFree: true,
      maxStayDaysAsTourist: 90,
      workPermitNeeded: true,
      specialAgreements: [],
      notes: "Nota base",
    },
    visaTypes: [
      {
        id: "highly-skilled-migrant",
        name: "Migrante Altamente Qualificado",
        nameOriginal: "Highly Skilled Migrant",
        description: "Visto para profissionais qualificados",
        eligibility: ["Oferta de emprego de sponsor reconhecido"],
        requirements: {
          documents: [],
          incomeRequirement: { amount: 5688, currency: "EUR", period: "monthly", notes: null },
          qualificationsRequired: [],
          languageRequired: null,
        },
        process: {
          steps: [{ order: 1, name: "Aplicacao", description: "Submeter pedido", estimatedDays: null }],
          estimatedDuration: "2 a 4 semanas",
          fees: [{ amount: 380, currency: "EUR", period: "one-time", notes: null }],
          applicationLocation: "destino",
        },
        rights: {
          canWork: true,
          canBringFamily: true,
          canChangeEmployer: false,
          pathToResidency: { yearsRequired: 5, conditions: [] },
          pathToCitizenship: null,
        },
        relevanceForDelivery: "low",
        notes: null,
      },
    ],
    generalRequirements: {
      passportValidity: "Minimo 6 meses",
      proofOfFunds: null,
      healthInsurance: { required: true, mustBeLocal: true, minimumCoverage: null, notes: "" },
      cleanCriminalRecord: true,
      vaccinations: [],
    },
    recentChanges: [],
    reliability: {
      extractedBy: "llm",
      extractionConfidence: "high",
      humanReviewedAt: null,
      knownIssues: [],
    },
  };
}

describe("diffSnapshots", () => {
  it("retorna hasChanges=false quando snapshots sao identicos", () => {
    const snap = baseSnapshot();
    const result = diffSnapshots(snap, snap);
    expect(result.hasChanges).toBe(false);
    expect(result.high).toHaveLength(0);
    expect(result.medium).toHaveLength(0);
  });

  it("detecta mudanca de incomeRequirement como alta relevancia", () => {
    const before = baseSnapshot();
    const after = baseSnapshot();
    after.visaTypes[0]!.requirements.incomeRequirement = {
      amount: 5876,
      currency: "EUR",
      period: "monthly",
      notes: null,
    };
    after.meta.lastUpdated = "2026-02-01T06:00:00Z";

    const result = diffSnapshots(before, after);
    expect(result.hasChanges).toBe(true);
    const highPaths = result.high.map((c) => c.path);
    expect(highPaths.some((p) => p.includes("incomeRequirement"))).toBe(true);
  });

  it("detecta adicao de visaType como alta relevancia", () => {
    const before = baseSnapshot();
    const after = baseSnapshot();
    after.visaTypes.push({
      id: "orientation-year",
      name: "Ano de Orientacao",
      nameOriginal: "Orientation Year",
      description: "Visto para recém-graduados",
      eligibility: ["Diploma recente"],
      requirements: { documents: [], incomeRequirement: null, qualificationsRequired: [], languageRequired: null },
      process: { steps: [], estimatedDuration: "Nao especificado", fees: [], applicationLocation: "destino" },
      rights: { canWork: true, canBringFamily: false, canChangeEmployer: true, pathToResidency: null, pathToCitizenship: null },
      relevanceForDelivery: "indirect",
      notes: null,
    });
    after.meta.lastUpdated = "2026-02-01T06:00:00Z";

    const result = diffSnapshots(before, after);
    expect(result.high.some((c) => c.path === "visaTypes.added")).toBe(true);
  });

  it("detecta remocao de visaType como alta relevancia", () => {
    const before = baseSnapshot();
    const after = baseSnapshot();
    after.visaTypes = [];
    // workPermitNeeded precisa ser false para passar no schema
    after.forBrazilians.workPermitNeeded = false;
    after.meta.lastUpdated = "2026-02-01T06:00:00Z";

    const result = diffSnapshots(before, after);
    expect(result.high.some((c) => c.path === "visaTypes.removed")).toBe(true);
  });

  it("detecta mudanca em workPermitNeeded como alta relevancia", () => {
    const before = baseSnapshot();
    const after = baseSnapshot();
    after.forBrazilians.workPermitNeeded = false;
    after.visaTypes = [];
    after.meta.lastUpdated = "2026-02-01T06:00:00Z";

    const result = diffSnapshots(before, after);
    expect(result.high.some((c) => c.path === "forBrazilians.workPermitNeeded")).toBe(true);
  });

  it("detecta mudanca em notes como media relevancia", () => {
    const before = baseSnapshot();
    const after = baseSnapshot();
    after.forBrazilians.notes = "Nota atualizada com nova informacao";
    after.meta.lastUpdated = "2026-02-01T06:00:00Z";

    const result = diffSnapshots(before, after);
    expect(result.medium.some((c) => c.path === "forBrazilians.notes")).toBe(true);
    expect(result.high).toHaveLength(0);
  });

  it("gera markdown com secoes de relevancia", () => {
    const before = baseSnapshot();
    const after = baseSnapshot();
    after.visaTypes[0]!.requirements.incomeRequirement = {
      amount: 6000,
      currency: "EUR",
      period: "monthly",
      notes: null,
    };
    after.meta.lastUpdated = "2026-02-01T06:00:00Z";

    const result = diffSnapshots(before, after);
    expect(result.markdown).toContain("## Mudancas detectadas: NL");
    expect(result.markdown).toContain("### Alta relevancia");
    expect(result.markdown).toContain("incomeRequirement");
  });
});
