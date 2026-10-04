import RootDocument from "@/components/RootDocument";
import { buildMetadata } from "@/lib/metadata";

export { viewport } from "@/lib/metadata";
export const metadata = buildMetadata("en");

export default function EnglishLayout({ children }: LayoutProps<"/en">) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
