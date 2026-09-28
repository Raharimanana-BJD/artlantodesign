# 0003. Header & hero

**Date**: 2026-09-26
**Status**: In Progress

## Summary

This spec builds the site's fixed header (wordmark, nav, a quote CTA, and the scroll driven transparent to solid transition from spec 0002) and the full bleed hero section, both ported faithfully from the old reference file. It also adds one new thing the reference file doesn't have: on a narrow screen, the nav collapses into a hamburger button that opens a full screen, dark, GSAP animated menu, at the engineer's explicit request for that higher polish. A `<noscript>` fallback keeps every nav link reachable with JavaScript disabled, so the collapsed nav never becomes a dead end. Everything else, including the header's own scroll transition, still follows spec 0002's plain CSS convention; only this one interaction gets a GSAP timeline, a deliberate, scoped exception.

## Requirements

**User stories**:
- As a visitor on desktop, I want the header to stay out of the way until I scroll, then read clearly against whatever I've scrolled to.
- As a visitor on a phone, I want a real, easy to use way to jump to a section, not four cramped links wrapping awkwardly, and I want that to work even if a link blocker or a slow connection means JavaScript hasn't run yet.
- As the first thing anyone sees, I want the hero to load instantly and completely, even before any JavaScript runs.

**Acceptance criteria**:
- **AC-1**: A `Header` component renders fixed at the top on every route (`z-80`, content capped at `max-w-[1440px]`, horizontal padding `px-gutter`): the wordmark (a static imported `next/image` of `app/assets/logo-ad.png`, `h-7 w-auto`, `alt=""`, since the adjacent "Art Lanto Design" text is the accessible name) linking to `#top`, four nav links (Nos maisons → `#maisons`, Vannerie → `#toliara`, Processus → `#processus`, Questions → `#faq`, hover opacity `.6` at the 200ms default ease tier), and a "Demander un devis" `Pill` linking to `#contact`. Once `useScrolled` (spec 0002) reports past its 40px threshold, at the 350ms chrome tier, it transitions: background transparent → `bg-warm-bg/86` with `backdrop-blur-[16px]`, text white → `text-warm-ink`, border transparent → `border-warm-border`, and vertical padding `py-[22px]` → `py-3`. The transition classes only apply after mount, so a page that loads already scrolled snaps straight to the solid state instead of visibly animating into it on every reload.
- **AC-2**: Below the `md` breakpoint (768px; Tailwind's `md:` applies **at** 768px and up, so the collapsed nav shows below that, the full row at 768px and above), `MobileMenu`'s hamburger button replaces the nav links and quote `Pill`; at 768px and above, the full row from AC-1 shows exactly as described.
- **AC-3**: `MobileMenu` owns its own hamburger button, its open/closed state, and the `<dialog>` (`Header` only renders `<MobileMenu overlay={overlay} />` in its collapsed slot; no shared state or ref crosses that boundary). The button (`type="button"`, `aria-label="Ouvrir le menu"`, `aria-expanded`, `aria-controls="mobile-menu"`) opens a full screen `<dialog id="mobile-menu" aria-label="Menu">`, its UA defaults fully reset (`m-0 p-0 border-0 w-screen h-dvh max-w-none max-h-none bg-transparent`) so an opaque `bg-oraura-bg` panel fills the screen. Opening calls `showModal()` first (clearing the UA's `display: none`), then plays a GSAP timeline: the panel fades in (0.3s), then the four nav links plus the quote CTA (a `gold` variant `Pill`) reveal large (the `h2` type token, `text-warm-cream`, hover/focus `text-oraura-gold`) via `gsap.from({ y: 24, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 })`, never a CSS pre-hide. A distinct in-dialog close button (a static X, `aria-label="Fermer le menu"`, `autofocus`) sits where the header's hamburger visually was, so the "morph" from hamburger to X is two elements handing off, not one element animating across the header/dialog boundary. While open, `<html>`'s `overflow-y` (the longhand, not the `overflow` shorthand, since `globals.css` already sets `overflow-x: clip` on `html`) is set to `hidden`, so the page behind can't scroll.
- **AC-4**: Closing (the in-dialog close button, a nav link, or Escape) reverses the same timeline, then calls the dialog's native `close()`, then explicitly calls `.focus()` on the header's hamburger button (not relied on as automatic, since browsers differ on restoring focus after `close()`). Escape is intercepted via the dialog's `cancel` event (`preventDefault()`, play the reverse, then `close()`), since the native instant close would skip the animation entirely; this is the one place here that stands in for native behavior; the focus trap and the dialog's modality otherwise stay entirely native. A full screen dialog exposes no clickable backdrop area (its box covers the whole viewport), so a "backdrop click" is not one of the close paths.
- **AC-5**: The menu's open and close timelines are wrapped in `gsap.matchMedia()` gated on `(prefers-reduced-motion: no-preference)`, matching spec 0002's discipline, and every animated value starts from `gsap.from()`, never a CSS pre-hide (the same rule spec 0002's reveal hook follows); a visitor who prefers reduced motion still gets a working menu (`showModal()`/`close()`, the overflow lock, the focus handling), just with the links at full opacity immediately and no timeline.
- **AC-6**: The `Hero` renders full bleed: the old file's exact photo through spec 0001's `CreditedImage` (`sizes="100vw"`, `preload`, `alt="Intérieur d'hôtel avec vannerie Toliara"`, credited, no `aspect` prop since the hero section itself is the sized, relatively positioned box at `height: max(660px, min(100vh, 940px))`), the confirmed single headline ("L'artisanat malgache, à votre échelle."), the subheadline, a "Lancer mon projet" `Pill` linking to `#contact`, the location/date strip, and the "Défiler ↓" scroll hint, matching the old file's gradient overlays and fluid type.
- **AC-7**: With JavaScript disabled in the browser, at any viewport width including below 768px, every nav link and the quote CTA are visible and clickable, and the complete hero renders. Below 768px this is a `<noscript>` block inside `Header` rendering the four nav links and the quote `Pill` as a plain wrapped row (the old file's own behavior, with no hamburger), since the hamburger button and its dialog are otherwise entirely inert without JavaScript. Verified by actually disabling JavaScript in the browser at 375px, not by reading the server rendered HTML source alone (the links exist there either way; whether they're visible and usable is the real question).
- **AC-8**: `Header` and `MobileMenu` are Client Components (they need `useScrolled` and real interactivity); `Hero` is a Server Component with no client interactivity of its own, and does not use the `Reveal` scroll wrapper from spec 0002, since it is visible immediately on load, not something that scrolls into view. `Header` accepts an `overlay` boolean prop, defaulting `true` (matching this one page site, where the header always sits over the hero's dark photo); a future non-hero route should pass `overlay={false}` so its header starts in the solid, dark text state instead of transparent white-on-light.

## Decision

**Chosen option**: Option 1: A native `<dialog>` for the overlay, animated with a GSAP timeline

Build the mobile menu on a native `<dialog>` for its focus trap and modality, reset its UA styling by hand to reach full bleed, animate its content with a GSAP timeline, and intercept only Escape (to animate the close instead of closing instantly).

## Feature design

**Data model sketch**:
None. This feature has no persistence; it is presentational components and client side interaction.

**State transitions**:
The mobile menu, owned entirely by `MobileMenu`: closed → open (hamburger tap) → closed (the in-dialog close button, a nav link, or Escape). No other state.

**API surface**:
None. No backend endpoints.

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Render `Header`'s nav | The four link labels and hrefs | Ported verbatim from the old file (`old/Art Lanto Design v3.dc.html`) |
| Render `Header`'s scroll state | The exact colors, blur, border, and padding in each state | Ported verbatim from the old file's `headerStyle`/`headerInner` logic |
| Render `Header`/`MobileMenu`'s collapse point | The `md` (768px) breakpoint | A recommended value (the old file has none; the engineer asked for a hamburger without naming a breakpoint) |
| Render `MobileMenu`'s reveal | The stagger, duration, y offset, and ease | Recommended values (0.5s, 24px, `power2.out`, 0.06s stagger); nothing in the old file to port, since it has no equivalent menu |
| Render `MobileMenu`'s icon | Its construction (bars, size, stroke) and transition tier | Recommended (three 1.5px bars in an 18×18px box, `currentColor`, the 200ms icon scale tier, not the 600 to 700ms layout morph tier design.md reserves for a bigger transform) |
| Render `MobileMenu`'s panel | Its background, link color, and CTA variant | Recommended (opaque `bg-oraura-bg`, `text-warm-cream` links, `gold` variant `Pill`); this extends design.md's "gold/ghost only inside Or'Aura" rule to "an Or'Aura palette surface, including the mobile menu" |
| Render `MobileMenu`'s reveal | Whether to animate at all | `gsap.matchMedia()`'s own read of `(prefers-reduced-motion: no-preference)`, never a prop, same pattern as spec 0002 |
| Render `Hero` | The photo `src`, `credit`, `creditHref`, `alt`, headline, subheadline, and location/date text | Ported verbatim from the old file (`alt` derived from its `placeholder` attribute, which has no visitor facing equivalent in the old file); of the old file's three A/B/C headline variants (a leftover of its no code page builder origin), only the default ("L'artisanat malgache, à votre échelle.") ships; the other two are dropped, not built behind a toggle nothing will ever flip |

**Key invariants**:
- `<dialog>`'s focus trap and modality are entirely native; no code here re-implements either. Escape detection and the animated close path are the one deliberate exception, handled explicitly (see AC-4).
- Closing the menu always explicitly focuses the hamburger button; this is not left to browser default behavior.
- `Hero` never imports `Reveal` or `useScrollReveal`.
- `MobileMenu` is the sole owner of the open/closed state and the `<dialog>`; `Header` never reaches into it.

**Security model**:
Not applicable. This feature has no user data, authentication, or authorization surface.

**Configuration required**:
- No new environment variables or credentials.

**Component location**: `app/components/Header.tsx`, `app/components/MobileMenu.tsx`, `app/components/sections/Hero.tsx`.

**Critical test scenarios**:
- Happy path: on a viewport at 768px and above the full header renders and its scroll transition still works (including a reload while already scrolled, with no visible flash); below 768px the hamburger opens the full screen menu with its staggered reveal, and closing it (each of the three ways) returns focus to the hamburger, verifies **AC-1**, **AC-2**, **AC-3**, **AC-4**.
- Reduced motion (verified by code review against the `gsap.matchMedia()`/`gsap.from()` pattern, the same limitation and resolution as spec 0002, since this browser tool can't emulate `prefers-reduced-motion`): the menu still opens and closes, just instantly, with no stagger, verifies **AC-5**.
- No JavaScript: with JavaScript actually disabled in the browser at 375px, all four nav links and the quote CTA are visible and clickable, and the complete hero renders, verifies **AC-7**.

## Build plan

1. [x] Build `MobileMenu` (`app/components/MobileMenu.tsx`, `"use client"`): the hamburger button and its own state/ARIA, the `<dialog>` with its UA reset, the GSAP timeline (`showModal()` then `gsap.from()` with stagger, gated by `gsap.matchMedia()`), the Escape interception (`cancel` event → prevent → reverse → `close()`), the distinct in-dialog close button (`autofocus`), explicit focus return to the hamburger on every close path, and the `overflow-y` scroll lock while open, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**
2. [x] Build `Header` (`app/components/Header.tsx`, `"use client"`): the wordmark (a static `next/image` import, not `CreditedImage`), the desktop nav row and its hover tier (hidden below `md`), the quote `Pill`, the `useScrolled` driven style toggle at the exact AC-1 tokens (transition classes applied only post mount), the `overlay` prop, rendering `<MobileMenu />` in its collapsed slot, and the `<noscript>` fallback nav row, satisfies **AC-1**, **AC-2**, **AC-7**, **AC-8**
3. [x] Render `Header` from `app/layout.tsx`, so it's present on every route, satisfies **AC-1**
4. [x] Build `Hero` (`app/components/sections/Hero.tsx`, a Server Component): the full bleed `CreditedImage`, gradient overlays, headline, subheadline, CTA `Pill`, location/date strip, and scroll hint, at the old file's exact height, satisfies **AC-6**, **AC-8**
5. [x] Update `app/page.tsx`: remove the placeholder `<main>`'s centering flex utilities, render `Hero` as its first child, satisfies **AC-6**
6. [x] Verify: typecheck, build, lint; a browser check at 390px and 1920px covering the header's scroll transition (including a simulated already scrolled load), the mobile menu's full open/close/focus cycle and scroll lock, and the server rendered no JavaScript fallback, satisfies **AC-1** through **AC-8**

**Deviations from this plan, discovered while building** (local implementation details, not load bearing):
- The hamburger's hit target is an 18×18px square (three bars stacked with `justify-between`), not 18×14px as the value sourcing table suggested; a marginally larger, easier tap target, same visual weight.
- `Header` computes `MobileMenu`'s `overlay` prop as `!solid` (accounting for both the `overlay` prop and the live scroll state), not the raw `overlay` prop alone, so the hamburger's own color always matches what's actually behind it at that moment.
- `app/page.tsx`'s `<main>` needed no `shrink-0`: removing the old centering flex utilities entirely (plain `<main>`, no flex context) was enough for `Hero`'s explicit height to render correctly.
- Verified with a temporary, JS injected spacer (added and removed at runtime, no file changes) rather than real page content, since no later section exists yet to provide natural scroll room.
- Escape closing the menu is implemented (intercepting the dialog's native `cancel` event) and confirmed correct by dispatching that event directly; the browser tool's synthetic Escape keypress does not reach the dialog's native handling to trigger it live, the same class of tooling limitation as spec 0002's reduced motion check.

## Consequences

**Positive**:
- The site gets a real, polished mobile navigation instead of a wrapped row of links, without adding a new dependency for it, and it still works with JavaScript disabled.
- The header and hero are both fully server rendered, so the page's first paint never waits on client JavaScript.
- The GSAP exception here is recorded explicitly, so it reads as a deliberate choice rather than an unexplained contradiction of spec 0002 later.

**Negative / tradeoffs**:
- The mobile menu is now a second GSAP surface (alongside scroll reveals) with its own timing logic (coordinating the exit animation with the dialog's native `close()`, and hand intercepting Escape), a bit more to maintain than a plain CSS open/close would have been.
- The old file's three headline variants are reduced to one; if a future need for that A/B style rotation returns, it has to be rebuilt, not just re-enabled.
- `Header` living in the root layout (rather than inside the hero, as in the old file) means its `overlay` default only suits a hero backed route; a future route without a dark hero has to remember to pass `overlay={false}`.

**Neutral**:
- `<dialog>`'s default styling (its centered box, `::backdrop`) is fully overridden to reach the full screen dark overlay look; nothing about its default appearance survives, only its focus trap and modal behavior.

## Follow-up

- [ ] Add a short note to spec 0002 acknowledging this scoped exception (GSAP now also drives the mobile menu's open/close, by direct request), so the two specs read as consistent rather than contradictory to a future reader.
- [ ] When a second, non-hero route is ever added (e.g. a legal page), pass `overlay={false}` to `Header` there so it doesn't render white text on the light background before any scrolling happens.

## Rationale

Reasoning and options: see `rationale.md`.
