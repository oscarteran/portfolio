import { tx, type Locale, type Text } from "@/lib/i18n";

type ProjectStat = { value: string; label: Text; accent?: boolean };

type ProjectSource = {
  title: Text;
  description: Text;
  sector: Text;
  /** Headline figure shown on the project card. */
  metric: string;
  tags: string[];
  highlights?: Text[];
  /** Only the featured case shows these: where and when it was built, and its key figures. */
  featured?: { org: string; period: Text; stats: ProjectStat[] };
  demoUrl?: string;
  repoUrl?: string;
};

const projects: ProjectSource[] = [
  {
    title: { es: "Plataforma de IA generativa multiagente", en: "Multi-agent generative AI platform" },
    description: {
      es: "Plataforma de inteligencia competitiva con 5 agentes que redujo la generación de informes de 4 horas a 30 minutos para 40 usuarios de negocio.",
      en: "Competitive-intelligence platform with 5 agents that cut report generation from 4 hours to 30 minutes for 40 business users.",
    },
    sector: { es: "Sector retail", en: "Retail" },
    metric: "−87.5 %",
    tags: ["Google ADK", "LangGraph", "LangChain", "Milvus", "MCP", "PostgreSQL", "Kubernetes"],
    highlights: [
      {
        es: "Agente router que orquesta agentes especializados en RAG, forecasting y búsqueda web, con memoria conversacional en PostgreSQL.",
        en: "Router agent orchestrating specialized RAG, forecasting and web-search agents, with conversational memory in PostgreSQL.",
      },
      {
        es: "Agentic-RAG sobre Milvus con 5 colecciones de conocimiento, chunking y reranking para mejorar el contexto entregado al LLM.",
        en: "Agentic-RAG over Milvus with 5 knowledge collections, chunking and reranking to improve the context passed to the LLM.",
      },
      {
        es: "Herramientas y fuentes externas integradas mediante Model Context Protocol (MCP).",
        en: "External tools and sources integrated through the Model Context Protocol (MCP).",
      },
      {
        es: "Desplegada on-premise en Kubernetes, con observabilidad de agentes en Grafana.",
        en: "Deployed on-premise on Kubernetes, with agent observability in Grafana.",
      },
    ],
    featured: {
      org: "Minsait",
      period: { es: "2024 — hoy", en: "2024 — present" },
      stats: [
        { value: "4 h → 30 min", label: { es: "por informe", en: "per report" }, accent: true },
        { value: "40", label: { es: "usuarios de negocio", en: "business users" } },
        { value: "5", label: { es: "agentes", en: "agents" } },
      ],
    },
  },
  {
    title: { es: "Forecasting estratégico de la competencia", en: "Strategic competitor forecasting" },
    description: {
      es: "Proyecciones a 18 meses con 97% de precisión (MAPE), integradas como herramienta del agente de forecasting.",
      en: "18-month forecasts at 97% accuracy (MAPE), integrated as a tool of the forecasting agent.",
    },
    sector: { es: "Sector retail", en: "Retail" },
    metric: "97 %",
    tags: ["SARIMAX", "Prophet", "NeuralProphet"],
  },
  {
    title: { es: "Pronóstico de demanda de infraestructura", en: "Infrastructure demand forecasting" },
    description: {
      es: "Modelos de pronóstico de demanda de cómputo para procesos ETL a gran escala que contribuyeron a reducir 20% el OPEX.",
      en: "Compute-demand forecasting models for large-scale ETL processes that helped cut OPEX by 20%.",
    },
    sector: { es: "Consumo masivo", en: "Consumer goods" },
    metric: "−20 %",
    tags: ["Kubernetes", "Airflow", "Grafana"],
  },
  {
    title: { es: "Calculadora de emisiones de carbono", en: "Carbon emissions calculator" },
    description: {
      es: "Solución full-stack en producción que redujo 75% el tiempo de captura de inventarios y llenado de formularios normativos.",
      en: "Full-stack production solution that cut inventory capture and regulatory form-filling time by 75%.",
    },
    sector: { es: "Consultoría ambiental", en: "Environmental consulting" },
    metric: "−75 %",
    tags: ["Flask", "Airflow", "PostgreSQL", "Docker"],
  },
  {
    title: { es: "Optimización de costos de LLMs", en: "LLM cost optimization" },
    description: {
      es: "Benchmarking de modelos fundacionales y configuraciones de tokens para elegir la combinación más rentable sin sacrificar calidad.",
      en: "Benchmarking of foundation models and token configurations to choose the most cost-effective combination without losing quality.",
    },
    sector: { es: "Sector retail", en: "Retail" },
    metric: "ROI",
    tags: ["LLMOps", "OpenAI", "Benchmarking"],
  },
];

export function getProjects(locale: Locale) {
  return projects.map((p) => ({
    title: tx(p.title, locale),
    description: tx(p.description, locale),
    sector: tx(p.sector, locale),
    metric: p.metric,
    tags: p.tags,
    highlights: (p.highlights ?? []).map((h) => tx(h, locale)),
    featured: p.featured && {
      org: p.featured.org,
      period: tx(p.featured.period, locale),
      stats: p.featured.stats.map((s) => ({ ...s, label: tx(s.label, locale) })),
    },
    demoUrl: p.demoUrl,
    repoUrl: p.repoUrl,
  }));
}

export type Project = ReturnType<typeof getProjects>[number];

/** Boxes of the featured case's architecture diagram. */
const architecture = {
  user: { es: "Usuario de negocio", en: "Business user" },
  router: { es: "Agente router", en: "Router agent" },
  routerDetail: { es: "Google ADK · LangGraph · memoria en PostgreSQL", en: "Google ADK · LangGraph · PostgreSQL memory" },
  agents: [
    { title: "Agentic-RAG", detail: { es: "Milvus · 5 colecciones", en: "Milvus · 5 collections" } },
    { title: "Forecasting", detail: "SARIMAX · Prophet" },
    { title: { es: "Búsqueda web", en: "Web search" }, detail: { es: "Herramientas vía MCP", en: "Tools via MCP" } },
  ],
  deploy: { es: "On-premise en Kubernetes", en: "On-premise on Kubernetes" },
  observability: { es: "Observabilidad en Grafana", en: "Observability in Grafana" },
};

export function getArchitecture(locale: Locale) {
  return {
    user: tx(architecture.user, locale),
    router: tx(architecture.router, locale),
    routerDetail: tx(architecture.routerDetail, locale),
    agents: architecture.agents.map((a) => ({ title: tx(a.title, locale), detail: tx(a.detail, locale) })),
    deploy: tx(architecture.deploy, locale),
    observability: tx(architecture.observability, locale),
  };
}
