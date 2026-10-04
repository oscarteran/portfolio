import type { Metadata } from "next";
import Blueprint from "@/components/Blueprint";
import { getSite } from "@/data/site";
import { getUi } from "@/data/ui";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// Each locale has its own root layout, so unmatched URLs need a 404 that brings its own
// <html>. It's shown in Spanish (the default locale) with a link to the English home.
const ui = getUi("es").notFound;
const en = getUi("en").notFound;

export const metadata: Metadata = {
  metadataBase: new URL(getSite("es").url),
  title: `404 — ${ui.title}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <main className="flex min-h-screen flex-col items-start justify-center gap-4 px-[clamp(20px,5vw,72px)] py-20">
          <p className="kicker">404</p>
          <h1 className="text-[clamp(36px,4vw,52px)] uppercase">{ui.title}</h1>
          <p className="max-w-md text-[16px] text-neutral-800">{ui.body}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Blueprint as="a" href="/" className="btn btn-primary btn-lg">
              {ui.back}
            </Blueprint>
            <a href="/en" hrefLang="en" lang="en" className="text-[14px]">
              {en.back}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
