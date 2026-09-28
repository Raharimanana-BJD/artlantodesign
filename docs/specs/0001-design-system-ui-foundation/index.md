# 0001. Design system & UI foundation

**Date**: 2026-09-26
**Status**: In Progress

## Summary

This spec ports the visual language of the old reference page (`old/Art Lanto Design v3.dc.html`) into a small set of Tailwind v4 tokens (colors, fonts, a type scale, a spacing scale) and six shared components: a page container, a pill button, a bordered card, a borderless stat tile, a section heading, and a photo component that carries its credit line and refuses to render an uncredited Unsplash photo. Every one of the eleven page sections in the scope reuses these instead of inventing its own styling. The site keeps one fixed warm palette; there is no dark mode.

## Requirements

**User stories**:
- As the site's future visitor, I want every section to look and feel like one coherent site, so that the eleven different pages feel like a single, trustworthy business rather than a patchwork.
- As the engineer building the next ten features, I want a small set of ready made pieces (tokens, container, button, card, heading, credited photo), so that I am not re deriving the same colors, spacing, and photo credit handling by hand in every feature.

**Acceptance criteria**:
- **AC-1**: Tailwind v4 theme tokens exist in `app/globals.css` for: the full color palette (the warm base, the Univers Plante sage tones, the Or'Aura dark and gold tones, the footer tone, and the rule/divider tones below); the two font families, loaded through `next/font/google`, replacing the scaffold's Geist fonts; a fluid type scale (`display`, `h2`, `stat`, `quote`, `body`, `small`, `micro`, each a `clamp()` value ported from the old file); and a spacing scale (`gutter`, `section`, `band`, `col-gap`, `head-gap`, each a `clamp()` value ported from the old file).
- **AC-2**: The scaffold's light and dark color pair and its `prefers-color-scheme` block are removed; the site renders with one fixed palette regardless of the visitor's system theme.
- **AC-3**: A `Container` primitive renders content at a 1440px max width, always with the `gutter` token as horizontal padding, and a `py` variant for vertical padding matching the old file's actual patterns: `section` (the `section` token, all sides, the default), `band` (the `band` token, for full bleed CTA/contact bands), `bottom-only` (no top padding, for a section that immediately follows another), and `none` (for a section handling its own padding). Every later section picks the variant that matches its position on the page.
- **AC-4**: A `Pill` primitive covers the old file's five color variants (`dark`, `cream`, `sage`, `gold`, `ghost`, each with its own hover color), three sizes (`sm`, `md`, `lg`, `md` default), its trailing circular arrow, a `focus-visible` outline (the warm dark tone on light or photo surfaces, the gold tone on the Or'Aura dark surface), and renders an `<a>` when an `href` prop is passed or a `<button>` otherwise. Built with `clsx` and `tailwind merge` for its conditional classes.
- **AC-5**: A `Card` primitive (bordered box, 6px corner radius, 20px padding default) exists for the recurring bordered offer/step card pattern.
- **AC-6**: A `StatTile` primitive (no radius, a right and bottom rule only, 20px padding) exists for the About section's stat tile pattern, distinct from `Card`.
- **AC-7**: A `SectionHeading` primitive renders the recurring small dot plus two line heading pattern (lowercase, not uppercase), with a `tone` prop for the dot's four colors (the warm dark default, sage, gold, white for use on a photo).
- **AC-8**: A `CreditedImage` primitive wraps `next/image` with `fill` and `object-cover`, a required `sizes` prop, an optional `aspect` prop that renders the rounded, clipped wrapper box, and an optional `priority` flag for the hero's photo; `images.unsplash.com` and `plus.unsplash.com` are allow listed in `next.config.ts`. When credited, it renders the old file's exact credit chip (bottom left, small pill, "Photo by {name} on Unsplash" with both parts linked, Unsplash referral params appended automatically).
- **AC-9**: A `CreditedImage` whose `src` host matches any `*.unsplash.com` subdomain throws in development when no `credit` prop is passed, matching the old file's fail closed rule that an uncredited Unsplash photo must never render. A `CreditedImage` using a non Unsplash `src` (the deferred real photography swap) may omit `credit` and renders the photo alone.
- **AC-10**: All six primitives, and the root layout's `overflow-x: clip`, produce no horizontal overflow when rendered together at a 375px phone width and a 1920px desktop width.

## Decision

**Chosen option**: Option 1: Tailwind v4 theme tokens plus small hand rolled primitives (clsx + tailwind merge)

Port the old file's palette, fonts, and spacing into Tailwind v4 tokens, and hand build the six shared primitives using `clsx` and `tailwind merge` for their variants.

**Implementation skills**: `tailwind-4-docs` (`lombiq/tailwind-agent-skills`, `.agents/skills/tailwind-4-docs/`) · `tailwind-design-system` (`wshobson/agents`, `.agents/skills/tailwind-design-system/`)

## Feature design

**Data model sketch**:
None. This feature has no persistence; it is tokens and presentational React components only.

**State transitions**:
None.

**API surface**:
None. No backend endpoints; every primitive is a presentational component consumed by server or client components in later features.

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Render any primitive | The color, font, radius, or spacing value used | A Tailwind theme token defined in `app/globals.css` (AC-1) |
| Render `CreditedImage` | The photo `src`, `alt` text, `sizes`, `aspect`, and optional credit text/link | Passed in as props by the page section that uses it (decided per section, in each section's own feature; `sizes` follows that section's own layout, e.g. a full bleed hero is `100vw`, a 132px thumbnail is a fixed pixel value) |
| Render `Pill` | Which color variant and size | Passed in as props by the calling section, based on the background it sits on and its place in the page |
| Render `SectionHeading` | Which dot `tone` | Passed in as a prop by the calling section, based on which house/background it belongs to |
| Guard a `CreditedImage` render | Whether `src`'s host counts as Unsplash | Derived at render time from `src` itself (a hostname match against `*.unsplash.com`), never a prop |

**Key invariants**:
- `Container` content never exceeds 1440px.
- Every text/background pair actually paired together in the reference design meets WCAG AA contrast (e.g. the muted label tone on the warm base, the cream text on the Or'Aura dark background); a token is not assumed safe against a background it is never actually placed on in this design (the gold accent tone, for instance, is only ever used on the Or'Aura dark background, never on the cream background, where it would fail).
- A `CreditedImage` with a `credit` prop always shows that credit; a non Unsplash `CreditedImage` without one never shows an empty credit line; an Unsplash `CreditedImage` without one never renders the photo at all (AC-9).

**Security model**:
Not applicable. This feature has no user data, authentication, or authorization surface.

**Configuration required**:
- No new environment variables or credentials. `next.config.ts` gains two non secret `images.remotePatterns` entries, for `images.unsplash.com` and `plus.unsplash.com` (build plan task 4).

**Component location**: the six primitives live at `app/components/ui/{Container,Pill,Card,StatTile,SectionHeading,CreditedImage}.tsx`, with the `cn()` class merge helper at `app/lib/cn.ts`.

**Critical test scenarios**:
- Happy path: every primitive (`Container`, `Pill`, `Card`, `StatTile`, `SectionHeading`, `CreditedImage`) renders correctly on a throwaway sample page using the new tokens, verifies **AC-1**, **AC-3**, **AC-4**, **AC-5**, **AC-6**, **AC-7**, **AC-8**.
- Failure case: an Unsplash `CreditedImage` rendered with no `credit` prop throws instead of rendering the photo; a non Unsplash `CreditedImage` without one renders the photo with no broken or empty credit line, verifies **AC-9**.
- Responsive: the sample page shows no horizontal overflow at a 375px phone width or a 1920px desktop width, verifies **AC-10**.

## Build plan

1. [x] Add `clsx` and `tailwind-merge` as dependencies; add a small `cn()` class merge helper at `app/lib/cn.ts`, satisfies **AC-4**
2. [x] Swap the `next/font/google` fonts in `app/layout.tsx` from Geist to Hanken Grotesk (weights 300 to 700) and Instrument Serif (italic), satisfies **AC-1**
3. [x] Rewrite `app/globals.css`: define the full color palette, the type scale, and the spacing scale as Tailwind v4 `@theme` entries; add the body base rule (background, text color, antialiasing) and `overflow-x: clip` on the root wrapper; remove the scaffold's light/dark `prefers-color-scheme` block and its now unused default tokens, satisfies **AC-1**, **AC-2**, **AC-10**
4. [x] Add `images.unsplash.com` and `plus.unsplash.com` to `next.config.ts`'s `images.remotePatterns`, satisfies **AC-8**
5. [x] Build the `CreditedImage` component at `app/components/ui/CreditedImage.tsx`: a `next/image` wrapper using `fill` + `object-cover`, a required `sizes` prop, an optional `aspect` prop for the wrapper box, an optional `priority` flag, the old file's exact credit chip styling and link pattern, and the fail closed guard that throws in development for an uncredited Unsplash `src`, satisfies **AC-8**, **AC-9**
6. [x] Build the `Container` layout primitive with its `py` variant (`section` | `band` | `bottom-only` | `none`), satisfies **AC-3**
7. [x] Build the `Pill` button/link primitive (`dark`/`cream`/`sage`/`gold`/`ghost` variants, `sm`/`md`/`lg` sizes, trailing circular arrow, hover and `focus-visible` states, `<a>` when `href` is passed else `<button>`) using the `cn()` helper, satisfies **AC-4**
8. [x] Build the `Card` primitive (bordered, 6px radius), satisfies **AC-5**
9. [x] Build the `StatTile` primitive (borderless, right/bottom rule only), satisfies **AC-6**
10. [x] Build the `SectionHeading` primitive with its dot `tone` prop, satisfies **AC-7**
11. [x] Remove the default `create next app` sample content and unused public assets, then check every primitive together on a throwaway sample page at a 375px and a 1920px width before deleting the sample, satisfies **AC-10**

**Deviations from this plan, discovered while building** (local implementation details, not load bearing):
- Next.js 16 deprecated `next/image`'s `priority` prop in favor of `preload` (confirmed in `node_modules/next/dist/docs`); `CreditedImage` exposes `preload` instead, same purpose (task 5).
- `body`/`small`/`micro` are the old file's real flat pixel values (17px/15px/12.5px), not `clamp()`; only `display`/`h2`/`stat`/`quote` are genuinely fluid in the reference. AC-1's "each a `clamp()` value" was imprecise; the tokens are otherwise exactly as specced (task 3).
- Caught and fixed during the browser check: `CreditedImage`'s wrapper collapsed to zero height whenever used without an `aspect` prop (the documented "parent already sized" mode), because the component's own div wasn't positioned to fill that parent. Fixed by making the no `aspect` wrapper `absolute inset-0` instead of a bare `relative` div (task 5).

## Consequences

**Positive**:
- Every later section feature reuses the same six primitives instead of re deriving styling by hand, so the site reads as one coherent product.
- The whole visual language lives in one file (`app/globals.css`), so a future rebrand or palette tweak touches one place.
- The Unsplash credit guard makes an unattributed photo a build time failure instead of a silent terms violation that ships.

**Negative / tradeoffs**:
- Porting `clamp()` values by hand from the old file is manual work; a value copied wrong drifts quietly from the reference design until someone notices.
- `clsx` and `tailwind merge` are two more dependencies to keep updated, small as they are, for a benefit (readable multi variant composition, future `className` passthrough) that a plain lookup table could also provide.

**Neutral**:
- The default `create next app` sample page content and unused public assets (already partly removed, per the current git status) are fully cleared out as part of this work.
- No dark mode is defined; supporting it later is a real follow up feature, not a flag to flip.

## Follow-up

- [ ] `tailwind-4-docs` (`lombiq/tailwind-agent-skills`) and `tailwind-design-system` (`wshobson/agents`) conventions are not yet in root `AGENTS.md`'s Agent skills section; they apply to every file in the project and belong at root level.
- [ ] Revisit `Container`'s default vertical padding once Header & hero is built: the hero is a fixed viewport height, full bleed section, and may need its own padding variant rather than the standard one.

## Rationale

Reasoning and options: see `rationale.md`.
