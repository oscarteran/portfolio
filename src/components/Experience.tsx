import type { certification as Certification, getEducation, getExperience } from "@/data/experience";
import type { Dictionary } from "@/data/ui";
import Blueprint from "./Blueprint";
import DashList from "./DashList";
import Section from "./Section";

type Props = {
  ui: Dictionary;
  experience: ReturnType<typeof getExperience>;
  education: ReturnType<typeof getEducation>;
  certification: typeof Certification;
};

function CredentialCard({ kicker, title, meta }: { kicker: string; title: string; meta: string }) {
  return (
    <Blueprint className="flex flex-col gap-1 p-5">
      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-accent-700">{kicker}</span>
      <span className="font-heading text-[22px] font-semibold">{title}</span>
      <span className="text-[14px] text-neutral-700">{meta}</span>
    </Blueprint>
  );
}

export default function Experience({ ui, experience, education, certification }: Props) {
  return (
    <Section id="experiencia" number="03" label={ui.sections.experience}>
      {experience.map((job) => (
        <article
          key={job.code}
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-12 gap-y-3 border-b border-rule pb-8 pt-6"
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold tracking-[0.08em] text-accent-700">{job.code}</span>
            <h3 className="text-[28px]">{job.role}</h3>
            <span className="text-[15px] font-medium">{job.company}</span>
            <span className="text-[13px] text-neutral-700">{job.period}</span>
          </div>
          {/* Spanning 2 columns would add an implicit column (and overflow) once the grid
              collapses to one column, below ~632px of viewport. */}
          <div className="col-span-2 flex min-w-0 flex-col gap-3.5 max-[639px]:col-span-1">
            <p className="text-[16px] leading-[1.6]">{job.summary}</p>
            <DashList items={job.achievements} className="gap-2" />
          </div>
        </article>
      ))}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-7 pt-7">
        <CredentialCard
          kicker={ui.education}
          title={education.degree}
          meta={`${education.school} · ${education.year}`}
        />
        <CredentialCard
          kicker={ui.certification}
          title={certification.name}
          meta={`${certification.issuer} · ${certification.year}`}
        />
      </div>
    </Section>
  );
}
