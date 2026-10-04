import type { Metadata, Viewport } from "next";
import { getSite } from "@/data/site";
import { localePath, locales, ogLocale, type Locale } from "./i18n";

const ogImage = { url: "/opengraph-image", width: 1200, height: 630, type: "image/png" };

const keywords = ["AI Engineer", "IA Generativa", "Agentic AI", "RAG", "Multi-Agent", "LLM", "Google Cloud", "Forecasting", "Python"];

export function buildMetadata(locale: Locale): Metadata {
  const site = getSite(locale);
  const title = `${site.name} — ${site.role}`;
  const path = localePath(locale);

  return {
    metadataBase: new URL(site.url),
    title,
    description: site.tagline,
    authors: [{ name: site.name, url: site.url }],
    keywords,
    alternates: {
      canonical: path,
      languages: { ...Object.fromEntries(locales.map((l) => [l, localePath(l)])), "x-default": "/" },
    },
    openGraph: {
      type: "profile",
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      url: path,
      siteName: site.name,
      title,
      description: site.tagline,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description: site.tagline, images: [ogImage.url] },
    // app/icon.tsx and app/opengraph-image.tsx sit above the per-locale root layouts, so
    // Next doesn't link them automatically; reference them explicitly.
    icons: { icon: { url: "/icon", type: "image/png", sizes: "64x64" } },
  };
}

export const viewport: Viewport = { themeColor: "#f2f2f3", colorScheme: "light" };

/** Structured data so search engines can show a rich result for the person, not just the page. */
export function personJsonLd(locale: Locale) {
  const site = getSite(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.bio,
    url: new URL(localePath(locale), site.url).toString(),
    email: `mailto:${site.email}`,
    sameAs: Object.values(site.social).filter(Boolean),
    alumniOf: "Universidad Nacional Autónoma de México",
  };
}
