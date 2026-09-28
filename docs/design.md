---
name: art-lanto-design-system
source: extracted-from-old/Art Lanto Design v3.dc.html
character: "Warm, tactile, and unhurried: a cream and dark brown base carries the main site and Toliara Handicraft, a soft sage green carries Univers Plante, and a near black and gold treatment carries Or'Aura. Fluid, clamp() based type and spacing throughout, not fixed breakpoint steps. One fixed look; no dark mode."
tokens: "real values live in app/globals.css (the @theme block); read them there, never duplicated here"
contrast: "primary text 13.4:1 / muted label 4.9:1 on the warm base; cream text 15.6:1 / muted 5.0:1 on the Or'Aura dark background; sage text 11.9:1 / muted 5.2:1 on the Univers Plante background; gold accent 9.8:1 on the Or'Aura dark background (large/decorative use only, never placed on the cream or warm base background, where it fails)"
---

## Build mandate

You are a senior product designer. Every page ships as a complete, professional product surface: brand, real product specific copy, a considered layout with hierarchy, all states (empty, loading, error), supporting content, and a footer where the page warrants one. Maximalist, never a lone form on an empty page. This system additionally has a fixed source of truth: `old/Art Lanto Design v3.dc.html` is a fully worked reference for every page section in the scope. Where that file covers a section, port its content and layout faithfully rather than reinventing it; where it doesn't (a state it never shows, a new page), extend the same character and the rules below.

## Character & direction

Warm artisanal hospitality, not corporate tech. Large, confident, lowercase display type for section headings (a small colored dot marks each one); a single italic serif accent (Instrument Serif) for the odd word or ampersand, never body copy. Photography carries most of the emotional weight, always full bleed or a large fixed aspect box, always credited. Three houses, three palettes, one shared structural language (the same container widths, spacing rhythm, pill buttons, and card patterns everywhere).

## Composition patterns

A single, long landing page (see `docs/scope/scope.md`): fixed header that turns from transparent to a blurred solid bar on scroll → full bleed hero → About → Nos maisons (interactive house picker) → a full bleed band image → Toliara Handicraft → Processus + a quick contact band → a horizontal gallery → Univers Plante → Or'Aura → Impact/quote → Contact → FAQ → footer. Section vertical rhythm uses the `section`/`band`/`bottom-only` `Container` padding variants (see `## Component & usage rules`); horizontal rhythm is always the `gutter` token, content capped at 1440px.

## Component & usage rules (do's and don'ts)

- **Container** (`app/components/ui/Container.tsx`): every section wraps in it. Pick `py="section"` normally, `py="band"` for a full bleed CTA/contact band, `py="bottom-only"` when the section immediately follows another with no gap needed above, `py="none"` when the section owns its own padding (e.g. a full bleed image strip).
- **Pill** (`app/components/ui/Pill.tsx`): the only button/link treatment. `dark` is the default, general purpose CTA; `cream` (white) only on a hero or header, always over a photo or dark backdrop; `sage` only inside Univers Plante; `gold`/`ghost` only inside Or'Aura. Always renders its own trailing arrow; don't add a second one. Pass `href` for navigation, omit it for an in page action (`type="submit"`, `onClick`).
- **SectionHeading** (`app/components/ui/SectionHeading.tsx`): the dot `tone` follows the section's own palette (`warm` default, `sage` in Univers Plante, `gold` in Or'Aura, `photo` when the heading sits directly on a photo). Lowercase; never force uppercase through this component (the About section's own heading is a deliberate one off exception, built by hand, not through `SectionHeading`).
- **Card vs StatTile**: `Card` is the bordered, 6px radius box (Toliara's offer cards, Processus' steps). `StatTile` is the borderless, right + bottom rule box (About's stat numbers). Don't use one for the other's job.
- **CreditedImage** (`app/components/ui/CreditedImage.tsx`): every photo on the site goes through it, never a bare `next/image`. Pass `aspect` (a CSS `aspect-ratio` string) when the image owns its own box; omit it only when the image already fills a parent you've explicitly sized and positioned (`position: relative` with a real height). `sizes` is required, always. `credit`/`creditHref` are required for any Unsplash photo, exact form `"Photo by {name} on Unsplash"`, or the component refuses to render it. Use `preload` on exactly one image per page, the one most likely to be the largest contentful paint (normally the hero).
- **Accent usage**: an accent color (`sage-accent`, `oraura-gold`, `oraura-green`) marks a primary action or a section's own dot/heading only, never decorative text or backgrounds at large area.
- **Elevation**: hairline borders (`border-rule` / `border-rule-strong` / `border-rule-inverse`) throughout; no drop shadows anywhere in the reference design, don't introduce one.

## Motion (spec 0002)

GSAP (with ScrollTrigger and the official `@gsap/react` hook) is reserved for scroll triggered entrance reveals only, through `useScrollReveal` (`app/lib/useScrollReveal.ts`) or its `Reveal` wrapper (`app/components/Reveal.tsx`, the entry point for a Server Component section). Every hover, focus, and open/close transition stays plain CSS, on one of three tiers ported from the old file, never a value invented per feature:

- **200ms, the CSS default ease** — a hover or focus color/opacity change (`Pill` already conforms).
- **350ms, the CSS default ease** — a chrome level transition (the sticky header's own background/color/border shift via `useScrolled`, `app/lib/useScrolled.ts`).
- **600 to 700ms, `ease-house`** (`--ease-house`, `cubic-bezier(.2,.7,.2,1)`, `app/globals.css`) — a layout or transform morph (the Nos maisons card hover, the gallery slide).

A reveal always wraps an already sized container (a fixed height, or a `CreditedImage` with its `aspect` prop) so a lazily loading image below it can never shift `ScrollTrigger`'s cached trigger position. Reduced motion is handled once, centrally, inside `useScrollReveal` (`gsap.matchMedia()` on `(prefers-reduced-motion: no-preference)`); a section never has to check it itself.

## Responsive & accessibility direction

Fluid `clamp()` based type and spacing everywhere (the `--text-*` and `--spacing-*` tokens): there is no fixed breakpoint step to design for beyond what a layout (grid columns, flex wrap) needs. Keep `overflow-x: clip` on the root (already set in `app/globals.css`) since the footer wordmark is deliberately wider than its own container. Every interactive element (`Pill`, and any future control) gets a visible `focus-visible` outline; never remove it without replacing it. No dark mode: the fixed palette applies regardless of the visitor's system theme.
