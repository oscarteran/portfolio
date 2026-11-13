import type { Site } from "@/data/site";
import type { Dictionary } from "@/data/ui";
import Section from "./Section";

export default function Contact({ site, ui }: { site: Site; ui: Dictionary }) {
  return (
    <Section id="contacto" number="05" label={ui.sections.contact} spacing="md">
      <div className="flex max-w-[640px] flex-col gap-5">
        <h3 className="text-[clamp(36px,4vw,52px)] uppercase leading-[1.05]">{ui.contactTitle}</h3>
        <p className="text-[17px] leading-[1.6] text-neutral-800">{ui.contactBody}</p>
        <div className="flex flex-col items-start gap-2.5 text-[15px]">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {site.social.linkedin && (
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
          {site.social.github && (
            <a href={site.social.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
          {site.cvs.map((cv) => (
            <a key={cv.lang} href={cv.url} download={cv.fileName} hrefLang={cv.lang}>
              {ui.cv} · {cv.label}
            </a>
          ))}
          <span className="text-neutral-700">{site.location}</span>
        </div>
      </div>
    </Section>
  );
}
