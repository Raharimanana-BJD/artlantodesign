"use client";

import { type MouseEventHandler, type Ref } from "react";
import { cn } from "@/app/lib/cn";

export interface BurgerProps {
  open: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  /** The button's accessible name. Swap it as the state flips ("Fermer"/"Ouvrir"). */
  label: string;
  /** The header owns this so the menu can hand focus back on close. */
  buttonRef?: Ref<HTMLButtonElement>;
  className?: string;
}

const BAR =
  "block h-px w-full origin-center bg-current transition-transform duration-300 ease-menu";

/**
 * The hamburger, as a two bar morph: closed it is a parallel pair, open it is an
 * X. The bars are 1px tall in a `gap-1.5` column, so each bar travels 3.5px to
 * meet on the centre line. Animating in CSS (not GSAP) keeps this on the
 * project rule that only scroll reveals get a timeline, and it makes reduced
 * motion a one line media query away.
 */
export function Burger({ open, onClick, label, buttonRef, className }: BurgerProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center md:hidden",
        "text-current outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
        className,
      )}
    >
      <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
        <span className={cn(BAR, open ? "translate-y-[3.5px] rotate-45" : "translate-y-0 rotate-0")} />
        <span className={cn(BAR, open ? "-translate-y-[3.5px] -rotate-45" : "translate-y-0 rotate-0")} />
      </span>
    </button>
  );
}
