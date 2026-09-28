# Scope: Art Lanto Design website

A single page marketing and lead generation site for Art Lanto Design, showcasing its three houses (Toliara Handicraft basketry, Univers Plante, and Or'Aura restaurant) and collecting quote and reservation requests from hotels, restaurants, and distributors.

**Build approach:** Skateboard (ship the full page as one usable whole, working end to end, then grow it with later releases).
**Workflow:** Alpha (after `/develop`, run `/check verify` against the real running site; no separate test suite or fresh model review by default, except where a feature carries its own tag). `/architect` is the recommended first stop for a feature with a real decision, but skippable when you already know the build. You decide when a feature is `done`.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack & architecture | Foundation | existing |
| 2 | Design system & UI foundation | Foundation | in-progress |
| 3 | GSAP animation foundation | Foundation | in-progress |
| 4 | SEO & metadata basics | Foundation | in-progress |
| 5 | Header & hero | Release 1 | in-progress |
| 6 | About | Release 1 | in-progress |
| 7 | Nos maisons | Release 1 | in-progress |
| 8 | Toliara Handicraft | Release 1 | in-progress |
| 9 | Processus & quick contact band | Release 1 | in-progress |
| 10 | Réalisations gallery | Release 1 | in-progress |
| 11 | Univers Plante | Release 1 | in-progress |
| 12 | Or'Aura | Release 1 | in-progress |
| 13 | Impact & founder quote | Release 1 | in-progress |
| 14 | Contact | Release 1 | in-progress |
| 15 | FAQ, footer & sticky CTA | Release 1 | done |
| 16 | Catalogue & menu page | Release 1 | done |

## Foundations

### 1. Stack & architecture · existing
Next.js 16, React 19, and Tailwind v4 are already scaffolded and boot locally through `create next app`. No product content yet.
**Done when:** the app builds and runs; this row exists for context, not to redo the choice.
code in `./`

### 2. Design system & UI foundation
Turn the old file's inline styles (colors, the Hanken Grotesk and Instrument Serif type pair, spacing and radius patterns, section wrapper widths) into Tailwind theme tokens and a small set of shared primitives (section container, pill button, card, and an image component that renders a remote photo with its credit line, matching the old `image slot` behavior).
**Done when:** the palette, type scale, and spacing live as Tailwind tokens in `app/globals.css`; a container, pill button, card, and credited image component exist and are used by at least one page section; Unsplash is allowed as a remote image source in `next.config.ts`.
- [x] Design it (spec): `/architect design system & UI foundation`
- [x] Build it: `/develop design system & UI foundation`
   - [x] Tokens: color palette, type scale, spacing scale, and the two Google fonts, replacing the scaffold's defaults (AC-1, AC-2, AC-10)
   - [x] Image handling: Unsplash allow listed in `next.config.ts`, and the `CreditedImage` component with its sizing contract and fail closed credit guard (AC-8, AC-9)
   - [x] Layout and button primitives: `Container` (with its padding variants) and `Pill` (with its color/size variants) (AC-3, AC-4)
   - [x] `Card`, `StatTile`, and `SectionHeading` primitives (AC-5, AC-6, AC-7)
   - [x] Cleanup and a responsive check of every primitive together, phone and desktop width (AC-10)
- [ ] Verify it: `/check verify design system & UI foundation`
Spec [0001](../specs/0001-design-system-ui-foundation/index.md) · code in `app/components/ui/`, `app/lib/cn.ts`, `app/globals.css`, `docs/design.md`

### 3. GSAP animation foundation
Decide the shared animation conventions: scroll triggered reveals, the sticky header's transition on scroll, hover and open and close transitions, and how `prefers reduced motion` is respected, so every section below reuses the same small set of patterns instead of inventing its own.
**Done when:** GSAP and ScrollTrigger are installed and registered once; a reusable hook or utility exists for scroll triggered reveals; motion is skipped or reduced when the visitor prefers reduced motion.
- [x] Design it (spec): `/architect gsap animation foundation`
- [x] Build it: `/develop gsap animation foundation`
   - [x] GSAP setup: install `gsap` and `@gsap/react`, register `ScrollTrigger` exactly once (AC-1)
   - [x] Reveal path: `useScrollReveal` hook plus the `Reveal` client wrapper, reduced motion gated (AC-2, AC-3, AC-6)
   - [x] Sticky header hook: `useScrolled`, SSR safe (AC-4)
   - [x] Shared motion tokens: `--ease-house` plus the three duration tiers in `docs/design.md`, `Pill` conforming (AC-5)
   - [x] Verify and clean up on a throwaway sample page, phone and desktop (AC-2, AC-3, AC-4, AC-6)
- [ ] Verify it: `/check verify gsap animation foundation`
Spec [0002](../specs/0002-gsap-animation-foundation/index.md) · code in `app/lib/gsap-config.ts`, `app/lib/useScrollReveal.ts`, `app/lib/useScrolled.ts`, `app/components/Reveal.tsx`, `app/globals.css`, `docs/design.md`

### 4. SEO & metadata basics
Replace the default `create next app` metadata with the real site's title, description, Open Graph image, favicon, `sitemap.ts`, and `robots.ts`, so the site is discoverable and shareable from day one.
**Done when:** `app/layout.tsx` exports real metadata and an Open Graph image; a sitemap and robots file exist; the default Next.js and Vercel placeholder assets are gone.
- [x] Build it: `/develop seo & metadata basics`
- [ ] Verify it: `/check verify seo & metadata basics`
code in `app/layout.tsx`, `app/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`, `app/sitemap.ts`, `app/robots.ts`

## Release 1: the full page, live

### 5. Header & hero
The fixed header (logo, nav links, quote CTA) that turns from transparent to a blurred solid bar past a scroll threshold, and the hero itself: full bleed photo, headline, subheadline, CTA, and the "scroll" hint. On a narrow screen the nav collapses into a full screen, GSAP animated mobile menu (a native `<dialog>`), with a no JavaScript fallback.
**Done when:** the header's transparent to solid transition matches the old file's scroll behavior; the hero renders the photo, headline, and CTA; the page still works with JavaScript disabled for the initial paint, including the mobile nav.
- [x] Design it (spec): `/architect header & hero`
- [x] Build it: `/develop header & hero`
   - [x] Mobile menu: hamburger button, native `<dialog>`, GSAP timeline, Escape handling, focus return, scroll lock (AC-2, AC-3, AC-4, AC-5)
   - [x] Header: wordmark, desktop nav, quote CTA, scroll transition, `overlay` prop, no JS fallback, wired into `app/layout.tsx` (AC-1, AC-2, AC-7, AC-8)
   - [x] Hero section, wired into `app/page.tsx` (AC-6, AC-8)
   - [x] Verify across viewports, the breakpoint boundary, scroll states, the mobile menu, and with JavaScript disabled
- [ ] Verify it: `/check verify header & hero`
Spec [0003](../specs/0003-header-hero/index.md) · code in `app/components/Header.tsx`, `app/components/MobileMenu.tsx`, `app/components/sections/Hero.tsx`, `app/lib/nav-links.ts`, `app/layout.tsx`, `app/page.tsx`

### 6. About
Intro copy, the still photo, the four stat tiles (founding year, artisans trained, biodegradable share, and the impact teaser card linking to Impact).
**Done when:** the stat grid and impact teaser render and the teaser link scrolls to the Impact section.
- [x] Build it: `/develop about`
- [ ] Verify it: `/check verify about`
code in `app/components/sections/About.tsx`

### 7. Nos maisons
The three house cards (Toliara Handicraft, Univers Plante, Or'Aura), each linking to its own section. Originally ported the old file's hover-to-reveal active state (only one card showed its photo/description at a time, defaulting to card 01); feedback flagged this as unusable on mobile (no hover) and making cards 02/03 look unfinished at rest, so all three cards now show their photo and description unconditionally, equally weighted.
**Done when:** all three cards show their photo, tag, number, logo, description, and name without any hover/focus interaction; each card links to its section.
- [x] Build it: `/develop nos maisons`
- [ ] Verify it: `/check verify nos maisons`
code in `app/components/sections/NosMaisons.tsx`

### 8. Toliara Handicraft
The vannerie house section: intro copy, catalogue CTA, and the three way card grid (catalogue pieces, hotel custom work, volume and export orders).
**Done when:** the three cards and the catalogue CTA render with the old file's copy and layout.
- [x] Build it: `/develop toliara handicraft`
- [ ] Verify it: `/check verify toliara handicraft`
code in `app/components/sections/Toliara.tsx`

### 9. Processus
The four step "how it works" grid (brief, prototype and quote, production, delivery). Originally shipped with its own full bleed "quick contact" phone band; that band was removed after feedback that it competed with the main Contact form as a second conversion point, so this section now only explains the process and points to the single Contact form (feature 14) via its own CTA.
**Done when:** the four steps render in order; the "Obtenir un devis" CTA scrolls to Contact.
- [x] Build it: `/develop processus & quick contact band`
- [ ] Verify it: `/check verify processus & quick contact band`
code in `app/components/sections/Processus.tsx`

### 10. Réalisations gallery
The horizontally sliding gallery of pieces, with previous and next controls, a numbered counter, and a caption per item.
**Done when:** previous and next wrap around at the ends; the counter and caption update with the current item; the slide transition is smooth on touch and with a mouse.
- [x] Build it: `/develop réalisations gallery`
- [ ] Verify it: `/check verify réalisations gallery`
code in `app/components/sections/Gallery.tsx`

### 11. Univers Plante
The plant house section: intro copy, photo, the five category list (indoor, outdoor, aromatic, fruit trees, pots and accessories), and its order CTA.
**Done when:** the category list and CTA render with the old file's copy.
- [x] Build it: `/develop univers plante`
- [ ] Verify it: `/check verify univers plante`
code in `app/components/sections/UniversPlante.tsx`

### 12. Or'Aura
The restaurant and lounge house section: intro, reservation CTA, room photo, the Eat, Drink, Meet, and "with purpose" list, and the privatization callout with its small photo.
**Done when:** the four item list and the privatization callout render with the old file's copy and dark theme.
- [x] Build it: `/develop or'aura`
- [ ] Verify it: `/check verify or'aura`
code in `app/components/sections/OrAura.tsx`

### 13. Impact & founder quote
The founder photo and quote, plus the three impact stats (local employment, zero chemistry, protected areas).
**Done when:** the quote and the three stat cards render with the old file's copy.
- [x] Build it: `/develop impact & founder quote`
- [ ] Verify it: `/check verify impact & founder quote`
code in `app/components/sections/Impact.tsx`

### 14. Contact · Beta
The site's single lead form: house picker (Toliara Handicraft, Univers Plante, Or'Aura), request type picker per house, name, company, email, phone, and message fields (each with a visible label), per-field inline validation, a confirmation state, and sending the submission to you by email. Formerly there were two conversion points (this form plus Processus's standalone quick phone form); the latter was removed after feedback that it competed with this one, so phone now lives here as an optional field alongside email.
**Done when:** picking a house updates the request type options and the message placeholder; submitting with a missing name shows "Votre nom est requis." under the Nom field, an invalid email shows "Adresse e-mail non valide." under the E-mail field, and neither error blocks the other from showing independently; a valid submission emails you the lead's details and shows the confirmation state naming the chosen house.
- [x] Design it (spec): `/architect contact`
- [x] Build it: `/develop contact`
   - [x] Env/config: `.env.local`, `.env.example`, `nodemailer` + `server-only` installed (AC-3)
   - [x] Email sending: `app/lib/email.tsx` (self hosted SMTP via Nodemailer, HTML template via react-email) and the shared `/api/contact` route, honeypot checked before validation (AC-1, AC-2, AC-3)
   - [x] Client send helper: `app/lib/send-lead.ts` (AC-3, AC-5)
   - [x] `Contact` form component with per-field labels and inline errors, wired into `app/page.tsx` (AC-4, AC-5, AC-7)
   - [x] Processus's quick form removed (feedback: two competing conversion points); phone is now an optional field on this form instead
- [ ] Verify it: `/check verify contact`
- [ ] Test it: `/test contact`
Spec [0004](../specs/0004-contact.md)

### 15. FAQ, footer & sticky CTA
The FAQ accordion (one open answer at a time), the footer (navigation, social links, contact details, and the large wordmark), and the sticky "quick quote" button.
**Done when:** opening a question closes any other open one; the footer's links scroll to their sections; the sticky CTA stays visible while scrolling and opens the Contact section.
- [x] Build it: `/develop faq, footer & sticky cta`
  code in `app/components/sections/Faq.tsx`, `app/components/Footer.tsx`, `app/components/StickyCta.tsx`

### 16. Catalogue & menu page
A dedicated `/catalogue` page: the Toliara Handicraft product catalog, the Univers Plante product catalog, and the Or'Aura restaurant menu, each in its own section with the house's own palette. Linked from the footer nav. No decision owed: reuses the existing design tokens/primitives and the old file's brand palettes; content (product names, descriptions, prices) is original placeholder copy, not sourced from the old file (which never had a catalog), flagged below for replacement with the business's real catalog and menu.
**Done when:** all three sections render with accurate product/menu photos (verified, no mismatched or broken images) and correct prices; the footer's "Catalogue & menu" link opens the page; the in-page nav jumps to each section.
- [x] Build it: `/develop catalogue page`
  code in `app/catalogue/page.tsx`, `app/lib/catalogue-data.ts`
Follow-up: every product name, description, and price on this page is placeholder content written for this build (Ariary prices are illustrative), and must be replaced with the business's real catalog and menu before launch. Photos are stock Unsplash images picked to visually match each placeholder product/dish; they should be replaced with real product/food photography at the same time.

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **Real photography**: swap the Unsplash placeholders for the client's own photos · no decision needed, a content swap once photos exist
- **Analytics & tracking**: visitor and lead analytics · needs a decision
- **Cookie consent banner**: only becomes needed if analytics or another cookie setting feature is added later · needs a decision
- **English translation**: the site is French only for this pass · needs a decision
- **CRM or spreadsheet lead forwarding**: an alternative to emailing leads directly, if email stops being enough · needs a decision

## Legend

**The decision box.** Every feature carries at most one, the sub task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | **`/architect` at spec capture** | `Design it` ticked; spec linked; `Build it: /develop <feature>` plus 2 to 5 milestones; the tier's closing boxes (`Verify it` for Alpha and above); any surfaced follow up enrolled |
| `in-progress` (building) | `/develop` | milestone sub boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` and milestones ticked; `Verify it` ticked |
| `done` | **you, when you decide it is** (any skill sets it when you say so); `/sync` reconciles | boxes you ran ticked, skipped ones marked skipped; Alpha's last stage (after `/check verify`) is the suggested point to call it done |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop`.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` to `in-progress` to `done`, plus `existing` (predates this workflow) and `dropped` (out of scope, kept for history).
- **Workflow tier tag** beside a heading (here, `· Beta` on Contact) sets that one feature's rigor above the project default; no tag inherits Alpha.
- **Workflow** (header line): Alpha runs `/check verify` after `/develop`; Beta adds `/test` after that. A feature built on an unratified decision (an `Assumed` spec) stays flagged, but that never blocks `done`.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
