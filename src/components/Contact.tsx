import { Download, Mail } from "lucide-react";
import { site } from "@/data/site";
import ContactForm from "./ContactForm";
import { GithubIcon, LinkedinIcon } from "./icons";
import Section from "./Section";

export default function Contact() {
  return (
    <Section id="contacto" eyebrow="Contacto" title="hablemos">
        <div className="grid gap-12 xl:grid-cols-2 xl:items-start xl:gap-16">
          <div>
            <p className="max-w-md text-base leading-relaxed text-muted sm:text-lg">
              ¿Tienes un proyecto en mente o una oportunidad para conversar? Escríbeme, con gusto te
              respondo.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="flex w-fit items-center gap-2 font-mono text-muted transition-colors hover:text-accent-2"
              >
                <Mail size={16} /> {site.email}
              </a>
              {site.social.github && (
                <a
                  href={site.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-2 text-muted transition-colors hover:text-accent-2"
                >
                  <GithubIcon size={16} /> GitHub
                </a>
              )}
              {site.social.linkedin && (
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-2 text-muted transition-colors hover:text-accent-2"
                >
                  <LinkedinIcon size={16} /> LinkedIn
                </a>
              )}
              <a
                href={site.cvUrl}
                download={site.cvFileName}
                className="flex w-fit items-center gap-2 text-muted transition-colors hover:text-accent-2"
              >
                <Download size={16} /> Descargar CV
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
    </Section>
  );
}
