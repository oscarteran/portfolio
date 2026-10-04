import type { Site } from "@/data/site";
import type { Dictionary } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import ContactForm from "./ContactForm";
import Section from "./Section";

export default function Contact({ site, ui, locale }: { site: Site; ui: Dictionary; locale: Locale }) {
  return (
    <Section id="contacto" number="05" label={ui.sections.contact} spacing="md">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-[72px] gap-y-12">
        <div className="flex flex-col gap-5">
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
            <a href={site.cvUrl} download={site.cvFileName}>
              {ui.cv}
            </a>
            <span className="text-neutral-700">{site.location}</span>
          </div>
        </div>
        <ContactForm locale={locale} email={site.email} ui={ui.form} />
      </div>
    </Section>
  );
}
