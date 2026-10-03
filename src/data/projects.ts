export type ProjectVisualKind = "rag" | "trend" | "etl" | "vision" | "scrape" | "receipt" | "diceChat";

export type Project = {
  title: string;
  description: string;
  tags: string[];
  visual: ProjectVisualKind;
  period?: string;
  highlights?: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Plataforma de IA generativa multiagente",
    description:
      "Plataforma de inteligencia competitiva con 5 agentes que redujo la generación de informes de 4 horas a 30 minutos para 40 usuarios de negocio.",
    tags: ["Google ADK", "LangGraph", "Milvus", "MCP"],
    visual: "rag",
    period: "Sector Retail",
    highlights: [
      "Agente router que orquesta agentes especializados en RAG, forecasting y búsqueda web, con memoria conversacional en PostgreSQL.",
      "Agentic-RAG sobre Milvus con 5 colecciones de conocimiento, chunking y reranking para mejorar el contexto entregado al LLM.",
      "Herramientas y fuentes externas integradas mediante Model Context Protocol (MCP).",
      "Desplegada on-premise en Kubernetes, con observabilidad de agentes en Grafana.",
    ],
    featured: true,
  },
  {
    title: "Forecasting estratégico de la competencia",
    description:
      "Proyecciones a 18 meses con 97% de precisión (MAPE), integradas como herramienta del agente de forecasting.",
    tags: ["SARIMAX", "Prophet", "NeuralProphet"],
    visual: "trend",
    period: "Sector Retail",
    highlights: [
      "Comparación de SARIMAX, Prophet y NeuralProphet para elegir el mejor modelo por serie.",
      "Base en análisis espectral de series de tiempo para entender estacionalidades antes de modelar.",
      "Expuesto como herramienta del sistema multiagente para responder preguntas de negocio en lenguaje natural.",
    ],
    featured: true,
  },
  {
    title: "Pronóstico de demanda de infraestructura",
    description:
      "Modelos de pronóstico de demanda de cómputo para procesos ETL a gran escala que contribuyeron a reducir 20% el OPEX.",
    tags: ["Kubernetes", "Airflow", "Grafana"],
    visual: "etl",
    period: "Consumo masivo",
    highlights: [
      "Modelos contenerizados con Docker y orquestados con Kubernetes y Apache Airflow.",
      "Reducción del 20% del OPEX de infraestructura, validada en la auditoría de Kubernetes del cliente.",
      "Dashboards en Grafana con KPIs en tiempo real y alertas automáticas a equipos directivos.",
    ],
  },
  {
    title: "Calculadora de emisiones de carbono",
    description:
      "Solución full-stack en producción que redujo 75% el tiempo de captura de inventarios y llenado de formularios normativos.",
    tags: ["Flask", "Airflow", "PostgreSQL", "Docker"],
    visual: "receipt",
    period: "Consultoría ambiental",
    highlights: [
      "Adoptada por los 20 usuarios de la firma para gestionar proyectos de múltiples clientes.",
      "Automatización de la captura de datos de inventario de terceros.",
      "Pipelines en Airflow y persistencia en PostgreSQL, todo contenerizado con Docker.",
    ],
  },
  {
    title: "Optimización de costos de LLMs",
    description:
      "Benchmarking de modelos fundacionales y configuraciones de tokens para elegir la combinación más rentable sin sacrificar calidad.",
    tags: ["LLMOps", "OpenAI", "Benchmarking"],
    visual: "scrape",
    period: "Sector Retail",
    highlights: [
      "Comparación sistemática de calidad contra costo por token sobre información corporativa real.",
      "Recomendaciones de viabilidad técnica y ROI presentadas a stakeholders de negocio.",
      "Pila técnica estandarizada (GitHub workflows, conexiones a datos, estructura de proyecto) adoptada en proyectos nuevos y existentes.",
    ],
  },
];
