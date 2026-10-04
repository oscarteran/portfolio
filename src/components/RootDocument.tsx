import type { ReactNode } from "react";
import { getUi } from "@/data/ui";
import { fontVariables } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";
import { personJsonLd } from "@/lib/metadata";
import "@/app/globals.css";

/** <html> shell shared by every locale's root layout. */
export default function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const ui = getUi(locale);
  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg"
        >
          {ui.skipLink}
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
