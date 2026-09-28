"use client";

import { useRef, type RefObject } from "react";
import { gsap, useGSAP } from "@/app/lib/gsap-config";

export interface ScrollRevealOptions {
  /** Seconds before the reveal starts, once triggered. Default 0. */
  delay?: number;
  /** How far (px) the content starts offset below its final position. Default 24. */
  y?: number;
  /** Seconds the reveal takes. Default 0.8. */
  duration?: number;
  /** Seconds between each child's start, when staggering. Omit for no stagger (animates the scope element itself). */
  stagger?: number;
  /** GSAP ease. Default "power2.out". */
  ease?: string;
}

/**
 * Fades and slides the returned ref's element (or, with `stagger` set, its
 * direct children) into view once as it scrolls into the viewport. Skips
 * the animation entirely when the visitor prefers reduced motion. Never
 * re-triggers once played.
 *
 * Usable directly only from a Client Component; a Server Component section
 * should use the `Reveal` wrapper (`app/components/Reveal.tsx`) instead.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
): RefObject<T | null> {
  const scope = useRef<T>(null);
  const { delay = 0, y = 24, duration = 0.8, stagger, ease = "power2.out" } = options;

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = stagger !== undefined ? gsap.utils.toArray<HTMLElement>(el.children) : el;
        gsap.from(targets, {
          opacity: 0,
          y,
          duration,
          delay,
          ease,
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      return () => mm.revert();
    },
    { scope, dependencies: [delay, y, duration, stagger, ease] },
  );

  return scope;
}
