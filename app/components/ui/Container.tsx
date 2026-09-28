import { type ReactNode } from "react";
import { cn } from "@/app/lib/cn";

export type ContainerPy = "section" | "band" | "bottom-only" | "none";

const PY_CLASSES: Record<ContainerPy, string> = {
  section: "py-section",
  band: "py-band",
  "bottom-only": "pb-section",
  none: "",
};

export interface ContainerProps {
  children: ReactNode;
  /** Vertical padding variant. Defaults to "section" (the old file's most common pattern). */
  py?: ContainerPy;
  className?: string;
  as?: "div" | "section";
}

export function Container({ children, py = "section", className, as = "div" }: ContainerProps) {
  const Tag = as;
  return (
    <Tag className={cn("mx-auto max-w-[1440px] px-gutter", PY_CLASSES[py], className)}>
      {children}
    </Tag>
  );
}
