import type { MetadataRoute } from "next";
import { getSite } from "@/data/site";
import { localePath, locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = getSite("es");
  const languages = Object.fromEntries(locales.map((l) => [l, new URL(localePath(l), url).toString()]));
  return locales.map((locale) => ({
    url: languages[locale],
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "es" ? 1 : 0.9,
    alternates: { languages },
  }));
}
