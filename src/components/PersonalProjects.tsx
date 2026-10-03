import { ExternalLink } from "lucide-react";
import { personalProjects } from "@/data/personalProjects";
import { buttonClass } from "@/lib/styles";
import Card from "./Card";
import { GithubIcon } from "./icons";
import ProjectVisual from "./ProjectVisual";
import Reveal from "./Reveal";
import Section from "./Section";
import Tag from "./Tag";

export default function PersonalProjects() {
  return (
    <Section id="proyectos-personales" eyebrow="Fuera del trabajo" title="proyectos personales">
      <div className="grid gap-6 sm:grid-cols-2">
        {personalProjects.map((project, i) => (
          <Reveal key={project.title} index={i}>
            <Card className="flex h-full flex-col">
              <div className="relative h-32 shrink-0 overflow-hidden rounded-md border border-border bg-background/40 text-accent/70 sm:h-36">
                <ProjectVisual kind={project.visual} seed={project.title} />
              </div>

              <h3 className="mt-5 font-bold text-xl">{project.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{project.description}</p>

              {project.highlights && project.highlights.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>
                      <span className="text-accent-2">— </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Tag key={tag} className="font-mono">
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={buttonClass.primary}>
                    Ver demo
                    <ExternalLink size={15} />
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={buttonClass.secondary}>
                    Ver código
                    <GithubIcon size={15} />
                  </a>
                )}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
