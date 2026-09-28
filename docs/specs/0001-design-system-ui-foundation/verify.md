# Verify: Design system & UI foundation · spec 0001 · updated 2026-09-26

_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] Render `Container` with `py="section"` → vertical padding matches `clamp(96px, 11vw, 168px)`; `py="band"` matches `clamp(96px, 11vw, 160px)`; `py="bottom-only"` has no top padding; `py="none"` adds none of its own → AC-3
- [ ] Render all five `Pill` variants (`dark`, `cream`, `sage`, `gold`, `ghost`) → each shows its own background/border, text color, and hover color; every one shows its trailing circular arrow disc in the correct inverse tone → AC-4
- [ ] Tab to a `Pill` with the keyboard → a visible `focus-visible` outline appears (the warm dark tone on a light/photo surface, the gold tone on an Or'Aura dark surface); clicking with a mouse does not show the same outline → AC-4
- [ ] Render `Pill` with no `href` and `type="submit"` inside a `<form>` → submits the form like a native button → AC-4 (value sourcing: variant/size come from the caller's props)
- [ ] Render `Card` and `StatTile` side by side → `Card` has a full border on all sides and 6px rounded corners; `StatTile` has no radius and shows only a right and bottom rule → AC-5, AC-6
- [ ] Render `SectionHeading` with each `tone` (`warm`, `sage`, `gold`, `photo`) → the dot color matches; the heading text stays lowercase (never forced uppercase) → AC-7
- [ ] Render `CreditedImage` with a real Unsplash `src`, a `credit` in the exact form `"Photo by {name} on Unsplash"`, `creditHref`, and `aspect="4/5"` → the photo fills a rounded, clipped box at that ratio; the credit chip sits bottom left, both "{name}" and "Unsplash" are separately linked, and the Unsplash link carries `utm_source`/`utm_medium` → AC-8
- [ ] Render `CreditedImage` with no `aspect`, inside a parent with `position: relative` and an explicit height (e.g. a 420px hero band) → the photo fills that exact box, not zero height → AC-8 (regression check for the bug caught and fixed during this build)
- [ ] In a development server, render `CreditedImage` with an Unsplash `src` and no `credit` prop → the component throws, naming the missing credit → AC-9
- [ ] In a production build, render the same (Unsplash `src`, no `credit`) → nothing renders (no photo, no broken layout) and an error is logged, the page does not crash → AC-9
- [ ] Render `CreditedImage` with a non Unsplash `src` and no `credit` → the photo renders with no broken or empty credit line → AC-9
- [ ] Load a page using every primitive together at a 375px phone width and a 1920px desktop width → no horizontal scrollbar, `document.documentElement.scrollWidth` equals `clientWidth` at both → AC-10
- [ ] Switch the OS/browser to dark mode and reload → the palette does not change → AC-2

## Commands

- [ ] `bunx tsc --noEmit` → passes with no errors
- [ ] `bun run build` → completes with no route or type errors
- [ ] `bun run lint` → clean for every file under `app/` (pre-existing warnings in `old/` are out of scope)

## Acceptance-criteria coverage

- AC-1 (palette, fonts, type scale, spacing tokens) · covered by the `Container`/`Pill`/`SectionHeading` steps exercising the tokens, plus a direct read of `app/globals.css`
- AC-2 (one fixed palette, no dark mode) · covered by the dark mode reload step
- AC-3 (`Container` py variants) · covered by the `Container` step
- AC-4 (`Pill` variants, sizes, focus, tag choice) · covered by the `Pill` steps
- AC-5, AC-6 (`Card`, `StatTile`) · covered by the `Card`/`StatTile` step
- AC-7 (`SectionHeading` tone, lowercase) · covered by the `SectionHeading` step
- AC-8 (`CreditedImage` sizing contract, credit chip) · covered by the two `CreditedImage` rendering steps
- AC-9 (Unsplash fail closed guard) · covered by the three credit guard steps (dev throw, prod no render, non-Unsplash pass through)
- AC-10 (no horizontal overflow) · covered by the 375px/1920px step
