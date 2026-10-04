import { tx, type Locale, type Text } from "@/lib/i18n";

type SkillGroup = { category: Text; items: Text[] };

const skills: SkillGroup[] = [
  {
    category: { es: "IA Generativa & Agentes", en: "Generative AI & Agents" },
    items: ["Google ADK", "LangGraph", "LangChain", "CrewAI", "MCP", "Prompt Engineering"],
  },
  {
    category: { es: "Recuperación de información", en: "Information retrieval" },
    items: ["Milvus", "Embeddings", "Chunking", "Reranking", "PostgreSQL"],
  },
  {
    category: "Google Cloud",
    items: ["Cloud Run", "GKE", "BigQuery", "Pub/Sub", "Secret Manager", "Vertex AI"],
  },
  {
    category: { es: "ML & Series de tiempo", en: "ML & Time series" },
    items: ["SARIMAX", "Prophet", "NeuralProphet", { es: "Análisis espectral", en: "Spectral analysis" }],
  },
  {
    category: { es: "Software & Datos", en: "Software & Data" },
    items: ["Python", "FastAPI", "Flask", "Streamlit", "Apache Airflow", "SQL"],
  },
  {
    category: { es: "MLOps & Observabilidad", en: "MLOps & Observability" },
    items: ["Docker", "Kubernetes", "GitHub CI/CD", "MLflow", "Grafana"],
  },
];

export function getSkills(locale: Locale) {
  return skills.map((g) => ({ category: tx(g.category, locale), items: g.items.map((i) => tx(i, locale)) }));
}
