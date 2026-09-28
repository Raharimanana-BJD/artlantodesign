"use client";

import { useEffect, useRef, type RefObject } from "react";
import { cn } from "@/app/lib/cn";
import { NAV_LINKS, QUOTE_CTA } from "@/app/lib/nav-links";
import { Pill } from "@/app/components/ui/Pill";

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  /** The header's burger. It sits above this panel, so it is both the first and
   *  the last stop of the focus cycle and where focus returns on close. */
  toggleRef: RefObject<HTMLButtonElement | null>;
}

/** valo-app's stagger: 0.1s of head start, then 0.07s between links. */
const STAGGER_START = 0.1;
const STAGGER_STEP = 0.07;
const CTA_DELAY = 0.45;

const FOCUSABLE = "a[href], button:not([disabled])";

export function MobileMenu({ open, onClose, toggleRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus the first link on open, lock the page behind, and release both on close.
  useEffect(() => {
    if (!open) return;
    const { documentElement } = document;
    documentElement.style.overflowY = "hidden";
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      documentElement.style.overflowY = "";
    };
  }, [open]);

  // Escape closes, and Tab cycles burger -> links -> CTA -> burger. A plain
  // z-index overlay has no native focus trap, so this replaces the one the
  // <dialog> used to give us for free.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const stops = [
        ...(toggleRef.current ? [toggleRef.current] : []),
        ...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)),
      ];
      if (stops.length === 0) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      const insidePanel = active instanceof Node && panel.contains(active);

      if (event.shiftKey && (active === first || !insidePanel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !insidePanel)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, toggleRef]);

  // Rotating or resizing past md hides the burger, so close rather than strand
  // the page behind an overlay whose only toggle is gone.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={cn(
        "fixed inset-0 z-70 flex flex-col bg-oraura-bg px-gutter pt-24 pb-10 text-warm-cream md:hidden",
        "transition-[clip-path] duration-600 ease-menu",
        open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]",
      )}
    >
      <nav className="flex flex-1 flex-col justify-center">
        {NAV_LINKS.map((link, index) => (
          <div key={link.href} className="overflow-hidden border-b border-oraura-ghost-border">
            <a
              href={link.href}
              onClick={onClose}
              style={{ transitionDelay: open ? `${STAGGER_START + index * STAGGER_STEP}s` : "0s" }}
              className={cn(
                "block py-4 text-h2 font-normal tracking-h2",
                "transition-transform duration-500 ease-menu",
                "outline-none hover:text-oraura-gold focus-visible:text-oraura-gold focus-visible:underline",
                open ? "translate-y-0" : "translate-y-full",
              )}
            >
              {link.label}
            </a>
          </div>
        ))}
      </nav>

      <div
        style={{ transitionDelay: open ? `${CTA_DELAY}s` : "0s" }}
        className={cn(
          "transition-[transform,opacity] duration-500 ease-menu",
          open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        )}
      >
        <Pill href={QUOTE_CTA.href} variant="gold" size="lg" onClick={onClose}>
          {QUOTE_CTA.label}
        </Pill>
      </div>
    </div>
  );
}
