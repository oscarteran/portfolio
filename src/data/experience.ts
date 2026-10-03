export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  /** One line shown before the entry is expanded: the scope of the role, not its results. */
  summary?: string;
  achievements: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Minsait – Indra Group",
    role: "AI Engineer",
    period: "Julio 2024 — Actualidad",
    summary:
      "Liderazgo técnico de un sistema multiagente de IA generativa para inteligencia competitiva en el sector retail (Walmart de México / Sam's Club).",
    achievements: [
      "Lideré técnicamente el diseño e implementación end-to-end de la plataforma, coordinando a un ingeniero y un becario junto con el líder de negocio.",
      "Reduje de 4 horas a 30 minutos (87.5%) la generación de informes de inteligencia competitiva para 40 usuarios de negocio.",
      "Diseñé un sistema de 5 agentes con Google ADK, LangGraph y LangChain: un agente router orquesta agentes de RAG, forecasting y búsqueda web.",
      "Alcancé 97% de precisión (MAPE) en proyecciones a 18 meses con SARIMAX, Prophet y NeuralProphet.",
      "Aceleré 44% los tiempos de entrega (de 50 a 28 horas) estandarizando CI/CD y control de versiones en GitHub.",
    ],
  },
  {
    company: "CBPI Consulting",
    role: "Data Scientist",
    period: "Junio 2022 — Julio 2024",
    summary:
      "Ciclo de vida completo de soluciones de ciencia de datos para clientes enterprise (AB InBev, Soriana y una consultora ambiental).",
    achievements: [
      "Desarrollé modelos de pronóstico de demanda de cómputo para AB InBev, orquestados con Docker, Kubernetes y Airflow.",
      "Contribuí a reducir 20% el OPEX de infraestructura, validado en la auditoría de Kubernetes del cliente.",
      "Construí y desplegué una calculadora de emisiones de carbono full-stack que redujo 75% la captura manual de datos normativos.",
      "Diseñé dashboards en Grafana sobre la salud de modelos productivos, con KPIs en tiempo real y alertas automáticas.",
    ],
  },
  {
    company: "Universidad Nacional Autónoma de México (UNAM)",
    role: "Ingeniería Geofísica",
    period: "Diciembre 2021",
    achievements: [],
  },
];
