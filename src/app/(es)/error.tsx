"use client";

import ErrorView from "@/components/ErrorView";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorView locale="es" error={error} retry={retry} />;
}
