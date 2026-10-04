import RootDocument from "@/components/RootDocument";
import { buildMetadata } from "@/lib/metadata";

export { viewport } from "@/lib/metadata";
export const metadata = buildMetadata("es");

export default function SpanishLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
