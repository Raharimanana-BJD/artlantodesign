# Rationale: 0002. GSAP animation foundation

## Context

Nine of the eleven planned page sections need the same "fade and slide up as it scrolls into view" reveal the old reference file implies through its layout, plus a small set of recurring interaction transitions: the fixed header turning from transparent to a blurred solid bar past a scroll threshold, the Nos maisons cards widening on hover, and the gallery sliding between items. The old file handles all of these with plain CSS transitions and a little React state (a `scrolled` boolean, an `active` index, a `faq` index); it has no scroll triggered entrance reveal at all, since it is a single static prototype, not a real animated product. The user has asked for GSAP specifically, so this spec has to decide not just how to install it but where its real job starts and stops, so the next nine section features aren't left guessing (or reaching for GSAP where two lines of CSS already do the job).

Most of the site's sections are content, not interaction, so they are naturally React Server Components (no client JavaScript needed just to display text and a photo). GSAP and ScrollTrigger touch the DOM directly, which only a Client Component can do, so this spec also has to settle how a reveal reaches a server rendered section without dragging that whole section into the client bundle.

This is a solo, personal project, so the tooling this foundation adds should stay small and the conventions should be easy to hold in your head across many section builds.

## Options considered

### Option 1: GSAP + ScrollTrigger + @gsap/react for scroll reveals only, plain CSS for everything else

Install GSAP with ScrollTrigger and the official React hook, but scope its job narrowly to scroll triggered entrance reveals. Every hover, focus, and open/close transition stays a plain CSS transition using shared duration and easing tokens.

**Pros**:
- Matches what was asked for (GSAP) exactly where it earns its keep: orchestrated, once only scroll reveals that plain CSS can't express cleanly.
- The official `@gsap/react` hook handles cleanup safely inside React's render lifecycle, so a hook that mounts and unmounts across route changes or fast refresh doesn't leak animations.
- ScrollTrigger is the standard, broadly supported tool for this exact job.

**Cons**:
- Still a real dependency (GSAP core plus ScrollTrigger is a meaningful chunk of JavaScript) for a site whose total motion need is fairly small.
- Reserving GSAP for reveals only means a section author has to know the boundary (reveal → GSAP, everything else → CSS) rather than reaching for one tool everywhere.

### Option 2: Native CSS scroll driven animations (`animation-timeline: view()`) instead of GSAP for reveals

Skip GSAP for reveals entirely and use the still emerging CSS `animation-timeline: view()` feature, which ties a CSS animation's progress to an element's scroll position with no JavaScript at all.

**Pros**:
- Zero JavaScript dependency for reveals; runs off the main thread, about as cheap as motion gets.

**Cons**:
- Browser support is meaningfully behind GSAP's own compatibility (Safari support only landed recently, and older browsers have no fallback), and it goes directly against what was actually asked for without a strong technical reason forcing the switch.

### Option 3: GSAP end to end, also driving hover and open/close transitions

Use GSAP timelines for every transition in the system, including the ones a two line CSS transition already handles well (hover states, the gallery slide, the header).

**Pros**:
- One single animation engine and mental model everywhere, no "which system handles this" question per feature.

**Cons**:
- Reimplements in JavaScript what CSS already does for free, adding bundle weight and imperative code, and client component boundaries, to interactions that are purely presentational state changes.

## Rationale

The engineer explicitly asked for GSAP, so Option 2 (skip it entirely) is only right if there were a strong technical reason to override that, and there isn't one here. Scoping GSAP to scroll reveals, rather than end to end (Option 3), follows the same "boring technology, simple beats clever" principle spec 0001 already established for this project: the site's hover and toggle interactions are small, purely presentational state changes that a CSS transition expresses in one line, and reaching for a JavaScript timeline there adds weight, code, and an unnecessary client component boundary for no visible difference on screen. The official `@gsap/react` hook is the current, maintained way to use GSAP inside React function components, so it is the natural companion pick alongside the library itself, not a separate decision.
