import { extractFromHtml } from "@/extractors/llm-extractor";
import { VisaTypeSchema } from "@/extractors/schema";
import { z } from "zod";

const sampleHtml = `
Highly Skilled Migrant

To work in the Netherlands as a highly skilled migrant, your employer must apply
for a residence permit on your behalf. Your employer must be recognised as a
sponsor by IND.

Salary requirements 2026
- Age 30 and older: EUR 5,688 gross per month
- Younger than 30: EUR 4,171 gross per month

The application fee is EUR 380 (paid by employer).

Steps:
1. Your employer submits the application to IND
2. IND processes within 2 to 4 weeks
3. You collect the MVV at the Dutch consulate

Rights: you may work only for the sponsoring employer. You can bring your family.
After 5 years of continuous legal stay you can apply for permanent residence permit.
After 5 years you can also apply for Dutch citizenship (requires A2 Dutch level).
`;

const PartialSchema = z.object({
  visaTypes: z.array(VisaTypeSchema),
});

const result = await extractFromHtml(sampleHtml, PartialSchema, {
  country: "nl",
  countryName: "Holanda",
  contentType: "visa-overview",
  sourceUrl: "https://ind.nl/en/highly-skilled-migrant",
  contentLanguage: "en",
});

console.log(JSON.stringify(result, null, 2));
