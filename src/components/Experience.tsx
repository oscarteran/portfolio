"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { experience, type ExperienceItem } from "@/data/experience";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import Reveal from "./Reveal";
import Section from "./Section";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  const reduceMotion = useSafeReducedMotion();
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set());

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <Section id="experiencia" eyebrow="Trayectoria" title="experiencia">
      <ol className="max-w-4xl">
        {experience.map((item, i) => (
          <li key={`${item.company}-${item.role}`}>
            <Reveal index={i} className="grid gap-2 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-10">
              <p className="font-mono text-xs text-muted sm:whitespace-nowrap sm:pt-1.5 sm:text-right">{item.period}</p>
              <div className={`relative border-l border-border pl-8 ${i === experience.length - 1 ? "pb-2" : "pb-12"}`}>
                <span
                  aria-hidden="true"
                  className="absolute -left-[5.5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent-2"
                />
                <Entry
                  item={item}
                  id={`experiencia-${i}`}
                  expanded={open.has(i)}
                  onToggle={() => toggle(i)}
                  reduceMotion={reduceMotion}
                />
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Entry({
  item,
  id,
  expanded,
  onToggle,
  reduceMotion,
}: {
  item: ExperienceItem;
  id: string;
  expanded: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
}) {
  const heading = (
    <>
      <h3 className="font-bold text-xl">{item.role}</h3>
      <p className="mt-1 text-sm text-accent-2">{item.company}</p>
    </>
  );

  if (item.achievements.length === 0) {
    return (
      <div>
        {heading}
        {item.summary && <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.summary}</p>}
      </div>
    );
  }

  const panelId = `${id}-logros`;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="group block w-full text-left"
      >
        {heading}
        {item.summary && <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.summary}</p>}
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted transition-colors group-hover:text-accent-2">
          {expanded ? "Ocultar logros" : `Ver logros (${item.achievements.length})`}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            key="logros"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <ul className="space-y-3 pt-4 text-[15px] leading-relaxed text-muted">
              {item.achievements.map((achievement) => (
                <li key={achievement}>
                  <span className="text-accent-2">— </span>
                  {achievement}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
