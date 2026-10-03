export const site = {
  name: "Oscar Hernández Terán",
  role: "AI Engineer",
  tagline:
    "Llevo IA generativa a producción: agentes con RAG que bajaron la generación de informes de 4 horas a 30 minutos.",
  bio: "Ingeniero Geofísico por la UNAM y AI Engineer con más de 4 años de experiencia diseñando soluciones de IA generativa y Agentic AI para clientes enterprise. Mi base en métodos numéricos y análisis espectral de series de tiempo me da rigor para modelar, evaluar y explicar sistemas de IA. Certificado Google Cloud Associate Cloud Engineer.",
  // location: "México",
  // Canonical origin for metadata, OG images and the sitemap. Set NEXT_PUBLIC_SITE_URL at
  // build time in production (it is inlined during `next build`).
  // `||`, not `??`: an unset Docker ARG arrives as "" rather than undefined.
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "oscarhdzteran@gmail.com",
  cvUrl: "/CV_Oscar_Hernandez_Teran.pdf",
  cvFileName: "Oscar-Hernandez-Teran-CV.pdf",
  social: {
    github: "",
    linkedin: "https://www.linkedin.com/in/oscarhernandezteran",
  },
};

export const nav = [
  { label: "Inicio", href: "#inicio" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Experiencia", href: "#experiencia" },
  { label: "Habilidades", href: "#habilidades" },
  { label: "Contacto", href: "#contacto" },
];
