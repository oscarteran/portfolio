"use client";

import type { KeyboardEvent, ReactNode } from "react";

type CardProps = {
  featured?: boolean;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

/** Surface for project content. Hover feedback is only applied when the card itself is
 * clickable, so static cards don't promise an interaction they don't have. */
export default function Card({ featured, className = "", onClick, children }: CardProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  }

  const interactive = onClick
    ? "cursor-pointer transition-[border-color,box-shadow] duration-150 ease-out hover:border-accent-2 hover:shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--accent-2)_35%,transparent)]"
    : "";

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-border bg-card p-7 ${interactive} ${
        featured ? "border-t-2 border-t-accent-2" : ""
      } ${className}`}
      {...(onClick ? { role: "button", tabIndex: 0, onClick, onKeyDown: handleKeyDown } : {})}
    >
      {children}
    </div>
  );
}
