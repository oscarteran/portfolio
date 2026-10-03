"use client";

import { useEffect } from "react";
import { buttonClass } from "@/lib/styles";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-start justify-center px-6 py-20 sm:px-10 lg:px-16">
      <p className="font-mono text-sm text-danger">Error</p>
      <h1 className="mt-3 font-black uppercase tracking-tight text-4xl">Algo salió mal</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        Ocurrió un problema al mostrar esta página. Puedes intentar de nuevo.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className={`mt-8 ${buttonClass.primary}`}
      >
        Reintentar
      </button>
    </div>
  );
}
