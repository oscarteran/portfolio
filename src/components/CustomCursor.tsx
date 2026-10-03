"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsClient } from "@/lib/useIsClient";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], summary";
const TEXT_FIELD_SELECTOR = "input, textarea";
const DOT_SIZE = 6;
const RING_SIZE = 32;
const RING_SIZE_HOVER = 52;

/** A precise dot plus a lightly-trailing ring, both using mix-blend-mode: difference
 * so they stay visible over any background (light buttons included) by inverting
 * whatever color sits underneath, instead of relying on a fixed light/dark color.
 * Disabled entirely on touch devices and when the OS prefers reduced motion — in
 * both cases the native cursor is left untouched (see the enabled-gate below). */
export default function CustomCursor() {
  const isClient = useIsClient();
  const enabled =
    isClient &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 800, damping: 50, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 800, damping: 50, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("custom-cursor-active");

    function handleMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    function handleOver(e: PointerEvent) {
      const target = e.target as Element | null;
      if (target?.closest(TEXT_FIELD_SELECTOR)) {
        setHovering(false);
        return;
      }
      setHovering(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-white mix-blend-difference"
        style={{
          x,
          y,
          marginLeft: -DOT_SIZE / 2,
          marginTop: -DOT_SIZE / 2,
          width: DOT_SIZE,
          height: DOT_SIZE,
        }}
        animate={{ opacity: hovering ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border-[1.5px] border-white mix-blend-difference"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: hovering ? RING_SIZE_HOVER : RING_SIZE,
          height: hovering ? RING_SIZE_HOVER : RING_SIZE,
          marginLeft: hovering ? -RING_SIZE_HOVER / 2 : -RING_SIZE / 2,
          marginTop: hovering ? -RING_SIZE_HOVER / 2 : -RING_SIZE / 2,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </>
  );
}
