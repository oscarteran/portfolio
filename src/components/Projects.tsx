"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Projects() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedProject = selectedIndex !== null ? projects[selectedIndex] : null;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    function updateBounds() {
      if (!el) return;
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    }

    updateBounds();
    el.addEventListener("scroll", updateBounds, { passive: true });
    window.addEventListener("resize", updateBounds);
    return () => {
      el.removeEventListener("scroll", updateBounds);
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduceMotion ? "auto" : "smooth";

    if (direction === 1 && atEnd) {
      el.scrollTo({ left: 0, behavior });
      return;
    }
    if (direction === -1 && atStart) {
      el.scrollTo({ left: el.scrollWidth, behavior });
      return;
    }
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior });
  }

  return (
    <Section id="proyectos" eyebrow="Casos de éxito" title="proyectos">
      <div className="relative">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((project, i) => (
              <Reveal key={project.title} index={i} className="w-[300px] shrink-0 snap-start sm:w-[340px]">
                <ProjectCard project={project} onOpen={() => setSelectedIndex(i)} />
              </Reveal>
            ))}
          </div>

          {/* Arrows are hidden on phones, so say the row scrolls. */}
          <p aria-hidden="true" className="mt-1 font-mono text-xs text-muted sm:hidden">
            Desliza para ver más →
          </p>

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent transition-opacity duration-300 ${
              atStart ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent transition-opacity duration-300 ${
              atEnd ? "opacity-0" : "opacity-100"
            }`}
          />

          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={atStart ? "Ir al último proyecto" : "Proyecto anterior"}
            className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-lg backdrop-blur transition-colors hover:border-accent-2 hover:text-accent-2 sm:-left-6 sm:flex lg:-left-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={atEnd ? "Ir al primer proyecto" : "Siguiente proyecto"}
            className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-lg backdrop-blur transition-colors hover:border-accent-2 hover:text-accent-2 sm:-right-6 sm:flex lg:-right-10"
          >
            <ChevronRight size={18} />
          </button>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedIndex(null)}
        onPrev={() => setSelectedIndex((i) => (i === null ? null : (i - 1 + projects.length) % projects.length))}
        onNext={() => setSelectedIndex((i) => (i === null ? null : (i + 1) % projects.length))}
      />
    </Section>
  );
}
