# Rationale: 0003. Header & hero

## Context

The header is global chrome (present on every route, even though this is currently a one page site), so it belongs in the root layout, not the page. The hero is the very first thing a visitor sees and must render fully through server rendering, since the scope explicitly requires the page to still work with JavaScript disabled for the initial paint; only the header's scroll transition and the mobile menu's interactivity are allowed to depend on client JavaScript.

The old file's header nav simply wraps onto a new line on a narrow screen, four links plus a CTA with no hamburger menu at all. Asked directly, the engineer wants something more ambitious for mobile specifically: a full screen, animated menu in the spirit of an awards site, not just a wrapped row of links. That is new ground spec 0002 didn't anticipate, since spec 0002 scoped GSAP to scroll triggered reveals only and left every open/close interaction to plain CSS. This spec has to decide how to build that one richer interaction well (accessibly, without a new dependency if one isn't needed), how to keep it truly usable without JavaScript, and without quietly reopening spec 0002's general boundary for everything else.

## Options considered

### Option 1: A native `<dialog>` for the overlay, animated with a GSAP timeline

Use `<dialog>` with `showModal()` for the full screen menu (its native top layer and focus trap come for free) and drive the nav links' staggered reveal with a `useGSAP` timeline.

**Pros**:
- No new dependency; the browser itself supplies the focus trap, exactly the accessibility code that's easiest to get subtly wrong by hand.
- GSAP timeline delivers the specific staggered, choreographed feel that was actually asked for.

**Cons**:
- `<dialog>`'s UA defaults (centered box, `max-width`/`max-height`, `margin: auto`) all have to be reset by hand to reach true full bleed, and Escape still needs a small amount of custom handling to animate the close instead of closing instantly.

### Option 2: A hand rolled fixed position overlay, no `<dialog>`

Build the overlay as a plain `position: fixed` div, with a hand written focus trap (tracking and cycling Tab/Shift+Tab manually).

**Pros**:
- Full control over positioning and animation with no native element quirks to work around.

**Cons**:
- Hand rolling a correct focus trap (initial focus, cycling at both edges, never letting focus escape) is real accessibility surface area to get right; `<dialog>` already solves the hardest part of it.

### Option 3: A focus trap library (e.g. `focus-trap-react`) plus a plain overlay div

Use a small, purpose built library for the trap instead of `<dialog>`.

**Pros**:
- A well tested library dedicated to exactly this problem.

**Cons**:
- A new dependency for something the browser already does natively; adds a library's own API to learn for no benefit over Option 1's remaining, much smaller reset work.

## Rationale

`<dialog>` is the current, boring, standard browser primitive for exactly this job (a modal overlay needing a focus trap), so reaching for it first, before a library or hand rolled code, follows the same "boring technology" principle spec 0001 and 0002 already established; the UA style reset and the small Escape interception are real but bounded, well known costs, not a reason to prefer hand rolling the trap itself. GSAP is scoped specifically to this one interaction because the engineer asked for it directly here, not because spec 0002's general boundary (CSS for hover and open/close, GSAP for scroll reveals) was wrong; everywhere else in the site (the FAQ accordion, the gallery slide, the header's own scroll transition) still follows that original rule. Recording this as a scoped exception, rather than silently reopening spec 0002, keeps that earlier decision legible instead of looking contradicted by an unexplained precedent.
