import type { CSSProperties } from "react";
import type { Project, getArchitecture } from "@/data/projects";
import type { Dictionary } from "@/data/ui";
import Blueprint from "./Blueprint";
import DashList from "./DashList";
import Section from "./Section";

type Architecture = ReturnType<typeof getArchitecture>;

const dotGrid: CSSProperties = {
  backgroundImage: "radial-gradient(color-mix(in srgb, var(--color-text) 12%, transparent) 1px, transparent 1px)",
  backgroundSize: "16px 16px",
};

function Connector() {
  return <div aria-hidden="true" className="h-5 w-px self-center bg-accent" />;
}

function ArchitectureDiagram({ arch }: { arch: Architecture }) {
  const box = "border border-divider bg-bg";
  return (
    <div className="flex flex-1 flex-col justify-center border border-divider px-6 py-7 text-[14px]" style={dotGrid}>
      <div className={`${box} self-center whitespace-nowrap px-4 py-2`}>{arch.user}</div>
      <Connector />
      <div className="flex flex-col items-center gap-0.5 self-center border border-accent bg-bg px-5 py-2.5 text-center">
        <span className="whitespace-nowrap font-semibold">{arch.router}</span>
        <span className="text-[12px] text-neutral-700">{arch.routerDetail}</span>
      </div>
      <Connector />
      <div aria-hidden="true" className="mx-[16.6%] h-5 border border-b-0 border-accent" />
      <ul className="grid grid-cols-3 gap-3">
        {arch.agents.map((agent) => (
          <li key={agent.title} className={`${box} flex flex-col gap-0.5 px-2 py-2.5 text-center`}>
            <span className="whitespace-nowrap font-semibold">{agent.title}</span>
            <span className="text-[12px] text-neutral-700">{agent.detail}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-dashed border-neutral-400 pt-2.5 text-[12px] text-neutral-700">
        <span>{arch.deploy}</span>
        <span>{arch.observability}</span>
      </div>
    </div>
  );
}

function FeaturedCase({ project, arch, ui }: { project: Project; arch: Architecture; ui: Dictionary }) {
  const featured = project.featured!;
  return (
    <Blueprint as="article" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-10 p-8">
      <div className="flex flex-col gap-[18px]">
        <div className="flex flex-wrap justify-between gap-4 text-[13px]">
          <span className="font-semibold uppercase tracking-[0.08em] text-accent-700">
            {ui.featuredKicker} · {project.sector}
          </span>
          <span className="text-neutral-700">
            {featured.org} · {featured.period}
          </span>
        </div>
        <h3 className="text-[36px] uppercase tracking-[0.01em]">{project.title}</h3>
        <p className="text-[16px] leading-[1.6] text-neutral-800">{project.description}</p>
        <dl className="flex flex-wrap gap-9 border-y border-divider py-4">
          {featured.stats.map((stat) => (
            <div key={stat.value} className="flex flex-col-reverse gap-1">
              <dt className="text-[13px] text-neutral-700">{stat.label}</dt>
              <dd className={`font-heading text-[40px] font-semibold leading-none ${stat.accent ? "text-accent-700" : ""}`}>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        <DashList items={project.highlights} className="gap-2.5" />
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="tag tag-outline">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-700">{ui.architecture}</span>
        <ArchitectureDiagram arch={arch} />
      </div>
    </Blueprint>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Blueprint as="article" className="flex flex-col gap-2.5 p-[22px]">
      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-700">{project.sector}</span>
      <span className="font-heading text-[36px] font-semibold leading-none text-accent-700">{project.metric}</span>
      <h3 className="text-[21px] leading-[1.2]">{project.title}</h3>
      <p className="flex-1 text-[14px] leading-[1.55] text-neutral-800">{project.description}</p>
      <div className="flex flex-wrap gap-1.5 pt-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="tag tag-neutral">
            {tag}
          </span>
        ))}
      </div>
    </Blueprint>
  );
}

export default function Projects({
  projects,
  arch,
  ui,
}: {
  projects: Project[];
  arch: Architecture;
  ui: Dictionary;
}) {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== featured);

  return (
    <Section id="proyectos" number="02" label={ui.sections.projects} spacing="md">
      {featured && <FeaturedCase project={featured} arch={arch} ui={ui} />}
      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-7">
        {rest.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </Section>
  );
}
