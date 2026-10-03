import type { ProjectVisualKind } from "./projects";

export type PersonalProject = {
  title: string;
  description: string;
  tags: string[];
  visual: ProjectVisualKind;
  highlights?: string[];
  demoUrl?: string;
  repoUrl?: string;
};

/** The "Proyectos personales" section stays hidden while this list is empty. When adding
 * entries, also add `{ label: "Proyectos personales", href: "#proyectos-personales" }` to `nav` in site.ts. */
export const personalProjects: PersonalProject[] = [];
