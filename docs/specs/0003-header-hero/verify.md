# Verify: Header & hero · spec 0003 · updated 2026-09-26

_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] Load the page at 1920px → the header renders transparent with white text over the hero photo, the logo, four nav links, and the "Demander un devis" pill visible → AC-1
- [ ] Scroll (or, with nothing below the hero yet, simulate scroll) past 40px → the header transitions over 350ms to a blurred, solid warm background with dark text and a smaller vertical padding; the CTA pill switches from cream to dark → AC-1 (confirmed: the pill and header both switched correctly in this build's check)
- [ ] Reload the page already scrolled past 40px → the header shows its solid state immediately, no visible fade in from transparent → AC-1
- [ ] Resize to 767px and to 768px → below 768px the hamburger replaces the nav and CTA; at 768px and above the full row shows → AC-2
- [ ] At a narrow width, tap the hamburger → a full screen, opaque, Or'Aura dark overlay opens with a staggered reveal of the four nav links (large, `h2` scale) and a gold "Demander un devis" pill; an X close button sits top right and receives focus automatically → AC-3 (confirmed working in this build's check)
- [ ] With the menu open, tap the X → the menu reverses its animation, closes, and focus returns to the hamburger button; confirmed via `document.activeElement` → AC-4 (confirmed in this build's check)
- [ ] With the menu open, tap a nav link → the menu closes the same way as the X → AC-4
- [ ] With the menu open, dispatch the dialog's native `cancel` event (Escape) → the menu closes via the same reverse-then-close path → AC-4 (confirmed correct by directly dispatching the event; the browser tool's synthetic Escape keypress does not reach native dialog handling to trigger this live)
- [ ] With the menu open, try to scroll the page behind it → nothing scrolls; closing the menu restores scrolling → AC-3, AC-4 (confirmed: `overflow-y` returns to `visible` after close)
- [ ] **Needs a real browser/OS** (this browser tool can't emulate `prefers-reduced-motion`; verified by code review against the `gsap.matchMedia()`/`gsap.from()` pattern during this build, not live): with reduced motion preferred, the menu still opens and closes, just instantly, with no stagger → AC-5
- [ ] View the page's raw server rendered HTML (e.g. `curl`) → a `<noscript>` block inside the header contains all four nav links and the CTA as plain anchors, only meant to show below 768px → AC-7 (confirmed present in this build's check)
- [ ] With JavaScript actually disabled in a real browser at 375px → the `<noscript>` row is visible and every link is clickable → AC-7
- [ ] Read the hero → the exact photo, headline ("L'artisanat malgache, à votre échelle."), subheadline, "Lancer mon projet" CTA, location/date strip, and scroll hint all render, matching the old file → AC-6

## Commands

- [ ] `bunx tsc --noEmit` → passes with no errors
- [ ] `bun run build` → completes with no route or type errors
- [ ] `bun run lint` → clean for every file under `app/` (pre-existing warnings in `old/` are out of scope)

## Acceptance-criteria coverage

- AC-1 (header scroll transition, no reload flash) · covered by the four header steps
- AC-2 (768px breakpoint) · covered by the resize step
- AC-3 (menu open, structure, scroll lock) · covered by the open and scroll lock steps
- AC-4 (menu close paths, focus return) · covered by the three close steps
- AC-5 (reduced motion) · covered by the flagged manual step (needs a real browser/OS)
- AC-6 (hero content) · covered by the hero read step
- AC-7 (works with JavaScript disabled) · covered by the `<noscript>` and real no-JS steps
- AC-8 (Server/Client boundaries, no Reveal on Hero) · covered by code review: `Hero` has no `"use client"` directive and imports neither `Reveal` nor `useScrollReveal`
