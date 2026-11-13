"use client";

import { Moon, Sun } from "lucide-react";

/** Flips data-theme on <html> and remembers the choice. The icon is picked in CSS from
 * data-theme, so server and client render the same markup and nothing flashes. */
export default function ThemeToggle({ label }: { label: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex h-[29px] w-[29px] cursor-pointer items-center justify-center border border-divider text-text hover:bg-[color-mix(in_srgb,var(--color-text)_7%,transparent)]"
    >
      <Moon aria-hidden size={15} className="dark:hidden" />
      <Sun aria-hidden size={15} className="hidden dark:block" />
    </button>
  );
}
