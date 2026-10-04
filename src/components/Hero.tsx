import type { Site } from "@/data/site";
import type { Dictionary } from "@/data/ui";
import Blueprint from "./Blueprint";

/** "Oscar Hernández Terán" → ["Oscar", "Hernández Terán"]: given names, then both surnames. */
function splitName(name: string) {
  const words = name.split(" ").filter(Boolean);
  const cut = Math.max(1, Math.floor(words.length / 2));
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

export default function Hero({ site, ui }: { site: Site; ui: Dictionary }) {
  const [givenNames, surnames] = splitName(site.name);

  return (
    <section
      id="inicio"
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-x-16 gap-y-10 pt-[88px]"
    >
      <div className="flex flex-col gap-5">
        <p className="kicker">
          {site.role} · {site.location}
        </p>
        <h1 className="text-[clamp(48px,6vw,80px)] uppercase leading-[0.98] tracking-[0.01em]">
          {givenNames}
          <span className="block">{surnames}</span>
        </h1>
        <div className="flex flex-wrap gap-3 pt-2">
          <Blueprint as="a" href="#proyectos" className="btn btn-primary btn-lg">
            {ui.ctaProjects}
          </Blueprint>
          <a href="#contacto" className="btn btn-secondary btn-lg">
            {ui.ctaContact}
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-heading text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.2]">{site.tagline}</p>
        <p className="text-[16px] leading-[1.6] text-neutral-800">{site.bio}</p>
      </div>
    </section>
  );
}
