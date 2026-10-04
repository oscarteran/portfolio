"use client";

import { useEffect } from "react";
import { getUi } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import Blueprint from "./Blueprint";

export default function ErrorView({ locale, error, retry }: { locale: Locale; error: Error; retry: () => void }) {
  const ui = getUi(locale).error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-start justify-center gap-4 px-[clamp(20px,5vw,72px)] py-20">
      <p className="kicker text-danger">Error</p>
      <h1 className="text-[clamp(36px,4vw,52px)] uppercase">{ui.title}</h1>
      <p className="max-w-md text-[16px] text-neutral-800">{ui.body}</p>
      <Blueprint as="button" type="button" onClick={() => retry()} className="btn btn-primary btn-lg mt-4">
        {ui.retry}
      </Blueprint>
    </div>
  );
}
