import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  /** Two-digit order shown in the kicker, e.g. "02". */
  number: string;
  label: string;
  /** Space between the rule and the content. */
  spacing?: "sm" | "md";
  className?: string;
  children: ReactNode;
};

/** Section opened by a numbered kicker ("02 · Proyectos") over a 1px rule. */
export default function Section({ id, number, label, spacing = "sm", className = "pt-24", children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`flex flex-col gap-3 ${className}`}>
      <h2 id={`${id}-title`} className="kicker font-sans">
        {number} · {label}
      </h2>
      <div className={`h-px bg-divider ${spacing === "md" ? "mb-5" : "mb-3"}`} />
      {children}
    </section>
  );
}
