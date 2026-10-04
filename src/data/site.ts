import { tx, type Locale, type Text } from "@/lib/i18n";

const siteBase = {
  name: "Oscar Hernández Terán",
  role: "AI Engineer",
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

const siteText = {
  tagline: {
    es: "Llevo IA generativa a producción: agentes con RAG que bajaron la generación de informes de 4 horas a 30 minutos.",
    en: "I take generative AI to production: RAG agents that cut report generation from 4 hours to 30 minutes.",
  },
  bio: {
    es: "Ingeniero Geofísico por la UNAM y AI Engineer con más de 4 años de experiencia diseñando soluciones de IA generativa y Agentic AI para clientes enterprise. Mi base en métodos numéricos y análisis espectral de series de tiempo me da rigor para modelar, evaluar y explicar sistemas de IA.",
    en: "Geophysical Engineer from UNAM and AI Engineer with 4+ years of experience designing generative AI and Agentic AI solutions for enterprise clients. My background in numerical methods and spectral time-series analysis gives me rigor to model, evaluate and explain AI systems.",
  },
  location: { es: "Veracruz, México · Remoto", en: "Veracruz, Mexico · Remote" },
} satisfies Record<string, Text>;

export function getSite(locale: Locale) {
  return {
    ...siteBase,
    tagline: tx(siteText.tagline, locale),
    bio: tx(siteText.bio, locale),
    location: tx(siteText.location, locale),
  };
}

export type Site = ReturnType<typeof getSite>;
