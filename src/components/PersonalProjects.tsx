import type { getPersonalProjects } from "@/data/personalProjects";
import type { Dictionary } from "@/data/ui";
import Blueprint from "./Blueprint";
import Section from "./Section";

/** Only rendered when there are personal projects; numbered after Projects. */
export default function PersonalProjects({
  ui,
  projects,
}: {
  ui: Dictionary;
  projects: ReturnType<typeof getPersonalProjects>;
}) {
  return (
    <Section id="proyectos-personales" number="02b" label={ui.sections.personalProjects}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-7">
        {projects.map((project) => (
          <Blueprint as="article" key={project.title} className="flex flex-col gap-2.5 p-[22px]">
            <h3 className="text-[21px] leading-[1.2]">{project.title}</h3>
            <p className="flex-1 text-[14px] leading-[1.55] text-neutral-800">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="tag tag-neutral">
                  {tag}
                </span>
              ))}
            </div>
            {(project.demoUrl || project.repoUrl) && (
              <div className="flex gap-4 pt-1 text-[14px]">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    {ui.demo}
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    {ui.repo}
                  </a>
                )}
              </div>
            )}
          </Blueprint>
        ))}
      </div>
    </Section>
  );
}
