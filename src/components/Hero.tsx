"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import MountainSilhouette from "./MountainSilhouette";

const EASE = [0.16, 1, 0.3, 1] as const;

const [firstName, lastName] = splitName(site.name);

/** "Oscar Hernández Terán" → ["Oscar", "Hernández Terán"]: given names, then both surnames. */
function splitName(name: string) {
  const words = name.split(" ").filter(Boolean);
  const cut = Math.max(1, Math.floor(words.length / 2));
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

export default function Hero() {
  const reduceMotion = useSafeReducedMotion();

  function fadeUp(delay: number) {
    return {
      initial: { opacity: 0, y: reduceMotion ? 0 : 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : delay, ease: EASE },
    };
  }

  function nameLine(index: number) {
    return {
      initial: { y: reduceMotion ? "0%" : "105%" },
      animate: { y: "0%" },
      transition: { duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.1 + index * 0.12, ease: EASE },
    };
  }

  return (
    // --mountain-h / --lake-h size the landscape below the text; the text's bottom padding
    // reserves room for both so the peaks and pines never reach it.
    <section
      id="inicio"
      className="relative scroll-mt-24 [--lake-h:90px] [--mountain-h:220px] lg:[--lake-h:170px] lg:[--mountain-h:clamp(240px,52%,420px)]"
    >
      <MountainSilhouette />
      <div className="relative mx-auto max-w-[1600px] px-6 pb-4 pt-20 sm:px-10 sm:pt-28 md:pb-[calc(12rem+var(--lake-h))] lg:px-16 lg:pb-[calc(10rem+var(--lake-h))]">
        <motion.p {...fadeUp(0)} className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-accent-2">
          <span aria-hidden="true" className="h-px w-8 bg-accent-2" />
          {site.role}
        </motion.p>

        <h1 className="mt-6 font-black uppercase leading-[0.88] tracking-tight text-[clamp(2.8rem,8.5vw,9rem)]">
          <span className="block overflow-hidden pb-[0.04em]">
            <motion.span {...nameLine(0)} className="block">
              {firstName}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <motion.span
              {...nameLine(1)}
              className="block text-transparent [-webkit-text-stroke:1px_var(--foreground)] sm:[-webkit-text-stroke:2px_var(--foreground)]"
            >
              {lastName}
            </motion.span>
          </span>
        </h1>

        <motion.div {...fadeUp(0.45)} className="mt-10 max-w-2xl border-t border-border pt-8 sm:mt-14 lg:max-w-xl xl:max-w-2xl">
          <p className="text-lg leading-relaxed text-foreground sm:text-xl">{site.tagline}</p>
          <p className="mt-4 text-base leading-relaxed text-muted">{site.bio}</p>
        </motion.div>
      </div>
    </section>
  );
}
