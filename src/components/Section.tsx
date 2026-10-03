import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

/** Page section with its title in a narrow left column that stays pinned while the
 * content scrolls past on large screens; stacks title-over-content below `lg`. */
export default function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16 lg:px-16 lg:py-24 xl:grid-cols-[240px_minmax(0,1fr)]">
        <header className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-2">{eyebrow}</p>
          <h2 className="mt-2 font-extrabold uppercase tracking-tight text-2xl">{title}</h2>
        </header>
        <div className="mt-8 min-w-0 lg:mt-0">{children}</div>
      </div>
    </section>
  );
}
