import type { Locale } from "@/lib/i18n";

/** Interface copy: labels, headings and messages that aren't part of the portfolio content. */
const ui = {
  es: {
    skipLink: "Saltar al contenido",
    nav: [
      { label: "Proyectos", href: "#proyectos" },
      { label: "Experiencia", href: "#experiencia" },
      { label: "Habilidades", href: "#habilidades" },
      { label: "Contacto", href: "#contacto" },
    ],
    mainNav: "Principal",
    languageLabel: "Idioma",
    cv: "Descargar CV",
    ctaProjects: "Ver proyectos",
    ctaContact: "Contactar",
    seismogram: {
      title: "Sismograma de carrera",
      station: "Estación OHT · Veracruz, MX",
      channel: "Canal HHZ · vertical",
      caption:
        "Registro de un sismómetro de banda ancha, como los que analicé en Geofísica. Cada evento es un cambio de rol: P marca la llegada de la onda primaria y S la de la secundaria, y la magnitud crece con el alcance de cada etapa.",
      figureLabel: "Sismograma de carrera: tres eventos que marcan la formación en la UNAM, CBPI Consulting y Minsait.",
    },
    sections: {
      metrics: "Resultados",
      projects: "Proyectos",
      personalProjects: "Proyectos personales",
      experience: "Experiencia",
      skills: "Habilidades",
      contact: "Contacto",
    },
    featuredKicker: "Caso destacado",
    architecture: "Arquitectura del sistema",
    education: "Formación",
    certification: "Certificación",
    contactTitle: "Hablemos",
    contactBody:
      "Si tu equipo construye productos con LLMs, agentes o forecasting, me interesa conversar. Escríbeme y te respondo.",
    form: {
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      honeypot: "No llenar",
      send: "Enviar mensaje",
      sending: "Enviando…",
      successTitle: "¡Mensaje enviado!",
      successBody: "Gracias por escribir. Te respondo lo antes posible.",
      mailtoBefore: "Se abrirá tu cliente de correo con el mensaje listo. Si no se abre, escríbeme a",
    },
    footer: "De señales sísmicas a sistemas multiagente.",
    demo: "Demo",
    repo: "Código",
    notFound: {
      title: "No encontramos esta página",
      body: "El enlace puede estar roto o la página se movió. Vuelve al inicio para seguir explorando.",
      back: "Volver al inicio",
    },
    error: {
      title: "Algo salió mal",
      body: "Ocurrió un problema al mostrar esta página. Puedes intentar de nuevo.",
      retry: "Reintentar",
    },
  },
  en: {
    skipLink: "Skip to content",
    nav: [
      { label: "Projects", href: "#proyectos" },
      { label: "Experience", href: "#experiencia" },
      { label: "Skills", href: "#habilidades" },
      { label: "Contact", href: "#contacto" },
    ],
    mainNav: "Main",
    languageLabel: "Language",
    cv: "Download CV",
    ctaProjects: "View projects",
    ctaContact: "Get in touch",
    seismogram: {
      title: "Career seismogram",
      station: "Station OHT · Veracruz, MX",
      channel: "Channel HHZ · vertical",
      caption:
        "A broadband seismometer record, like the ones I analyzed in Geophysics. Each event is a role change: P marks the primary-wave arrival and S the secondary, and magnitude grows with the scope of each stage.",
      figureLabel: "Career seismogram: three events marking UNAM, CBPI Consulting and Minsait.",
    },
    sections: {
      metrics: "Results",
      projects: "Projects",
      personalProjects: "Personal projects",
      experience: "Experience",
      skills: "Skills",
      contact: "Contact",
    },
    featuredKicker: "Featured case",
    architecture: "System architecture",
    education: "Education",
    certification: "Certification",
    contactTitle: "Let's talk",
    contactBody:
      "If your team builds products with LLMs, agents or forecasting, I'd like to hear about it. Write to me and I'll get back to you.",
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      honeypot: "Do not fill",
      send: "Send message",
      sending: "Sending…",
      successTitle: "Message sent!",
      successBody: "Thanks for writing. I'll get back to you as soon as I can.",
      mailtoBefore: "Your mail client will open with the message ready. If it doesn't, write to me at",
    },
    footer: "From seismic signals to multi-agent systems.",
    demo: "Demo",
    repo: "Code",
    notFound: {
      title: "We couldn't find this page",
      body: "The link may be broken or the page has moved. Head back home to keep exploring.",
      back: "Back to home",
    },
    error: {
      title: "Something went wrong",
      body: "There was a problem showing this page. You can try again.",
      retry: "Try again",
    },
  },
} satisfies Record<Locale, unknown>;

export type Dictionary = (typeof ui)["es"];

// Compile-time check that every locale has exactly the same keys as Spanish.
ui satisfies Record<Locale, Dictionary>;

export function getUi(locale: Locale): Dictionary {
  return ui[locale];
}
