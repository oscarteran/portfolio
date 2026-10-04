"use client";

import { locales, localePath, type Locale } from "@/lib/i18n";

/** Segmented ES | EN control. Each language is its own page, so options are plain links;
 * clicking one carries the current #section over so the visitor stays where they were. */
export default function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  return (
    <nav aria-label={label} className="inline-flex border border-divider">
      {locales.map((option, i) => {
        const active = option === locale;
        return (
          <a
            key={option}
            href={localePath(option)}
            hrefLang={option}
            lang={option}
            aria-current={active ? "true" : undefined}
            onClick={(e) => {
              if (active || !window.location.hash) return;
              e.preventDefault();
              window.location.href = localePath(option) + window.location.hash;
            }}
            className={`px-3 py-[7px] text-[13px] leading-none no-underline ${i > 0 ? "border-l border-divider" : ""} ${
              active
                ? "bg-accent text-bg hover:text-bg"
                : "text-text hover:bg-[color-mix(in_srgb,var(--color-text)_7%,transparent)] hover:text-text"
            }`}
          >
            {option.toUpperCase()}
          </a>
        );
      })}
    </nav>
  );
}
