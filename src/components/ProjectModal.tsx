"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Project } from "@/data/projects";
import { useIsClient } from "@/lib/useIsClient";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import ProjectVisual from "./ProjectVisual";
import Tag from "./Tag";

const EASE = [0.16, 1, 0.3, 1] as const;
const FOCUSABLE_SELECTOR = "a[href], button:not([disabled])";

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
}: {
  project: Project | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const isClient = useIsClient();
  const reduceMotion = useSafeReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!project) return;

    if (!triggerRef.current) triggerRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        onPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        onNext();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, onPrev, onNext]);

  // Separate effect for scroll-lock/focus-restore: only on the open -> closed edge,
  // not on every project change (prev/next keeps the modal open and shouldn't
  // restore focus to the original trigger until the whole modal actually closes).
  useEffect(() => {
    if (project) return;
    document.body.style.overflow = "";
    if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    triggerRef.current = null;
  }, [project]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* The dialog role lives on this wrapper (not the scrollable card below)
              so the prev/next buttons — positioned outside the card to sit at its
              true vertical center — stay inside the dialog boundary for the focus
              trap and for assistive tech, even though they're visually siblings
              of the card rather than nested inside it. */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            className="relative w-full max-w-2xl outline-none"
          >
            {/* Below `sm:` there's no room to float outside the card, and the card's
                height varies with content, so centering on it risks landing on top
                of text. Anchor to the banner's fixed vertical center there instead;
                from `sm:` up there's room to sit outside, centered on the whole
                card, clear of any text. */}
            <button
              type="button"
              onClick={onPrev}
              aria-label="Proyecto anterior"
              className="absolute left-2 top-[124px] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur transition-colors hover:border-accent-2 hover:text-accent-2 sm:-left-5 sm:top-1/2"
            >
              <ChevronLeft size={18} />
            </button>

            <motion.div
              key={project.title}
              className="relative max-h-[85vh] w-full overflow-y-auto rounded-lg border border-border bg-card p-7 shadow-2xl sm:p-8"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : 12 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: EASE }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-accent-2 hover:text-accent-2"
              >
                <X size={16} />
              </button>

              <div className="h-48 overflow-hidden rounded-md border border-border bg-background/40 text-accent/70">
                <ProjectVisual kind={project.visual} seed={project.title} />
              </div>

              <h3 id="project-modal-title" className="mt-6 pr-12 font-bold text-2xl">
                {project.title}
              </h3>
              {project.period && (
                <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-2/40 bg-accent-2/10 px-2.5 py-1 font-mono text-xs text-accent-2">
                  {project.period}
                </span>
              )}
              <p className="mt-5 text-sm font-semibold text-foreground">Resumen</p>
              <p className="mt-1.5 leading-relaxed text-muted">{project.description}</p>

              {project.highlights && project.highlights.length > 0 && (
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>
                      <span className="text-accent-2">— </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Tag key={tag} className="font-mono">
                    {tag}
                  </Tag>
                ))}
              </div>

            </motion.div>

            <button
              type="button"
              onClick={onNext}
              aria-label="Siguiente proyecto"
              className="absolute right-2 top-[124px] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur transition-colors hover:border-accent-2 hover:text-accent-2 sm:-right-5 sm:top-1/2"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
