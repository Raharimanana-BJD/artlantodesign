# Rationale: 0001. Design system & UI foundation

## Context

The Next.js scaffold currently ships with `create next app`'s own default tokens (a light and dark color pair, Geist fonts) and no product styling at all. The real visual language for Art Lanto Design already exists, fully worked out, in the old reference file: a warm cream and brown palette for the main site, a sage green palette for the Univers Plante house, a near black and gold palette for Or'Aura, two Google fonts (Hanken Grotesk for body text, Instrument Serif in italic for a handful of accent words), fluid `clamp()` based type and spacing rather than fixed breakpoint steps, a 1440px content width, 6px rounded corners on cards and photos, and fully rounded (999px) pill shaped buttons with a small circular arrow.

Nine of the eleven planned page sections repeat the same small heading pattern (a colored dot plus a two line heading, lowercase, not the About section's own uppercase treatment) and the same pill shaped call to action, in five different color variants across the site's three houses. Every photo in the old file is a remote Unsplash URL; the old file's own `image-slot.js` component renders a small bottom left credit chip ("Photo by {name} on Unsplash", two links, Unsplash referral params auto appended) whenever a photo is credited, and, critically, renders an error tile **instead of the photo** when an Unsplash photo has no credit at all, since an uncredited Unsplash photo on screen is itself a violation of Unsplash's terms. Without a shared set of tokens and primitives, each of the eleven section features would re derive these values and re build the same button and heading by hand, and small inconsistencies (a slightly different radius, a missed credit line) would show up across the site. This is a solo, personal project, so the tooling this foundation adds should stay small.

## Options considered

### Option 1: Tailwind v4 theme tokens plus small hand rolled primitives (clsx + tailwind merge)

Extend the `@theme inline` block already started in `app/globals.css` with the full palette, fonts, type scale, and spacing scale, then hand build the six primitives as small React components, using `clsx` and `tailwind merge` only to keep their conditional class names readable.

**Pros**:
- Zero heavy dependencies; builds directly on the Tailwind v4 setup the scaffold already uses.
- Every value can be ported exactly from the old file, since the full reference design is already known.

**Cons**:
- The primitives are hand written, so covering a new variant later is manual work, not something a library hands you for free.

### Option 2: A component library (e.g. a Radix or Base UI primitive set with Tailwind styling)

Adopt an existing accessible component library for the primitives instead of hand building them.

**Pros**:
- Battery included accessible behavior (focus trapping, keyboard handling) for interactive pieces like dialogs or menus, if the site ever needs them.

**Cons**:
- This site has no modal, dropdown, or menu in scope; the library's real value goes almost entirely unused for a six primitive, mostly static marketing page, while its own API and conventions still have to be learned.

### Option 3: Plain CSS custom properties and CSS Modules, skipping Tailwind utility classes for the primitives

Keep the tokens as CSS custom properties and style the primitives with plain CSS Modules, closer to the old file's own inline style approach.

**Pros**:
- Structurally closest to how the old file itself is written.

**Cons**:
- Abandons the Tailwind v4 setup already scaffolded and chosen for this project, so two styling systems would coexist; loses Tailwind's utility ergonomics for the many one off layout tweaks each of the eleven sections will still need on top of the primitives.

## Rationale

The project already runs Tailwind v4 with an `@theme inline` block in the scaffolded `app/globals.css` (basis: the existing scaffold), so extending that same mechanism costs nothing new to learn and keeps one styling system in the codebase. The whole site is a single, fairly small marketing page with no complex interactive primitives (no modal, menu, or multi step form beyond a couple of simple text forms), so a full component library's accessible interaction primitives would mostly sit unused, while its own conventions would still cost time to learn (basis: simple beats clever, boring technology over a large dependency for value not needed). Because the full reference design already exists in the old file, hand porting its exact values is direct, low risk work rather than an open design exercise, which favors Option 1's small, precise primitives over a library's own opinionated defaults. A plain `Record<Variant, string>` lookup would also satisfy every acceptance criterion here without `clsx`/`tailwind merge` at all, since nothing outside these primitives currently passes them a `className` to merge; the two are kept anyway, small as they are, so `Pill`'s five color variants times three sizes times a focus state compose as one readable `cn(...)` call rather than a lookup table with fifteen combinations, and so a later primitive can accept a passthrough `className` without a rewrite.

## References

**Project sources**:
- `old/Art Lanto Design v3.dc.html`, the exact palette, fonts, spacing, and component patterns this spec ports
- `docs/scope/scope.md`, feature 2's done when line

**Practices & standards**:
- WCAG AA contrast for body text against its background
- Design tokens defined once and consumed everywhere, rather than repeated per component
