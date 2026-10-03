/** Shared button looks, usable on <button>, <a> and <Link> alike. */
export const buttonClass = {
  primary:
    "inline-flex w-fit items-center gap-1.5 rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex w-fit items-center gap-1.5 rounded-sm border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent",
} as const;
