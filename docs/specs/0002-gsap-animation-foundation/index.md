# 0002. GSAP animation foundation

**Date**: 2026-09-26
**Status**: In Progress

## Summary

This spec installs GSAP (a JavaScript animation library, which bundles its ScrollTrigger plugin for firing an animation as an element scrolls into view) and the official React hook `@gsap/react`, then builds three small reusable pieces every later section reuses: a scroll reveal hook, a `Reveal` wrapper component (the real entry point for a Server Component section, since a hook alone can only be called from a Client Component), and a plain scroll threshold hook for the sticky header's own transition. GSAP is reserved for scroll reveals only; every hover, focus, and open/close transition stays plain CSS, using shared duration and easing conventions this spec also records. A visitor who prefers reduced motion sees every reveal skipped entirely.

## Requirements

**User stories**:
- As the site's future visitor, I want content to feel alive as I scroll, without motion that fights me or ignores my reduced motion preference.
- As the engineer building the next nine section features, I want one ready made way to reveal content on scroll, usable from a plain server rendered section, and one shared easing and duration convention for everything else, so I'm not deciding animation mechanics freshly in every feature.

**Acceptance criteria**:
- **AC-1**: `gsap` (which bundles the `ScrollTrigger` plugin) and the official `@gsap/react` package are installed; `ScrollTrigger` is registered exactly once, by importing `gsap` only through one shared client only module (`app/lib/gsap-config.ts`); no other file imports from `"gsap"` directly.
- **AC-2**: A `useScrollReveal` hook returns a ref the caller attaches to one wrapper element; it fades and slides that element (or, when a `stagger` option is given, its direct children) into view once as it scrolls into the viewport (around 85% down the viewport), and never re-triggers on scrolling back up. A `Reveal` client component wraps this hook as the documented entry point for a Server Component section: the section stays a server component and passes its already rendered subtree as `Reveal`'s `children`, so only the small wrapper itself ships to the client. A section that is already a client component (the header, Nos maisons, the gallery) may call `useScrollReveal` directly instead.
- **AC-3**: Every animation `useScrollReveal` registers is wrapped in `gsap.matchMedia()` gated on `(prefers-reduced-motion: no-preference)`; a visitor who prefers reduced motion sees the final state immediately, with no animation running and no flash of a hidden state first.
- **AC-4**: A `useScrolled` hook exists for the sticky header's own transparent to solid transition: no GSAP or ScrollTrigger, SSR safe (`false` on the server and on first client render, never a `window` read during render), a passive scroll listener that also runs once on mount (so a page loaded already scrolled past the threshold starts in the right state), toggling past a 40px offset (matching the old file).
- **AC-5**: A shared easing token (`--ease-house`, `cubic-bezier(.2,.7,.2,1)`, the old file's one recurring curve for its two large layout morphs) is defined in `app/globals.css`'s theme. `docs/design.md` records the three real duration tiers ported from the old file: **200ms** for a hover/focus color or opacity change (the CSS default ease, no named curve), **350ms** for the header's own background/color/border transition, and **600 to 700ms with `--ease-house`** for a layout or transform morph (the Nos maisons card hover, the gallery slide). `Pill`'s existing hover transition is updated to state its duration explicitly (200ms), so it conforms to the convention this spec sets rather than an implicit default.
- **AC-6**: A reveal is wired up inside `useGSAP`'s layout effect (before first paint, exactly what `useGSAP` already does; never during render, never a plain `useEffect` after paint that would flash the hidden state), and animates only `opacity` and `transform`, so a reveal can never itself cause a layout reflow.

## Decision

**Chosen option**: Option 1: GSAP + ScrollTrigger + @gsap/react for scroll reveals only, plain CSS for everything else

Install GSAP, ScrollTrigger, and `@gsap/react`; build a scroll reveal hook plus its `Reveal` client wrapper, and a plain scroll threshold hook; keep every other transition as CSS using shared duration and easing tokens.

## Feature design

**Data model sketch**:
None. This feature has no persistence; it is a small set of hooks, one wrapper component, and CSS tokens.

**State transitions**:
None beyond `useScrolled`'s own boolean (below/past the 40px offset), which is local UI state, not a modeled entity.

**API surface**:
None. No backend endpoints; everything here runs entirely in the browser.

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Run `useScrollReveal` / `Reveal` | The delay, y offset, duration, stagger, and ease used | Hook defaults (`delay: 0`, `y: 24px`, `duration: 0.8s`, `stagger: undefined` meaning no stagger, `ease: "power2.out"`), overridable per call site by the section that uses it |
| Run `useScrollReveal` / `Reveal` | Which elements animate when `stagger` is set | `gsap.utils.toArray(scope.children)`, the scope element's direct children only |
| Run `useScrollReveal` / `Reveal` | Whether to animate at all | `gsap.matchMedia()`'s own read of `(prefers-reduced-motion: no-preference)`, never a prop |
| Run `useScrolled` | The toggle offset | A hook constant (40px, ported from the old file), overridable by the one caller (the header) if a later feature needs a different value |
| Run `useScrolled` | The initial value before the first scroll event | Hardcoded `false` (SSR safe), corrected once by the hook's own mount time check |
| Apply a hover/focus/open-close CSS transition | The duration and easing used | The three tiers `docs/design.md` records (200ms default ease for hover/focus, 350ms default ease for the header's own chrome transition, 600 to 700ms `--ease-house` for a layout/transform morph); a later feature picks the tier that matches what it's animating, not a value invented fresh |

**Key invariants**:
- No GSAP animation ever registers outside the `(prefers-reduced-motion: no-preference)` `matchMedia` gate.
- `ScrollTrigger` is registered exactly once for the whole app; every consumer imports `gsap` from `app/lib/gsap-config.ts`, never from `"gsap"` directly.
- A scroll reveal never repeats once it has played.
- A reveal always wraps an already sized container (a fixed height, or an image already using spec 0001's `CreditedImage` with its `aspect` prop) so a lazily loading image below it can never shift `ScrollTrigger`'s cached trigger position.

**Security model**:
Not applicable. This feature has no user data, authentication, or authorization surface.

**Configuration required**:
- No new environment variables or credentials.

**Component location**: `app/lib/gsap-config.ts`, `app/lib/useScrollReveal.ts`, `app/lib/useScrolled.ts`, `app/components/Reveal.tsx`.

**Critical test scenarios**:
- Happy path: a Server Component section wrapping its content in `Reveal` is invisible/offset before it enters the viewport and fades/slides into place once, on a throwaway sample page, verifies **AC-2**, **AC-6**.
- Reduced motion: with the OS/browser set to prefer reduced motion, the same element appears in its final state immediately, with no transition and no flash, verifies **AC-3**.
- Sticky header: loading the sample page already scrolled past 40px starts with the header in its solid state (no flash of the transparent state); scrolling past and back above 40px flips the hook's boolean both ways, verifies **AC-4**.

## Build plan

1. [x] Install `gsap` and `@gsap/react`, satisfies **AC-1**
2. [x] Create `app/lib/gsap-config.ts`: a `"use client"` module that registers `ScrollTrigger` on `gsap` exactly once and re-exports `{ gsap, ScrollTrigger }` as the only sanctioned import path, satisfies **AC-1**
3. [x] Create `app/lib/useScrollReveal.ts`: a `useGSAP` based hook returning a ref, using `gsap.from()` (never a CSS pre-hide, never `fromTo`) to animate `opacity`/`y` for the scope element or its direct children (via `gsap.utils.toArray`, when `stagger` is set) into view once, `toggleActions` set to play once and never reverse, gated by `gsap.matchMedia()` on `(prefers-reduced-motion: no-preference)`, satisfies **AC-2**, **AC-3**, **AC-6**
4. [x] Create `app/components/Reveal.tsx` (`"use client"`): a thin wrapper calling `useScrollReveal` and attaching its ref to one wrapper element around `children`, so a Server Component section can use it without itself becoming a client component, satisfies **AC-2**
5. [x] Create `app/lib/useScrolled.ts`: the SSR safe scroll listener hook described in AC-4 (initial `false`, a passive listener, invoked once on mount, state set only on an actual change), satisfies **AC-4**
6. [x] Add `--ease-house: cubic-bezier(.2,.7,.2,1);` to `app/globals.css`'s theme, and document the three duration tiers in `docs/design.md`, satisfies **AC-5**
7. [x] Update `app/components/ui/Pill.tsx`'s `transition-colors` to `transition-colors duration-200`, matching the 200ms hover/focus tier, satisfies **AC-5**
8. [x] Verify on a throwaway sample page: a `Reveal` wrapped section rendered from a server component parent plays its reveal once scrolling down and does not replay scrolling back up; `useScrolled` starts correctly on a page loaded already scrolled, and flips both ways at 40px; delete the sample once confirmed, satisfies **AC-2**, **AC-4**, **AC-6**

**Deviations from this plan, discovered while building** (local implementation details, not load bearing):
- The browser tool used for the visual check has no way to emulate `prefers-reduced-motion` (only light/dark color scheme), so AC-3 (the reduced motion gate) was verified by code review against GSAP's documented `matchMedia()` idiom, not by a live browser check. Flagged in `verify.md` as a manual step for `/check verify` to run on a real browser/OS.

## Consequences

**Positive**:
- Every later section reuses one reveal path (hook or wrapper, whichever fits whether it's already a client component) and one duration/easing convention instead of inventing scroll or transition logic nine more times.
- Reduced motion is handled once, centrally, so no section feature can forget it.
- Server Component sections stay server rendered; only the small `Reveal` wrapper and any section that already needs interactivity (the header, Nos maisons, the gallery) ship client JavaScript for motion.

**Negative / tradeoffs**:
- GSAP and ScrollTrigger add real weight to the client bundle for a use case (entrance reveals) that a lighter, less broadly supported CSS only approach could eventually replace.
- Keeping GSAP scoped to reveals only means two different systems (GSAP for reveals, CSS for everything else) exist side by side; a future contributor has to know that boundary rather than reaching for GSAP everywhere out of habit.
- AC-5's duration tiers are recorded here but only `Pill`'s hover and the reveal path are actually built and verifiable by this feature; the Nos maisons card morph, the gallery slide, and the header's own chrome transition are forward constraints for features 5, 7, 9, and 12 to follow, not something this build can itself prove.

**Neutral**:
- `@gsap/react` is a new runtime dependency alongside `gsap` itself, not just a dev tool.
- `Reveal` is a small, genuinely new component (not one of spec 0001's six primitives); later features treat it as part of the same shared UI toolkit.

## Follow-up

- [ ] The engineer declined an Agent Skill/MCP search for GSAP during this design; record the decline in root `AGENTS.md` so a later stack walk doesn't offer it again for this stack.

## Rationale

Reasoning and options: see `rationale.md`.
