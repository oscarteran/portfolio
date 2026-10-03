"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type NavItem = {
  label: string;
  href: string;
};

export default function NavLinks({
  items,
  className = "",
  linkClassName = "",
  indicator = false,
}: {
  items: NavItem[];
  className?: string;
  linkClassName?: string;
  indicator?: boolean;
}) {
  const [active, setActive] = useState(items[0]?.href ?? "");
  const reduceMotion = useSafeReducedMotion();

  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={className}>
      {items.map((item) => {
        const isActive = active === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={`${linkClassName} relative transition-colors ${
              isActive ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {indicator && isActive && (
              <motion.span
                layoutId="nav-underline"
                className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-accent"
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
                }
              />
            )}
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
