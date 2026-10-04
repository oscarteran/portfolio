"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type RevealProps = {
  children: ReactNode;
  index?: number;
  className?: string;
};

const STAGGER_STEP = 0.04;

export default function Reveal({ children, index = 0, className }: RevealProps) {
  const reduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.3,
        ease: [0.16, 1, 0.3, 1],
        delay: reduceMotion ? 0 : index * STAGGER_STEP,
      }}
    >
      {children}
    </motion.div>
  );
}
