import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  className?: string;
};

export default function Tag({ children, className = "" }: TagProps) {
  return <span className={`rounded-full border border-border px-3 py-1 text-xs text-muted ${className}`}>{children}</span>;
}
