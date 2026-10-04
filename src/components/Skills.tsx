import type { getSkills } from "@/data/skills";
import Section from "./Section";

/** Skill groups in a ruled grid. Like the results grid, the container draws the top/left
 * edges and each cell its right/bottom ones, so a short last row leaves no filled gaps. */
export default function Skills({ label, skills }: { label: string; skills: ReturnType<typeof getSkills> }) {
  return (
    <Section id="habilidades" number="04" label={label}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] border-l border-t border-divider">
        {skills.map((group) => (
          <div key={group.category} className="flex flex-col gap-3 border-b border-r border-divider p-[22px]">
            <h3 className="text-[19px] uppercase tracking-[0.02em]">{group.category}</h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li key={item} className="tag tag-outline">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
