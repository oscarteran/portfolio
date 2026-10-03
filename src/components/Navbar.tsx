import Link from "next/link";
import { nav, site } from "@/data/site";
import NavLinks from "./NavLinks";
import SocialLinks from "./SocialLinks";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-6 sm:px-10 lg:px-16">
        <Link
          href="#inicio"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border text-sm font-bold text-accent-2"
        >
          {initials(site.name)}
        </Link>

        <NavLinks
          items={nav}
          indicator
          className="hidden items-center gap-7 text-sm lg:flex"
          linkClassName="py-1.5"
        />

        <div className="flex items-center gap-4">
          <SocialLinks className="max-sm:hidden" />
          <a
            href={site.cvUrl}
            download={site.cvFileName}
            className="shrink-0 rounded-sm bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Descargar CV
          </a>
        </div>
      </div>

      <NavLinks
        items={nav}
        className="mx-auto flex max-w-[1600px] items-center gap-6 overflow-x-auto border-t border-border px-6 py-2 text-sm lg:hidden"
        linkClassName="whitespace-nowrap"
      />
    </header>
  );
}
