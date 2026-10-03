"use client";

import { useEffect, useRef } from "react";

/** Dot grid with a pointer-following, neutral-toned spotlight. Drop it as the first
 * child of a `relative` container and wrap the content that follows in its own
 * `relative` box so it paints above the grid.
 *
 * The container must set `--spot-x`/`--spot-y` (the resting position, used before the
 * pointer moves and under reduced motion). Pointer moves overwrite those two custom
 * properties on the container itself — never re-rendering — so any descendant (e.g.
 * <MountainSilhouette>) can read the same spot to light itself up. */
export default function DotBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number | null = null;

    function handlePointerMove(e: PointerEvent) {
      if (frame !== null || !host) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const rect = host.getBoundingClientRect();
        host.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        host.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      });
    }

    host.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      host.removeEventListener("pointermove", handlePointerMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, color-mix(in oklab, var(--foreground) 22%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(480px circle at var(--spot-x) var(--spot-y), black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(480px circle at var(--spot-x) var(--spot-y), black, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(560px circle at var(--spot-x) var(--spot-y), color-mix(in oklab, var(--foreground) 6%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
