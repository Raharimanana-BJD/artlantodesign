"use client";

import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 40;

/**
 * True once the page has scrolled past a 40px threshold. SSR safe (starts
 * `false`, never reads `window` during render); syncs once on mount so a
 * page that loads already scrolled starts in the right state.
 */
export function useScrolled(threshold: number = SCROLL_THRESHOLD): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > threshold;
      setScrolled((prev) => (prev !== past ? past : prev));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
