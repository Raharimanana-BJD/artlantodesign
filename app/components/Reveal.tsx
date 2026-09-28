"use client";

import { type ElementType, type ReactNode } from "react";
import { useScrollReveal, type ScrollRevealOptions } from "@/app/lib/useScrollReveal";

export interface RevealProps extends ScrollRevealOptions {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/**
 * The entry point for revealing a Server Component section on scroll: the
 * section itself stays a server component and passes its already rendered
 * subtree as `children` here. Only this small wrapper ships to the client.
 *
 * A section that is already a client component (the header, Nos maisons,
 * the gallery) may call `useScrollReveal` directly instead.
 */
export function Reveal({ children, className, as: Tag = "div", ...options }: RevealProps) {
  const ref = useScrollReveal<HTMLElement>(options);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
