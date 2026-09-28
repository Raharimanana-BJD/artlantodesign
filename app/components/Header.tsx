/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/app/lib/cn";
import { useScrolled } from "@/app/lib/useScrolled";
import { Pill } from "@/app/components/ui/Pill";
import { Burger } from "@/app/components/ui/Burger";
import { MobileMenu } from "@/app/components/MobileMenu";
import { NAV_LINKS, QUOTE_CTA } from "@/app/lib/nav-links";
import { Logo } from "@/app/assets";

export interface HeaderProps {
  /** Whether the header starts over a dark, full bleed hero (transparent/white).
   *  Defaults to true only on the homepage ("/"), which owns the hero photo;
   *  every other route starts solid since it has no dark image under the header. */
  overlay?: boolean;
}

const subscribeNever = () => () => {};

export function Header({ overlay }: HeaderProps) {
  const pathname = usePathname();
  const resolvedOverlay = overlay ?? pathname === "/";
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  // While the menu is open the panel owns the whole background, so the header
  // wears its transparent white-on-dark treatment whatever the scroll is doing.
  // That is also what keeps the burger legible as it turns into the X.
  const solid = (scrolled || !resolvedOverlay) && !menuOpen;

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    // Browsers disagree on where focus lands once the panel leaves the a11y
    // tree, so we put it back on the burger ourselves rather than assume.
    burgerRef.current?.focus();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-80 border-b md:border-b-0",
          mounted &&
            "transition-[background-color,color,border-color,padding] duration-350",
          solid
            ? "border-warm-border bg-warm-bg/86 py-3 text-warm-ink backdrop-blur-lg"
            : "border-transparent bg-transparent py-5.5 text-white",
        )}
      >
        <div className="mx-auto flex max-w-360 items-center justify-between gap-6 px-gutter">
          <a
            href="/#top"
            inert={menuOpen}
            className="flex items-center gap-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <Image
              src={Logo}
              alt=""
              className={cn("h-7 w-auto", solid ? "invert-0" : "invert")}
            />
            <span className="font-semibold text-[17px] leading-none tracking-quote">
              Art Lanto Design
            </span>
          </a>

          <nav className="hidden items-center gap-9 text-[13.5px] font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <Pill
            href={QUOTE_CTA.href}
            variant={solid ? "dark" : "cream"}
            size="sm"
            className="hidden md:inline-flex"
            inert={menuOpen}
          >
            {QUOTE_CTA.label}
          </Pill>

          <Burger
            open={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            buttonRef={burgerRef}
          />
        </div>

        <noscript>
          <div className="flex flex-wrap items-center gap-4 border-t border-warm-border bg-warm-bg px-gutter py-4 text-warm-ink md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13.5px] font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href={QUOTE_CTA.href}
              className="text-[13.5px] font-semibold underline"
            >
              {QUOTE_CTA.label}
            </a>
          </div>
        </noscript>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} toggleRef={burgerRef} />
    </>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group relative outline-none transition-opacity duration-200 hover:opacity-60 focus-visible:opacity-60"
    >
      {label}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100"
      />
    </a>
  );
}
