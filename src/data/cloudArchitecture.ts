import { tx, type Locale, type Text } from "@/lib/i18n";

/** "flow": on the query path (numbered steps). "optional": not part of phase 1. */
type NodeKind = "flow" | "default" | "optional";

type NodeSource = {
  title: Text;
  detail: Text;
  kind?: NodeKind;
  /** Query-flow steps that touch this node. */
  steps?: number[];
  tag?: Text;
};

type GroupSource = { label: Text; nodes: NodeSource[] };

/** Target Google Cloud architecture for the featured platform (phase 1). Rendered as zones
 * and numbered steps instead of arrows so it reflows on narrow screens. */
const cloudArchitecture = {
  kicker: { es: "Arquitectura objetivo · Google Cloud", en: "Target architecture · Google Cloud" },
  title: { es: "Migración a Google Cloud · fase 1", en: "Migration to Google Cloud · phase 1" },
  summary: {
    es: "El servidor MCP se migra sin dependencias del cliente y un agente en ADK lo consume como herramienta. Ambientes dev y prod comparten la misma topología.",
    en: "The MCP server is migrated with no client dependencies and an ADK agent consumes it as a tool. Dev and prod environments share the same topology.",
  },
  facts: [
    { es: "10 usuarios", en: "10 users" },
    { es: "~750 consultas/día", en: "~750 queries/day" },
    { es: "Horario 9:00–21:00", en: "Hours 9:00–21:00" },
    { es: "Proyectos dev y prod", en: "Dev and prod projects" },
  ],
  users: {
    label: { es: "Usuarios", en: "Users" },
    nodes: [
      {
        title: { es: "Consultores", en: "Consultants" },
        detail: { es: "10 usuarios · cuenta corporativa", en: "10 users · corporate account" },
        kind: "flow",
        steps: [1],
      },
      {
        title: "Gemini Enterprise",
        detail: {
          es: "Canal alterno donde se registra el agente (licencia por usuario)",
          en: "Alternate channel where the agent is registered (per-user license)",
        },
        kind: "optional",
        tag: { es: "Opcional", en: "Optional" },
      },
    ],
  } satisfies GroupSource,
  region: {
    label: { es: "Región México · northamerica-south1", en: "Mexico region · northamerica-south1" },
    sublabel: { es: "Datos y cómputo", en: "Data and compute" },
    groups: [
      {
        label: { es: "Servicio", en: "Serving" },
        nodes: [
          {
            title: "Web UI · Cloud Run",
            detail: { es: "Acceso con IAP (identidad corporativa)", en: "IAP access (corporate identity)" },
            kind: "flow",
            steps: [1, 2],
          },
          {
            title: "MCP server · Cloud Run",
            detail: {
              es: "FastMCP · tools de RAG, ventas y forecast · autenticación IAM",
              en: "FastMCP · RAG, sales and forecast tools · IAM auth",
            },
            kind: "flow",
            steps: [4, 5, 6],
          },
          {
            title: "Milvus standalone",
            detail: {
              es: "Compute Engine (e2) + Persistent Disk · encendida 9–21 h",
              en: "Compute Engine (e2) + Persistent Disk · on 9am–9pm",
            },
            kind: "flow",
            steps: [5],
            tag: "IaaS",
          },
        ],
      },
      {
        label: { es: "Datos e ingesta", en: "Data and ingestion" },
        nodes: [
          {
            title: "Cloud Storage",
            detail: {
              es: "Documentos .txt · ventas · salidas de forecast (CSV)",
              en: ".txt documents · sales · forecast outputs (CSV)",
            },
          },
          {
            title: { es: "Ingesta · Cloud Run Job", en: "Ingestion · Cloud Run Job" },
            detail: {
              es: "Chunking + embeddings → Milvus, al subir archivos (Eventarc)",
              en: "Chunking + embeddings → Milvus, on file upload (Eventarc)",
            },
          },
          {
            title: "BigQuery",
            detail: { es: "Ventas diarias · resultados de forecast", en: "Daily sales · forecast results" },
            kind: "flow",
            steps: [6],
          },
          {
            title: "RAG Engine / Vector Search",
            detail: { es: "Reemplaza a Milvus con un servicio administrado", en: "Replaces Milvus with a managed service" },
            kind: "optional",
            tag: { es: "Fase 2", en: "Phase 2" },
          },
        ],
      },
      {
        label: { es: "Red y configuración", en: "Network and config" },
        nodes: [
          { title: "Secret Manager", detail: { es: "Llaves y configuración", en: "Keys and configuration" } },
          {
            title: { es: "VPC privada", en: "Private VPC" },
            detail: {
              es: "Cloud Run → Milvus por IP interna (Direct VPC egress)",
              en: "Cloud Run → Milvus over internal IP (Direct VPC egress)",
            },
          },
          {
            title: "Cloud Scheduler",
            detail: { es: "Enciende y apaga la VM de Milvus en horario", en: "Starts and stops the Milvus VM on schedule" },
          },
        ],
      },
    ] satisfies GroupSource[],
  },
  agent: {
    label: { es: "Agent Platform · us-central1", en: "Agent Platform · us-central1" },
    sublabel: { es: "Agente e inferencia", en: "Agent and inference" },
    nodes: [
      {
        title: { es: "Agente · ADK 2.0", en: "Agent · ADK 2.0" },
        detail: {
          es: "Agent Runtime con Sessions · router + subagentes de conocimiento, ventas, forecast y búsqueda web",
          en: "Agent Runtime with Sessions · router + knowledge, sales, forecast and web-search subagents",
        },
        kind: "flow",
        steps: [2, 3, 4, 7],
      },
      {
        title: "Gemini Flash · Pro",
        detail: { es: "Razonamiento y respuesta", en: "Reasoning and response" },
        kind: "flow",
        steps: [3],
      },
      {
        title: "gemini-embedding-001",
        detail: { es: "3,072 dimensiones (mismo esquema)", en: "3,072 dimensions (same schema)" },
      },
      {
        title: "Google Search",
        detail: { es: "Grounding para búsqueda web", en: "Grounding for web search" },
        kind: "flow",
        steps: [7],
      },
      {
        title: "Agent Evaluation",
        detail: { es: "Trazas y calidad de respuestas", en: "Traces and answer quality" },
      },
    ],
    note: {
      es: "Gemini aún no se procesa en la región de México: la inferencia corre en EE. UU.; datos y cómputo permanecen en México.",
      en: "Gemini isn't served from the Mexico region yet: inference runs in the US, while data and compute stay in Mexico.",
    },
  } satisfies GroupSource & { sublabel: Text; note: Text },
  ops: {
    label: { es: "Operación y seguridad (ambos proyectos)", en: "Operations and security (both projects)" },
    items: [
      "Cloud Build",
      "Artifact Registry",
      { es: "Cloud IAM · cuentas de servicio", en: "Cloud IAM · service accounts" },
      "Cloud Logging",
      "Cloud Monitoring",
      "Cloud Trace",
    ] satisfies Text[],
  },
  flowLabel: { es: "Flujo de consulta", en: "Query flow" },
  flow: [
    { es: "El consultor entra a la Web UI a través de IAP.", en: "The consultant reaches the Web UI through IAP." },
    { es: "La Web UI envía la consulta al agente en ADK.", en: "The Web UI sends the query to the ADK agent." },
    { es: "El agente razona con Gemini Flash o Pro.", en: "The agent reasons with Gemini Flash or Pro." },
    { es: "Llama al servidor MCP con un token IAM.", en: "It calls the MCP server with an IAM token." },
    { es: "MCP recupera contexto de Milvus (RAG).", en: "MCP retrieves context from Milvus (RAG)." },
    { es: "MCP consulta ventas y forecast en BigQuery.", en: "MCP queries sales and forecast in BigQuery." },
    { es: "El agente hace grounding con Google Search.", en: "The agent grounds answers with Google Search." },
  ] satisfies Text[],
  ingestLabel: { es: "Ingesta de datos", en: "Data ingestion" },
  ingest: [
    { es: "Un archivo nuevo en Cloud Storage dispara el job vía Eventarc.", en: "A new file in Cloud Storage triggers the job via Eventarc." },
    { es: "El job hace chunking y embeddings, y escribe los vectores en Milvus.", en: "The job chunks and embeds it, then writes the vectors to Milvus." },
    { es: "Ventas y salidas de forecast se cargan a BigQuery.", en: "Sales and forecast outputs are loaded into BigQuery." },
  ] satisfies Text[],
  legend: {
    flow: { es: "En el flujo de consulta", en: "On the query path" },
    optional: { es: "Opcional / evolución", en: "Optional / evolution" },
  },
};

function node(n: NodeSource, locale: Locale) {
  return {
    title: tx(n.title, locale),
    detail: tx(n.detail, locale),
    kind: n.kind ?? "default",
    steps: n.steps ?? [],
    tag: n.tag && tx(n.tag, locale),
  };
}

export function getCloudArchitecture(locale: Locale) {
  const a = cloudArchitecture;
  const t = (text: Text) => tx(text, locale);
  return {
    kicker: t(a.kicker),
    title: t(a.title),
    summary: t(a.summary),
    facts: a.facts.map(t),
    users: { label: t(a.users.label), nodes: a.users.nodes.map((n) => node(n, locale)) },
    region: {
      label: t(a.region.label),
      sublabel: t(a.region.sublabel),
      groups: a.region.groups.map((g) => ({ label: t(g.label), nodes: g.nodes.map((n) => node(n, locale)) })),
    },
    agent: {
      label: t(a.agent.label),
      sublabel: t(a.agent.sublabel),
      nodes: a.agent.nodes.map((n) => node(n, locale)),
      note: t(a.agent.note),
    },
    ops: { label: t(a.ops.label), items: a.ops.items.map(t) },
    flowLabel: t(a.flowLabel),
    flow: a.flow.map(t),
    ingestLabel: t(a.ingestLabel),
    ingest: a.ingest.map(t),
    legend: { flow: t(a.legend.flow), optional: t(a.legend.optional) },
  };
}

export type CloudArchitecture = ReturnType<typeof getCloudArchitecture>;
export type CloudNode = CloudArchitecture["users"]["nodes"][number];
