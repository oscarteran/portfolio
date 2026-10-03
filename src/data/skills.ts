export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "IA Generativa & Agentes",
    items: ["Google ADK", "LangGraph", "LangChain", "CrewAI", "MCP", "Prompt Engineering"],
  },
  {
    category: "Recuperación de información",
    items: ["Milvus", "Embeddings", "Chunking", "Reranking", "PostgreSQL"],
  },
  {
    category: "Google Cloud",
    items: ["Cloud Run", "GKE", "BigQuery", "Pub/Sub", "Secret Manager", "Vertex AI"],
  },
  {
    category: "ML & Series de tiempo",
    items: ["SARIMAX", "Prophet", "NeuralProphet", "Análisis espectral"],
  },
  {
    category: "Software & Datos",
    items: ["Python", "FastAPI", "Flask", "Streamlit", "Apache Airflow", "SQL"],
  },
  {
    category: "MLOps & Observabilidad",
    items: ["Docker", "Kubernetes", "GitHub CI/CD", "MLflow", "Grafana"],
  },
];
