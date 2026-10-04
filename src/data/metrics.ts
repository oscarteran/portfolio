import { tx, type Locale, type Text } from "@/lib/i18n";

type Metric = { value: string; label: Text };

const metrics: Metric[] = [
  {
    value: "87.5 %",
    label: {
      es: "menos tiempo en informes de inteligencia competitiva",
      en: "less time on competitive-intelligence reports",
    },
  },
  {
    value: "97 %",
    label: { es: "precisión (MAPE) en proyecciones a 18 meses", en: "accuracy (MAPE) on 18-month forecasts" },
  },
  {
    value: "44 %",
    label: { es: "entregas más rápidas con CI/CD (50 → 28 h)", en: "faster delivery with CI/CD (50 → 28 h)" },
  },
  {
    value: "20 %",
    label: {
      es: "menos OPEX de infraestructura, validado en auditoría",
      en: "lower infrastructure OPEX, audit-validated",
    },
  },
  {
    value: "75 %",
    label: { es: "menos captura manual de datos normativos", en: "less manual capture of regulatory data" },
  },
];

export function getMetrics(locale: Locale) {
  return metrics.map((m) => ({ value: m.value, label: tx(m.label, locale) }));
}
