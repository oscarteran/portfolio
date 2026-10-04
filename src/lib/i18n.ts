export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

/** A string that differs per language. Plain strings are used as-is in every locale. */
export type Localized<T = string> = Record<Locale, T>;
export type Text = string | Localized;

export function tx(text: Text, locale: Locale): string {
  return typeof text === "string" ? text : text[locale];
}

/** Spanish lives at the root so existing links keep working; other locales get a prefix. */
export function localePath(locale: Locale) {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

export const ogLocale: Record<Locale, string> = { es: "es_MX", en: "en_US" };
