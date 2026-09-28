# Verify: GSAP animation foundation · spec 0002 · updated 2026-09-26

_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] Render a Server Component section wrapping its content in `Reveal` (no `"use client"` on the section itself) → the section still compiles and renders as a Server Component; before scrolling to it the content is invisible/offset, and it fades and slides into place once it scrolls to about 85% down the viewport → AC-2, AC-6
- [ ] Scroll past the revealed section, then scroll back up above it, then back down again → the content stays fully visible throughout; it never re-hides or replays → AC-2
- [ ] Pass `stagger` to `Reveal`/`useScrollReveal` around several direct children → each child starts its reveal slightly after the previous one, not all at once → AC-2
- [ ] **Needs a real browser/OS** (this browser tool has no way to emulate `prefers-reduced-motion`; verified by code review against GSAP's documented `matchMedia()` idiom, not live, during this build): with the OS/browser set to prefer reduced motion, load a page using `Reveal` → the content appears in its final state immediately, with no fade/slide and no flash of a hidden state first → AC-3
- [ ] Call `useScrolled()` from a client component and load the page already scrolled past 40px (e.g. via a same page anchor link or a saved scroll position) → it starts `true`, not `false` then flipping a frame later → AC-4
- [ ] Scroll past 40px, then back above it → the hook's return value flips both ways → AC-4
- [ ] Inspect `Pill`'s rendered hover transition → `transition-colors duration-200` (200ms, default ease) → AC-5
- [ ] Read `app/globals.css` → `--ease-house: cubic-bezier(.2,.7,.2,1);` is defined in the `@theme` block → AC-5
- [ ] Read `docs/design.md`'s Motion section → the three duration tiers (200ms, 350ms, 600 to 700ms with `--ease-house`) are documented → AC-5
- [ ] Inspect a reveal's animated CSS properties in devtools while it plays → only `opacity` and `transform` change; no layout property (`width`, `height`, `top`, `left`, margin/padding) is ever animated → AC-6

## Commands

- [ ] `grep -rn "from \"gsap\"" app/` (excluding `app/lib/gsap-config.ts`) → no matches; every consumer imports from `app/lib/gsap-config.ts` → AC-1
- [ ] `bunx tsc --noEmit` → passes with no errors
- [ ] `bun run build` → completes with no route or type errors
- [ ] `bun run lint` → clean for every file under `app/` (pre-existing warnings in `old/` are out of scope)

## Acceptance-criteria coverage

- AC-1 (install, single registration point) · covered by the grep command and a read of `app/lib/gsap-config.ts`
- AC-2 (`useScrollReveal` / `Reveal`, once only, stagger, Server Component usable) · covered by the three `Reveal` UI steps
- AC-3 (reduced motion gate) · covered by the flagged manual step (needs a real browser/OS)
- AC-4 (`useScrolled`, SSR safe, 40px threshold) · covered by the two `useScrolled` steps
- AC-5 (shared duration/easing tiers, `Pill` conformance) · covered by the `Pill`/`globals.css`/`design.md` steps
- AC-6 (layout effect timing, opacity/transform only) · covered by the devtools property step and the Server Component reveal step
