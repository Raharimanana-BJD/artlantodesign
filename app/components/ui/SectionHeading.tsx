import { type ReactNode } from "react";
import { cn } from "@/app/lib/cn";

export type SectionHeadingTone = "warm" | "sage" | "gold" | "photo";

const DOT_CLASSES: Record<SectionHeadingTone, string> = {
  warm: "bg-warm-ink",
  sage: "bg-sage-accent",
  gold: "bg-oraura-gold",
  photo: "bg-white",
};

export interface SectionHeadingProps {
  /** The small label before the dot, e.g. "nos trois" in "nos trois maisons". */
  eyebrow: ReactNode;
  /** The second line, rendered on its own row. */
  children: ReactNode;
  tone?: SectionHeadingTone;
  className?: string;
}

/** The recurring dot + two line heading pattern (lowercase, not uppercase). */
export function SectionHeading({ eyebrow, children, tone = "warm", className }: SectionHeadingProps) {
  return (
    <h2 className={cn("m-0 font-normal tracking-h2 text-h2", className)}>
      <span className="flex items-center gap-[0.28em]">
        <span aria-hidden="true" className={cn("size-[0.14em] rounded-full", DOT_CLASSES[tone])} />
        {eyebrow}
      </span>
      <span className="block">{children}</span>
    </h2>
  );
}
