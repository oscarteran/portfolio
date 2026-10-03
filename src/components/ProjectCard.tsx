"use client";

import type { Project } from "@/data/projects";
import Card from "./Card";
import ProjectVisual from "./ProjectVisual";
import Tag from "./Tag";

export default function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <Card featured={project.featured} className="flex h-[480px] flex-col" onClick={onOpen}>
      <div className="relative h-24 shrink-0 overflow-hidden rounded-md border border-border bg-background/40 transition-colors duration-300 group-hover:border-accent-2 sm:h-28">
        <div className="h-full w-full text-accent/70 transition-[color,transform] duration-500 ease-out group-hover:scale-[1.04] group-hover:text-accent-2">
          <ProjectVisual kind={project.visual} seed={project.title} />
        </div>
      </div>

      <h3 className="mt-5 line-clamp-2 font-bold text-xl">{project.title}</h3>
      {project.period && (
        <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-2/40 bg-accent-2/10 px-2.5 py-1 font-mono text-xs text-accent-2">
          {project.period}
        </span>
      )}
      <p className="mt-3 line-clamp-4 flex-1 text-[15px] leading-relaxed text-muted">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Tag key={tag} className="font-mono">
            {tag}
          </Tag>
        ))}
      </div>
    </Card>
  );
}
