import { tx, type Locale, type Text } from "@/lib/i18n";

type ExperienceSource = {
  /** Links the role to its event on the career seismogram. */
  code: string;
  /** Year shown in the seismogram's event table, e.g. "2024 — hoy". */
  since: Text;
  company: string;
  role: string;
  period: Text;
  summary: Text;
  achievements: Text[];
};

const experience: ExperienceSource[] = [
  {
    code: "EV-03",
    since: { es: "2024 — hoy", en: "2024 — present" },
    company: "Minsait – Indra Group",
    role: "AI Engineer",
    period: { es: "Julio 2024 — Actualidad", en: "July 2024 — Present" },
    summary: {
      es: "Liderazgo técnico de un sistema multiagente de IA generativa para inteligencia competitiva en el sector retail (Walmart de México / Sam's Club).",
      en: "Technical lead of a multi-agent generative AI system for competitive intelligence in retail (Walmart de México / Sam's Club).",
    },
    achievements: [
      {
        es: "Lideré técnicamente el diseño e implementación end-to-end de la plataforma, coordinando a un ingeniero y un becario junto con el líder de negocio.",
        en: "Led the end-to-end design and implementation of the platform, coordinating an engineer and an intern alongside the business lead.",
      },
      {
        es: "Reduje de 4 horas a 30 minutos (87.5%) la generación de informes de inteligencia competitiva para 40 usuarios de negocio.",
        en: "Cut competitive-intelligence report generation from 4 hours to 30 minutes (87.5%) for 40 business users.",
      },
      {
        es: "Diseñé un sistema de 5 agentes con Google ADK, LangGraph y LangChain: un agente router orquesta agentes de RAG, forecasting y búsqueda web.",
        en: "Designed a 5-agent system with Google ADK, LangGraph and LangChain: a router agent orchestrates RAG, forecasting and web-search agents.",
      },
      {
        es: "Alcancé 97% de precisión (MAPE) en proyecciones a 18 meses con SARIMAX, Prophet y NeuralProphet.",
        en: "Reached 97% accuracy (MAPE) on 18-month forecasts with SARIMAX, Prophet and NeuralProphet.",
      },
      {
        es: "Aceleré 44% los tiempos de entrega (de 50 a 28 horas) estandarizando CI/CD y control de versiones en GitHub.",
        en: "Sped up delivery by 44% (50 to 28 hours) by standardizing CI/CD and version control on GitHub.",
      },
    ],
  },
  {
    code: "EV-02",
    since: "2022",
    company: "CBPI Consulting",
    role: "Data Scientist",
    period: { es: "Junio 2022 — Julio 2024", en: "June 2022 — July 2024" },
    summary: {
      es: "Ciclo de vida completo de soluciones de ciencia de datos para clientes enterprise (AB InBev, Soriana y una consultora ambiental).",
      en: "Full lifecycle of data-science solutions for enterprise clients (AB InBev, Soriana and an environmental consultancy).",
    },
    achievements: [
      {
        es: "Desarrollé modelos de pronóstico de demanda de cómputo para AB InBev, orquestados con Docker, Kubernetes y Airflow.",
        en: "Built compute-demand forecasting models for AB InBev, orchestrated with Docker, Kubernetes and Airflow.",
      },
      {
        es: "Contribuí a reducir 20% el OPEX de infraestructura, validado en la auditoría de Kubernetes del cliente.",
        en: "Helped cut infrastructure OPEX by 20%, validated in the client's Kubernetes audit.",
      },
      {
        es: "Construí y desplegué una calculadora de emisiones de carbono full-stack que redujo 75% la captura manual de datos normativos.",
        en: "Built and deployed a full-stack carbon emissions calculator that cut manual regulatory data capture by 75%.",
      },
      {
        es: "Diseñé dashboards en Grafana sobre la salud de modelos productivos, con KPIs en tiempo real y alertas automáticas.",
        en: "Designed Grafana dashboards on production model health, with real-time KPIs and automated alerts.",
      },
    ],
  },
];

const education = {
  code: "EV-01",
  since: "2021",
  degree: { es: "Ingeniería Geofísica", en: "Geophysical Engineering" },
  school: "Universidad Nacional Autónoma de México",
  schoolShort: "UNAM",
  year: "2021",
};

const certification = {
  name: "Google Cloud Associate Cloud Engineer",
  issuer: "Google Cloud",
  year: "2025",
};

export function getExperience(locale: Locale) {
  return experience.map((x) => ({
    code: x.code,
    since: tx(x.since, locale),
    company: x.company,
    role: x.role,
    period: tx(x.period, locale),
    summary: tx(x.summary, locale),
    achievements: x.achievements.map((a) => tx(a, locale)),
  }));
}

export function getEducation(locale: Locale) {
  return { ...education, degree: tx(education.degree, locale) };
}

export { certification };

/** Career events in chronological order, as plotted on the seismogram. */
export function getCareerEvents(locale: Locale) {
  const edu = getEducation(locale);
  return [
    { code: `${edu.code} · ${edu.since}`, role: edu.degree, org: edu.schoolShort },
    ...getExperience(locale)
      .reverse()
      .map((x) => ({ code: `${x.code} · ${x.since}`, role: x.role, org: x.company })),
  ];
}
