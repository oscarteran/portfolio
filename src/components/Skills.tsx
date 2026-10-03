import { skills } from "@/data/skills";
import Section from "./Section";
import Tag from "./Tag";

export default function Skills() {
  return (
    <Section id="habilidades" eyebrow="Stack & herramientas" title="habilidades">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-accent-2">{group.category}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
