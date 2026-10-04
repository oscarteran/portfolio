import { tx, type Locale, type Text } from "@/lib/i18n";

type PersonalProjectSource = {
  title: Text;
  description: Text;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
};

/** The "Proyectos personales" section stays hidden while this list is empty. */
const personalProjects: PersonalProjectSource[] = [];

export function getPersonalProjects(locale: Locale) {
  return personalProjects.map((p) => ({
    title: tx(p.title, locale),
    description: tx(p.description, locale),
    tags: p.tags,
    demoUrl: p.demoUrl,
    repoUrl: p.repoUrl,
  }));
}
