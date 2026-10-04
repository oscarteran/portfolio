import Section from "./Section";

type Metric = { value: string; label: string };

/** Headline results grid. The container draws the top/left edges and each cell its
 * right/bottom ones, so the hairlines stay single however the grid wraps. */
export default function Metrics({ label, metrics }: { label: string; metrics: Metric[] }) {
  return (
    <Section id="logros" number="01" label={label} className="pt-[72px]">
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,190px),1fr))] border-l border-t border-divider">
        {metrics.map((m) => (
          <li key={m.value} className="flex flex-col gap-2 border-b border-r border-divider p-6">
            <span className="font-heading text-[48px] font-semibold leading-none text-accent-700">{m.value}</span>
            <span className="text-[14px] leading-[1.45] text-neutral-800">{m.label}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
