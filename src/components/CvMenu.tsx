"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Site } from "@/data/site";
import Blueprint from "./Blueprint";

/** CV button that opens a small list with one download per language.
 * Closes on outside click, Escape or after picking a file. */
export default function CvMenu({ cvs, label }: { cvs: Site["cvs"]; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* On phones the label shrinks to "CV" so brand, language and CV share one row. */}
      <Blueprint
        as="button"
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="btn btn-primary"
      >
        <span className="max-[479px]:hidden">{label}</span>
        <span className="min-[480px]:hidden">CV</span>
        <ChevronDown aria-hidden size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </Blueprint>
      <ul
        id={menuId}
        hidden={!open}
        className="absolute right-0 top-full z-20 mt-1 min-w-full border border-divider bg-bg py-1"
      >
        {cvs.map((cv) => (
          <li key={cv.lang}>
            <a
              href={cv.url}
              download={cv.fileName}
              hrefLang={cv.lang}
              lang={cv.lang}
              onClick={() => setOpen(false)}
              className="block whitespace-nowrap px-4 py-2 text-[14px] text-text no-underline hover:bg-[color-mix(in_srgb,var(--color-text)_7%,transparent)] hover:text-text"
            >
              CV · {cv.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
