import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type BlueprintProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Hairline frame with no fill (styles in globals.css). */
export default function Blueprint<T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...props
}: BlueprintProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag className={`blueprint ${className}`} {...props}>
      {children}
    </Tag>
  );
}
