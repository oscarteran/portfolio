import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/data/site";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.tagline,
  authors: [{ name: site.name, url: site.url }],
  keywords: ["AI Engineer", "IA Generativa", "Agentic AI", "RAG", "Multi-Agent", "LLM", "Google Cloud", "Forecasting", "Python"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "es_MX",
    url: "/",
    siteName: site.name,
    title,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#15171c",
};

// Structured data so search engines can show a rich result for the person, not just the page.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.bio,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: Object.values(site.social).filter(Boolean),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
        >
          Saltar al contenido
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
