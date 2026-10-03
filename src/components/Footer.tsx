import { site } from "@/data/site";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1600px] px-6 py-10 sm:px-10 lg:px-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black uppercase tracking-tight text-lg">{site.name}</p>
          <p className="mt-1 text-sm text-muted">{site.role}</p>
        </div>
        <SocialLinks />
      </div>

      <div className="mt-8 border-t border-border pt-6 text-xs text-muted">
        <p>
          © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
