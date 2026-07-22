# Yorba Linda FC Snapshot — Build Record

This repo was generated from the Onzio prospect master template on 2026-07-20 and customized for Yorba Linda FC. Full intake, research sources, and detailed round-by-round review notes live outside this repo in the sibling `intake/` folder (`PROSPECT_INTAKE.yaml`, `LOCAL_REVIEW.md`) — this file is a short in-repo summary for anyone who only has this git repository.

## What makes this snapshot different from a fresh generation

- Real crest, club/player photos, real training-program copy, and two merchandise products (navy home jersey, white away jersey) with real transparent front + back photos, all sourced and background-processed from Christian-supplied assets.
- Real sponsor logos (7) and real governing-body/league affiliation marks (US Soccer, FIFA, SWPL) shown in the site nav next to the crest.
- Exact supplied palette (`#2A2E54` / `#DAAE2B` / `#FEFEFE`).
- Sora (display) + Inter (body/UI) fonts, checked in as self-hosted static files — not the base template's Geist Sans.
- Copy grounded in the club's real "Who We Are" description and verified facts from yorbalindafc.com.
- The optional **Standings** feature turned on — an interactive, sortable table living on the homepage (not a separate page section), not part of every prospect, added specifically because the real club's site has one.

## Master-template fixes discovered and ported during this build

A few real bugs were found while building this snapshot and fixed in the master template first, then ported here (not snapshot-only patches):

- Hero headline text could overflow into the crest image on wide viewports (`globals.css` — removed a forced `white-space: nowrap`).
- The matchday gallery headline was hardcoded generic copy, not actually configurable per club (`types.ts` / `MatchdaySlideshow.tsx` — added `copy.home.gallerySectionHeadline`).
- GSAP ScrollTrigger could permanently hide a page section if images/fonts finished loading after the initial trigger-position calculation (`PublicMotion.tsx` — added refresh-on-load safety net).
- A continuously-animating section (the sponsor logo carousel) was being gated behind the same scroll-triggered fade-in as static content, so it sat invisible until scrolled into view (`PublicMotion.tsx` — `.partner-home` is now exempt from that reveal).
- The Standings feature itself (see above) was built as a new optional, reusable master feature rather than a one-off.
- Product photos with an opaque white studio background showed as a mismatched box when placed on a colored card; fixed at the source by using real transparent-cutout photos instead of a CSS matting workaround.

## Known issue — not yet resolved

The store's featured-product photo (a real player cutout, faded into the background via `mask-image`) still shows a rendering gap/artifact on hover, most likely from the hover-zoom `transform:scale()` interacting with the mask, plus ~5.5% unaccounted transparent headroom baked into the source photo above the hairline. Left mid-fix at the end of this session — see `CLAUDE.md`'s Store section for the exact next step.

## Release definition

Ready only after: intake completion, copy review, template validation, type generation, strict TypeScript, ESLint, production build, and desktop/mobile browser verification — all currently passing except the known hover-gap issue above. External publishing (GitHub push, Vercel deploy) additionally requires Christian's explicit approval, tracked in `intake/LOCAL_REVIEW.md`.
