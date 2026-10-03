import Link from "next/link";
import { buttonClass } from "@/lib/styles";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-start justify-center px-6 py-20 sm:px-10 lg:px-16">
      <p className="font-mono text-sm text-accent-2">404</p>
      <h1 className="mt-3 font-black uppercase tracking-tight text-4xl">No encontramos esta página</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        El enlace puede estar roto o la página se movió. Vuelve al inicio para seguir explorando.
      </p>
      <Link
        href="/"
        className={`mt-8 ${buttonClass.primary}`}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
